import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode, CSSProperties } from 'react';

interface SortableRenderProps {
  setNodeRef: (element: HTMLElement | null) => void;
  style: CSSProperties;
  listeners: Record<string, unknown> | undefined;
  attributes: Record<string, unknown>;
  isDragging: boolean;
}

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: SortableRenderProps) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <>{children({ 
    setNodeRef, 
    style, 
    listeners: listeners as Record<string, unknown> | undefined, 
    attributes: attributes as unknown as Record<string, unknown>, 
    isDragging 
  })}</>;
}
