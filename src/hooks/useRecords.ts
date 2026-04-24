import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useEffect } from 'react';
import { GameRecord, Difficulty, RecordsByDifficulty } from '../types/game';

const RECORDS_KEY = '@lhama_game_records_v2'; // changed key to reset legacy format easily

const initialRecords: RecordsByDifficulty = {
  easy: [],
  medium: [],
  hard: [],
  impossible: [],
};

export const useRecords = () => {
  const [records, setRecords] = useState<RecordsByDifficulty>(initialRecords);

  const loadRecords = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(RECORDS_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load records', e);
    }
  }, []);

  const saveRecord = useCallback(async (timeInSeconds: number, difficulty: Difficulty) => {
    const newRecord: GameRecord = {
      id: Math.random().toString(36).substr(2, 9),
      time: timeInSeconds,
      date: new Date().toLocaleDateString(),
    };

    try {
      const stored = await AsyncStorage.getItem(RECORDS_KEY);
      const currentRecords: RecordsByDifficulty = stored ? JSON.parse(stored) : initialRecords;
      
      const updatedDifficultyRecords = [...(currentRecords[difficulty] || []), newRecord]
        .sort((a, b) => a.time - b.time) // Best times first
        .slice(0, 10); // Keep top 10

      const updatedRecordsAll = {
        ...currentRecords,
        [difficulty]: updatedDifficultyRecords
      };

      await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(updatedRecordsAll));
      setRecords(updatedRecordsAll);
    } catch (e) {
      console.error('Failed to save record', e);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return { records, saveRecord, loadRecords };
};
