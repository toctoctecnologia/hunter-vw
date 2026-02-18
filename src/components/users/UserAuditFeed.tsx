import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getUserAudit } from '@/services/users';

interface AuditEntry {
  id: string;
  action: string;
  createdAt: string;
  [key: string]: any;
}

interface UserAuditFeedProps {
  userId: string;
}

export default function UserAuditFeed({ userId }: UserAuditFeedProps) {
  const [items, setItems] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserAudit(userId);
        if (mounted) {
          setItems(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Erro ao carregar auditoria'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    if (userId) {
      load();
    }
    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <Card>
      <CardContent>
        {loading && <p className="text-sm">Carregando...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-2 text-sm">
            {items.length === 0 && <li>Nenhuma atividade encontrada</li>}
            {items.map((item) => (
              <li key={item.id}>
                {new Date(item.createdAt).toLocaleDateString()} - {item.action}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
