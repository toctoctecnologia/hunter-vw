'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { QueueItemDetailUser } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { TypographySmall } from '@/shared/components/ui/typography';
import { removeNonNumeric } from '@/shared/lib/masks';

interface SortableUserCardProps {
  user: QueueItemDetailUser;
  index: number;
  onUpdate: (index: number, updates: Partial<QueueItemDetailUser>) => void;
  onRemove: (index: number) => void;
}

export function SortableUserCard({ user, index, onUpdate, onRemove }: SortableUserCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: user.userUuid,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border p-4 space-y-3 animate-in fade-in-50 slide-in-from-top-2 bg-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" className="cursor-grab active:cursor-grabbing touch-none" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <p className="font-medium">{user.userName}</p>
            <TypographySmall className="text-muted-foreground">Ordem: {user.userOrder}</TypographySmall>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`active-${user.userUuid}`} className="text-sm">
              Ativo
            </Label>
            <Switch
              id={`active-${user.userUuid}`}
              checked={user.isActive}
              onCheckedChange={(checked) => onUpdate(index, { isActive: checked })}
            />
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`observation-${user.userUuid}`}>Observação</Label>
          <Input
            id={`observation-${user.userUuid}`}
            placeholder="Observação"
            value={user.observation || ''}
            onChange={(e) => onUpdate(index, { observation: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`limit-${user.userUuid}`}>Limite de leads</Label>
          <Input
            id={`limit-${user.userUuid}`}
            placeholder="0"
            value={user.openedLeadsLimit || ''}
            onChange={(e) => onUpdate(index, { openedLeadsLimit: Number(removeNonNumeric(e.target.value) || 0) })}
          />
        </div>
      </div>
    </div>
  );
}
