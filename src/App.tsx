import { useState, useEffect } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MessageArea from './components/MessageArea';
import ShipPlacement from './components/ShipPlacement';
import { useGameBoard } from './hooks/useGameBoard';
import { useShipPlacement } from './hooks/useShipPlacement';
import { getMessage, resetMessageHistory, getCoordinateString } from './utils/aiMessages';
import type { GamePhase } from './types/game';

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [message, setMessage] = useState('Welcome to Battleship! Place your ships to begin...');
  const [isAiTalking, setIsAiTalking] = useState(false);

  // Initialize board states for player and AI
  const playerBoard = useGameBoard();
  const aiBoard = useGameBoard();

  // Ship placement state
  const shipPlacement = useShipPlacement();

  // Keyboard listener for rotation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (gamePhase === 'setup' && shipPlacement.selectedShip) {
          shipPlacement.toggleOrientation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gamePhase, shipPlacement]);

  const handlePlayerCellClick = (row: number, col: number) => {
    if (gamePhase === 'setup' && shipPlacement.selectedShip) {
      // Try to place the selected ship
      const canPlace = shipPlacement.canPlaceShip(
        row,
        col,
        shipPlacement.selectedShip.size,
        shipPlacement.orientation,
        playerBoard.boardState
      );

      if (canPlace) {
        playerBoard.placeShip(
          shipPlacement.selectedShip.id,
          shipPlacement.selectedShip.name,
          shipPlacement.selectedShip.size,
          row,
          col,
          shipPlacement.orientation
        );
        shipPlacement.markShipAsPlaced(shipPlacement.selectedShip.id);
        setMessage(`${shipPlacement.selectedShip.name} placed at ${getCoordinateString(row, col)}!`);
        setIsAiTalking(false);
      } else {
        setMessage('Cannot place ship here. Check for overlaps or boundaries.');
        setIsAiTalking(false);
      }
    }
  };

  const handleAiCellClick = (row: number, col: number) => {
    console.log(`AI board clicked: ${getCoordinateString(row, col)}`);
    if (gamePhase === 'playing') {
      const cell = aiBoard.boardState.cells[row]?.[col];
      if (!cell) return;

      if (!cell.isGuessed) {
        const newState = cell.hasShip ? 'hit' : 'miss';
        aiBoard.updateCell(row, col, newState);

        if (newState === 'hit') {
          // Check if ship was sunk
          const sunkInfo = aiBoard.checkIfShipSunk(cell.shipId);
          if (sunkInfo?.sunk) {
            setMessage(`${sunkInfo.shipName} sunk at ${getCoordinateString(row, col)}! ${getMessage('playerSinkShip')}`);
            setIsAiTalking(true);
          } else {
            setMessage(`Direct hit at ${getCoordinateString(row, col)}! ${getMessage('playerHit')}`);
            setIsAiTalking(true);
          }
        } else {
          setMessage(getMessage('playerMiss'));
          setIsAiTalking(true);
        }
      } else {
        setMessage(getMessage('alreadyGuessed'));
        setIsAiTalking(false);
      }
    } else {
      setMessage('Start the game first!');
      setIsAiTalking(false);
    }
  };

  const handleCellHover = (row: number, col: number) => {
    if (gamePhase === 'setup' && shipPlacement.selectedShip) {
      shipPlacement.setPreview({ row, col });
    }
  };

  const handleStartGame = () => {
    if (!shipPlacement.allShipsPlaced) {
      setMessage('Please place all ships before starting the game!');
      setIsAiTalking(false);
      return;
    }
    resetMessageHistory();
    setGamePhase('playing');
    setMessage(getMessage('gameStart'));
    setIsAiTalking(true);
  };

  const handleReset = () => {
    setGamePhase('setup');
    setMessage('Welcome to Battleship! Place your ships to begin...');
    setIsAiTalking(false);
    resetMessageHistory();
    playerBoard.resetBoard();
    aiBoard.resetBoard();
    shipPlacement.resetPlacement();
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
            shipPreview={
              gamePhase === 'setup' && shipPlacement.selectedShip && shipPlacement.previewPosition
                ? {
                    row: shipPlacement.previewPosition.row,
                    col: shipPlacement.previewPosition.col,
                    size: shipPlacement.selectedShip.size,
                    orientation: shipPlacement.orientation,
                    valid: shipPlacement.canPlaceShip(
                      shipPlacement.previewPosition.row,
                      shipPlacement.previewPosition.col,
                      shipPlacement.selectedShip.size,
                      shipPlacement.orientation,
                      playerBoard.boardState
                    ),
                  }
                : null
            }
          />
          {gamePhase === 'setup' ? (
            <ShipPlacement
              ships={shipPlacement.ships}
              selectedShipId={shipPlacement.selectedShip?.id || null}
              orientation={shipPlacement.orientation}
              allShipsPlaced={shipPlacement.allShipsPlaced}
              onSelectShip={shipPlacement.selectShip}
              onToggleOrientation={shipPlacement.toggleOrientation}
              onStartGame={handleStartGame}
            />
          ) : (
            <GameBoard
              isPlayer={false}
              boardState={aiBoard.boardState}
              onCellClick={handleAiCellClick}
              onCellHover={handleCellHover}
              showShips={false}
            />
          )}
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
