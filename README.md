# ⚽ World Cup 2026 Command Center

A modern, interactive web application for football enthusiasts featuring a tactical lineup builder and an authentic World Cup 2026 draw simulator.

## 🌟 Features

### 🏠 Landing Page
- Modern glassmorphism UI design
- Interactive selection cards with hover effects
- Easy navigation between tools

### 📋 Tactical Board (Lineup Builder)
- **Drag & Drop**: Intuitive player positioning with @dnd-kit
- **Multiple Formations**: 4-3-3, 4-4-2, 3-5-2, 4-2-3-1
- **Visual Pitch**: Beautiful SVG football pitch with markings
- **Auto-Save**: Lineup automatically saved to local storage
- **Custom Teams**: Name your team and customize positions

### 🏆 Official Draw Simulator
- **48 Teams**: Complete World Cup 2026 format
- **12 Groups**: Groups A through L with 4 teams each
- **Authentic Rules**:
  - 4 pots of 12 teams
  - Host nations (USA, Mexico, Canada) pre-assigned
  - Confederation constraints (max 1 per group, except UEFA with max 2)
  - Intelligent retry logic for valid draws
- **Step-by-Step UI**: View pots → Simulate → View groups
- **Color-Coded**: Teams colored by confederation

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom glassmorphism theme
- **State Management**: Zustand with persistence
- **Drag & Drop**: @dnd-kit/core
- **Icons**: Lucide React

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Persistent navigation
├── pages/
│   ├── Home.jsx            # Landing page with selection cards
│   ├── LineupBuilder.jsx   # Drag-and-drop tactical board
│   └── DrawSimulator.jsx   # World Cup draw simulator
├── store/
│   ├── lineupStore.js      # Zustand store for lineups
│   └── drawStore.js        # Zustand store for draw state
├── utils/
│   └── drawAlgorithm.js    # WC 2026 draw logic
├── App.jsx                 # Router configuration
├── main.jsx               # App entry point
└── index.css              # Global styles & Tailwind
```

## 🎨 Custom Theme

The app features a custom Tailwind theme with:
- **pitch-green**: Shades for the football pitch
- **fifa-blue**: Official FIFA blue tones
- **fifa-gold**: Trophy gold accents
- **Glassmorphism**: Frosted glass effect components

## 💾 Data Persistence

- Lineups are automatically saved to browser local storage
- Draw results are persisted between sessions
- "Reset Data" button clears all saved information

## 🎯 Key Features Explained

### Lineup Builder
- Click and drag players to reposition them on the pitch
- Change formations to auto-arrange players
- Positions are constrained to pitch boundaries
- Real-time visual feedback during dragging

### Draw Simulator
- Implements official FIFA World Cup 2026 rules
- Uses intelligent algorithm with retry logic
- Handles confederation clashes automatically
- Maximum 1000 attempts to create valid draw
- Fallback to simplified draw if constraints too strict

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## 📝 License

This is a demonstration project for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your own purposes!

---

Built with ⚽ for football fans worldwide
