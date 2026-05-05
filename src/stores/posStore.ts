import { create } from 'zustand'

interface PosState {
  activeCategory: string
  searchQuery: string
  setActiveCategory: (categoryId: string) => void
  setSearchQuery: (query: string) => void
}

export const usePosStore = create<PosState>((set) => ({
  activeCategory: 'all',
  searchQuery: '',
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))
