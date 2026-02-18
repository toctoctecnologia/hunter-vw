import { useCallback, useState } from 'react';
import { httpJSON } from '@/lib/http';
import type { DistribuicaoConfig } from '@/types/distribuicao';

interface ConfigStore {
  config: DistribuicaoConfig;
  loading: boolean;
  error?: string;
  load: () => Promise<void>;
  save: (cfg: DistribuicaoConfig) => Promise<void>;
}

const DEFAULT_CONFIG: DistribuicaoConfig = {
  timeoutMin: 5,
  redistribuicaoGlobal: false,
  horarioInicio: '00:00',
  horarioFim: '23:59'
};

export function useDistribuicaoConfig(): ConfigStore {
  const [config, setConfig] = useState<DistribuicaoConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await httpJSON<DistribuicaoConfig>('/api/distribuicao/config');
      if (data) setConfig(data);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar configuração');
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(
    async (cfg: DistribuicaoConfig) => {
      setLoading(true);
      setError(undefined);
      try {
        await httpJSON<DistribuicaoConfig>('/api/distribuicao/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cfg)
        });
        setConfig(cfg);
      } catch (e: any) {
        setError(e?.message || 'Falha ao salvar configuração');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { config, loading, error, load, save };
}

export default useDistribuicaoConfig;
