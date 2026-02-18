import { LucideIcon } from 'lucide-react';

import { CardHeader as CardHeaderComponent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface CardHeaderProps {
  icon?: LucideIcon;
  title: string;
  actionText?: string;
  actionIcon?: LucideIcon;
  onAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CardHeader({ icon: Icon, title, actionText = '', actionIcon: ActionIcon, onAction }: CardHeaderProps) {
  return (
    <CardHeaderComponent className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-primary" />}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {!!onAction && (
        <Button onClick={(e) => onAction(e)} size="sm">
          {ActionIcon && <ActionIcon className="size-3" />}
          {actionText}
        </Button>
      )}
    </CardHeaderComponent>
  );
}
