import React from 'react';
import type { ShipTemplate } from '../hooks/useShipPlacement';
import type { Orientation } from '../types/game';

interface ShipPlacementProps {
  ships: ShipTemplate[];
  selectedShipId: string | null;
  orientation: Orientation;
  allShipsPlaced: boolean;
  onSelectShip: (shipId: string) => void;
  onToggleOrientation: () => void;
  onStartGame: () => void;
}

const ShipPlacement: React.FC<ShipPlacementProps> = ({
  ships,
  selectedShipId,
  orientation,
  allShipsPlaced,
  onSelectShip,
  onToggleOrientation,
  onStartGame,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ship Roster</h2>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">
          {allShipsPlaced
            ? '✓ All ships placed! Ready to start the game.'
            : 'Select a ship and click on the board to place it.'}
        </p>

        <div className="space-y-2">
          {ships.map(ship => (
            <button
              key={ship.id}
              onClick={() => onSelectShip(ship.id)}
              disabled={ship.placed}
              className={`
                w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                ${ship.placed
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : ship.id === selectedShipId
                    ? 'bg-blue-500 border-blue-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-400 cursor-pointer'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{ship.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: ship.size }, (_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 border ${
                          ship.placed
                            ? 'bg-gray-300 border-gray-400'
                            : ship.id === selectedShipId
                              ? 'bg-blue-300 border-blue-400'
                              : 'bg-blue-100 border-blue-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {ship.placed && (
                  <span className="text-green-600 font-bold">✓ Placed</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedShipId && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2">Placement Controls</h3>
          <div className="space-y-2">
            <button
              onClick={onToggleOrientation}
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Orientation: {orientation === 'horizontal' ? 'Horizontal →' : 'Vertical ↓'}
            </button>
            <p className="text-xs text-gray-600">
              Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">R</kbd> to rotate
            </p>
          </div>
        </div>
      )}

      {allShipsPlaced && (
        <button
          onClick={onStartGame}
          className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-colors"
        >
          Start Game!
        </button>
      )}
    </div>
  );
};

export default ShipPlacement;
