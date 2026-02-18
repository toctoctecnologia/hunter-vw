import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCatchErrorMessages } from '@/shared/lib/utils';

export function ErrorCard({ error, title }: { error: unknown; title?: string }) {
  const messages = formatCatchErrorMessages(error);

  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <p className="text-destructive">{title || 'Ocorreu um erro'}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {messages.length > 0 ? messages.join(', ') : 'Erro desconhecido'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
