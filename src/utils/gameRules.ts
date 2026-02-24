import type { BoardState, PlacedShip } from '../types/game';

/**
 * Check if a specific ship is sunk
 */
export function isShipSunk(ship: PlacedShip): boolean {
  return ship.hits >= ship.size;
}

/**
 * Check if all ships on a board are sunk (win condition)
 */
export function areAllShipsSunk(boardState: BoardState): boolean {
  if (boardState.placedShips.length === 0) return false;
  return boardState.placedShips.every(ship => isShipSunk(ship));
}

/**
 * Get a list of cells that have not been guessed yet
 */
function getUnguessedCells(boardState: BoardState): { row: number; col: number }[] {
  const unguessed: { row: number; col: number }[] = [];

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = boardState.cells[row]?.[col];
      if (cell && !cell.isGuessed) {
        unguessed.push({ row, col });
      }
    }
  }

  return unguessed;
}

/**
 * AI attack logic - randomly selects an unguessed cell
 * In a more advanced version, this could use a smarter strategy
 */
export function getAiAttack(boardState: BoardState): { row: number; col: number } | null {
  const unguessed = getUnguessedCells(boardState);

  if (unguessed.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * unguessed.length);
  return unguessed[randomIndex] || null;
}

/**
 * Find which ship was hit at a given position
 */
export function findShipAtPosition(
  boardState: BoardState,
  row: number,
  col: number
): PlacedShip | null {
  const cell = boardState.cells[row]?.[col];
  if (!cell || !cell.shipId) return null;

  return boardState.placedShips.find(ship => ship.shipId === cell.shipId) || null;
}
