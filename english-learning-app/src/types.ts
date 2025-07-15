export interface Word {
  id: string;
  english: string;
  chinese?: string;
  pronunciation?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
}

export interface GameTile {
  id: string;
  wordId: string;
  word: string;
  isMatched: boolean;
  isSelected: boolean;
  position: { x: number; y: number };
}

export type GameMode = 'match' | 'spell';
export type InputMode = 'file' | 'manual' | 'random';

export interface AppState {
  words: Word[];
  currentMode: GameMode;
  inputMode: InputMode;
  gameStarted: boolean;
}