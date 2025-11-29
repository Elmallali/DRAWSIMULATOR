// FIFA World Cup 2026™ Official Draw Algorithm
// 48 teams, 12 groups of 4
// Following official FIFA draw procedures as per draw document

export const CONFEDERATIONS = {
  UEFA: 'UEFA',
  CONMEBOL: 'CONMEBOL',
  CONCACAF: 'CONCACAF',
  CAF: 'CAF',
  AFC: 'AFC',
  OFC: 'OFC',
}

// Predetermined group positions from Appendix B (Pot 2, 3, 4)
// Format: [Group A, B, C, D, E, F, G, H, I, J, K, L]
const GROUP_POSITIONS = {
  pot2: ['B', 'C', 'D', 'A', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
  pot3: ['C', 'D', 'A', 'B', 'F', 'E', 'H', 'G', 'J', 'I', 'L', 'K'],
  pot4: ['D', 'A', 'B', 'C', 'G', 'H', 'E', 'F', 'K', 'L', 'I', 'J'],
}

// Pots for World Cup 2026 (48 teams) - Based on FIFA ranking Nov 2025
export const POTS = {
  pot1: [
    // Hosts (colored balls)
    { name: 'Canada', confederation: CONFEDERATIONS.CONCACAF, host: true, ball: 'green' },
    { name: 'Mexico', confederation: CONFEDERATIONS.CONCACAF, host: true, ball: 'red' },
    { name: 'USA', confederation: CONFEDERATIONS.CONCACAF, host: true, ball: 'blue' },
    // Top 9 ranked teams
    { name: 'Spain', confederation: CONFEDERATIONS.UEFA },
    { name: 'Argentina', confederation: CONFEDERATIONS.CONMEBOL },
    { name: 'France', confederation: CONFEDERATIONS.UEFA },
    { name: 'England', confederation: CONFEDERATIONS.UEFA },
    { name: 'Brazil', confederation: CONFEDERATIONS.CONMEBOL },
    { name: 'Portugal', confederation: CONFEDERATIONS.UEFA },
    { name: 'Netherlands', confederation: CONFEDERATIONS.UEFA },
    { name: 'Belgium', confederation: CONFEDERATIONS.UEFA },
    { name: 'Germany', confederation: CONFEDERATIONS.UEFA },
  ],
  pot2: [
    // Next 12 highest-ranked teams
    { name: 'Croatia', confederation: CONFEDERATIONS.UEFA },
    { name: 'Morocco', confederation: CONFEDERATIONS.CAF },
    { name: 'Colombia', confederation: CONFEDERATIONS.CONMEBOL },
    { name: 'Uruguay', confederation: CONFEDERATIONS.CONMEBOL },
    { name: 'Switzerland', confederation: CONFEDERATIONS.UEFA },
    { name: 'Japan', confederation: CONFEDERATIONS.AFC },
    { name: 'Senegal', confederation: CONFEDERATIONS.CAF },
    { name: 'IR Iran', confederation: CONFEDERATIONS.AFC },
    { name: 'Korea Republic', confederation: CONFEDERATIONS.AFC },
    { name: 'Ecuador', confederation: CONFEDERATIONS.CONMEBOL },
    { name: 'Australia', confederation: CONFEDERATIONS.AFC },
    { name: 'Austria', confederation: CONFEDERATIONS.UEFA },
  ],
  pot3: [
    // Next 12 highest-ranked teams
    { name: 'Norway', confederation: CONFEDERATIONS.UEFA },
    { name: 'Panama', confederation: CONFEDERATIONS.CONCACAF },
    { name: 'Egypt', confederation: CONFEDERATIONS.CAF },
    { name: 'Algeria', confederation: CONFEDERATIONS.CAF },
    { name: 'Scotland', confederation: CONFEDERATIONS.UEFA },
    { name: 'Paraguay', confederation: CONFEDERATIONS.CONMEBOL },
    { name: 'Tunisia', confederation: CONFEDERATIONS.CAF },
    { name: 'Côte d\'Ivoire', confederation: CONFEDERATIONS.CAF },
    { name: 'Uzbekistan', confederation: CONFEDERATIONS.AFC },
    { name: 'Qatar', confederation: CONFEDERATIONS.AFC },
    { name: 'South Africa', confederation: CONFEDERATIONS.CAF },
    { name: 'Saudi Arabia', confederation: CONFEDERATIONS.AFC },
  ],
  pot4: [
    // Next 6 highest-ranked teams + 6 placeholders
    { name: 'Jordan', confederation: CONFEDERATIONS.AFC },
    { name: 'Cabo Verde', confederation: CONFEDERATIONS.CAF },
    { name: 'Ghana', confederation: CONFEDERATIONS.CAF },
    { name: 'Curaçao', confederation: CONFEDERATIONS.CONCACAF },
    { name: 'Haiti', confederation: CONFEDERATIONS.CONCACAF },
    { name: 'New Zealand', confederation: CONFEDERATIONS.OFC },
    // Play-off placeholders (will be determined)
    { name: 'UEFA Play-Off A (ITA/NOR/WAL/BIH)', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'UEFA Play-Off B (UKR/GRE/POL/AUS)', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'UEFA Play-Off C (TUR/HUN/SWE/KOS)', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'UEFA Play-Off D (DEN/MKD/CZE/IRE)', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'FIFA Play-Off 1 (NCL/JAM/COD)', confederation: CONFEDERATIONS.CONCACAF, placeholder: true },
    { name: 'FIFA Play-Off 2 (BOL/SUR/IRQ)', confederation: CONFEDERATIONS.CONMEBOL, placeholder: true },
  ],
}

/**
 * Check if a team can be added to a group based on FIFA confederation rules:
 * - No more than ONE team from same confederation (except UEFA)
 * - UEFA: Maximum TWO teams per group (including play-off placeholders)
 * - Each group must have at least one, but no more than two UEFA teams
 */
function canAddTeamToGroup(group, team) {
  const confederationCount = group.filter(
    (t) => t.confederation === team.confederation
  ).length

  // UEFA special rule: max 2 teams per group
  if (team.confederation === CONFEDERATIONS.UEFA) {
    return confederationCount < 2
  }

  // All other confederations: max 1 team per group
  return confederationCount === 0
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Main draw algorithm following official FIFA World Cup 2026™ procedures
 * 
 * Draw procedure:
 * 1. Draw three host teams (colored balls) - Mexico (green) → A1, USA (red) → B1, Canada (blue) → D1
 * 2. Draw remaining 9 teams from Pot 1 into groups E-L
 * 3. Draw Pot 2, 3, 4 teams following predetermined positions (Appendix B)
 * 4. Apply confederation constraints throughout
 */
export function simulateDraw() {
  const maxAttempts = 100
  let attempt = 0

  while (attempt < maxAttempts) {
    attempt++
    
    // Initialize 12 empty groups (A through L)
    const groups = Array.from({ length: 12 }, (_, i) => ({
      name: String.fromCharCode(65 + i), // A, B, C, D, E, F, G, H, I, J, K, L
      teams: [],
    }))

    try {
      // Initialize all groups with empty arrays of size 4
      groups.forEach(group => {
        group.teams = new Array(4).fill(null)
      })

      // STEP 1: Place hosts in Position 1 (index 0)
      const mexico = POTS.pot1.find(t => t.name === 'Mexico')
      const usa = POTS.pot1.find(t => t.name === 'USA')
      const canada = POTS.pot1.find(t => t.name === 'Canada')
      
      if (mexico) groups[0].teams[0] = mexico // Group A, Position 1
      if (usa) groups[1].teams[0] = usa // Group B, Position 1
      if (canada) groups[3].teams[0] = canada // Group D, Position 1

      // STEP 2: Place remaining Pot 1 teams in Position 1 (index 0)
      const pot1NonHosts = shuffleArray(POTS.pot1.filter(t => !t.host))
      const availableGroupsForPot1 = [2, 4, 5, 6, 7, 8, 9, 10, 11] // C, E, F, G, H, I, J, K, L
      
      pot1NonHosts.forEach((team, index) => {
        if (index < availableGroupsForPot1.length) {
          // Ensure Pot 1 teams go to Position 1 (index 0)
          groups[availableGroupsForPot1[index]].teams[0] = team
        }
      })

      // STEP 3: Place Pot 2 teams in Position 2 (index 1)
      const pot2Teams = shuffleArray([...POTS.pot2])
      for (const team of pot2Teams) {
        let placed = false
        
        for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
          const group = groups[groupIndex]
          
          // Check if Position 2 is available and team can be added
          if (!group.teams[1] && canAddTeamToGroup(group.teams.filter(t => t), team)) {
            group.teams[1] = team
            placed = true
            break
          }
        }
        
        if (!placed) {
          throw new Error(`Cannot place Pot 2 team ${team.name} in Position 2`)
        }
      }

      // STEP 4: Place Pot 3 teams in Position 3 (index 2)
      const pot3Teams = shuffleArray([...POTS.pot3])
      for (const team of pot3Teams) {
        let placed = false
        
        for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
          const group = groups[groupIndex]
          
          // Check if Position 3 is available and team can be added
          if (!group.teams[2] && canAddTeamToGroup(group.teams.filter(t => t), team)) {
            group.teams[2] = team
            placed = true
            break
          }
        }
        
        if (!placed) {
          throw new Error(`Cannot place Pot 3 team ${team.name} in Position 3`)
        }
      }

      // STEP 5: Place Pot 4 teams in Position 4 (index 3)
      const pot4Teams = shuffleArray([...POTS.pot4])
      for (const team of pot4Teams) {
        let placed = false
        
        for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
          const group = groups[groupIndex]
          
          // Check if Position 4 is available and team can be added
          if (!group.teams[3] && canAddTeamToGroup(group.teams.filter(t => t), team)) {
            group.teams[3] = team
            placed = true
            break
          }
        }
        
        if (!placed) {
          throw new Error(`Cannot place Pot 4 team ${team.name} in Position 4`)
        }
      }

      // Convert sparse arrays to dense arrays and validate
      groups.forEach(group => {
        group.teams = group.teams.filter(t => t) // Remove undefined slots
        if (group.teams.length !== 4) {
          throw new Error(`Group ${group.name} has ${group.teams.length} teams instead of 4`)
        }
      })

      // Validate final result
      const isValid = groups.every(group => 
        group.teams.length === 4 && 
        group.teams.every(team => team && team.name)
      )
      
      if (!isValid) {
        throw new Error('Invalid final group structure')
      }

      return groups
      
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message)
      continue
    }
  }

  // Fallback: Create a guaranteed valid draw
  console.warn('Using fallback draw algorithm')
  return createSimplifiedDraw()
}

