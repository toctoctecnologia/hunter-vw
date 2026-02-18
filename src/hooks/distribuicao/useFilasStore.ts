import { useCallback, useState } from 'react';
import { httpJSON } from '@/lib/http';
import type { Fila } from '@/types/distribuicao';

interface FilasStore {
  filas: Fila[];
  loading: boolean;
  error?: string;
  load: () => Promise<void>;
  save: (fila: Partial<Fila>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  reorder: (newOrder: Fila[]) => Promise<void>;
}

const STORAGE_KEY = 'regras_distribuicao';

export function useFilasStore(): FilasStore {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const persist = useCallback((data: Fila[]) => {
    setFilas(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await httpJSON<Fila[]>('/api/distribuicao/filas');
      persist(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.warn('Falha ao carregar filas da API, usando localStorage', e);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          persist(JSON.parse(cached));
        } else {
          persist([]);
        }
      } catch {
        persist([]);
      }
      setError(e?.message || 'Falha ao carregar filas');
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const save = useCallback(async (fila: Partial<Fila>) => {
    try {
      let saved: Fila;
      if (fila.id) {
        saved = await httpJSON<Fila>(`/api/distribuicao/filas/${fila.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fila)
        });
      } else {
        saved = await httpJSON<Fila>('/api/distribuicao/filas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fila)
        });
      }
      const updated = fila.id
        ? filas.map(f => (f.id === saved.id ? saved : f))
        : [...filas, saved];
      persist(updated);
    } catch (e) {
      console.warn('Falha ao salvar via API, persistindo local', e);
      const localId = fila.id ?? Date.now();
      const localFila: Fila = {
        id: localId,
        nome: fila.nome || '',
        regras: fila.regras || [],
        redistribuicao: !!fila.redistribuicao,
        preservarPosicao: !!fila.preservarPosicao,
        ativo: fila.ativo ?? true,
        ordem: fila.ordem ?? filas.length + 1
      };
      const updated = fila.id
        ? filas.map(f => (f.id === localId ? localFila : f))
        : [...filas, localFila];
      persist(updated);
    }
  }, [filas, persist]);

  const remove = useCallback(async (id: number) => {
    try {
      await httpJSON<void>(`/api/distribuicao/filas/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Falha ao remover fila via API', e);
    } finally {
      const updated = filas.filter(f => f.id !== id);
      persist(updated);
    }
  }, [filas, persist]);

  const reorder = useCallback(async (newOrder: Fila[]) => {
    persist(newOrder);
    try {
      await fetch('/api/distribuicao/filas/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder.map(f => f.id) })
      });
    } catch (e) {
      console.warn('Falha ao persistir reorder', e);
    }
  }, [persist]);

  return { filas, loading, error, load, save, remove, reorder };
}

export default useFilasStore;
