import { useState, useEffect } from 'react'
import type { PropertyCardProps } from '@/components/imoveis/PropertyCard'

export function usePropertiesByIds(ids: number[]) {
  const [properties, setProperties] = useState<PropertyCardProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (ids.length === 0) {
      setProperties([])
      return
    }

    setIsLoading(true)
    fetch(`/api/imoveis?ids=${ids.join(',')}`)
      .then(res => res.json())
      .then(data => {
        setProperties(data ?? [])
        setError(null)
      })
      .catch(err => {
        setError(err)
        setProperties([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [ids])

  return {
    properties,
    isLoading,
    error,
  }
}

export default usePropertiesByIds
