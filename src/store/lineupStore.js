import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FORMATIONS, DEFAULT_KIT_COLOR } from '../utils/formations'

// Convert formation positions to player objects with metadata
const createPlayersFromFormation = (formationKey, existingPlayers = []) => {
  const formation = FORMATIONS[formationKey]
  if (!formation) return []
  
  return formation.positions.map((pos) => {
    // Try to find existing player data to preserve name, number, color
    const existing = existingPlayers.find(p => p.id === pos.id)
    
    return {
      id: pos.id,
      position: pos.position,
      top: pos.top,
      left: pos.left,
      name: existing?.name || '',
      number: existing?.number || '',
      color: existing?.color || DEFAULT_KIT_COLOR,
    }
  })
}

export const useLineupStore = create(
  persist(
    (set) => ({
      teamName: 'My Team',
      formation: '4-3-3',
      players: createPlayersFromFormation('4-3-3'),
      
      setTeamName: (name) => set({ teamName: name }),
      
      setFormation: (formationKey) => set((state) => ({ 
        formation: formationKey, 
        players: createPlayersFromFormation(formationKey, state.players)
      })),
      
      updatePlayerPosition: (id, top, left) => set((state) => ({
        players: state.players.map(player =>
          player.id === id ? { ...player, top, left } : player
        )
      })),
      
      updatePlayerData: (id, data) => set((state) => ({
        players: state.players.map(player =>
          player.id === id ? { ...player, ...data } : player
        )
      })),
      
      resetLineup: () => set((state) => ({
        players: createPlayersFromFormation(state.formation)
      })),
    }),
    {
      name: 'lineup-storage',
    }
  )
)
