import { LucideIcon } from 'lucide-react';

import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string;
  trendUp?: boolean;
  trend?: string;
  description?: string;
  icon?: LucideIcon;
}

export function StatusCard({ title, value, trendUp, trend, description, icon: Icon }: StatusCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex flex-col gap-1 mb-1">
              <p className="text-sm font-medium">{title}</p>
              {description && <TypographyMuted>{description}</TypographyMuted>}
            </div>
            <p className="text-2xl font-bold ">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>{trend}</span>
            )}
          </div>

          {Icon && (
            <div className="h-6 w-6 bg-primary/10 rounded-sm flex items-center justify-center">
              <Icon className="size-3 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
