import { useState, useCallback } from 'react';
import type { BoardState, CellState, Orientation } from '../types/game';

export function useGameBoard() {
  const [boardState, setBoardState] = useState<BoardState>({
    cells: Array.from({ length: 10 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => ({
        row,
        col,
        state: 'empty' as CellState,
        hasShip: false,
        isGuessed: false,
      }))
    ),
    placedShips: [],
  });

  const updateCell = useCallback(
    (row: number, col: number, newState: CellState) => {
      setBoardState((prev) => {
        const newCells = prev.cells.map((r) => r.map((c) => ({ ...c })));
        const newPlacedShips = [...prev.placedShips];

        if (newCells[row]?.[col]) {
          newCells[row][col].state = newState;
          newCells[row][col].isGuessed = true;

          // If it's a hit, increment the ship's hit counter
          if (newState === 'hit' && newCells[row][col].shipId) {
            const shipId = newCells[row][col].shipId;
            if (shipId) {
              const shipIndex = newPlacedShips.findIndex(s => s.shipId === shipId);
              if (shipIndex !== -1) {
                const ship = newPlacedShips[shipIndex];
                if (ship) {
                  newPlacedShips[shipIndex] = {
                    ...ship,
                    hits: ship.hits + 1,
                  };
                }
              }
            }
          }
        }
        return { cells: newCells, placedShips: newPlacedShips };
      });
    },
    []
  );

  const placeShip = useCallback(
    (
      shipId: string,
      name: string,
      size: number,
      startRow: number,
      startCol: number,
      orientation: Orientation
    ) => {
      setBoardState((prev) => {
        const newCells = prev.cells.map((r) => r.map((c) => ({ ...c })));

        // Mark cells as having ships
        for (let i = 0; i < size; i++) {
          const row = orientation === 'horizontal' ? startRow : startRow + i;
          const col = orientation === 'horizontal' ? startCol + i : startCol;

          if (row < 10 && col < 10 && newCells[row]?.[col]) {
            newCells[row][col].hasShip = true;
            newCells[row][col].shipId = shipId;
            newCells[row][col].state = 'ship';
          }
        }

        const newPlacedShips = [
          ...prev.placedShips,
          { shipId, name, size, startRow, startCol, orientation, hits: 0 },
        ];

        return { cells: newCells, placedShips: newPlacedShips };
      });
    },
    []
  );

  const resetBoard = useCallback(() => {
    setBoardState({
      cells: Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => ({
          row,
          col,
          state: 'empty' as CellState,
          hasShip: false,
          isGuessed: false,
        }))
      ),
      placedShips: [],
    });
  }, []);

  const checkIfShipSunk = useCallback(
    (shipId: string | undefined): { sunk: boolean; shipName: string } | null => {
      if (!shipId) return null;

      const ship = boardState.placedShips.find(s => s.shipId === shipId);
      if (!ship) return null;

      const isSunk = ship.hits >= ship.size;
      return isSunk ? { sunk: true, shipName: ship.name } : null;
    },
    [boardState.placedShips]
  );

  return { boardState, updateCell, placeShip, resetBoard, checkIfShipSunk };
}
