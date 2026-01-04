
export enum CategoryType {
  HEALTH = 'سلامت و زیست',
  REGULATIONS = 'آیین‌نامه',
  GENERAL = 'اطلاعات عمومی',
  GAMES = 'بازی و سرگرمی'
}

export interface QuestionCard {
  id: string;
  category: CategoryType;
  question: string;
  options?: string[];
  correctIndex?: number;
  hint: string;
}

export interface GameState {
  cards: Record<CategoryType, QuestionCard[]>;
  score: number;
  revealedCard: QuestionCard | null;
}
