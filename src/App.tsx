import { useState } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MessageArea from './components/MessageArea';
import type { GamePhase } from './types/game';

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [message, setMessage] = useState('Welcome to Battleship! Place your ships to begin...');
  const [isAiTalking, setIsAiTalking] = useState(false);

  const handleStartGame = () => {
    setGamePhase('playing');
    setMessage("Let's see if you can handle this, captain...");
    setIsAiTalking(true);
  };

  const handleReset = () => {
    setGamePhase('setup');
    setMessage('Welcome to Battleship! Place your ships to begin...');
    setIsAiTalking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GameBoard isPlayer={true} boardId="player" />
          <GameBoard isPlayer={false} boardId="ai" />
        </div>

        <Controls
          onStartGame={handleStartGame}
          onReset={handleReset}
          gameStarted={gamePhase !== 'setup'}
        />

        <MessageArea message={message} isAiTalking={isAiTalking} />
      </main>

      <footer className="text-center py-4 text-gray-600 text-sm">
        <p>Battleship Game - Built with React + TypeScript + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
