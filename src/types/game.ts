export type CellState = 'empty' | 'ship' | 'hit' | 'miss';
export type GamePhase = 'setup' | 'playing' | 'gameOver';

export interface Cell {
  row: number;
  col: number;
  state: CellState;
}

export interface BoardProps {
  isPlayer: boolean;
  boardId: string;
}

export interface Ship {
  name: string;
  length: number;
  positions?: { row: number; col: number }[];
  hits?: number;
}

export interface GameStats {
  shipsRemaining: number;
  shotsFired: number;
}
