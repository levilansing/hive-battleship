# Task: Build AI opponent logic

## Description

Implement AI ship placement (random valid positions) and targeting strategy. Use hunt mode (random shots) and target mode (adjacent cells after hit). Create useAI hook to encapsulate AI behavior.

## Acceptance Criteria

AI can randomly place ships on its board. AI makes intelligent attacks: random until hit, then targets adjacent cells. AI decisions are deterministic for same seed.

## Implementation Plan

## Implementation Plan

### 1. Create AI Logic Utilities (src/utils/aiLogic.ts)
- Implement seeded random number generator for determinism
- `placeShipsRandomly(seed)`: Randomly place all ships with valid positions
  - Use SHIP_TEMPLATES from useShipPlacement
  - Validate placement using similar logic to canPlaceShip
  - Return array of PlacedShip objects
- `getNextTarget(boardState, hitStack, seed)`: Intelligent targeting
  - Hunt mode: Random untargeted cell when hitStack is empty
  - Target mode: Pop from hitStack to target adjacent cells after a hit
  - Return {row, col} for next attack

### 2. Create useAI Hook (src/hooks/useAI.ts)
- State management:
  - `hitStack`: Stack of cells to target (for target mode)
  - `seed`: Random seed for determinism
- Functions:
  - `placeAIShips(boardState, placeShip)`: Place all AI ships randomly
  - `getAIMove(boardState)`: Get next cell to attack
  - `recordHit(row, col)`: Add adjacent cells to hitStack when ship is hit
  - `reset()`: Clear state for new game

### 3. Update Types (src/types/game.ts)
- Add `AIMode` type: 'hunt' | 'target'
- Add `AIState` interface if needed for exported state

### 4. Testing Approach
- Verify ships placed randomly don't overlap
- Verify determinism: same seed = same placements/moves
- Verify hunt mode uses random untargeted cells
- Verify target mode attacks adjacent cells after hit

## Files to Modify

src/hooks/useAI.ts (new), src/utils/aiLogic.ts (new), src/types/game.ts

## Instructions

1. Implement the task as described above.
2. Follow the project conventions.
3. Commit your work with a descriptive message.
4. Exit when done.
