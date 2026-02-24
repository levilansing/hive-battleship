import React from 'react';
import type { BoardProps } from '../types/game';
import BoardCell from './BoardCell';

const GameBoard: React.FC<BoardProps> = ({
  isPlayer,
  boardState,
  onCellClick,
  onCellHover,
  showShips = true,
}) => {
  const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="flex flex-col gap-2">
      {/* Board header with title */}
      <h2 className="text-xl font-bold text-gray-800">
        {isPlayer ? 'Your Fleet' : 'Enemy Waters'}
      </h2>

      {/* Grid container with coordinate labels */}
      <div className="grid grid-cols-11 gap-1 p-4 bg-blue-50 border-2 border-gray-300 rounded-lg shadow-md">
          {/* Empty corner cell */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />

          {/* Column labels A-J */}
          {columnLabels.map((label) => (
            <div
              key={label}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-sm font-semibold text-gray-700"
            >
              {label}
            </div>
          ))}

          {/* Rows with labels and cells */}
          {Array.from({ length: 10 }, (_, row) => (
            <React.Fragment key={row}>
              {/* Row label 1-10 */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-sm font-semibold text-gray-700">
                {row + 1}
              </div>

              {/* Cell grid for this row */}
              {Array.from({ length: 10 }, (_, col) => {
                const cell = boardState.cells[row]?.[col];
                if (!cell) return null;
                return (
                  <BoardCell
                    key={`${row}-${col}`}
                    cell={cell}
                    onClick={() => onCellClick?.(row, col)}
                    onHover={() => onCellHover?.(row, col)}
                    showShip={showShips || isPlayer}
                  />
                );
              })}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default GameBoard;
