import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTournamentStore = create(
  persist(
    (set, get) => ({
      // Tournament state
      phase: 'draw', // 'draw', 'group_stage', 'round_of_32', 'round_of_16', 'quarter_finals', 'semi_finals', 'final', 'champion'
      groups: null,
      groupStandings: {}, // { 'A': [team1, team2, team3, team4], ... }
      knockoutMatches: {
        round_of_32: [],
        round_of_16: [],
        quarter_finals: [],
        semi_finals: [],
        final: null,
        third_place: null,
      },
      champion: null,
      runnerUp: null,
      thirdPlace: null,

      // Set groups from draw
      setGroups: (groups) => set({ groups, phase: 'group_stage' }),

      // Set group standings (1st and 2nd place from each group)
      setGroupStandings: (standings) => {
        set({ groupStandings: standings })
        
        // Generate Round of 32 matches based on Appendix A
        const matches = get().generateRoundOf32Matches(standings)
        set((state) => ({
          knockoutMatches: {
            ...state.knockoutMatches,
            round_of_32: matches,
          },
          phase: 'round_of_32',
        }))
      },

      // Generate Round of 32 matches following FIFA bracket (Appendix A)
      generateRoundOf32Matches: (standings) => {
        // Based on Appendix A bracket structure
        // Top half: Groups A-F, Bottom half: Groups G-L
        const matches = [
          // Match 1: Winner Group A vs Runner-up Group B
          { id: 1, team1: standings.A?.[0], team2: standings.B?.[1], winner: null, path: 'top' },
          // Match 2: Winner Group C vs Runner-up Group D
          { id: 2, team1: standings.C?.[0], team2: standings.D?.[1], winner: null, path: 'top' },
          // Match 3: Winner Group E vs Runner-up Group F
          { id: 3, team1: standings.E?.[0], team2: standings.F?.[1], winner: null, path: 'top' },
          // Match 4: Winner Group G vs Runner-up Group H
          { id: 4, team1: standings.G?.[0], team2: standings.H?.[1], winner: null, path: 'top' },
          // Match 5: Winner Group B vs Runner-up Group A
          { id: 5, team1: standings.B?.[0], team2: standings.A?.[1], winner: null, path: 'bottom' },
          // Match 6: Winner Group D vs Runner-up Group C
          { id: 6, team1: standings.D?.[0], team2: standings.C?.[1], winner: null, path: 'bottom' },
          // Match 7: Winner Group F vs Runner-up Group E
          { id: 7, team1: standings.F?.[0], team2: standings.E?.[1], winner: null, path: 'bottom' },
          // Match 8: Winner Group H vs Runner-up Group G
          { id: 8, team1: standings.H?.[0], team2: standings.G?.[1], winner: null, path: 'bottom' },
          // Match 9: Winner Group I vs Runner-up Group J
          { id: 9, team1: standings.I?.[0], team2: standings.J?.[1], winner: null, path: 'top' },
          // Match 10: Winner Group K vs Runner-up Group L
          { id: 10, team1: standings.K?.[0], team2: standings.L?.[1], winner: null, path: 'top' },
          // Match 11: Winner Group J vs Runner-up Group I
          { id: 11, team1: standings.J?.[0], team2: standings.I?.[1], winner: null, path: 'bottom' },
          // Match 12: Winner Group L vs Runner-up Group K
          { id: 12, team1: standings.L?.[0], team2: standings.K?.[1], winner: null, path: 'bottom' },
          // Additional matches for 3rd place teams (simplified)
          { id: 13, team1: standings.A?.[2], team2: standings.B?.[2], winner: null, path: 'third' },
          { id: 14, team1: standings.C?.[2], team2: standings.D?.[2], winner: null, path: 'third' },
          { id: 15, team1: standings.E?.[2], team2: standings.F?.[2], winner: null, path: 'third' },
          { id: 16, team1: standings.G?.[2], team2: standings.H?.[2], winner: null, path: 'third' },
        ]
        return matches
      },

      // Set match winner for Round of 32
      setRoundOf32Winner: (matchId, winner) => {
        set((state) => {
          const updatedMatches = state.knockoutMatches.round_of_32.map((match) =>
            match.id === matchId ? { ...match, winner } : match
          )

          // Check if all Round of 32 matches are complete
          const allComplete = updatedMatches.every((m) => m.winner !== null)
          
          let newPhase = state.phase
          let round16Matches = state.knockoutMatches.round_of_16

          if (allComplete) {
            // Generate Round of 16
            round16Matches = [
              { id: 1, team1: updatedMatches[0].winner, team2: updatedMatches[1].winner, winner: null },
              { id: 2, team1: updatedMatches[2].winner, team2: updatedMatches[3].winner, winner: null },
              { id: 3, team1: updatedMatches[4].winner, team2: updatedMatches[5].winner, winner: null },
              { id: 4, team1: updatedMatches[6].winner, team2: updatedMatches[7].winner, winner: null },
              { id: 5, team1: updatedMatches[8].winner, team2: updatedMatches[9].winner, winner: null },
              { id: 6, team1: updatedMatches[10].winner, team2: updatedMatches[11].winner, winner: null },
              { id: 7, team1: updatedMatches[12].winner, team2: updatedMatches[13].winner, winner: null },
              { id: 8, team1: updatedMatches[14].winner, team2: updatedMatches[15].winner, winner: null },
            ]
            newPhase = 'round_of_16'
          }

          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              round_of_32: updatedMatches,
              round_of_16: round16Matches,
            },
            phase: newPhase,
          }
        })
      },

      // Set match winner for Round of 16
      setRoundOf16Winner: (matchId, winner) => {
        set((state) => {
          const updatedMatches = state.knockoutMatches.round_of_16.map((match) =>
            match.id === matchId ? { ...match, winner } : match
          )

          const allComplete = updatedMatches.every((m) => m.winner !== null)
          
          let newPhase = state.phase
          let quarterMatches = state.knockoutMatches.quarter_finals

          if (allComplete) {
            // Generate Quarter Finals
            quarterMatches = [
              { id: 1, team1: updatedMatches[0].winner, team2: updatedMatches[1].winner, winner: null },
              { id: 2, team1: updatedMatches[2].winner, team2: updatedMatches[3].winner, winner: null },
              { id: 3, team1: updatedMatches[4].winner, team2: updatedMatches[5].winner, winner: null },
              { id: 4, team1: updatedMatches[6].winner, team2: updatedMatches[7].winner, winner: null },
            ]
            newPhase = 'quarter_finals'
          }

          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              round_of_16: updatedMatches,
              quarter_finals: quarterMatches,
            },
            phase: newPhase,
          }
        })
      },

      // Set match winner for Quarter Finals
      setQuarterFinalWinner: (matchId, winner) => {
        set((state) => {
          const updatedMatches = state.knockoutMatches.quarter_finals.map((match) =>
            match.id === matchId ? { ...match, winner } : match
          )

          const allComplete = updatedMatches.every((m) => m.winner !== null)
          
          let newPhase = state.phase
          let semiMatches = state.knockoutMatches.semi_finals

          if (allComplete) {
            // Generate Semi Finals
            semiMatches = [
              { id: 1, team1: updatedMatches[0].winner, team2: updatedMatches[1].winner, winner: null, loser: null },
              { id: 2, team1: updatedMatches[2].winner, team2: updatedMatches[3].winner, winner: null, loser: null },
            ]
            newPhase = 'semi_finals'
          }

          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              quarter_finals: updatedMatches,
              semi_finals: semiMatches,
            },
            phase: newPhase,
          }
        })
      },

      // Set match winner for Semi Finals
      setSemiFinalWinner: (matchId, winner) => {
        set((state) => {
          const updatedMatches = state.knockoutMatches.semi_finals.map((match) => {
            if (match.id === matchId) {
              const loser = match.team1?.name === winner.name ? match.team2 : match.team1
              return { ...match, winner, loser }
            }
            return match
          })

          const allComplete = updatedMatches.every((m) => m.winner !== null)
          
          let newPhase = state.phase
          let finalMatch = state.knockoutMatches.final
          let thirdPlaceMatch = state.knockoutMatches.third_place

          if (allComplete) {
            // Generate Final and Third Place match
            finalMatch = {
              team1: updatedMatches[0].winner,
              team2: updatedMatches[1].winner,
              winner: null,
            }
            thirdPlaceMatch = {
              team1: updatedMatches[0].loser,
              team2: updatedMatches[1].loser,
              winner: null,
            }
            newPhase = 'final'
          }

          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              semi_finals: updatedMatches,
              final: finalMatch,
              third_place: thirdPlaceMatch,
            },
            phase: newPhase,
          }
        })
      },

      // Set final winner
      setFinalWinner: (winner) => {
        set((state) => {
          const finalMatch = state.knockoutMatches.final
          const runnerUp = finalMatch.team1?.name === winner.name ? finalMatch.team2 : finalMatch.team1
          
          // Only move to champion phase if third place is also decided (or doesn't exist)
          const thirdPlaceMatch = state.knockoutMatches.third_place
          const shouldMoveToChampion = !thirdPlaceMatch || thirdPlaceMatch.winner !== null

          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              final: { ...finalMatch, winner },
            },
            champion: winner,
            runnerUp,
            phase: shouldMoveToChampion ? 'champion' : state.phase,
          }
        })
      },

      // Set third place winner
      setThirdPlaceWinner: (winner) => {
        set((state) => {
          // Move to champion phase if final is also decided
          const finalMatch = state.knockoutMatches.final
          const shouldMoveToChampion = finalMatch && finalMatch.winner !== null

          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              third_place: { ...state.knockoutMatches.third_place, winner },
            },
            thirdPlace: winner,
            phase: shouldMoveToChampion ? 'champion' : state.phase,
          }
        })
      },

      // Reset tournament
      resetTournament: () =>
        set({
          phase: 'draw',
          groups: null,
          groupStandings: {},
          knockoutMatches: {
            round_of_32: [],
            round_of_16: [],
            quarter_finals: [],
            semi_finals: [],
            final: null,
            third_place: null,
          },
          champion: null,
          runnerUp: null,
          thirdPlace: null,
        }),
    }),
    {
      name: 'tournament-storage',
    }
  )
)

export { useTournamentStore }
