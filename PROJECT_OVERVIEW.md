# 📊 Project Architecture Overview

## 🏗️ Hub & Spoke Architecture

```
                    Landing Page (/)
                          |
        +-----------------+-----------------+
        |                                   |
   Tactical Board                    Official Draw
    (/lineup)                          (/draw)
```

## 📁 Complete File Structure

```
DSLB2026/
│
├── public/                    # Static assets
│
├── src/
│   ├── components/
│   │   └── Navbar.jsx        # Persistent navigation (Home, Tactical Board, Draw)
│   │
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with selection cards
│   │   ├── LineupBuilder.jsx # Drag-and-drop lineup tool
│   │   └── DrawSimulator.jsx # World Cup draw simulator
│   │
│   ├── store/
│   │   ├── lineupStore.js    # Zustand store for lineup state
│   │   └── drawStore.js      # Zustand store for draw state
│   │
│   ├── utils/
│   │   └── drawAlgorithm.js  # WC 2026 draw logic & rules
│   │
│   ├── App.jsx               # Router setup (BrowserRouter + Routes)
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind + custom glassmorphism styles
│
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Custom colors (pitch-green, fifa-blue, fifa-gold)
├── postcss.config.js         # PostCSS setup
├── .gitignore
├── README.md                 # Full documentation
└── START_HERE.md             # Quick start guide
```

## 🎨 Design System

### Colors
- **pitch-green**: Football pitch colors (50-900)
- **fifa-blue**: Official FIFA blue (50-900)
- **fifa-gold**: Trophy gold accents (50-900)

### Components
- **glass-card**: Glassmorphism container
- **glass-card-hover**: Interactive hover effects

## 🔄 Data Flow

### Lineup Builder
```
User Input → LineupStore (Zustand) → LocalStorage
                    ↓
            LineupBuilder.jsx
                    ↓
            DnD Kit (Drag & Drop)
```

### Draw Simulator
```
User Click → drawAlgorithm.js → DrawStore (Zustand) → LocalStorage
                                        ↓
                                DrawSimulator.jsx
                                        ↓
                                Groups Display
```

## 🛣️ Routing

```javascript
/ (Home)
├── /lineup (LineupBuilder)
└── /draw (DrawSimulator)
```

All routes have persistent Navbar for easy navigation.

## 🔑 Key Technologies

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Zustand | State management |
| @dnd-kit | Drag and drop |
| Tailwind CSS | Styling |
| Lucide React | Icons |

## 📦 State Management

### lineupStore.js
- `teamName`: String
- `formation`: String (4-3-3, 4-4-2, etc.)
- `players`: Array of player objects with positions
- Actions: `setTeamName`, `setFormation`, `updatePlayerPosition`, `resetLineup`

### drawStore.js
- `currentStep`: Number (1-3)
- `groups`: Array of group objects or null
- Actions: `setStep`, `setGroups`, `resetDraw`

## 🎯 Core Features

### Phase 1: Architecture ✅
- Client-side routing with React Router
- Persistent Navbar component
- Hub & spoke navigation pattern

### Phase 2: Landing Page ✅
- Hero section with gradient title
- Two interactive selection cards
- Glassmorphism design
- Reset data functionality

### Phase 3: Tools ✅

**Lineup Builder:**
- SVG football pitch with markings
- Draggable player nodes
- 4 formation presets
- Animated position transitions
- Auto-save to localStorage

**World Cup Draw:**
- 48 teams in 4 pots
- 12 groups (A-L)
- Confederation constraints
- Host nation rules (USA, Mexico, Canada)
- Stepper UI (View Pots → Simulate → View Groups)
- Color-coded by confederation

## 🚀 Performance

- Vite for fast HMR (Hot Module Replacement)
- Code splitting via React Router
- Optimized re-renders with Zustand
- LocalStorage for persistence
- Lazy loading ready

## 🎨 UI/UX Highlights

- **Glassmorphism**: Frosted glass aesthetic
- **Smooth Transitions**: All interactions animated
- **Responsive**: Works on mobile, tablet, desktop
- **Color Coding**: Visual hierarchy with custom colors
- **Hover Effects**: Interactive feedback on all clickable elements
- **Loading States**: Visual feedback during draw simulation

---

Built following the Master Prompt specifications! 🏆
