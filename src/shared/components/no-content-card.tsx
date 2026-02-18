import { LucideIcon, SquareDashed } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';

export function NoContentCard({ title, icon: Icon }: { title?: string; icon?: LucideIcon }) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center size-12 mb-4 bg-secondary rounded-full">
            {Icon ? <Icon className="size-6" /> : <SquareDashed className="size-6" />}
          </div>

          <p className="text-muted-foreground">{title || 'Nenhum conteúdo disponível'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
