import { useState, useCallback } from 'react';
import type { Orientation, BoardState } from '../types/game';

export interface ShipTemplate {
  id: string;
  name: string;
  size: number;
  placed: boolean;
}

const SHIP_TEMPLATES: ShipTemplate[] = [
  { id: 'carrier', name: 'Carrier', size: 5, placed: false },
  { id: 'battleship', name: 'Battleship', size: 4, placed: false },
  { id: 'cruiser', name: 'Cruiser', size: 3, placed: false },
  { id: 'submarine', name: 'Submarine', size: 3, placed: false },
  { id: 'destroyer', name: 'Destroyer', size: 2, placed: false },
];

export function useShipPlacement() {
  const [ships, setShips] = useState<ShipTemplate[]>(SHIP_TEMPLATES);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null);

  const selectedShip = ships.find(s => s.id === selectedShipId);

  const toggleOrientation = useCallback(() => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  }, []);

  const selectShip = useCallback((shipId: string) => {
    const ship = ships.find(s => s.id === shipId);
    if (ship && !ship.placed) {
      setSelectedShipId(shipId);
    }
  }, [ships]);

  const markShipAsPlaced = useCallback((shipId: string) => {
    setShips(prev => prev.map(s =>
      s.id === shipId ? { ...s, placed: true } : s
    ));
    setSelectedShipId(null);
  }, []);

  const canPlaceShip = useCallback(
    (row: number, col: number, size: number, orientation: Orientation, boardState: BoardState): boolean => {
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

        const cell = boardState.cells[checkRow]?.[checkCol];
        if (!cell || cell.hasShip) {
          return false;
        }
      }

      return true;
    },
    []
  );

  const setPreview = useCallback((position: { row: number; col: number } | null) => {
    setPreviewPosition(position);
  }, []);

  const resetPlacement = useCallback(() => {
    setShips(SHIP_TEMPLATES);
    setSelectedShipId(null);
    setOrientation('horizontal');
    setPreviewPosition(null);
  }, []);

  const allShipsPlaced = ships.every(s => s.placed);

  return {
    ships,
    selectedShip,
    orientation,
    previewPosition,
    allShipsPlaced,
    selectShip,
    toggleOrientation,
    markShipAsPlaced,
    canPlaceShip,
    setPreview,
    resetPlacement,
  };
}
