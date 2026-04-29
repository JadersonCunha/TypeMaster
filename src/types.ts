export enum LevelDifficulty {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado',
  EXPERT = 'Especialista'
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  content: string;
  minWpm: number;
  minAccuracy: number;
}

export interface Level {
  id: number;
  title: string;
  difficulty: LevelDifficulty;
  challenges: Challenge[];
  tips: string[];
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  isFinished: boolean;
}

export interface UserProgress {
  currentLevel: number;
  completedChallenges: string[];
  bestWpm: number;
}
