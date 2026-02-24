import React from 'react';
import type { Cell } from '../types/game';

interface BoardCellProps {
  cell: Cell;
  onClick: () => void;
  onHover: () => void;
  showShip: boolean;
  isPreview?: boolean;
  previewValid?: boolean;
}

const BoardCell: React.FC<BoardCellProps> = React.memo(
  ({ cell, onClick, onHover, showShip, isPreview = false, previewValid = true }) => {
    const getCellClasses = () => {
      const base =
        'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-gray-400 cursor-pointer transition-colors flex items-center justify-center font-bold';

      // Preview state takes precedence during ship placement
      if (isPreview) {
        if (previewValid) {
          return `${base} bg-green-300 border-green-500 border-2`;
        } else {
          return `${base} bg-red-300 border-red-500 border-2`;
        }
      }

      // State-based styling
      if (cell.state === 'hit') return `${base} bg-red-500 text-white`;
      if (cell.state === 'miss') return `${base} bg-gray-300 text-gray-600`;
      if (cell.hasShip && showShip) return `${base} bg-blue-400 hover:bg-blue-500`;

      return `${base} bg-blue-50 hover:bg-blue-200`;
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
