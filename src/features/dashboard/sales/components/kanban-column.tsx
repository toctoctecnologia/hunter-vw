'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2 } from 'lucide-react';

import type { KanbanColumn as KanbanColumnType } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

import { SortableLeadCard } from '@/features/dashboard/sales/components/sortable-lead-card';

interface KanbanColumnProps {
  column: KanbanColumnType;
  isDraggingColumn?: boolean;
  onDelete?: () => void;
}

export function KanbanColumn({ column, isDraggingColumn = false, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className={cn('flex flex-col h-full min-w-[340px] max-w-[340px]', isDraggingColumn && 'opacity-50')}>
      <Card className="p-0 overflow-hidden pb-4">
        <div className="flex items-center justify-between p-4 py-2 border-b bg-primary">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{column.title}</h3>
            <span className="text-sm">({column.leads.length})</span>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
              title="Excluir coluna"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 px-4 space-y-4 overflow-y-auto',
            isOver && 'bg-accent/50 ring-2 ring-primary ring-inset',
          )}
        >
          <SortableContext items={column.leads.map((l) => l.uuid)} strategy={verticalListSortingStrategy}>
            {column.leads.map((lead) => (
              <SortableLeadCard key={lead.uuid} lead={lead} />
            ))}
          </SortableContext>

          {column.leads.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              Arraste leads para cá
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
