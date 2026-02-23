import React from 'react';

interface ControlsProps {
  onStartGame?: () => void;
  onReset?: () => void;
  onSettings?: () => void;
  gameStarted?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onStartGame,
  onReset,
  onSettings,
  gameStarted = false,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-6">
      <button
        onClick={onStartGame}
        disabled={gameStarted}
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        Start Game
      </button>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
      >
        Reset
      </button>
      <button
        onClick={onSettings}
        disabled={true}
        className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
      >
        Settings
      </button>
    </div>
  );
};

export default Controls;
