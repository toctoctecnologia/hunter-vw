import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lead } from '@/types/lead';
import type { DistribuicaoConfig, RoletaoResponse } from '@/types/distribuicao';
import { httpJSON, HttpError } from '@/lib/http';

interface RoletaoStore {
  leads: Lead[];
  config: DistribuicaoConfig;
  loading: boolean;
  error?: string;
  claim: (leadId: number) => Promise<'ok' | 'conflict'>;
}

const POLL_INTERVAL = 5000;

export function useRoletaoStore(): RoletaoStore {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [config, setConfig] = useState<DistribuicaoConfig>({
    timeoutMin: 5,
    redistribuicaoGlobal: false,
    horarioInicio: '00:00',
    horarioFim: '23:59'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await httpJSON<RoletaoResponse<Lead>>(
        '/api/distribuicao/roletao'
      );
      if (data) {
        setLeads(Array.isArray(data.leads) ? data.leads : []);
        if (data.config) setConfig(data.config);
      }
      setError(undefined);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar roletão');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const connectSSE = () => {
      if (typeof EventSource === 'undefined') {
        startPolling();
        return;
      }
      const es = new EventSource('/api/distribuicao/roletao');
      eventSourceRef.current = es;
      es.onmessage = (ev) => {
        try {
          const data: RoletaoResponse<Lead> = JSON.parse(ev.data);
          setLeads(Array.isArray(data.leads) ? data.leads : []);
          if (data.config) setConfig(data.config);
          setLoading(false);
        } catch (err) {
          console.error('Erro ao processar SSE do roletão', err);
        }
      };
      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        startPolling();
      };
    };

    const startPolling = () => {
      fetchData();
      pollRef.current = setInterval(fetchData, POLL_INTERVAL);
    };

    connectSSE();

    return () => {
      eventSourceRef.current?.close();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  const claim = useCallback(async (leadId: number) => {
    try {
      const res = await fetch('/api/distribuicao/roletao/pegar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      });
      if (res.status === 409) {
        return 'conflict';
      }
      if (!res.ok) {
        throw new HttpError(res.statusText, res.status);
      }
      await fetchData();
      return 'ok';
    } catch (e) {
      console.error('Falha ao pegar lead', e);
      throw e;
    }
  }, [fetchData]);

  return { leads, config, loading, error, claim };
}

export default useRoletaoStore;

