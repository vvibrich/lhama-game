export type CardValue = string;

export interface Card {
  id: string;
  value: CardValue;
  x: number;
  y: number;
  layer: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface DifficultyConfig {
  label: string;
  layers: number;
  uniqueTypes: number;
  totalCards: number;
  diamondCount: number;
  goalPoints: number;
  spacing: number;
  benchSize: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Fácil',
    layers: 2,
    uniqueTypes: 6,
    totalCards: 60,
    diamondCount: 9,
    goalPoints: 6,
    spacing: 55,
    benchSize: 7,
  },
  medium: {
    label: 'Médio',
    layers: 3,
    uniqueTypes: 8,
    totalCards: 75,
    diamondCount: 15,
    goalPoints: 12,
    spacing: 52,
    benchSize: 6,
  },
  hard: {
    label: 'Difícil',
    layers: 4,
    uniqueTypes: 10,
    totalCards: 126,
    diamondCount: 21,
    goalPoints: 20,
    spacing: 45,
    benchSize: 5,
  },
  impossible: {
    label: 'Impossível',
    layers: 5,
    uniqueTypes: 11,
    totalCards: 189,
    diamondCount: 30,
    goalPoints: 27,
    spacing: 40,
    benchSize: 4,
  },
};

export type GameStatus = 'playing' | 'llama_selection' | 'win' | 'lose';

export interface GameState {
  table: Card[]; // Flat array of cards with positioning
  board: Card[];   // Captured cards
  llamaMeter: number; // 0 to 15
  status: GameStatus;
}

export interface GameRecord {
  id: string;
  time: number; // in seconds
  date: string;
}

export type RecordsByDifficulty = Record<Difficulty, GameRecord[]>;
