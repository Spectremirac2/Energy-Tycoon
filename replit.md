# Cuhadar Enerji Simulator

## Overview
A 3D browser-based energy empire simulation game inspired by cuhadarenerji.com. Players build an energy business empire by constructing buildings, mining resources, battling natives to capture gold mines, and using profits to establish a gaming company.

## Recent Changes
- 2026-02-07: Initial implementation of the full game
  - Game state management with Zustand (useGameState store)
  - 3D world with Three.js / React Three Fiber
  - Building placement system (solar panels, wind turbines, power stations, gold mines, gaming offices)
  - Gold mine battle system
  - Economic dashboard
  - Employee hiring and management
  - Dark energy-tech themed UI

## Architecture
- **Frontend**: React + Three.js via @react-three/fiber
- **State Management**: Zustand with subscribeWithSelector
- **3D Scene**: React Three Fiber with Drei helpers
- **Server**: Express.js serving static files and API
- **Build**: Vite for client, esbuild for server

## Project Structure
```
client/src/
├── App.tsx                    # Main app with game phase routing
├── components/
│   ├── game/
│   │   ├── GameWorld.tsx       # Canvas + 3D scene setup
│   │   ├── Terrain.tsx         # Ground plane with grass texture
│   │   ├── Buildings.tsx       # Building meshes (solar, wind, power, mine, office)
│   │   ├── GoldMines.tsx       # Capturable gold mine locations
│   │   ├── Environment.tsx     # Trees and rocks
│   │   └── PlacementGrid.tsx   # Building placement with raycasting
│   └── ui/
│       ├── MainMenu.tsx        # Start screen
│       ├── GameHUD.tsx         # Resource counters and action buttons
│       ├── BuildPanel.tsx      # Building selection menu
│       ├── BattlePanel.tsx     # Battle interface for mine capture
│       ├── CompanyPanel.tsx    # Gaming company management
│       └── EconomicPanel.tsx   # Economic overview dashboard
├── lib/stores/
│   ├── useGameState.tsx        # Main game state (resources, buildings, employees, battles)
│   ├── useAudio.tsx            # Sound management
│   └── useGame.tsx             # Simple phase management (unused, replaced by useGameState)
```

## Style Guide
- Primary: #1A5F7A (energy blue)
- Secondary: #FFB800 (gold/energy yellow)
- Accent: #2ECC71 (success green)
- Background: #0F2027 (dark gradient)
- UI Elements: #34495E (slate grey)
- Highlights: #E67E22 (orange/alert)
- Fonts: Rajdhani, Orbitron (Google Fonts)
