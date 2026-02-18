import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard';

interface PropertyResultsListProps {
  items: PropertyCardProps[];
  onSelect: (property: PropertyCardProps) => void;
}

export function PropertyResultsList({ items, onSelect }: PropertyResultsListProps) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      {items.map(property => (
        <PropertyCard
          key={property.id}
          {...property}
          compact
          actions={
            <button
              onClick={() => onSelect(property)}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
            >
              Selecionar
            </button>
          }
        />
      ))}
    </div>
  );
}

export default PropertyResultsList;
