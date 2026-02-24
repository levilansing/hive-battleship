import React, { useState, useEffect } from 'react';

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Auto-hide confirmation after 5 seconds
  useEffect(() => {
    if (showResetConfirm) {
      const timeout = setTimeout(() => setShowResetConfirm(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showResetConfirm]);

  const handleResetClick = () => {
    if (onReset) {
      onReset();
    }
    setShowResetConfirm(false);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 py-6">
      <button
        onClick={onStartGame}
        disabled={gameStarted}
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        Start Game
      </button>

      {!showResetConfirm ? (
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
        >
          Reset Game
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-lg border-2 border-red-400">
          <p className="text-sm font-semibold text-gray-800">Reset game?</p>
          <button
            onClick={handleResetClick}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-all"
          >
            Yes
          </button>
          <button
            onClick={() => setShowResetConfirm(false)}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded transition-all"
          >
            Cancel
          </button>
        </div>
      )}

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
