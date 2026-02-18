import { ReactNode } from 'react';
import { ShieldOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Default403StateProps {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Default403State({
  title = 'Acesso restrito',
  description = 'Você não possui permissão para acessar esta página.',
  action,
  className = '',
}: Default403StateProps) {
  return (
    <div className={cn('flex h-full flex-col items-center justify-center p-6', className)}>
      <Card className="max-w-md border-dashed text-center">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <ShieldOff className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>
          {action}
        </CardContent>
      </Card>
    </div>
  );
}

export default Default403State;
