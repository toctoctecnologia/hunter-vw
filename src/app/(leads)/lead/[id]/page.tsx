import InterestedProperties from './components/InterestedProperties'
import Section from './components/Section'

interface PageProps {
  params: { id: string }
}

async function getLead(id: string) {
  try {
    const res = await fetch(`/api/leads/${id}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function LeadPage({ params }: PageProps) {
  const leadId = Number(params.id)
  const lead = await getLead(params.id)
  const interestedPropertyIds: number[] = lead?.interestedPropertyIds ?? []

  return (
    <Section title="Imóveis interessados">
      <InterestedProperties leadId={leadId} interestedPropertyIds={interestedPropertyIds} />
    </Section>
  )
}

