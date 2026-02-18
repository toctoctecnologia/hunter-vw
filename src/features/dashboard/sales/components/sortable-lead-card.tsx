'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { LeadDetail } from '@/shared/types';

import { KanbanLeadCard } from '@/features/dashboard/sales/components/kanban-lead-card';

interface SortableLeadCardProps {
  lead: LeadDetail;
}

export function SortableLeadCard({ lead }: SortableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanLeadCard leadDetail={lead} isDragging={isDragging} />
    </div>
  );
}
