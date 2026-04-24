import { Card, CardValue } from '../types/game';

const CARD_POOL: CardValue[] = ['💎', '🍎', '🍌', '🍇', '🍓', '🍉', '🍒', '🥝', '🫐', '🍍', '🍈'];
export const CARD_WIDTH = 50;
export const CARD_HEIGHT = 65;

export const isCardBlocked = (card: Card, allCards: Card[]): boolean => {
  return allCards.some(other => {
    if (other.layer <= card.layer) return false;
    
    // Check overlap
    const horizontalOverlap = Math.abs(card.x - other.x) < CARD_WIDTH * 0.8;
    const verticalOverlap = Math.abs(card.y - other.y) < CARD_HEIGHT * 0.8;
    
    return horizontalOverlap && verticalOverlap;
  });
};

export const generateDeck = (totalCards: number, diamondCount: number): CardValue[] => {
  const deck: CardValue[] = [];
  
  for (let i = 0; i < diamondCount; i++) {
    deck.push('💎');
  }

  const remainingCards = totalCards - diamondCount;
  const triplesNeeded = Math.floor(remainingCards / 3);
  const otherPool = CARD_POOL.filter(v => v !== '💎');

  for (let i = 0; i < triplesNeeded; i++) {
    const type = otherPool[i % otherPool.length];
    deck.push(type, type, type);
  }

  // If there's a remainder due to pruning, add random triples or cards
  while (deck.length < totalCards) {
    deck.push(otherPool[0]);
  }

  return deck.sort(() => Math.random() - 0.5);
};

export const generateInitialGrid = (config: any): Card[] => {
  const layout: {x: number, y: number, layer: number}[] = [];
  const { layers, totalCards, diamondCount, spacing } = config;

  const MAX_COLS = 6;
  const MAX_ROWS = 7;

  for (let l = 0; l < layers; l++) {
    // Offset each layer slightly for the Mahjong effect
    const offsetX = l * 8; 
    const offsetY = l * 10;
    
    for (let r = 0; r < MAX_ROWS; r++) {
      for (let c = 0; c < MAX_COLS; c++) {
        // Stop adding if we exceed total possible cards in a layer to keep it manageable
        if (layout.length >= totalCards * 2) break; 

        layout.push({ 
          x: c * (spacing - 5) + offsetX, 
          y: r * (spacing - 2) + offsetY, 
          layer: l 
        });
      }
    }
  }

  // Shuffle the layout positions so the "pruning" is random across the grid
  // but keep layers somewhat consistent
  const shuffledLayout = layout.sort(() => Math.random() - 0.5).slice(0, totalCards);
  const deck = generateDeck(shuffledLayout.length, diamondCount);

  return shuffledLayout.map((pos, idx) => ({
    id: `card-${idx}-${Math.random().toString(36).substr(2, 5)}`,
    value: deck[idx],
    ...pos
  }));
};

export const resolveMatches = (board: Card[]): { newBoard: Card[]; matchedValues: CardValue[] } => {
  const counts: Record<CardValue, number> = {};
  board.forEach(card => {
    counts[card.value] = (counts[card.value] || 0) + 1;
  });

  const matchedValues: CardValue[] = [];

  Object.entries(counts).forEach(([value, count]) => {
    const matches = Math.floor(count / 3);
    for (let i = 0; i < matches; i++) {
      matchedValues.push(value as CardValue);
    }
  });

  if (matchedValues.length === 0) {
    return { newBoard: board, matchedValues: [] };
  }

  const currentCounts: Record<CardValue, number> = {};
  const newBoard = board.filter(card => {
    currentCounts[card.value] = (currentCounts[card.value] || 0) + 1;
    const maxToKeep = (counts[card.value] || 0) % 3;
    const totalToRemove = (counts[card.value] || 0) - maxToKeep;
    
    if (currentCounts[card.value] <= totalToRemove) {
      return false;
    }
    return true;
  });

  return { newBoard, matchedValues };
};

export const checkWinCondition = (table: Card[], board: Card[]): boolean => {
  return table.length === 0 && board.length === 0;
};

export const checkLossCondition = (board: Card[], benchSize: number): boolean => {
  return board.length >= benchSize;
};
