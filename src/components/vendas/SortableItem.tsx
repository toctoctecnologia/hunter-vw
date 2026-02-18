import { Link } from 'react-router-dom';
import { GripVertical, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard';
import { Button } from '@/components/ui/button';
import type { FC } from 'react';

interface SortableItemProps {
  property: PropertyCardProps;
  onRemove: (id: number) => void;
}

const SortableItem: FC<SortableItemProps> = ({ property, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: property.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as const;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
      aria-roledescription="sortable"
    >
      <Link to={`/property/${property.id}`} className="block">
        <PropertyCard
          {...property}
          draggableHandle={
            <button
              {...attributes}
              {...listeners}
              onClick={e => e.preventDefault()}
              onPointerDown={e => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 cursor-grab text-gray-400"
              aria-label="Reordenar imóvel"
            >
              <GripVertical className="w-5 h-5" />
            </button>
          }
        />
      </Link>
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(property.id);
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SortableItem;
