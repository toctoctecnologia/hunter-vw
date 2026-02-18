import { useNavigate } from 'react-router-dom'
import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard'
import { usePropertiesByIds } from '@/hooks/imoveis'
import { MOCK_PROPERTIES } from '@/mocks/properties'

interface InterestedPropertiesProps {
  leadId: number
  interestedPropertyIds: number[]
}

export function InterestedProperties({ leadId, interestedPropertyIds }: InterestedPropertiesProps) {
  const { properties, isLoading } = usePropertiesByIds(interestedPropertyIds)
  const navigate = useNavigate()

  const parseNumber = (value: any) =>
    typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^\d]+/g, ''))

  const fallbackProperties: PropertyCardProps[] = MOCK_PROPERTIES.map(p => ({
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

  const list = (properties as unknown as PropertyCardProps[]).length ? (properties as unknown as PropertyCardProps[]) : fallbackProperties

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : (
        list.map(property => (
          <PropertyCard
            key={property.id}
            {...property}
            actions={
              <>
                <button
                  onClick={() => navigate(`/imoveis/${property.id}`)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-center"
                >
                  Ver Mais Detalhes
                </button>
                <button
                  onClick={() => navigate(`/leads/${leadId}?action=agendar&propertyId=${property.id}`)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Agendar Visita
                </button>
              </>
            }
          />
        ))
      )}
    </div>
  )
}

export default InterestedProperties

