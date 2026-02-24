# AI Opponent Implementation

## Overview
Implemented AI opponent logic with deterministic behavior using seeded random number generation.

## Architecture Decisions

### Seeded Random Generator
- Used Linear Congruential Generator (LCG) for deterministic pseudo-random behavior
- Ensures same seed produces identical ship placements and attack patterns
- Critical for testing and reproducibility

### Two-Mode Targeting Strategy
- **Hunt Mode**: Random attacks on unguessed cells when no active targets
- **Target Mode**: After a hit, attacks adjacent cells (up, down, left, right)
- Uses a stack to track cells to target, enabling systematic ship hunting

### State Management
- `useAI` hook encapsulates all AI behavior
- Maintains hit stack for target mode
- Provides clean interface: `placeAIShips`, `getAIMove`, `recordHit`, `reset`
- Avoids mutation by returning updated state from `getNextTarget`

## Files Created
- `src/utils/aiLogic.ts`: Core AI algorithms
- `src/hooks/useAI.ts`: React hook for AI state management
- `src/types/game.ts`: Added `AIMode` and `AIState` types

## Testing Considerations
- Determinism can be verified by using same seed
- Ship placement validates no overlaps and stays within bounds
- Target mode efficiently narrows search after hits
