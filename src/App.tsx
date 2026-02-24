import { useState } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MessageArea from './components/MessageArea';
import { useGameBoard } from './hooks/useGameBoard';
import type { GamePhase } from './types/game';

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [message, setMessage] = useState('Welcome to Battleship! Place your ships to begin...');
  const [isAiTalking, setIsAiTalking] = useState(false);

  // Initialize board states for player and AI
  const playerBoard = useGameBoard();
  const aiBoard = useGameBoard();

  const handlePlayerCellClick = (row: number, col: number) => {
    console.log(`Player board clicked: ${String.fromCharCode(65 + col)}${row + 1}`);
    if (gamePhase === 'setup') {
      setMessage(`Clicked cell ${String.fromCharCode(65 + col)}${row + 1} on your board`);
    }
  };

  const handleAiCellClick = (row: number, col: number) => {
    console.log(`AI board clicked: ${String.fromCharCode(65 + col)}${row + 1}`);
    if (gamePhase === 'playing') {
      const cell = aiBoard.boardState.cells[row]?.[col];
      if (!cell) return;

      if (!cell.isGuessed) {
        const newState = cell.hasShip ? 'hit' : 'miss';
        aiBoard.updateCell(row, col, newState);

        if (newState === 'hit') {
          setMessage(`Direct hit at ${String.fromCharCode(65 + col)}${row + 1}!`);
          setIsAiTalking(false);
        } else {
          setMessage(`Miss at ${String.fromCharCode(65 + col)}${row + 1}. "Is that the best you can do?"`);
          setIsAiTalking(true);
        }
      } else {
        setMessage('You already tried that spot, captain!');
      }
    } else {
      setMessage('Start the game first!');
    }
  };

  const handleCellHover = (row: number, col: number) => {
    // Optional: could show coordinate info on hover
  };

  const handleStartGame = () => {
    setGamePhase('playing');
    setMessage("Let's see if you can handle this, captain...");
    setIsAiTalking(true);
  };

  const handleReset = () => {
    setGamePhase('setup');
    setMessage('Welcome to Battleship! Place your ships to begin...');
    setIsAiTalking(false);
    playerBoard.resetBoard();
    aiBoard.resetBoard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GameBoard
            isPlayer={true}
            boardState={playerBoard.boardState}
            onCellClick={handlePlayerCellClick}
            onCellHover={handleCellHover}
            showShips={true}
          />
          <GameBoard
            isPlayer={false}
            boardState={aiBoard.boardState}
            onCellClick={handleAiCellClick}
            onCellHover={handleCellHover}
            showShips={false}
          />
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
