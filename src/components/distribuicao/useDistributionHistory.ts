import { useEffect, useState } from 'react';
import { fetchWithMock } from '@/utils/fetchWithMock';
import mockHistory from './historico.mock';

export interface DistHistoryFilters {
  start?: string;
  end?: string;
  user?: string;
  queue?: string;
  action?: string;
}

export interface DistHistoryChange {
  field: string;
  from?: string;
  to?: string;
}

export interface DistHistoryItem {
  id: string;
  ts: string;
  user?: string;
  queue?: string;
  lead?: string;
  action: string;
  details?: string;
  changes?: DistHistoryChange[];
}

export default function useDistributionHistory(filters: DistHistoryFilters) {
  const [items, setItems] = useState<DistHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
        const url = `/api/distribuicao/historico${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetchWithMock(url);
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        if (!ignore) {
          setItems(Array.isArray(data?.items) ? data.items : []);
        }
      } catch {
        if (!ignore) setItems(mockHistory);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [filters]);

  return { items, loading };
}

