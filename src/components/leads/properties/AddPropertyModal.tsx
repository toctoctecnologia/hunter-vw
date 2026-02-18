import { useEffect, useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard'
import { useProperties } from '@/hooks/useProperties'

interface AddPropertyModalProps {
  open: boolean
  onClose: () => void
  onSelect: (property: PropertyCardProps) => void
}

export function AddPropertyModal({ open, onClose, onSelect }: AddPropertyModalProps) {
  const search = useProperties(state => state.search)
  const cancelSearch = useProperties(state => state.cancelSearch)
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<PropertyCardProps[]>([])

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const data = await search(term)
        if (active) setResults(data)
      } catch {
        if (active) setResults([])
      }
    }
    run()
    return () => {
      active = false
      cancelSearch()
    }
  }, [term, search, cancelSearch])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">Adicionar imóvel</h3>
          <div className="w-9 h-9" />
        </div>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Pesquisar imóvel"
            value={term}
            onChange={e => setTerm(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-300 rounded-2xl text-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-3">
          {results.map(property => (
            <PropertyCard
              key={property.id}
              {...property}
              compact
              actions={
                <button
                  onClick={() => onSelect(property)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Selecionar
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddPropertyModal
