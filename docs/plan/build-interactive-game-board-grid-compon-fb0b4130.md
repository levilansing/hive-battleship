# Task: Build interactive game board grid component

## Description

Enhance the GameBoard component with interactivity: clickable cells, coordinate labels (A-J, 1-10), cell state visualization (empty, ship, hit, miss), and event handling using React hooks and TypeScript.

## Acceptance Criteria

Interactive grids with coordinate labels, cells can be clicked and display different states visually

## Implementation Plan

## Implementation Plan (TypeScript + React + Tailwind)

### Overview
Enhance the GameBoard component with interactive features: clickable cells, coordinate labels, cell state visualization, and event handling for ship placement and attacks.

### Files to Modify

- `src/components/GameBoard.tsx` - Add interactivity and state management
- `src/types/game.ts` - Add cell interaction types and event handlers
- `src/hooks/useGameBoard.ts` (new) - Custom hook for board state logic
- `src/App.tsx` - Wire up board interaction handlers

### Technical Approach

#### 1. **Enhanced Type Definitions**
```typescript
// src/types/game.ts
export type CellState = 'empty' | 'ship' | 'hit' | 'miss';
export type Orientation = 'horizontal' | 'vertical';

export interface Cell {
  row: number;
  col: number;
  state: CellState;
  hasShip: boolean;
  shipId?: string;
  isGuessed: boolean;
}

export interface BoardState {
  cells: Cell[][];
  placedShips: PlacedShip[];
}

export interface CellClickEvent {
  row: number;
  col: number;
}
```

#### 2. **GameBoard Component Enhancement**
```tsx
interface GameBoardProps {
  isPlayer: boolean;
  boardState: BoardState;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  showShips?: boolean; // Hide AI ships during battle
}

export function GameBoard({ isPlayer, boardState, onCellClick, onCellHover, showShips }: GameBoardProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Board header with title */}
      <h2 className="text-xl font-bold">
        {isPlayer ? "Your Fleet" : "Enemy Waters"}
      </h2>
      
      {/* Grid container with coordinate labels */}
      <div className="grid grid-cols-11 grid-rows-11 gap-1">
        {/* Column labels A-J */}
        <div className="col-start-2 col-span-10 grid grid-cols-10">
          {['A','B','C','D','E','F','G','H','I','J'].map(label => (
            <div key={label} className="text-center font-semibold text-sm">
              {label}
            </div>
          ))}
        </div>
        
        {/* Rows with labels and cells */}
        {Array.from({ length: 10 }, (_, row) => (
          <React.Fragment key={row}>
            {/* Row label 1-10 */}
            <div className="flex items-center justify-center font-semibold text-sm">
              {row + 1}
            </div>
            
            {/* Cell grid for this row */}
            {Array.from({ length: 10 }, (_, col) => {
              const cell = boardState.cells[row][col];
              return (
                <BoardCell
                  key={`${row}-${col}`}
                  cell={cell}
                  onClick={() => onCellClick?.(row, col)}
                  onHover={() => onCellHover?.(row, col)}
                  showShip={showShips || isPlayer}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
```

#### 3. **BoardCell Component** (new component)
```tsx
// src/components/BoardCell.tsx
interface BoardCellProps {
  cell: Cell;
  onClick: () => void;
  onHover: () => void;
  showShip: boolean;
}

export function BoardCell({ cell, onClick, onHover, showShip }: BoardCellProps) {
  const getCellClasses = () => {
    const base = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-gray-400 cursor-pointer transition-colors";
    
    // State-based styling
    if (cell.state === 'hit') return `${base} bg-red-500`;
    if (cell.state === 'miss') return `${base} bg-gray-300`;
    if (cell.hasShip && showShip) return `${base} bg-blue-400 hover:bg-blue-500`;
    
    return `${base} bg-blue-50 hover:bg-blue-200`;
  };

  return (
    <div
      className={getCellClasses()}
      onClick={onClick}
      onMouseEnter={onHover}
      role="button"
      tabIndex={0}
      aria-label={`Cell ${String.fromCharCode(65 + cell.col)}${cell.row + 1}`}
    />
  );
}
```

#### 4. **Custom Hook for Board State**
```tsx
// src/hooks/useGameBoard.ts
export function useGameBoard() {
  const [boardState, setBoardState] = useState<BoardState>({
    cells: Array.from({ length: 10 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => ({
        row,
        col,
        state: 'empty',
        hasShip: false,
        isGuessed: false
      }))
    ),
    placedShips: []
  });

  const updateCell = (row: number, col: number, newState: CellState) => {
    setBoardState(prev => {
      const newCells = prev.cells.map(r => r.map(c => ({...c})));
      newCells[row][col].state = newState;
      return { ...prev, cells: newCells };
    });
  };

  const placeShip = (shipId: string, startRow: number, startCol: number, orientation: Orientation, size: number) => {
    // Implementation for marking cells as having ships
  };

  return { boardState, updateCell, placeShip };
}
```

### Implementation Steps

