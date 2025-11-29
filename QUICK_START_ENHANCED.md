# 🚀 Quick Start - Enhanced Lineup Builder

## Installation & Running

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

App opens at `http://localhost:3000`

---

## 🎯 New Features at a Glance

### 1️⃣ Click Players to Edit

```
┌─────────────────────────────────┐
│  Player Editor Modal            │
├─────────────────────────────────┤
│  Position: [ST]                 │
│                                 │
│  👤 Player Name                 │
│  [Messi____________]            │
│                                 │
│  # Jersey Number                │
│  [10]                           │
│                                 │
│  🎨 Kit Color                   │
│  [🔴][🔵][⚪][⚫]               │
│  [🟠][🟢][🟡][🟣]               │
│                                 │
│  [Cancel]  [Save Changes]       │
└─────────────────────────────────┘
```

**How to use:**
- Click any player token on the pitch
- Fill in name (optional)
- Add jersey number (optional)
- Pick a kit color
- Click "Save Changes"

---

### 2️⃣ 7 Formations Available

**Sidebar Dropdown:**
```
Formation: [4-3-3 ▼]
           ├─ 4-4-2
           ├─ 4-3-3
           ├─ 4-2-3-1
           ├─ 3-5-2
           ├─ 3-4-3
           ├─ 5-3-2
           └─ 4-1-4-1
```

**What happens:**
- Players smoothly animate to new positions
- Names, numbers, and colors are preserved
- Formation updates instantly

---

### 3️⃣ Download Your Lineup

**New Button in Sidebar:**
```
┌──────────────────────┐
│ 💾 Download Image    │
└──────────────────────┘
```

**Output:**
- High-quality PNG image
- Filename: `My-Team-4-3-3.png`
- Perfect for sharing or printing

---

## 📋 Complete Workflow Example

### Step-by-Step: Create a Custom Lineup

1. **Navigate to Tactical Board**
   - Click "Tactical Board" card on home page
   - Or use navbar: `Tactical Board` button

2. **Set Team Name**
   ```
   Team Name: [Barcelona FC]
   ```

3. **Choose Formation**
   ```
   Formation: [4-3-3 ▼]
   ```

4. **Customize Your Star Players**
   
   **Goalkeeper:**
   - Click GK token
   - Name: "Ter Stegen"
   - Number: "1"
   - Color: Yellow
   - Save
   
   **Striker:**
   - Click ST token
   - Name: "Lewandowski"
   - Number: "9"
   - Color: Red
   - Save
   
   **Left Winger:**
   - Click LW token
   - Name: "Raphinha"
   - Number: "11"
   - Color: Blue
   - Save

5. **Fine-tune Positions**
   - Drag any player to adjust position
   - Players snap within pitch boundaries

6. **Save & Download**
   - Click "Save Lineup" (optional - auto-saves)
   - Click "Download Image"
   - Image saves to your Downloads folder

---

## 🎨 Visual Guide

### Before Customization
```
Pitch View:
    ┌─────────────────┐
    │                 │
    │    [LW]  [ST]  [RW]
    │                 │
    │  [CM] [CM] [CM] │
    │                 │
    │ [LB][CB][CB][RB]│
    │                 │
    │      [GK]       │
    └─────────────────┘
```

### After Customization
```
Pitch View:
    ┌─────────────────┐
    │                 │
    │  🔴11  🔴9  🔵7 │
    │ Raph  Lewa Dembele
    │                 │
    │ 🟢8  🔵5  🟣21  │
    │ Pedri Busq  Jong│
    │                 │
    │🔵3 🔴4 🔴15 🔵2 │
    │Alba Arujo Chris Kounde
    │                 │
    │     🟡1         │
    │   Ter Stegen    │
    └─────────────────┘
```

---

## 🎮 Keyboard & Mouse Controls

| Action | Method |
|--------|--------|
| Edit Player | **Click** player token |
| Move Player | **Click & Drag** player token |
| Close Modal | **Click** outside modal or X button |
| Change Formation | **Select** from dropdown |
| Save | **Click** "Save Lineup" button |
| Download | **Click** "Download Image" button |
| Reset | **Click** "Reset Positions" button |

---

## 💡 Pro Tips

### Color Strategy
- **Goalkeeper**: Yellow/Green (traditional)
- **Defenders**: Blue/Black (solid colors)
- **Midfielders**: Green/Purple (creative)
- **Attackers**: Red/Orange (aggressive)

### Numbering Convention
- **1**: Goalkeeper
- **2-5**: Defenders
- **6-8**: Defensive/Central Midfielders
- **9-11**: Attackers
- **7, 10**: Star players

### Formation Selection
- **4-4-2**: Balanced, good for beginners
- **4-3-3**: Attacking with width
- **4-2-3-1**: Modern, defensive stability
- **3-5-2**: Wing-back dominance
- **3-4-3**: All-out attack
- **5-3-2**: Ultra-defensive
- **4-1-4-1**: Single pivot control

---

## 🔄 Data Persistence

**Everything auto-saves to your browser:**
- Team name
- Formation choice
- Player positions
- Player names
- Jersey numbers
- Kit colors

**To clear all data:**
- Go to Home page
- Click "Reset All Data" button
- Confirm the action

---

## 🐛 Troubleshooting

### Player won't drag
- Make sure you're clicking and holding
- Try clicking the center of the token

### Modal won't open
- Ensure you're clicking the player token, not dragging
- Try a quick click instead of click-and-hold

### Download not working
- Check browser permissions for downloads
- Ensure pop-ups are not blocked
- Try a different browser (Chrome recommended)

### Formation not changing
- Check that you selected a different formation
- Refresh the page if stuck

---

## 📱 Browser Compatibility

✅ **Recommended:**
- Chrome/Edge (latest)
- Firefox (latest)

⚠️ **Limited Support:**
- Safari (may have download issues)
- Mobile browsers (drag may be tricky)

---

## 🎉 You're Ready!

Start creating your dream lineup with:
- ✅ 7 professional formations
- ✅ Custom player names & numbers
- ✅ 8 kit color options
- ✅ Drag-and-drop positioning
- ✅ High-quality image export
- ✅ Auto-save functionality

**Enjoy building your tactical masterpiece!** ⚽🏆
