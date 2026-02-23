import React from 'react';

interface HeaderProps {
  playerShips?: number;
  aiShips?: number;
  shotsFired?: number;
}

const Header: React.FC<HeaderProps> = ({
  playerShips = 5,
  aiShips = 5,
  shotsFired = 0
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-4 shadow-lg">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
          ⚓ Battleship ⚓
        </h1>
        <div className="flex justify-center gap-8 text-sm md:text-base">
          <div className="flex flex-col items-center">
            <span className="font-semibold">Your Ships</span>
            <span className="text-2xl font-bold">{playerShips}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">Enemy Ships</span>
            <span className="text-2xl font-bold">{aiShips}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">Shots Fired</span>
            <span className="text-2xl font-bold">{shotsFired}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
