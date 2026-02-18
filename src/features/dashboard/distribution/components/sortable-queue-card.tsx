'use client';

import { GripVertical, Edit, Trash2, Users, TrendingUp } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { useRouter } from '@/shims/next-navigation';
import { CSS } from '@dnd-kit/utilities';

import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

import { QueueItem } from '@/shared/types';

import { TypographyMuted } from '@/shared/components/ui/typography';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';

export function SortableQueueCard({
  queue,
  position,
  onToggleActive,
  onDelete,
}: {
  queue: QueueItem;
  position: number;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: queue.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card
        className="relative overflow-hidden transition-shadow hover:shadow-md"
        style={{ borderLeft: `4px solid ${queue.color}` }}
      >
        <div className="flex md:flex-row flex-col md:items-start gap-4 p-4">
          <div className="flex items-center gap-2">
            <button
              className="mt-1 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-white"
              style={{ backgroundColor: queue.color }}
            >
              {position}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4 md:flex-row flex-col">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{queue.name}</h3>
                  {!queue.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inativa
                    </Badge>
                  )}
                </div>
                <TypographyMuted>{queue.description || 'Sem descrição'}</TypographyMuted>
              </div>

              {!queue.isDefault && hasFeature(user?.userInfo.profile.permissions, '1601') && (
                <div className="flex items-center gap-2">
                  <Switch checked={queue.isActive} onCheckedChange={() => onToggleActive(queue.uuid)} />

                  <Button onClick={() => router.push(`/dashboard/distribution/queue/${queue.uuid}`)} size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button onClick={() => onDelete(queue.uuid)} size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-4 text-sm md:items-center md:flex-row flex-col">
              <div className="flex items-center gap-2">
                <Users className="size-3 text-muted-foreground" />
                <TypographyMuted>{queue.activeUsersCount} Ativos</TypographyMuted>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-3 text-muted-foreground" />
                <TypographyMuted>{queue.activeLeadsCount} Leads</TypographyMuted>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
