import type { PlacedShip } from '../types/game';
import { isShipSunk } from '../utils/gameRules';

interface ShipStatusProps {
  ships: PlacedShip[];
  title: string;
}

export default function ShipStatus({ ships, title }: ShipStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
      <div className="space-y-2">
        {ships.map((ship) => {
          const sunk = isShipSunk(ship);
          const healthPercentage = ((ship.size - ship.hits) / ship.size) * 100;

          return (
            <div key={ship.shipId} className="border rounded p-2">
              <div className="flex justify-between items-center mb-1">
                <span className={`font-semibold ${sunk ? 'text-red-600 line-through' : 'text-gray-700'}`}>
                  {ship.name}
                </span>
                <span className="text-sm text-gray-500">
                  {ship.hits}/{ship.size} hits
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    sunk ? 'bg-red-600' : healthPercentage > 50 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.max(0, healthPercentage)}%` }}
                />
              </div>
              {sunk && (
                <p className="text-xs text-red-600 mt-1 font-semibold">SUNK!</p>
              )}
            </div>
          );
        })}
        {ships.length === 0 && (
          <p className="text-gray-500 text-sm italic">No ships placed yet</p>
        )}
      </div>
    </div>
  );
}
