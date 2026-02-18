import { useCallback, useEffect, useState } from 'react'
import type { PropertyCardProps } from '@/components/imoveis/PropertyCard'
import { toast } from '@/hooks/use-toast'
import useProperties from '@/hooks/useProperties'

export interface UseInterestedPropertiesResult {
  properties: PropertyCardProps[]
  isLoading: boolean
  addByCode: (code: string) => Promise<boolean>
  searchByName: (name: string) => Promise<PropertyCardProps[]>
  addById: (id: number, propertyOverride?: PropertyCardProps) => Promise<boolean>
  reorder: (from: number, to: number) => Promise<void>
  removeById: (id: number) => Promise<void>
}

export function useInterestedProperties(leadId: number): UseInterestedPropertiesResult {
  const [properties, setProperties] = useState<PropertyCardProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const loadByIds = useProperties(state => state.loadByIds)
  const search = useProperties(state => state.search)
  const cancelSearch = useProperties(state => state.cancelSearch)

  const persist = async (ids: number[]) => {
    const res = await fetch(
      `/api/leads/${leadId}/interested-properties`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interestedPropertyIds: ids }),
      },
    )
    if (!res.ok) {
      throw new Error('Failed to persist interested properties')
    }
  }

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const leadRes = await fetch(`/api/leads/${leadId}`)
      if (!leadRes.ok) throw new Error('Failed to load lead')
      const leadData = await leadRes.json()
      const ids: number[] = leadData.interestedPropertyIds || []
      if (ids.length === 0) {
        setProperties([])
      } else {
        const props = await loadByIds(ids.map(String))
        setProperties(props)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os imóveis interessados.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [leadId, loadByIds])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => cancelSearch, [cancelSearch])

  const addById = async (id: number, propertyOverride?: PropertyCardProps) => {
    if (properties.some(p => p.id === id)) {
      toast({
        title: 'Imóvel já adicionado',
        description: 'Este imóvel já está nos interessados.',
      })
      return false
    }

    try {
      setIsLoading(true)
      let property = propertyOverride
      if (!property) {
        const props = await loadByIds([String(id)])
        property = props[0]
      }
      if (!property) {
        toast({ title: 'Erro', description: 'Imóvel não encontrado.' })
        return false
      }
      const updated = [...properties, property]
      setProperties(updated)
      await persist(updated.map(p => p.id))
      toast({
        title: 'Sucesso',
        description: 'Imóvel adicionado aos interessados.',
      })
      return true
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o imóvel.',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const addByCode = async (code: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `/api/properties?code=${encodeURIComponent(code)}`,
      )
      if (!res.ok) throw new Error('Failed to fetch property')
      const data: PropertyCardProps[] = await res.json()
      const property = data[0]
      if (!property) {
        toast({ title: 'Erro', description: 'Imóvel não encontrado.' })
        return false
      }
      return await addById(property.id, property)
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro', description: 'Imóvel não encontrado.' })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const searchByName = async (name: string): Promise<PropertyCardProps[]> => {
    cancelSearch()
    if (!name) return []
    try {
      const data = await search(name)
      return data.slice(0, 10)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar os imóveis.',
      })
      return []
    }
  }

  const reorder = async (from: number, to: number) => {
    const previous = [...properties]
    const updated = [...properties]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    setProperties(updated)
    try {
      await persist(updated.map(p => p.id))
      toast({ title: 'Sucesso', description: 'Imóveis reordenados.' })
    } catch (error) {
      setProperties(previous)
      toast({
        title: 'Erro',
        description: 'Não foi possível reordenar os imóveis.',
      })
      throw error
    }
  }

  const removeById = async (id: number) => {
    const previous = [...properties]
    const updated = properties.filter(p => p.id !== id)
    setProperties(updated)
    try {
      await persist(updated.map(p => p.id))
    } catch (error) {
      setProperties(previous)
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o imóvel.',
      })
      throw error
    }
  }

  return {
    properties,
    isLoading,
    addByCode,
    searchByName,
    addById,
    reorder,
    removeById,
  }
}

export default useInterestedProperties

