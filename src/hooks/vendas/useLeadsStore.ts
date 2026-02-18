import { useCallback, useState } from 'react';
import { STAGE_SLUG_TO_LABEL } from '@/data/stageMapping';
import type { Lead, LeadStage } from '@/types/lead';
import { httpJSON, HttpError } from '@/lib/http';
import { MOCK_LEADS } from '@/mocks/leads';

interface LeadsStore {
  leads: Lead[];
  loading: boolean;
  error?: string;
  load: () => Promise<void>;
  all: () => Lead[];
  byStage: (stageId: LeadStage) => Lead[];
  move: (leadId: number, toStage: LeadStage) => void;
}

const STORAGE_KEY = 'leads';

function mapStageLabels(data: Lead[]): Lead[] {
  let funnelConfig: any = null;
  try {
    funnelConfig = JSON.parse(localStorage.getItem('funnelConfig') ?? 'null');
  } catch (e) {
    console.error('Failed to parse funnelConfig from localStorage:', e);
    funnelConfig = null;
  }
  const stages: string[] | undefined = funnelConfig?.stages;

  return data.map((lead) => {
    if ('stageLabel' in lead) return lead;

    if (lead.stage && STAGE_SLUG_TO_LABEL[lead.stage]) {
      return { ...lead, stageLabel: STAGE_SLUG_TO_LABEL[lead.stage] } as Lead & { stageLabel: string };
    }

    if (stages) {
      const index = Number(lead.stage);
      if (!Number.isNaN(index) && stages[index]) {
        return { ...lead, stageLabel: stages[index] } as Lead & { stageLabel: string };
      }
    }

    return lead;
  });
}

export function useLeadsStore(): LeadsStore {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const persist = useCallback((data: Lead[]) => {
    setLeads(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore write errors
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      // Always use mock data for consistency across all tabs
      persist(MOCK_LEADS);
      setLoading(false);
      return;
      const data = await httpJSON<Lead[]>('/api/leads');
      const leads = Array.isArray(data) ? data : [];
      const mapped = mapStageLabels(leads);
      persist(mapped);
    } catch (e: any) {
      console.error('Failed to load leads:', e);
      if (e instanceof HttpError && e.status === 200) {
        console.warn('Endpoint retornou HTML', e);
        if (process.env.NODE_ENV === 'development') {
          persist(MOCK_LEADS);
        } else {
          persist([]);
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock leads as fallback');
        persist(MOCK_LEADS);
        setLoading(false);
        setError(undefined);
      } else {
        setError(e?.message || 'Falha ao carregar leads');
        persist([]);
      }
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const all = useCallback(() => leads, [leads]);

  const byStage = useCallback(
    (stageId: LeadStage) => leads.filter((l) => l.stage === stageId),
    [leads]
  );

  const move = useCallback((leadId: number, toStage: LeadStage) => {
    setLeads((prev) => {
      const updated = prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              stage: toStage,
              stageLabel:
                STAGE_SLUG_TO_LABEL[toStage] ||
                ('stageLabel' in lead
                  ? (lead as { stageLabel?: string }).stageLabel
                  : undefined)
            }
          : lead
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore write errors
      }
      return updated;
    });
  }, []);

  return { leads, loading, error, load, all, byStage, move };
}

export default useLeadsStore;

