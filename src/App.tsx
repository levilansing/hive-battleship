import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MessageArea from './components/MessageArea';
import ShipPlacement from './components/ShipPlacement';
import ShipStatus from './components/ShipStatus';
import { useGameBoard } from './hooks/useGameBoard';
import { useShipPlacement } from './hooks/useShipPlacement';
import { getAiAttack, areAllShipsSunk, findShipAtPosition, isShipSunk } from './utils/gameRules';
import type { GamePhase, Orientation } from './types/game';

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

  // Randomly place AI ships
  const placeAiShips = useCallback(() => {
    const ships = [
      { id: 'ai-carrier', name: 'Carrier', size: 5 },
      { id: 'ai-battleship', name: 'Battleship', size: 4 },
      { id: 'ai-cruiser', name: 'Cruiser', size: 3 },
      { id: 'ai-submarine', name: 'Submarine', size: 3 },
      { id: 'ai-destroyer', name: 'Destroyer', size: 2 },
    ];

    ships.forEach((ship) => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const orientation: Orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        // Check if ship fits
        const fitsHorizontal = orientation === 'horizontal' && col + ship.size <= 10;
        const fitsVertical = orientation === 'vertical' && row + ship.size <= 10;

        if (!fitsHorizontal && !fitsVertical) {
          attempts++;
          continue;
        }

        // Check for overlaps
        let canPlace = true;
        for (let i = 0; i < ship.size; i++) {
          const checkRow = orientation === 'horizontal' ? row : row + i;
          const checkCol = orientation === 'horizontal' ? col + i : col;
          const cell = aiBoard.boardState.cells[checkRow]?.[checkCol];

          if (!cell || cell.hasShip) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          aiBoard.placeShip(ship.id, ship.name, ship.size, row, col, orientation);
          placed = true;
        }

        attempts++;
      }
    });
  }, [aiBoard]);

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
        setMessage(`${shipPlacement.selectedShip.name} placed at ${String.fromCharCode(65 + col)}${row + 1}!`);
      } else {
        setMessage('Cannot place ship here. Check for overlaps or boundaries.');
      }
    }
  };

  const handleAiCellClick = (row: number, col: number) => {
    console.log(`AI board clicked: ${String.fromCharCode(65 + col)}${row + 1}`);
    if (gamePhase !== 'playing') {
      setMessage('Start the game first!');
      return;
    }

    const cell = aiBoard.boardState.cells[row]?.[col];
    if (!cell) return;

    if (cell.isGuessed) {
      setMessage('You already tried that spot, captain!');
      return;
    }

    // Player attacks
    const newState = cell.hasShip ? 'hit' : 'miss';
    aiBoard.updateCell(row, col, newState);

    if (newState === 'hit') {
      const hitShip = findShipAtPosition(aiBoard.boardState, row, col);

      // Check if ship was sunk after this hit
      setTimeout(() => {
        if (hitShip && isShipSunk({ ...hitShip, hits: hitShip.hits + 1 })) {
          setMessage(`Direct hit at ${String.fromCharCode(65 + col)}${row + 1}! You sunk the enemy ${hitShip.name}!`);
          setIsAiTalking(false);

          // Check for player win
          setTimeout(() => {
            if (areAllShipsSunk(aiBoard.boardState)) {
              setGamePhase('gameOver');
              setMessage('🎉 Congratulations! You sank all enemy ships! You win!');
              setIsAiTalking(false);
            } else {
              // AI counter-attack
              performAiAttack();
            }
          }, 1500);
        } else {
          setMessage(`Direct hit at ${String.fromCharCode(65 + col)}${row + 1}!`);
          setIsAiTalking(false);

          // AI counter-attack after short delay
          setTimeout(() => {
            performAiAttack();
          }, 1000);
        }
      }, 100);
    } else {
      setMessage(`Miss at ${String.fromCharCode(65 + col)}${row + 1}. "Is that the best you can do?"`);
      setIsAiTalking(true);

      // AI counter-attack
      setTimeout(() => {
        performAiAttack();
      }, 1500);
    }
  };

  const performAiAttack = () => {
    const aiTarget = getAiAttack(playerBoard.boardState);
    if (!aiTarget) {
      setMessage('AI has no more moves!');
      return;
    }

    const { row, col } = aiTarget;
    const cell = playerBoard.boardState.cells[row]?.[col];
    if (!cell) return;

    const newState = cell.hasShip ? 'hit' : 'miss';

    playerBoard.updateCell(row, col, newState);

    if (newState === 'hit') {
      const hitShip = findShipAtPosition(playerBoard.boardState, row, col);

      // Check if ship was sunk
      setTimeout(() => {
        if (hitShip && isShipSunk({ ...hitShip, hits: hitShip.hits + 1 })) {
          setMessage(`AI hit your ${hitShip.name} at ${String.fromCharCode(65 + col)}${row + 1} and sunk it! "Your fleet is weakening!"`);
          setIsAiTalking(true);

          // Check for AI win
          setTimeout(() => {
            if (areAllShipsSunk(playerBoard.boardState)) {
              setGamePhase('gameOver');
              setMessage('💀 All your ships have been destroyed! AI wins!');
              setIsAiTalking(true);
            }
          }, 1500);
        } else {
          setMessage(`AI hit your ship at ${String.fromCharCode(65 + col)}${row + 1}! "Got you!"`);
          setIsAiTalking(true);
        }
      }, 100);
    } else {
      setMessage(`AI missed at ${String.fromCharCode(65 + col)}${row + 1}. Your turn!`);
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
      return;
    }
    placeAiShips();
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
    shipPlacement.resetPlacement();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
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
            {gamePhase !== 'setup' && (
              <ShipStatus ships={playerBoard.boardState.placedShips} title="Your Fleet" />
            )}
          </div>
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
            <div className="space-y-4">
              <GameBoard
                isPlayer={false}
                boardState={aiBoard.boardState}
                onCellClick={handleAiCellClick}
                onCellHover={handleCellHover}
                showShips={false}
              />
              <ShipStatus ships={aiBoard.boardState.placedShips} title="Enemy Fleet" />
            </div>
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
