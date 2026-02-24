export type CellState = 'empty' | 'ship' | 'hit' | 'miss';
export type GamePhase = 'setup' | 'playing' | 'gameOver';
export type Orientation = 'horizontal' | 'vertical';

export interface Cell {
  row: number;
  col: number;
  state: CellState;
  hasShip: boolean;
  shipId?: string;
  isGuessed: boolean;
}

export interface PlacedShip {
  shipId: string;
  name: string;
  size: number;
  startRow: number;
  startCol: number;
  orientation: Orientation;
  hits: number;
}

export interface BoardState {
  cells: Cell[][];
  placedShips: PlacedShip[];
}

export interface BoardProps {
  isPlayer: boolean;
  boardState: BoardState;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  showShips?: boolean;
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

export interface CellClickEvent {
  row: number;
  col: number;
}
