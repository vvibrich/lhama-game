import { useState, useCallback, useEffect } from 'react';
import { GameState, Card, GameStatus, DifficultyConfig } from '../types/game';
import { 
  generateInitialGrid, 
  resolveMatches, 
  checkWinCondition, 
  checkLossCondition,
  isCardBlocked
} from '../engine/gameLogic';

export const useGame = (config: DifficultyConfig, onWin?: (time: number) => void) => {
  const [state, setState] = useState<GameState>(() => ({
    table: generateInitialGrid(config),
    board: [],
    llamaMeter: 0,
    status: 'playing',
  }));

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && state.status === 'playing') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, state.status]);

  const onRestart = useCallback(() => {
    setState({
      table: generateInitialGrid(config),
      board: [],
      llamaMeter: 0,
      status: 'playing',
    });
    setElapsedTime(0);
    setIsTimerRunning(false);
  }, [config]);

  const onPickCard = useCallback((cardId: string) => {
    setIsTimerRunning(true); // Start timer on first move
    
    setState(prev => {
      if (prev.status !== 'playing') return prev;
      
      const cardIndex = prev.table.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;
      
      const card = prev.table[cardIndex];
      if (isCardBlocked(card, prev.table)) return prev;

      const newTable = prev.table.filter(c => c.id !== cardId);
      const newBoardTemp = [...prev.board, card];
      const { newBoard, matchedValues } = resolveMatches(newBoardTemp);
      
      // Update Meter ONLY for Diamonds 💎
      const diamondMatches = matchedValues.filter(v => v === '💎').length;
      const newMeter = Math.min(config.goalPoints, prev.llamaMeter + (diamondMatches * 3));

      let newStatus: GameStatus = 'playing';
      if (checkWinCondition(newTable, newBoard)) {
        newStatus = 'win';
        setIsTimerRunning(false);
        if (onWin) onWin(elapsedTime);
      } else if (checkLossCondition(newBoard, config.benchSize)) {
        newStatus = 'lose';
        setIsTimerRunning(false);
        setElapsedTime(0); // Reset timer on loss
      }

      return {
        ...prev,
        table: newTable,
        board: newBoard,
        llamaMeter: newMeter,
        status: newStatus
      };
    });
  }, [onWin, elapsedTime, config.goalPoints]);

  const onActivateLlama = useCallback(() => {
    setState(prev => {
      if (prev.llamaMeter < config.goalPoints) return prev;
      return { ...prev, status: 'llama_selection' };
    });
  }, [config.goalPoints]);

  const onUseLlama = useCallback((cardId: string) => {
    setState(prev => {
      if (prev.status !== 'llama_selection') return prev;

      const targetCard = prev.table.find(c => c.id === cardId);
      if (!targetCard) return prev;
      
      // Values to remove from table
      const valuesToRemove: Record<string, number> = {};

      // 1. From Selected Card: Remove the full triple (itself + 2 twins)
      valuesToRemove[targetCard.value] = (valuesToRemove[targetCard.value] || 0) + 3;

      // 2. From Bench: Complete the triples for every card type on the bench
      const benchCounts: Record<string, number> = {};
      prev.board.forEach(c => {
        benchCounts[c.value] = (benchCounts[c.value] || 0) + 1;
      });

      Object.entries(benchCounts).forEach(([val, count]) => {
        const neededFromTable = (3 - (count % 3)) % 3;
        if (neededFromTable > 0) {
          valuesToRemove[val] = (valuesToRemove[val] || 0) + neededFromTable;
        }
      });

      // 3. Apply removals to the table
      let newTable = [...prev.table];
      Object.entries(valuesToRemove).forEach(([val, count]) => {
        let removed = 0;
        newTable = newTable.filter(c => {
          if (c.value === val && removed < count) {
            removed++;
            return false;
          }
          return true;
        });
      });

      const newBoard: Card[] = []; // Clear bench as requested
      
      const win = checkWinCondition(newTable, newBoard);
      if (win) {
        setIsTimerRunning(false);
        if (onWin) onWin(elapsedTime);
      }

      return {
        ...prev,
        table: newTable,
        board: newBoard,
        llamaMeter: 0,
        status: win ? 'win' : 'playing'
      };
    });
  }, [onWin, elapsedTime]);

  return {
    state,
    elapsedTime,
    onPickCard,
    onRestart,
    onActivateLlama,
    onUseLlama
  };
};
