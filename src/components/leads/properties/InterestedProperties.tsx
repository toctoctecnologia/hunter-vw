import { useState } from 'react'
import { ExternalLink, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard'
import useInterestedProperties from '@/hooks/useInterestedProperties'
import { MOCK_PROPERTIES } from '@/mocks/properties'
import { AddPropertyModal } from './AddPropertyModal'
import type { LeadStage } from '@/constants/pipeline'
import { STAGE_LABEL_TO_SLUG } from '@/data/stageMapping'
import { useVisitScheduler, useVisitPick } from '@/hooks/agenda'
import { useNavigate } from 'react-router-dom'

interface InterestedPropertiesProps {
  leadId: number
  className?: string
  currentStage?: LeadStage
}

export function InterestedProperties({ leadId, className, currentStage = 'em_atendimento' as LeadStage }: InterestedPropertiesProps) {
  const { properties, addById, isLoading } = useInterestedProperties(leadId)
  const { add } = useVisitScheduler()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const parseNumber = (v: any) =>
    typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d]+/g, ''))

  const fallbackProperties: PropertyCardProps[] = (MOCK_PROPERTIES as any[]).map(p => ({
    id: p.id,
    code: p.code,
    type: '',
    title: p.title,
    city: p.city,
    price: parseNumber(p.price),
    area: 0,
    beds: 0,
    baths: 0,
    parking: 0,
    coverUrl: p.image,
    daysWithoutContact: 0,
  }))

  const displayProperties = properties.length === 0 ? fallbackProperties : properties
  const selectedProperties = displayProperties.filter(property => selectedIds.includes(property.id))

  const toggleSelection = (propertyId: number) => {
    setSelectedIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId],
    )
  }

  const buildMockProperty = (property: PropertyCardProps) => ({
    id: property.id,
    code: property.code,
    title: property.title,
    address: property.city,
    city: property.city,
    price: property.price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }),
    image: property.coverUrl,
    specs: [],
  })

  const handleSelect = async (property: PropertyCardProps) => {
    await addById(property.id)
    setOpen(false)
  }

  const handleScheduleVisit = (property: PropertyCardProps) => {
    add({
      leadId: leadId,
      propertyId: property.id,
      date: '',
      time: '',
      durationMin: 60,
      transport: 'car'
    })

    useVisitPick.getState().pick(buildMockProperty(property) as any)

    navigate(`/leads/${leadId}?action=agendar`)
  }

  const handleScheduleSelected = () => {
    if (selectedProperties.length === 0) return

    selectedProperties.forEach(property => {
      add({
        leadId: leadId,
        propertyId: property.id,
        date: '',
        time: '',
        durationMin: 60,
        transport: 'car'
      })
    })

    useVisitPick.getState().pick(buildMockProperty(selectedProperties[0]) as any)
    setSelectedIds([])
    navigate(`/leads/${leadId}?action=agendar`)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100 md:col-span-2',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <a
          href="/imoveis"
          className="flex items-center gap-2 hover:text-orange-600 transition-colors group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
            Imóveis interessados
          </h3>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScheduleSelected}
            disabled={selectedIds.length === 0}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-xl border transition-colors',
              selectedIds.length === 0
                ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'text-orange-700 border-orange-100 bg-orange-50 hover:bg-orange-100',
            )}
          >
            Agendar selecionados ({selectedIds.length})
          </button>

          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center bg-orange-600 text-white rounded-xl hover:bg-orange-700"
            aria-label="Adicionar imóvel interessado"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          displayProperties.map(property => (
            <div key={property.id} className="flex items-start gap-3">
              <div className="pt-4">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded-full border-2 border-gray-300 text-orange-600 focus:ring-orange-500"
                  checked={selectedIds.includes(property.id)}
                  onChange={() => toggleSelection(property.id)}
                  aria-label={`Selecionar imóvel ${property.title}`}
                />
              </div>
              <PropertyCard
                {...property}
                actions={
                  <>
                    <a
                      href={`/imoveis/${property.id}`}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-center"
                    >
                      Ver Mais Detalhes
                    </a>
                    <button
                      onClick={() => handleScheduleVisit(property)}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                    >
                      Agendar Visita
                    </button>
                  </>
                }
              />
            </div>
          ))
        )}
      </div>

      <AddPropertyModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  )
}

export default InterestedProperties