1. **Update type definitions** - Add Cell, BoardState, and event types
2. **Create BoardCell component** - Reusable cell with state styling
3. **Create useGameBoard hook** - State management logic
4. **Enhance GameBoard component** - Add coordinate labels and grid layout
5. **Add click handlers** - Wire up cell interactions
6. **Add hover effects** - Visual feedback on mouse over
7. **Implement cell state styling** - Different colors for empty/ship/hit/miss
8. **Add responsive sizing** - Use Tailwind responsive classes
9. **Add accessibility** - ARIA labels, keyboard navigation
10. **Test interactions** - Verify all states and events work

### Tailwind Styling Strategy

**Cell States:**
- Empty: `bg-blue-50 hover:bg-blue-200`
- Ship (player): `bg-blue-400 hover:bg-blue-500`
- Hit: `bg-red-500` (with hit marker icon)
- Miss: `bg-gray-300` (with miss marker)

**Grid Layout:**
- Coordinate labels: `text-sm font-semibold text-gray-700`
- Responsive cell sizes: `w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12`
- Grid gaps: `gap-1`

### Edge Cases & Considerations

- **Touch targets**: Ensure cells are min 44x44px on mobile
- **Performance**: Use React.memo for BoardCell to prevent unnecessary re-renders
- **Coordinate system**: A-J (columns), 1-10 (rows)
- **Event delegation**: Consider using single click handler on grid container
- **Visual feedback**: Immediate visual response on click/hover
- **Accessibility**: Keyboard navigation with arrow keys (future enhancement)
- **State persistence**: Board state should be immutable updates

### Dependencies

- **Requires**: Base project setup from task 9f7c2fc7fc0b9503
- **Blocks**: Ship placement UI (needs interactive board)
- **Blocks**: Attack logic (needs clickable cells)

### Testing Checklist

- [ ] Coordinate labels (A-J, 1-10) display correctly
- [ ] All 100 cells render per board (x2 boards)
- [ ] Cells are clickable and log row/col to console
- [ ] Hover effects work (bg color changes)
- [ ] Cell state changes work (empty → ship → hit → miss)
- [ ] Visual styling matches design (Tailwind classes applied)
- [ ] Responsive sizing works (mobile, tablet, desktop)
- [ ] Touch targets are adequate size on mobile
- [ ] No performance issues with 200 cells rendering
- [ ] TypeScript has no errors
- [ ] ARIA labels present for accessibility

## Project Conventions

### React Component Architecture Patterns

# React Component Architecture Patterns

## Established Patterns from Initial Implementation

### Component Structure
- **Functional Components**: All components use TypeScript functional components with `React.FC<Props>` typing
- **Props Interfaces**: Each component defines its own props interface inline (e.g., `HeaderProps`, `ControlsProps`)
- **Type Imports**: Use `import type` for type-only imports from shared types file

### File Organization
```
src/
├── components/          # All UI components
│   ├── GameBoard.tsx
│   ├── Header.tsx
│   ├── Controls.tsx
│   └── MessageArea.tsx
├── types/
│   └── game.ts         # Shared type definitions
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.css           # Global styles + Tailwind imports
```

### TypeScript Conventions
- **No 'any' types**: All props and state properly typed
- **Shared types**: Game-related types in `src/types/game.ts`
- **Component props**: Interface defined in same file as component
- **Type exports**: Use `export type` and `export interface` for reusable types

### Tailwind CSS Patterns
- **Utility-first**: All styling via Tailwind classes, no custom CSS
- **Responsive design**: Mobile-first approach with `lg:`, `md:` breakpoints
- **Color scheme**: Blue theme for water/naval aesthetic (blue-50, blue-100, blue-600)
- **Gradients**: Used for visual polish (`bg-gradient-to-r`, `from-blue-600`)
- **State variants**: `hover:`, `disabled:` for interactive states

### Accessibility
- **ARIA labels**: Grid boards have proper `role="grid"` and `aria-label`
- **Semantic HTML**: Use proper elements (`<header>`, `<main>`, `<footer>`, `<button>`)
- **Grid cell labels**: Each cell labeled with chess-like notation (A1, B2, etc.)

### Component Reusability
- **GameBoard**: Reusable with `isPlayer` and `boardId` props
- **Prop defaults**: Optional props have sensible defaults (e.g., `gameStarted = false`)
- **Conditional styling**: Props control visual variants (`isAiTalking` changes MessageArea style)

### State Management (Current)
- **useState hooks**: Local state in App.tsx for game phase and messages
- **Props drilling**: Parent state passed down to child components
- **Event handlers**: Callbacks passed as props for user interactions

### Build Configuration
- **Vite**: Fast dev server with HMR, optimized production builds
- **TypeScript**: Strict mode enabled, separate configs for app and node
- **Tailwind**: Configured to scan all TSX files for class usage
- **PostCSS**: Autoprefixer for browser compatibility

## Instructions

1. Implement the task as described above.
2. Follow the project conventions.
3. Commit your work with a descriptive message.
4. Exit when done.
