import { useState, useCallback, useRef } from 'react';
import type { BoardState } from '../types/game';
import { placeShipsRandomly, getNextTarget, getTargetCellsAfterHit } from '../utils/aiLogic';

export interface UseAIReturn {
  placeAIShips: (placeShip: (shipId: string, name: string, size: number, startRow: number, startCol: number, orientation: 'horizontal' | 'vertical') => void) => void;
  getAIMove: (boardState: BoardState) => { row: number; col: number } | null;
  recordHit: (row: number, col: number, isHit: boolean) => void;
  reset: () => void;
  getCurrentMode: () => 'hunt' | 'target';
}

export function useAI(initialSeed?: number): UseAIReturn {
  // Use a ref for seed to maintain it across re-renders but allow updates
  const seedRef = useRef(initialSeed ?? Date.now());
  const moveCountRef = useRef(0);

  const [hitStack, setHitStack] = useState<Array<{ row: number; col: number }>>([]);

  const placeAIShips = useCallback((
    placeShip: (
      shipId: string,
      name: string,
      size: number,
      startRow: number,
      startCol: number,
      orientation: 'horizontal' | 'vertical'
    ) => void
  ) => {
    const ships = placeShipsRandomly(seedRef.current);

    ships.forEach(ship => {
      placeShip(
        ship.shipId,
        ship.name,
        ship.size,
        ship.startRow,
        ship.startCol,
        ship.orientation
      );
    });
  }, []);

  const getAIMove = useCallback((boardState: BoardState) => {
    // Increment move count for seed variation
    const moveSeed = seedRef.current + moveCountRef.current;
    moveCountRef.current++;

    const result = getNextTarget(boardState, hitStack, moveSeed);

    // Update hit stack with the new state (removes checked cells)
    setHitStack(result.newHitStack);

    return result.target;
  }, [hitStack]);

  const recordHit = useCallback((row: number, col: number, isHit: boolean) => {
    if (isHit) {
      // Add adjacent cells to hit stack for target mode
      const targetCells = getTargetCellsAfterHit(row, col);
      setHitStack(prev => [...prev, ...targetCells]);
    }
  }, []);

  const reset = useCallback(() => {
    setHitStack([]);
    moveCountRef.current = 0;
    seedRef.current = Date.now();
  }, []);

  const getCurrentMode = useCallback((): 'hunt' | 'target' => {
    return hitStack.length > 0 ? 'target' : 'hunt';
  }, [hitStack.length]);

  return {
    placeAIShips,
    getAIMove,
    recordHit,
    reset,
    getCurrentMode,
  };
}
