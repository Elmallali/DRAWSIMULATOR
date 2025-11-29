# 🔄 Player Display Update

## Change Summary

Updated player tokens to **always show user-entered number and name** instead of position aliases.

---

## Before vs After

### BEFORE
```
Token Display Logic:
- If number exists → Show number
- If no number → Show position (GK, CB, ST, etc.)

Label Display Logic:
- If name exists → Show name
- If no name → Show position (GK, CB, ST, etc.)
```

**Visual Example:**
```
┌──────────┐
│    CB    │  ← Position alias shown
└──────────┘
     CB        ← Position alias shown
```

### AFTER
```
Token Display Logic:
- Always show number
- If no number → Show "?" placeholder

Label Display Logic:
- Always show name
- If no name → Show "Click to edit" prompt
```

**Visual Example:**
```
┌──────────┐
│    ?     │  ← Placeholder prompting user to add number
└──────────┘
 Click to edit ← Prompt to add player details
```

---

## User Experience

### Empty State (Default)
All players start with:
- **Number**: `?` (question mark)
- **Name**: `Click to edit` (instructional text)
- **Color**: Blue (default)

**This clearly indicates to users that they need to customize the players.**

### After Customization
Once user adds details:
- **Number**: `10` (user's input)
- **Name**: `Messi` (user's input)
- **Color**: Red (user's choice)

---

## Benefits

✅ **Clearer UX**: Users immediately see they need to add player details  
✅ **No confusion**: Position aliases (GK, CB, ST) are no longer visible  
✅ **Better prompts**: "Click to edit" is more actionable than showing position  
✅ **Consistent display**: Number and name always present (even if placeholder)  
✅ **Professional look**: Completed lineups show only custom data  

---

## Technical Changes

### File Modified
- `src/pages/LineupBuilder.jsx`

### Changes Made

1. **DraggablePlayer Component** (Lines 43-49)
```javascript
// OLD
{player.number && (
  <span className="text-lg leading-none">{player.number}</span>
)}
{!player.number && (
  <span className="text-xs leading-none">{player.position}</span>
)}

// NEW
<span className="text-lg leading-none">
  {player.number || '?'}
</span>
```

2. **Player Name Label** (Lines 47-49)
```javascript
// OLD
{player.name && (
  <span className="mt-1 text-xs font-semibold text-white bg-black/70 px-2 py-0.5 rounded whitespace-nowrap">
    {player.name}
  </span>
)}
{!player.name && (
  <span className="mt-1 text-xs font-semibold text-white/70 bg-black/50 px-2 py-0.5 rounded">
    {player.position}
  </span>
)}

// NEW
<span className="mt-1 text-xs font-semibold text-white bg-black/70 px-2 py-0.5 rounded whitespace-nowrap">
  {player.name || 'Click to edit'}
</span>
```

3. **DragOverlay** (Lines 275-277)
```javascript
// OLD
{activePlayer.number && (
  <span className="text-lg">{activePlayer.number}</span>
)}
{!activePlayer.number && (
  <span className="text-xs">{activePlayer.position}</span>
)}

// NEW
<span className="text-lg">
  {activePlayer.number || '?'}
</span>
```

4. **Instructions Updated** (Line 209)
```javascript
// OLD
<li>• Click players to edit name/number</li>

// NEW
<li>• Click players to add name/number/color</li>
```

---

## Visual Comparison

### Default Lineup (Before Customization)

**Before Update:**
```
    [ST]        [ST]        [ST]
    ST          ST          ST

  [CM]        [CM]        [CM]
  CM          CM          CM

[LB]  [CB]    [CB]    [RB]
LB    CB      CB      RB

        [GK]
        GK
```

**After Update:**
```
    ?           ?           ?
Click to edit  Click to edit  Click to edit

    ?           ?           ?
Click to edit  Click to edit  Click to edit

  ?     ?       ?       ?
Click  Click   Click   Click
to edit to edit to edit to edit

        ?
    Click to edit
```

### Customized Lineup

**Before Update:**
```
    9           10          7
  Haaland      Messi     Ronaldo

    8           5           6
  Kroos      Casemiro    Modric

  3     4       15      2
Alba  Ramos   Militao  Carvajal

        1
      Courtois
```

**After Update:**
```
Same as before - no change when data is present!
```

---

## Impact

- **Position aliases (GK, CB, ST, etc.) are NEVER shown on tokens**
- **Users are clearly prompted to customize players**
- **More professional appearance**
- **Better user guidance**

---

## Status

✅ **Implemented and ready to use**

Run `npm run dev` to see the changes!
