import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserUpdatesContent from '@/features/users/updates/UserUpdatesContent';
import {
  getUserHealthSnapshot,
  runCheckpointNow,
  saveUserCheckpoint,
} from '@/services/users';
import type { CheckPointUpdateInput, UserHealthSnapshot } from '@/features/users/types';

interface Props {
  params?: { userId: string };
}

export default function AtualizacoesPage({ params }: Props) {
  const { id } = useParams<{ id: string }>();
  const userId = params?.userId ?? id ?? '';
  const [data, setData] = useState<UserHealthSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSnapshot = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getUserHealthSnapshot(userId, { reason: 'manual', force: true });
      setData(response);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Erro ao carregar a saúde do usuário');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleSaveCheckpoint = useCallback(
    async (payload: CheckPointUpdateInput) => {
      if (!userId) return null;
      const summary = await saveUserCheckpoint(userId, payload);
      await loadSnapshot();
      return summary;
    },
    [loadSnapshot, userId],
  );

  const handleRunCheckpoint = useCallback(async () => {
    if (!userId) return null;
    const summary = await runCheckpointNow(userId);
    await loadSnapshot();
    return summary;
  }, [loadSnapshot, userId]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <UserUpdatesContent
      data={data}
      userId={userId}
      loading={loading}
      error={error}
      onRetry={loadSnapshot}
      onSaveCheckpoint={handleSaveCheckpoint}
      onRunCheckpoint={handleRunCheckpoint}
    />
  );
}
