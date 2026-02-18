import { useState } from 'react'
import { STAGE_LABEL_TO_SLUG } from '@/data/stageMapping'
import { LeadStage } from '@/domain/pipeline/stages'

export function useLeadQualify() {
  const [loading, setLoading] = useState(false)
  const qualifiedStage: LeadStage = STAGE_LABEL_TO_SLUG['Em Atendimento'] as LeadStage

  const updateQualification = async (
    leadId: string,
    qualified: boolean,
    currentStage: LeadStage,
  ) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualified,
          qualifiedAt: qualified ? new Date().toISOString() : null,
          stage: qualified ? qualifiedStage : currentStage,
        }),
      })
      if (!res.ok) throw new Error('Failed to update lead')
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, updateQualification }
}

export default useLeadQualify

