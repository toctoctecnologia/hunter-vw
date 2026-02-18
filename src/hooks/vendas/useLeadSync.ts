import { useEffect, useState } from 'react'
import type { Lead } from '@/types/lead'

export const useLeadSync = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('leads')
    if (saved) {
      try {
        setLeads(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse leads', e)
      }
    }
  }, [])

  const storeLeads = (data: Lead[]) => {
    setLeads(data)
    localStorage.setItem('leads', JSON.stringify(data))
    setLastSync(new Date())
  }

  const sync = async (url: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to sync leads')
      const data = await res.json()
      if (Array.isArray(data.leads)) {
        storeLeads(data.leads)
      }
    } catch (e: any) {
      console.error('Lead sync error:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const syncMetaLeads = () => sync('/api/sync/meta/leads')
  const syncGoogleAdsLeads = () => sync('/api/sync/google-ads/leads')

  return { leads, loading, error, lastSync, syncMetaLeads, syncGoogleAdsLeads }
}
