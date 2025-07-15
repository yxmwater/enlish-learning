export interface Word {
  id: string;
  english: string;
  chinese?: string;
  pronunciation?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  textbook?: string;
  unit?: string;
  lesson?: string;
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
export type InputMode = 'file' | 'manual' | 'random' | 'textbook' | 'web' | 'pdf';

export interface AppState {
  words: Word[];
  currentMode: GameMode;
  inputMode: InputMode;
  gameStarted: boolean;
}

// 教材版本相关类型
export interface TextbookInfo {
  id: string;
  name: string;
  publisher: string;
  grade: string;
  semester: string;
  region: string;
  description?: string;
}

export interface TextbookUnit {
  id: string;
  name: string;
  description?: string;
  lessons: TextbookLesson[];
}

export interface TextbookLesson {
  id: string;
  name: string;
  description?: string;
  words: Word[];
}

export interface TextbookData {
  info: TextbookInfo;
  units: TextbookUnit[];
}