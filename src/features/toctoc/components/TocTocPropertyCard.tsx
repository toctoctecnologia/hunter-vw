import { MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeImage } from '@/components/ui/SafeImage';
import { cn } from '@/lib/utils';
import type { TocTocProperty } from '../api';

interface TocTocPropertyCardProps {
  property: TocTocProperty;
  className?: string;
  onSelect?: (propertyId: string) => void;
  isActive?: boolean;
}

const formatMoney = (value?: number | string) => {
  if (value === undefined || value === null) {
    return 'Preço não informado';
  }

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/\D+/g, ''));

  if (Number.isNaN(parsed)) {
    return String(value);
  }

  return parsed.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
};

export const TocTocPropertyCard = ({
  property,
  className,
  onSelect,
  isActive,
}: TocTocPropertyCardProps) => {
  const image = property.photos?.[0];
  const title = property.name ?? property.address ?? 'Imóvel sem título';
  const locationPieces = [property.address, property.city, property.state].filter(Boolean);
  const location = locationPieces.join(' • ');
  const price = formatMoney(property.price);

  return (
    <Card
      className={cn(
        'overflow-hidden h-full flex flex-col border border-border/60 transition-all',
        onSelect && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
        isActive && 'ring-2 ring-primary/60',
        className,
      )}
      onClick={() => onSelect?.(property.id)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={event => {
        if (!onSelect) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(property.id);
        }
      }}
    >
      <div className="h-48 w-full bg-muted">
        <SafeImage
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-base font-semibold text-foreground line-clamp-2">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{location || 'Localização não informada'}</span>
        </div>
      </CardHeader>

      <CardContent className="mt-auto space-y-3">
        <div className="text-2xl font-bold text-primary">{price}</div>

        {property.type_property && (
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span className="capitalize">{property.type_property}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TocTocPropertyCard;
