# Task: Create HTML structure and basic layout

## Description

Set up the React + TypeScript project with Vite and Tailwind CSS. Create the core component structure including two game boards (player and AI), header, and game controls. Establish the foundation for the battleship game UI.

## Acceptance Criteria

- Vite project initialized with React + TypeScript
- Tailwind CSS configured and working
- GameBoard component renders 10x10 grid (x2 for player and AI)
- Header, Controls, and MessageArea components created
- App runs in dev mode without errors
- All TypeScript types defined in src/types/game.ts
- Production build succeeds

## Implementation Plan

## Implementation Plan (TypeScript + React + Tailwind)

### Tech Stack

- **React 18+** with TypeScript
- **Tailwind CSS** for utility-first styling
- **Vite** as build tool and dev server
- **TypeScript** for type safety

### Files to Create/Modify

**Configuration & Setup:**

- `package.json` - Dependencies (react, react-dom, typescript, vite, tailwindcss)
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS with Tailwind
- `vite.config.ts` - Vite build configuration
- `index.html` - Root HTML (minimal, just mounts React app)

**Source Files:**

- `src/main.tsx` - React app entry point
- `src/App.tsx` - Main app component
- `src/index.css` - Tailwind imports + global styles
- `src/components/GameBoard.tsx` - Reusable board component
- `src/components/Header.tsx` - Game header with title and stats
- `src/components/Controls.tsx` - Game control buttons
- `src/components/MessageArea.tsx` - AI personality and status messages
- `src/types/game.ts` - TypeScript type definitions

### Component Structure

```tsx
App.tsx (Main container)
├── Header (title, stats)
├── <main> grid container
│   ├── GameBoard (player: true)
│   └── GameBoard (player: false, isAI)
├── Controls (buttons)
└── MessageArea (AI snark, status)
```

### Technical Approach

#### 1. **Project Initialization**

```bash
npm create vite@latest battleship -- --template react-ts
cd battleship
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2. **Tailwind Configuration**

Configure `tailwind.config.js` to scan all TSX files:

```js
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
```

Add Tailwind directives to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 3. **Component Architecture**

**GameBoard Component:**

- Props: `isPlayer: boolean`, `boardId: string`
- Renders 10x10 grid using Tailwind grid classes
- Each cell is a div with hover states and click handlers (prepared for future)
- Uses `grid grid-cols-10 gap-1` for layout

**Header Component:**

- Game title with gradient text
- Stats display (ships remaining, shots fired) - initially static
- Responsive flex layout

**Controls Component:**

- Button group with Tailwind styled buttons
- Start Game, Reset, Settings (disabled initially)
- Hover and disabled states

**MessageArea Component:**

- Props: `message: string`, `isAiTalking: boolean`
- Styled text area for AI personality
- Different styling for AI vs system messages

#### 4. **Type Definitions** (`src/types/game.ts`)

```typescript
export type CellState = 'empty' | 'ship' | 'hit' | 'miss';
export type GamePhase = 'setup' | 'playing' | 'gameOver';

export interface Cell {
  row: number;
  col: number;
  state: CellState;
}

export interface BoardProps {
  isPlayer: boolean;
  boardId: string;
}
```

#### 5. **Initial App.tsx Structure**

```tsx
- useState for game phase (initially 'setup')
- Two GameBoard components (player and AI)
- Tailwind container classes for responsive layout
- CSS Grid or Flexbox for board positioning
```

### Implementation Steps

 1. **Initialize Vite + React + TypeScript project**
 2. **Install and configure Tailwind CSS**
 3. **Create type definitions** in `src/types/game.ts`
 4. **Build GameBoard component** - 10x10 grid with Tailwind
 5. **Build Header component** - title and stats placeholders
 6. **Build Controls component** - button group
 7. **Build MessageArea component** - styled message display
 8. **Compose App.tsx** - wire all components together
 9. **Configure index.html** - minimal root div, proper meta tags
10. **Test dev server** - `npm run dev`, verify all components render

### Tailwind Styling Strategy

- **Boards**: `bg-blue-50`, `border-2 border-gray-300`, `rounded-lg`
- **Cells**: `w-8 h-8`, `border border-gray-400`, `hover:bg-blue-200`
- **Buttons**: `bg-blue-600 text-white`, `hover:bg-blue-700`, `disabled:opacity-50`
- **Layout**: `container mx-auto`, `flex justify-between`, `gap-4`
- **Responsive**: `lg:grid-cols-2`, `md:flex-col`, `sm:text-sm`

### Edge Cases & Considerations

- **Type safety**: All props typed, no `any` types
- **Accessibility**: ARIA labels on boards, semantic button elements, proper heading hierarchy
- **Responsive design**: Mobile-first Tailwind classes, boards stack on mobile
- **Performance**: React.memo for GameBoard if needed (10x10 = 100 cells each)
- **Dev experience**: Hot module replacement with Vite, TypeScript errors in IDE
- **Build output**: Optimized bundle with Vite's Rollup-based build

### Dependencies

- None - this is the foundation task
- Blocks: "Build interactive game board grid component" (will extend GameBoard)
- Blocks: "Implement ship placement UI" (will add interactivity)
- Blocks: "Add game control buttons and styling" (will enhance Controls)

### Files Modified/Created Summary

**Config (8 files):**

- package.json, tsconfig.json, tailwind.config.js, postcss.config.js, vite.config.ts, index.html, .gitignore, README.md

**Source (8 files):**

- src/main.tsx, src/App.tsx, src/index.css
- src/components/GameBoard.tsx
- src/components/Header.tsx
- src/components/Controls.tsx
- src/components/MessageArea.tsx
- src/types/game.ts

### Testing Checklist

- [ ] Vite dev server starts without errors (`npm run dev`)

- [ ] TypeScript compiles with no errors

- [ ] Tailwind classes apply correctly (check with browser devtools)

- [ ] Two game boards render as 10x10 grids

- [ ] Header displays with title

- [ ] Control buttons render and show disabled states

- [ ] Message area displays placeholder text

- [ ] Responsive layout works on mobile viewport

- [ ] Build command succeeds (`npm run build`)

- [ ] Production preview works (`npm run preview`)

- [ ] No console errors or warnings

- [ ] All components are properly typed (no TypeScript errors)

## Instructions

1. Implement the task as described above.
2. Follow the project conventions.
3. Commit your work with a descriptive message.
4. Exit when done.
