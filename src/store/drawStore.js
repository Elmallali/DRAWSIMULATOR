import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDrawStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      groups: null,
      
      setStep: (step) => set({ currentStep: step }),
      
      setGroups: (groups) => set({ groups, currentStep: 3 }),
      
      resetDraw: () => set({ currentStep: 1, groups: null }),
    }),
    {
      name: 'draw-storage',
    }
  )
)
