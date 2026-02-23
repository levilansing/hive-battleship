import React from 'react';
import type { BoardProps } from '../types/game';

const GameBoard: React.FC<BoardProps> = ({ isPlayer, boardId }) => {
  const cells = Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => ({ row, col }))
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-xl font-bold text-gray-800">
        {isPlayer ? 'Your Fleet' : 'Enemy Waters'}
      </h2>
      <div
        className="grid grid-cols-10 gap-1 p-4 bg-blue-50 border-2 border-gray-300 rounded-lg shadow-md"
        role="grid"
        aria-label={`${isPlayer ? 'Player' : 'AI'} game board`}
      >
        {cells.flat().map(({ row, col }) => (
          <div
            key={`${boardId}-${row}-${col}`}
            className="w-8 h-8 border border-gray-400 bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer flex items-center justify-center text-xs text-gray-600"
            role="gridcell"
            aria-label={`Cell ${String.fromCharCode(65 + row)}${col + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
