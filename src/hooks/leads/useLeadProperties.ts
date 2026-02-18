import { create } from 'zustand'

interface LeadPropertiesState {
  byLead: Record<string, string[]>
  load: (leadId: string) => Promise<string[]>
  add: (leadId: string, propertyId: string) => Promise<void>
  remove: (leadId: string, propertyId: string) => Promise<void>
  list: (leadId: string) => string[]
}

const STORAGE_KEY = 'leadProperties'

const persistLocal = (data: Record<string, string[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

export const useLeadProperties = create<LeadPropertiesState>((set, get) => ({
  byLead: {},
  load: async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/properties`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load')
      const ids = (await res.json()) as string[]
      set(state => {
        const updated = { ...state.byLead, [leadId]: ids }
        persistLocal(updated)
        return { byLead: updated }
      })
      return ids
    } catch {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, string[]>
          const ids = parsed[leadId] || []
          set(state => {
            const updated = { ...state.byLead, [leadId]: ids }
            persistLocal(updated)
            return { byLead: updated }
          })
          return ids
        }
      } catch {
        /* ignore */
      }
      set(state => {
        const updated = { ...state.byLead, [leadId]: [] }
        persistLocal(updated)
        return { byLead: updated }
      })
      return []
    }
  },
  add: async (leadId: string, propertyId: string) => {
    const ids = get().byLead[leadId] || []
    if (ids.includes(propertyId)) return
    const updated = [...ids, propertyId]
    set(state => {
      const next = { ...state.byLead, [leadId]: updated }
      persistLocal(next)
      return { byLead: next }
    })
    try {
      await fetch(`/api/leads/${leadId}/properties`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyIds: updated }),
      })
    } catch {
      /* ignore */
    }
  },
  remove: async (leadId: string, propertyId: string) => {
    const ids = get().byLead[leadId] || []
    const updated = ids.filter(id => id !== propertyId)
    set(state => {
      const next = { ...state.byLead, [leadId]: updated }
      persistLocal(next)
      return { byLead: next }
    })
    try {
      await fetch(`/api/leads/${leadId}/properties`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyIds: updated }),
      })
    } catch {
      /* ignore */
    }
  },
  list: (leadId: string) => get().byLead[leadId] || [],
}))

export default useLeadProperties

