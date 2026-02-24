import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MessageArea from './components/MessageArea';
import ShipPlacement from './components/ShipPlacement';
import ShipStatus from './components/ShipStatus';
import { useGameBoard } from './hooks/useGameBoard';
import { useShipPlacement } from './hooks/useShipPlacement';
import { useAI } from './hooks/useAI';
import { areAllShipsSunk, findShipAtPosition, isShipSunk } from './utils/gameRules';
import { getAIMessage, formatAIMessage, calculateGameState, type AIMessageContext } from './utils/aiMessages';
import type { GamePhase, Orientation } from './types/game';

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [message, setMessage] = useState('Welcome to Battleship! Place your ships to begin...');
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [usedMessages, setUsedMessages] = useState<Set<string>>(new Set());
  const [aiIsThinking, setAiIsThinking] = useState(false);

  // Initialize board states for player and AI
  const playerBoard = useGameBoard();
  const aiBoard = useGameBoard();

  // Ship placement state
  const shipPlacement = useShipPlacement();

  // AI intelligence
  const ai = useAI();

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

  // Randomly place AI ships using smart AI
  const placeAiShips = useCallback(() => {
    ai.placeAIShips(aiBoard.placeShip);
  }, [ai, aiBoard]);

  // Get AI personality message based on game context
  const getAIPersonalityMessage = useCallback((
    eventType: AIMessageContext['eventType'],
    shipName?: string
  ): string => {
    const playerShipsRemaining = playerBoard.boardState.placedShips.filter(
      ship => !isShipSunk(ship)
    ).length;
    const aiShipsRemaining = aiBoard.boardState.placedShips.filter(
      ship => !isShipSunk(ship)
    ).length;

    const context: AIMessageContext = {
      gameState: calculateGameState(playerShipsRemaining, aiShipsRemaining),
      eventType,
      playerShipsRemaining,
      aiShipsRemaining,
    };

    const rawMessage = getAIMessage(context, usedMessages);
    const formattedMessage = formatAIMessage(rawMessage, shipName);

    setUsedMessages(prev => new Set([...prev, rawMessage]));

    return formattedMessage;
  }, [playerBoard.boardState.placedShips, aiBoard.boardState.placedShips, usedMessages]);

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

    if (aiIsThinking) {
      setMessage('Wait for AI to finish!');
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
          const aiReaction = getAIPersonalityMessage('player_sunk_ship', hitShip.name);
          setMessage(`Direct hit at ${String.fromCharCode(65 + col)}${row + 1}! You sunk the enemy ${hitShip.name}! "${aiReaction}"`);
          setIsAiTalking(true);

          // Check for player win
          setTimeout(() => {
            if (areAllShipsSunk(aiBoard.boardState)) {
              setGamePhase('gameOver');
              const aiReaction = getAIPersonalityMessage('player_wins');
              setMessage(`🎉 Congratulations! You sank all enemy ships! You win! "${aiReaction}"`);
              setIsAiTalking(true);
            } else {
              // AI counter-attack
              performAiAttack();
            }
          }, 1500);
        } else {
          const aiReaction = getAIPersonalityMessage('player_hit');
          setMessage(`Direct hit at ${String.fromCharCode(65 + col)}${row + 1}! "${aiReaction}"`);
          setIsAiTalking(true);

          // AI counter-attack after short delay
          setTimeout(() => {
            performAiAttack();
          }, 1000);
        }
      }, 100);
    } else {
      const aiTaunt = getAIPersonalityMessage('player_miss');
      setMessage(`Miss at ${String.fromCharCode(65 + col)}${row + 1}. "${aiTaunt}"`);
      setIsAiTalking(true);

      // AI counter-attack
      setTimeout(() => {
        performAiAttack();
      }, 1500);
    }
  };

  const performAiAttack = () => {
    setAiIsThinking(true);
    setMessage('AI is calculating its next move...');
    setIsAiTalking(false);

    // Add AI "thinking" delay (300-800ms for realism)
    const thinkDelay = 300 + Math.random() * 500;

    setTimeout(() => {
      const aiTarget = ai.getAIMove(playerBoard.boardState);
      if (!aiTarget) {
        setMessage('AI has no more moves!');
        setAiIsThinking(false);
        return;
      }

      const { row, col } = aiTarget;
      const cell = playerBoard.boardState.cells[row]?.[col];
      if (!cell) {
        setAiIsThinking(false);
        return;
      }

      const newState = cell.hasShip ? 'hit' : 'miss';

      playerBoard.updateCell(row, col, newState);
      setAiIsThinking(false);

      // Record the hit to enable target mode
      ai.recordHit(row, col, newState === 'hit');

      if (newState === 'hit') {
        const hitShip = findShipAtPosition(playerBoard.boardState, row, col);

        // Check if ship was sunk
        setTimeout(() => {
          if (hitShip && isShipSunk({ ...hitShip, hits: hitShip.hits + 1 })) {
            const aiGloat = getAIPersonalityMessage('ai_sunk_ship', hitShip.name);
            setMessage(`AI hit your ${hitShip.name} at ${String.fromCharCode(65 + col)}${row + 1} and sunk it! "${aiGloat}"`);
            setIsAiTalking(true);

            // Check for AI win
            setTimeout(() => {
              if (areAllShipsSunk(playerBoard.boardState)) {
                setGamePhase('gameOver');
                const aiVictory = getAIPersonalityMessage('ai_wins');
                setMessage(`💀 All your ships have been destroyed! AI wins! "${aiVictory}"`);
                setIsAiTalking(true);
              }
            }, 1500);
          } else {
            const aiGloat = getAIPersonalityMessage('ai_hit');
            setMessage(`AI hit your ship at ${String.fromCharCode(65 + col)}${row + 1}! "${aiGloat}"`);
            setIsAiTalking(true);
          }
        }, 100);
      } else {
        setMessage(`AI missed at ${String.fromCharCode(65 + col)}${row + 1}. Your turn!`);
        setIsAiTalking(false);
      }
    }, thinkDelay);
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
    const aiGreeting = getAIPersonalityMessage('game_start');
    setMessage(aiGreeting);
    setIsAiTalking(true);
  };

  const handleReset = () => {
    setGamePhase('setup');
    setMessage('Welcome to Battleship! Place your ships to begin...');
    setIsAiTalking(false);
    setAiIsThinking(false);
    playerBoard.resetBoard();
    aiBoard.resetBoard();
    shipPlacement.resetPlacement();
    ai.reset();
    setUsedMessages(new Set());
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

        {aiIsThinking && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-blue-600 rounded-full animate-typing-dots"
                style={{ animationDelay: '0s' }}
              />
              <span
                className="w-2 h-2 bg-blue-600 rounded-full animate-typing-dots"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2 h-2 bg-blue-600 rounded-full animate-typing-dots"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
            <span className="text-blue-700 font-semibold">AI is thinking...</span>
          </div>
        )}

        <MessageArea message={message} isAiTalking={isAiTalking} />
      </main>

      <footer className="text-center py-4 text-gray-600 text-sm">
        <p>Battleship Game - Built with React + TypeScript + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
