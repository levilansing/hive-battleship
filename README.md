# 🚢 Battleship vs. Snarky AI ⚓

> *"Think you can sink my fleet? I've been practicing... and talking trash."* — Your AI Opponent

A 1-player web-based Battleship game where you face off against an AI opponent with **way too much personality**. Built for kids (and adults who like playful banter), this game combines classic naval warfare strategy with an AI that won't let you forget when you miss.

**This is a client-only app** — no server required, just pure browser-based naval combat. Deploy it anywhere that serves static files and prepare for some serious smack talk.

---

## ✨ Features

### ✅ Implemented
- **Modern Tech Stack**: React 18 + TypeScript + Tailwind CSS + Vite
- **Responsive UI Foundation**: Two 10x10 game boards (yours and the AI's)
- **Component Architecture**: Modular React components (GameBoard, Header, Controls, MessageArea)
- **Type Safety**: Full TypeScript implementation with strict typing
- **Kid-Friendly Design**: Ocean-themed UI with blue gradients and clear visuals

### 🚧 In Development
- **Interactive Ship Placement**: Drag-and-drop or click-to-place with rotation
- **Game Logic Engine**: Hit/miss detection, ship tracking, win conditions
- **Smart AI Opponent**: Hunt/target mode AI that actually challenges you
- **Snarky Personality System**: 50+ contextual responses (cocky when winning, defensive when losing)
- **Animations & Polish**: Hit/miss effects, ship sinking animations, sound effects

---

## 🎮 Game Rules

**Fleet Composition** (5 ships, 17 total squares):
- 🛳️ **Carrier** — 5 spaces
- ⚓ **Battleship** — 4 spaces
- 🚤 **Cruiser** — 3 spaces
- 🛥️ **Submarine** — 3 spaces
- ⛵ **Destroyer** — 2 spaces

**How to Play**:
1. **Setup**: Place your 5 ships on your 10×10 grid (horizontal or vertical, no overlaps)
2. **Battle**: Take turns firing shots at coordinates (e.g., "B5")
3. **Win**: First to sink all enemy ships wins
4. **Endure**: The AI's commentary throughout

Ships must be placed within grid boundaries, cannot overlap, and can only be horizontal or vertical (no diagonals).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI framework |
| **TypeScript** | Type safety and better developer experience |
| **Tailwind CSS** | Utility-first styling with ocean theme |
| **Vite** | Lightning-fast dev server and optimized builds |

**Why this stack?**
- ✅ Modern, maintainable, and type-safe
- ✅ Fast development with hot module replacement
- ✅ Zero backend dependencies (pure client-side)
- ✅ Excellent tooling and IDE support

See [docs/plan/tech-stack-decision.md](docs/plan/tech-stack-decision.md) for full rationale.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd battleship

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173` with hot module replacement enabled.

### Development Commands

```bash
npm run dev          # Start dev server with HMR
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run typecheck    # Run TypeScript compiler check
```

---

## 📁 Project Structure

```
battleship/
├── src/
│   ├── components/          # React components
│   │   ├── GameBoard.tsx    # Reusable 10×10 grid component
│   │   ├── Header.tsx       # Game title and stats
│   │   ├── Controls.tsx     # Game control buttons
│   │   └── MessageArea.tsx  # AI personality display
│   ├── types/
│   │   └── game.ts          # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles + Tailwind imports
├── docs/
│   └── plan/                # Task plans and architecture docs
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind theme customization
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

---

## 🏗️ Architecture

### Component Hierarchy
```
App.tsx (game state container)
├── Header (title, stats)
├── GameBoard × 2 (player & AI boards)
├── Controls (start, reset, settings buttons)
└── MessageArea (AI trash talk)
```

### Design Patterns
- **Functional Components**: All components use TypeScript functional components with proper typing
- **Props Drilling**: Current state management (may evolve to Context API or state library)
- **Utility-First Styling**: 100% Tailwind CSS, no custom CSS files
- **Type Safety**: No `any` types — everything is properly typed
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support

See [docs/knowledge-base/react-conventions.md](docs/knowledge-base/react-conventions.md) for detailed patterns.

---

## 🎯 Development Roadmap

### Phase 1: Game UI & Setup ✅
- [x] Project scaffolding (React + TypeScript + Vite + Tailwind)
- [x] Basic component structure
- [ ] Interactive game boards with click handlers
- [ ] Ship placement UI with drag-and-drop
- [ ] Responsive design polish

### Phase 2: Core Game Logic 🚧
- [ ] Game state management (boards, turns, phases)
- [ ] Ship placement validation (bounds, overlaps)
- [ ] Hit/miss detection and tracking
- [ ] Win condition checking

### Phase 3: AI Opponent System 🚧
- [ ] Random shot AI (basic mode)
- [ ] Hunt/target strategy AI (smart mode)
- [ ] Snarky personality system (50+ contextual responses)
- [ ] Difficulty balancing for kids

### Phase 4: Experience & Polish 🚧
- [ ] Hit/miss/sink animations
- [ ] Sound effects (with mute toggle)
- [ ] Victory/defeat sequences
- [ ] Final playtesting and iteration

---

## 🤖 AI Personality

The AI opponent features a **context-aware personality system** with 50+ unique responses:

- **On Hit**: *"Gotcha! I'm on fire today!"*
- **On Miss**: *"Strategic water-testing! That's totally what that was..."*
- **When Hit**: *"Ow! Lucky guess..."*
- **When Losing**: *"This is all part of my master plan... trust me!"*
- **When Winning**: *"Should I give you a hint? Nah, where's the fun in that!"*

All responses are kid-friendly, encouraging, and designed to make the game more fun without being mean.

---

## 🎨 Design Philosophy

- **Kid-Friendly**: Large buttons, clear visuals, appropriate difficulty
- **Responsive**: Works on tablets and desktops
- **Accessible**: Semantic HTML, ARIA labels, keyboard support
- **Fast**: Optimized builds, lazy loading, minimal dependencies
- **Fun**: Snarky AI makes every game entertaining

---

## 🤝 Contributing

This is an educational project, but contributions are welcome! Please:

1. Follow the existing TypeScript + React patterns
2. Use Tailwind for all styling (no custom CSS)
3. Ensure all code is properly typed (no `any` types)
4. Test your changes across different screen sizes
5. Keep the AI's snark kid-friendly

---

## 📄 License

MIT License — feel free to use this for your own snarky naval battles.

---

## 🙏 Credits

Built with ❤️ for a niece who deserves a fun Battleship game with an AI opponent that won't let her win too easily.

**Tech Stack**: React, TypeScript, Tailwind CSS, Vite
**Inspiration**: Classic Battleship + too many hours of competitive gaming
**AI Personality**: Snarky but never mean 😎

---

*Ready to battle? The AI is waiting... and already talking trash.* 🚢💥
