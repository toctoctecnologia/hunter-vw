import { create } from 'zustand'
import { PIPELINE_STAGES, type LeadStage, isForward, STAGE_TOASTS } from '@/constants/pipeline'
import { STAGE_SLUG_TO_LABEL } from '@/data/stageMapping'

interface Stage {
  id: LeadStage
  name: string
}

interface LeadStagesState {
  stages: Stage[]
  updating: boolean
  updateStage: (
    leadId: number | string,
    current: LeadStage,
    target: LeadStage
  ) => Promise<boolean>
}

const STAGES: Stage[] = PIPELINE_STAGES.map(stage => ({
  id: stage,
  name: STAGE_SLUG_TO_LABEL[stage]
}))

export const useLeadStages = create<LeadStagesState>(set => ({
  stages: STAGES,
  updating: false,
  updateStage: async (leadId, current, target) => {
    if (!isForward(current, target)) return false
    set({ updating: true })
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: target })
      })
      if (!res.ok) throw new Error('Failed to update stage')
      const actRes = await fetch(`/api/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_change',
          ...STAGE_TOASTS[target]
        })
      })
      if (!actRes.ok) throw new Error('Failed to log activity')
      if (target === 'indicação') {
        await fetch(`/api/leads/${leadId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'referral' })
        })
      }
      return true
    } catch {
      return false
    } finally {
      set({ updating: false })
    }
  }
}))

export default useLeadStages
