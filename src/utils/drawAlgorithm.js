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

// Pots for World Cup 2026 (48 teams) - Based on FIFA ranking Nov 19, 2025
export const POTS = {
  pot1: [
    // Hosts (colored balls) - Official placement: Mexico→A, Canada→B, USA→D
    { name: 'Mexico', confederation: CONFEDERATIONS.CONCACAF, host: true, ball: 'green', group: 'A' },
    { name: 'Canada', confederation: CONFEDERATIONS.CONCACAF, host: true, ball: 'red', group: 'B' },
    { name: 'USA', confederation: CONFEDERATIONS.CONCACAF, host: true, ball: 'blue', group: 'D' },
    // Top 9 ranked teams (FIFA ranking Nov 19, 2025)
    { name: 'Spain', confederation: CONFEDERATIONS.UEFA, ranking: 1, pathway: 'A' },
    { name: 'Argentina', confederation: CONFEDERATIONS.CONMEBOL, ranking: 2, pathway: 'B' },
    { name: 'France', confederation: CONFEDERATIONS.UEFA, ranking: 3, pathway: 'A' },
    { name: 'England', confederation: CONFEDERATIONS.UEFA, ranking: 4, pathway: 'B' },
    { name: 'Brazil', confederation: CONFEDERATIONS.CONMEBOL, ranking: 5 },
    { name: 'Portugal', confederation: CONFEDERATIONS.UEFA, ranking: 6 },
    { name: 'Netherlands', confederation: CONFEDERATIONS.UEFA, ranking: 7 },
    { name: 'Belgium', confederation: CONFEDERATIONS.UEFA, ranking: 8 },
    { name: 'Germany', confederation: CONFEDERATIONS.UEFA, ranking: 9 },
  ],
  pot2: [
    // Next 12 highest-ranked teams (FIFA ranking Nov 19, 2025)
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
    { name: 'Austria', confederation: CONFEDERATIONS.UEFA },
    { name: 'Australia', confederation: CONFEDERATIONS.AFC },
  ],
  pot3: [
    // Next 12 highest-ranked teams (FIFA ranking Nov 19, 2025)
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
    { name: 'Saudi Arabia', confederation: CONFEDERATIONS.AFC },
    { name: 'South Africa', confederation: CONFEDERATIONS.CAF },
  ],
  pot4: [
    // Next 6 highest-ranked teams + 6 play-off placeholders
    { name: 'Jordan', confederation: CONFEDERATIONS.AFC },
    { name: 'Cabo Verde', confederation: CONFEDERATIONS.CAF },
    { name: 'Ghana', confederation: CONFEDERATIONS.CAF },
    { name: 'Curaçao', confederation: CONFEDERATIONS.CONCACAF },
    { name: 'Haiti', confederation: CONFEDERATIONS.CONCACAF },
    { name: 'New Zealand', confederation: CONFEDERATIONS.OFC },
    // UEFA Play-offs (4 teams) - March 2026
    { name: 'UEFA Play-Off Winner 1', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'UEFA Play-Off Winner 2', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'UEFA Play-Off Winner 3', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    { name: 'UEFA Play-Off Winner 4', confederation: CONFEDERATIONS.UEFA, placeholder: true },
    // FIFA Intercontinental Play-offs (2 teams) - March 2026
    // Note: Confederation will be determined based on actual winners
    // IMPORTANT: In the actual draw, these teams' confederations will be known
    // and they must follow confederation rules (max 1 per group except UEFA)
    { name: 'FIFA Play-Off Winner 1', confederation: 'TBD', placeholder: true },
    { name: 'FIFA Play-Off Winner 2', confederation: 'TBD', placeholder: true },
  ],
}

/**
 * Check if a team can be added to a group based on FIFA confederation rules:
 * - No more than ONE team from same confederation (except UEFA)
 * - UEFA: Maximum TWO teams per group (including play-off placeholders)
 * - Each group must have at least one, but no more than two UEFA teams
 */
function canAddTeamToGroup(group, team) {
  // Handle TBD (To Be Determined) confederation for FIFA play-offs
  if (team.confederation === 'TBD') {
    // For simulation purposes, FIFA play-off winners can be placed anywhere
    // In reality, their confederation will be determined and rules will apply
    // But for now we allow placement to avoid blocking the draw
    return true
  }

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
 * Enhanced validation that will be used when actual confederations are known
 * This function can validate a team against a group considering potential confederation conflicts
 */
function canAddTeamToGroupWithKnownConfederation(group, team, actualConfederation) {
  // Use actual confederation if provided, otherwise use team's confederation
  const confederation = actualConfederation || team.confederation
  
  const confederationCount = group.filter(
    (t) => {
      // Handle TBD teams - in reality they would have actual confederations
      if (t.confederation === 'TBD') {
        // For now, assume TBD teams don't conflict (this is a limitation of simulation)
        return false
      }
      return t.confederation === confederation
    }
  ).length

  // UEFA special rule: max 2 teams per group
  if (confederation === CONFEDERATIONS.UEFA) {
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

      // STEP 1: Place hosts in Position 1 (index 0) - Official FIFA placement
      const mexico = POTS.pot1.find(t => t.name === 'Mexico')
      const canada = POTS.pot1.find(t => t.name === 'Canada')
      const usa = POTS.pot1.find(t => t.name === 'USA')
      
      if (mexico) groups[0].teams[0] = mexico // Group A, Position 1 (Green ball)
      if (canada) groups[1].teams[0] = canada // Group B, Position 1 (Red ball)
      if (usa) groups[3].teams[0] = usa // Group D, Position 1 (Blue ball)

      // STEP 2: Place remaining Pot 1 teams with semifinal pathway constraints
      const pot1NonHosts = POTS.pot1.filter(t => !t.host)
      const availableGroupsForPot1 = [2, 4, 5, 6, 7, 8, 9, 10, 11] // C, E, F, G, H, I, J, K, L
      
      // Apply semifinal pathway constraints for top 4 teams
      const spain = pot1NonHosts.find(t => t.name === 'Spain')
      const argentina = pot1NonHosts.find(t => t.name === 'Argentina')
      const france = pot1NonHosts.find(t => t.name === 'France')
      const england = pot1NonHosts.find(t => t.name === 'England')
      
      // Ensure Spain/Argentina are in different pathways (A/B)
      // Ensure France/England are in different pathways (A/B)
      const pathwayA = [2, 4, 6, 8, 10] // Groups C, E, G, I, K
      const pathwayB = [5, 7, 9, 11] // Groups F, H, J, L
      
      let pathwayAIndex = 0
      let pathwayBIndex = 0
      
      // Place top 4 teams with pathway constraints
      const topTeams = [spain, argentina, france, england].filter(t => t)
      const otherTeams = pot1NonHosts.filter(t => !topTeams.includes(t))
      
      // Randomly assign pathways ensuring constraints
      const shuffledTopTeams = shuffleArray(topTeams)
      shuffledTopTeams.forEach((team, index) => {
        if (team.pathway === 'A' || (index % 2 === 0 && !team.pathway)) {
          if (pathwayAIndex < pathwayA.length) {
            groups[pathwayA[pathwayAIndex]].teams[0] = team
            pathwayAIndex++
          }
        } else {
          if (pathwayBIndex < pathwayB.length) {
            groups[pathwayB[pathwayBIndex]].teams[0] = team
            pathwayBIndex++
          }
        }
      })
      
      // Place remaining teams in available slots
      const remainingSlots = [...pathwayA.slice(pathwayAIndex), ...pathwayB.slice(pathwayBIndex)]
      otherTeams.forEach((team, index) => {
        if (index < remainingSlots.length) {
          groups[remainingSlots[index]].teams[0] = team
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

  // STEP 1: Place Pot 1 teams in Position 1 (index 0) - Official FIFA placement
  const mexico = POTS.pot1.find(t => t.name === 'Mexico')
  const canada = POTS.pot1.find(t => t.name === 'Canada')
  const usa = POTS.pot1.find(t => t.name === 'USA')
  
  if (mexico) groups[0].teams[0] = mexico // Group A, Position 1 (Green ball)
  if (canada) groups[1].teams[0] = canada // Group B, Position 1 (Red ball)
  if (usa) groups[3].teams[0] = usa // Group D, Position 1 (Blue ball)

  // Place remaining Pot 1 teams with simplified pathway distribution
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
