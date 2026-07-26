'use client'
import { create } from 'zustand'

type Filters = {
  region: string
  ciudad: string
  anillo: string
  sitio: string
  origen: string[]
  ticket: string[]
}

export type Density = 'compact' | 'normal' | 'comfortable'

type AppStore = {
  activeTab:    string
  filters:      Filters
  refreshing:   boolean
  refreshPaused: boolean
  selectedConsumoId: string | null
  theme: 'dark' | 'light'
  collapseSignal: number
  density: Density

  setActiveTab:    (tab: string) => void
  setFilter:       (key: keyof Omit<Filters, 'origen' | 'ticket'>, val: string) => void
  toggleOrigen:    (key: string) => void
  toggleTicket:    (key: string) => void
  clearFilters:    () => void
  setRefreshing:   (v: boolean) => void
  toggleRefresh:   () => void
  setSelectedConsumo: (id: string | null) => void
  toggleTheme:     () => void
  collapseAllGroups: () => void
  cycleDensity:    () => void
}

const FILTERS_DEFAULT: Filters = {
  region: 'TODAS', ciudad: 'TODAS', anillo: 'TODAS', sitio: 'TODOS',
  origen: [], ticket: [],
}

const DENSITY_CYCLE: Density[] = ['compact', 'normal', 'comfortable']

export const useAppStore = create<AppStore>((set) => ({
  activeTab:         'internet',
  refreshing:        false,
  refreshPaused:     false,
  selectedConsumoId: null,
  theme:             'dark',
  filters:           { ...FILTERS_DEFAULT },
  collapseSignal:    0,
  density:           'normal',

  setActiveTab: (tab) => set({ activeTab: tab }),

  setFilter: (key, val) =>
    set((s) => ({ filters: { ...s.filters, [key]: val } })),

  toggleOrigen: (key) =>
    set((s) => {
      const cur = s.filters.origen
      return { filters: { ...s.filters, origen: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key] } }
    }),

  toggleTicket: (key) =>
    set((s) => {
      const cur = s.filters.ticket
      return { filters: { ...s.filters, ticket: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key] } }
    }),

  clearFilters: () => set({ filters: { ...FILTERS_DEFAULT } }),

  setRefreshing:  (v)  => set({ refreshing: v }),
  toggleRefresh:  ()   => set((s) => ({ refreshPaused: !s.refreshPaused })),
  setSelectedConsumo: (id) => set({ selectedConsumoId: id }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  collapseAllGroups: () => set((s) => ({ collapseSignal: s.collapseSignal + 1 })),
  cycleDensity: () => set((s) => ({
    density: DENSITY_CYCLE[(DENSITY_CYCLE.indexOf(s.density) + 1) % DENSITY_CYCLE.length],
  })),
}))