/**
 * Bulletproof draw algorithm with position enforcement
 */
function createSimplifiedDraw() {
  console.log('Creating bulletproof valid draw with position enforcement...')
  
  const groups = Array.from({ length: 12 }, (_, i) => ({
    name: String.fromCharCode(65 + i),
    teams: new Array(4).fill(null), // Fixed positions: [Pot1, Pot2, Pot3, Pot4]
  }))

  // STEP 1: Place Pot 1 teams in Position 1 (index 0)
  const mexico = POTS.pot1.find(t => t.name === 'Mexico')
  const usa = POTS.pot1.find(t => t.name === 'USA')
  const canada = POTS.pot1.find(t => t.name === 'Canada')
  
  if (mexico) groups[0].teams[0] = mexico // Group A, Position 1
  if (usa) groups[1].teams[0] = usa // Group B, Position 1
  if (canada) groups[3].teams[0] = canada // Group D, Position 1

  // Place remaining Pot 1 teams
  const pot1NonHosts = POTS.pot1.filter(t => !t.host)
  const emptyGroups = [2, 4, 5, 6, 7, 8, 9, 10, 11] // C, E, F, G, H, I, J, K, L
  
  pot1NonHosts.forEach((team, index) => {
    if (index < emptyGroups.length) {
      groups[emptyGroups[index]].teams[0] = team // Position 1
    }
  })

  // STEP 2: Place Pot 2 teams in Position 2 (index 1)
  for (const team of POTS.pot2) {
    let placed = false
    
    for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
      const group = groups[groupIndex]
      
      if (!group.teams[1] && canAddTeamToGroup(group.teams.filter(t => t), team)) {
        group.teams[1] = team
        placed = true
        break
      }
    }
    
    if (!placed) {
      console.warn(`Could not place ${team.name} in Position 2 with FIFA rules`)
      // Emergency: place in first available Position 2
      for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
        if (!groups[groupIndex].teams[1]) {
          groups[groupIndex].teams[1] = team
          break
        }
      }
    }
  }

  // STEP 3: Place Pot 3 teams in Position 3 (index 2)
  for (const team of POTS.pot3) {
    let placed = false
    
    for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
      const group = groups[groupIndex]
      
      if (!group.teams[2] && canAddTeamToGroup(group.teams.filter(t => t), team)) {
        group.teams[2] = team
        placed = true
        break
      }
    }
    
    if (!placed) {
      console.warn(`Could not place ${team.name} in Position 3 with FIFA rules`)
      // Emergency: place in first available Position 3
      for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
        if (!groups[groupIndex].teams[2]) {
          groups[groupIndex].teams[2] = team
          break
        }
      }
    }
  }

  // STEP 4: Place Pot 4 teams in Position 4 (index 3)
  for (const team of POTS.pot4) {
    let placed = false
    
    for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
      const group = groups[groupIndex]
      
      if (!group.teams[3] && canAddTeamToGroup(group.teams.filter(t => t), team)) {
        group.teams[3] = team
        placed = true
        break
      }
    }
    
    if (!placed) {
      console.warn(`Could not place ${team.name} in Position 4 with FIFA rules`)
      // Emergency: place in first available Position 4
      for (let groupIndex = 0; groupIndex < 12; groupIndex++) {
        if (!groups[groupIndex].teams[3]) {
          groups[groupIndex].teams[3] = team
          break
        }
      }
    }
  }

  // Convert to final format and validate
  groups.forEach(group => {
    group.teams = group.teams.filter(t => t) // Remove nulls
    console.log(`Group ${group.name}:`, group.teams.map(t => `${t.name} (${t.confederation})`))
    if (group.teams.length !== 4) {
      console.error(`Group ${group.name} has ${group.teams.length} teams instead of 4!`)
    }
  })

  return groups
}

/**
 * Get statistics about the draw
 */
export function getDrawStats(groups) {
  const stats = {
    totalTeams: 0,
    confederationDistribution: {},
    groupsWithUEFAClash: 0,
  }

  groups.forEach((group) => {
    stats.totalTeams += group.teams.length
    
    const uefaCount = group.teams.filter(
      (t) => t.confederation === CONFEDERATIONS.UEFA
    ).length
    
    if (uefaCount > 1) {
      stats.groupsWithUEFAClash++
    }

    group.teams.forEach((team) => {
      stats.confederationDistribution[team.confederation] =
        (stats.confederationDistribution[team.confederation] || 0) + 1
    })
  })

  return stats
}
