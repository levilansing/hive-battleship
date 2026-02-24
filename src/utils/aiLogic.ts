import type { BoardState, PlacedShip, Orientation } from '../types/game';

// Ship templates - same as in useShipPlacement
const SHIP_TEMPLATES = [
  { id: 'carrier', name: 'Carrier', size: 5 },
  { id: 'battleship', name: 'Battleship', size: 4 },
  { id: 'cruiser', name: 'Cruiser', size: 3 },
  { id: 'submarine', name: 'Submarine', size: 3 },
  { id: 'destroyer', name: 'Destroyer', size: 2 },
];

/**
 * Seeded random number generator for deterministic AI behavior
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Returns a random number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Returns a random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

/**
 * Check if a ship can be placed at the given position
 */
function canPlaceShip(
  row: number,
  col: number,
  size: number,
  orientation: Orientation,
  occupiedCells: Set<string>
): boolean {
  // Check if ship fits within bounds
  if (orientation === 'horizontal') {
    if (col + size > 10) return false;
  } else {
    if (row + size > 10) return false;
  }

  // Check for overlaps with existing ships
  for (let i = 0; i < size; i++) {
    const checkRow = orientation === 'horizontal' ? row : row + i;
    const checkCol = orientation === 'horizontal' ? col + i : col;
    const key = `${checkRow},${checkCol}`;

    if (occupiedCells.has(key)) {
      return false;
    }
  }

  return true;
}

/**
 * Randomly place all ships on a board using a seed for determinism
 */
export function placeShipsRandomly(seed: number): PlacedShip[] {
  const rng = new SeededRandom(seed);
  const placedShips: PlacedShip[] = [];
  const occupiedCells = new Set<string>();

  for (const template of SHIP_TEMPLATES) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      const orientation: Orientation = rng.nextInt(0, 2) === 0 ? 'horizontal' : 'vertical';
      const row = rng.nextInt(0, 10);
      const col = rng.nextInt(0, 10);

      if (canPlaceShip(row, col, template.size, orientation, occupiedCells)) {
        // Mark cells as occupied
        for (let i = 0; i < template.size; i++) {
          const cellRow = orientation === 'horizontal' ? row : row + i;
          const cellCol = orientation === 'horizontal' ? col + i : col;
          occupiedCells.add(`${cellRow},${cellCol}`);
        }

        placedShips.push({
          shipId: template.id,
          name: template.name,
          size: template.size,
          startRow: row,
          startCol: col,
          orientation,
          hits: 0,
        });

        placed = true;
      }
    }

    if (!placed) {
      throw new Error(`Failed to place ship ${template.name} after ${maxAttempts} attempts`);
    }
  }

  return placedShips;
}

/**
 * Get adjacent cells (up, down, left, right) for targeting mode
 */
function getAdjacentCells(row: number, col: number): Array<{ row: number; col: number }> {
  const adjacent: Array<{ row: number; col: number }> = [];

  // Up
  if (row > 0) adjacent.push({ row: row - 1, col });
  // Down
  if (row < 9) adjacent.push({ row: row + 1, col });
  // Left
  if (col > 0) adjacent.push({ row, col: col - 1 });
  // Right
  if (col < 9) adjacent.push({ row, col: col + 1 });

  return adjacent;
}

/**
 * Get the next target cell for the AI to attack
 *
 * @param boardState - The opponent's board state
 * @param hitStack - Stack of cells to target (for target mode)
 * @param seed - Random seed for deterministic behavior
 * @returns Object with next cell coordinates and updated hit stack
 */
export function getNextTarget(
  boardState: BoardState,
  hitStack: Array<{ row: number; col: number }>,
  seed: number
): { target: { row: number; col: number } | null; newHitStack: Array<{ row: number; col: number }> } {
  // Create a copy to avoid mutating the input
  const stackCopy = [...hitStack];

  // Target mode: prioritize cells from hit stack
  while (stackCopy.length > 0) {
    const target = stackCopy.pop()!;
    const cell = boardState.cells[target.row]?.[target.col];

    if (cell && !cell.isGuessed) {
      return { target, newHitStack: stackCopy };
    }
  }

  // Hunt mode: find random unguessed cell
  const unguessedCells: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = boardState.cells[row]?.[col];
      if (cell && !cell.isGuessed) {
        unguessedCells.push({ row, col });
      }
    }
  }

  if (unguessedCells.length === 0) {
    return { target: null, newHitStack: [] };
  }

  // Use seeded random to select a cell
  const rng = new SeededRandom(seed);
  const index = rng.nextInt(0, unguessedCells.length);
  const target = unguessedCells[index] ?? null;
  return { target, newHitStack: [] };
}

/**
 * Get cells to add to hit stack when a ship is hit
 */
export function getTargetCellsAfterHit(row: number, col: number): Array<{ row: number; col: number }> {
  return getAdjacentCells(row, col);
}
