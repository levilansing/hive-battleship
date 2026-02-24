import React, { useState, useEffect, useRef } from 'react';
import type { Cell } from '../types/game';

interface BoardCellProps {
  cell: Cell;
  onClick: () => void;
  onHover: () => void;
  showShip: boolean;
  isPreview?: boolean;
  previewValid?: boolean;
  isInteractive?: boolean;
}

const BoardCell: React.FC<BoardCellProps> = React.memo(
  ({ cell, onClick, onHover, showShip, isPreview = false, previewValid = true, isInteractive = false }) => {
    const [animating, setAnimating] = useState<'hit' | 'miss' | null>(null);
    const prevStateRef = useRef(cell.state);

    // Trigger animations when cell state changes
    useEffect(() => {
      const prevState = prevStateRef.current;
      const currentState = cell.state;

      if (currentState === 'hit' && prevState !== 'hit') {
        setAnimating('hit');
        const timeout = setTimeout(() => setAnimating(null), 500);
        return () => clearTimeout(timeout);
      } else if (currentState === 'miss' && prevState !== 'miss') {
        setAnimating('miss');
        const timeout = setTimeout(() => setAnimating(null), 400);
        return () => clearTimeout(timeout);
      }

      prevStateRef.current = currentState;
    }, [cell.state]);

    const getCellClasses = () => {
      const base =
        'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-gray-400 cursor-pointer transition-colors flex items-center justify-center font-bold';

      // Animation classes
      const animations = [];
      if (animating === 'hit') animations.push('animate-explosion');
      if (animating === 'miss') animations.push('animate-splash');

      // Preview state takes precedence during ship placement
      if (isPreview) {
        if (previewValid) {
          return `${base} bg-green-300 border-green-500 border-2 ${animations.join(' ')}`;
        } else {
          return `${base} bg-red-300 border-red-500 border-2 ${animations.join(' ')}`;
        }
      }

      // State-based styling
      if (cell.state === 'hit') return `${base} bg-red-500 text-white ${animations.join(' ')}`;
      if (cell.state === 'miss') return `${base} bg-gray-300 text-gray-600 ${animations.join(' ')}`;
      if (cell.hasShip && showShip) return `${base} bg-blue-400 hover:bg-blue-500 ${animations.join(' ')}`;

      // Add hover glow for interactive cells that haven't been guessed
      const hoverEffect = isInteractive && !cell.isGuessed ? 'hover:animate-hover-glow cursor-crosshair' : '';

      return `${base} bg-blue-50 hover:bg-blue-200 ${hoverEffect} ${animations.join(' ')}`;
    };

    const getCellContent = () => {
      if (cell.state === 'hit') return '×';
      if (cell.state === 'miss') return '•';
      return '';
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        className={getCellClasses()}
        onClick={onClick}
        onMouseEnter={onHover}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Cell ${String.fromCharCode(65 + cell.col)}${cell.row + 1}`}
      >
        {getCellContent()}
      </div>
    );
  }
);

BoardCell.displayName = 'BoardCell';

export default BoardCell;
