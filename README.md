# 🎮 Pixel Portfolio

An **interactive pixel-art portfolio website** built as a single-page application. Walk around a cozy pixel-art bedroom, interact with objects, and discover portfolio content — all through a retro game interface.

---

## ✨ Features

- 🕹️ **Controllable character** — move with WASD or arrow keys
- 🖥️ **TV & Game Console** — sit down and play 3 retro canvas-based games
  - 🚀 Space Shooter — enemy waves, scoring, lives, explosions
  - 🐍 Snake — wrap-around edges, growing snake, speed scaling
  - 🏓 Pong — AI opponent, ball physics, first to 7 wins
- 🎓 **Education certificate** — walk up to the wall certificate and press Enter
- ✨ **Proximity glow** — hotspots glow warm gold as you approach
- 🧱 **Polygon collision system** — 9 pixel-perfect isometric obstacles with ray-casting
- 🔧 **Collision Editor** (dev only) — visual polygon/rect editor with export

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 18.3.x |
| **Language** | TypeScript | 5.8.x |
| **Build Tool** | Vite + SWC | 5.4.x |
| **Styling** | TailwindCSS | 3.4.x |
| **UI Primitives** | shadcn/ui (Radix) | Various |
| **Routing** | React Router DOM | 6.30.x |
| **Fonts** | Press Start 2P, VT323 | Google Fonts |

---

## 📁 Project Structure

```
src/
├── assets/              # Pixel-art sprites (room, player, TV, bean bag chair)
├── components/
│   ├── GameRoom.tsx     # Main orchestrator — room, furniture, hotspots, dialogs
│   ├── PixelCharacter.tsx  # Player movement, polygon collision, proximity detection
│   ├── TVScreen.tsx     # CRT TV overlay with 3 playable retro games
│   ├── Hotspot.tsx      # Rect & polygon clickable zones with glow effects
│   ├── EducationDialog.tsx # Education / certificate dialog
│   ├── InfoDialog.tsx   # Themed dialog wrapper
│   └── CollisionEditor.tsx # Dev-only visual collision editor
├── pages/
│   ├── Index.tsx        # Home page
│   └── NotFound.tsx     # 404
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
```

---

## 🎮 Controls

| Action | Keys |
|--------|------|
| Move | `W A S D` or `↑ ↓ ← →` |
| Interact | `Enter` or `Space` (when near a hotspot) |
| Exit TV / Menu | `Escape` |

### Hotspots
| Object | Interaction |
|--------|-------------|
| 📺 TV & Game Console | Walk near → Press Enter to play games |
| 🎓 Certificate (right wall) | Walk near → Press Enter for Education dialog |

---

## 🧱 Collision System

- **9 polygon obstacles** covering all room furniture in isometric perspective
- **Ray-casting point-in-polygon** algorithm for pixel-perfect detection
- **Walkable bounds:** X: 1–97%, Y: 59–99%
- **Axis sliding:** diagonal movement resolves per-axis to slide along walls

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Tests
npm run test
```

---

## 🗺️ Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| Phase 1 | Pixel-art room + character + collision system | ✅ Done |
| Phase 2 | TV & 3 retro games (Space Shooter, Snake, Pong) | ✅ Done |
| Phase 3 | Desktop Shell — WindowManager + virtual apps | 🔜 Next |
| Refinement | Replace placeholder portfolio data with real info | ⏳ Waiting |
| Refinement | Mobile / touch controls | ⏳ Planned |

---

## 📄 License

MIT
