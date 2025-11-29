# 🔧 Click Handler Fix

## Issue
Modal wasn't opening when clicking on players because the drag listeners were preventing the click event from firing.

## Solution
Separated the drag and click interactions:

### New Interaction Model

#### 1. **Click the Name Label** (Easiest)
```
┌──────────┐
│    ?     │  ← Drag this to move
└──────────┘
Click to edit  ← CLICK HERE to edit player
     ↑
  Single click opens modal
```

#### 2. **Double-Click the Token**
```
┌──────────┐
│    ?     │  ← DOUBLE-CLICK HERE to edit
└──────────┘
Click to edit
```

#### 3. **Drag the Token**
```
┌──────────┐
│    ?     │  ← DRAG HERE to move position
└──────────┘
Click to edit
```

---

## Technical Changes

### Before (Broken)
```javascript
// Drag listeners on outer div prevented clicks
<div {...listeners} {...attributes}>
  <div onClick={onClick}>  // ❌ Never fired
    <div>Token</div>
    <span>Name</span>
  </div>
</div>
```

### After (Fixed)
```javascript
// Drag listeners only on token, click on name label
<div>
  <div 
    {...listeners} 
    {...attributes}
    onDoubleClick={handleClick}  // ✅ Double-click works
  >
    Token
  </div>
  <span onClick={handleClick}>   // ✅ Single-click works
    Name
  </span>
</div>
```

---

## User Experience

### To Edit a Player:
1. **Option A**: Click the name label ("Click to edit") - **RECOMMENDED**
2. **Option B**: Double-click the colored token

### To Move a Player:
- Click and drag the colored token

---

## Visual Guide

```
     Pitch View
┌─────────────────┐
│                 │
│    ?     ?     ?│
│  Click  Click  Click
│  to edit to edit to edit
│    ↑      ↑      ↑
│    └──────┴──────┘
│   Click any of these
│   to open editor modal
│                 │
│    ?     ?     ?│
│  Click  Click  Click
│  to edit to edit to edit
│                 │
└─────────────────┘
```

---

## Instructions Updated

New sidebar instructions:
- ✅ Click name label to edit player
- ✅ Drag token to reposition player
- ✅ Double-click token to edit player
- ✅ Your lineup auto-saves

---

## Benefits

✅ **Clear separation**: Drag vs Click interactions  
✅ **Easy to edit**: Just click the text label  
✅ **No conflicts**: Drag and click work independently  
✅ **Better UX**: Hover effects show what's clickable  
✅ **Intuitive**: "Click to edit" text is actually clickable  

---

## Status

✅ **Fixed and ready to use!**

Try it now:
1. Run `npm run dev`
2. Go to Tactical Board
3. Click on any "Click to edit" label
4. Modal should open immediately!
