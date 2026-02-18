import { Bath, Bed, Car, Ruler } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface PropertyCardMiniProps {
  id: string;
  code: string;
  title: string;
  type: string;
  city: string;
  price?: number;
  area?: number;
  beds?: number;
  baths?: number;
  parking?: number;
  coverUrl?: string;
  className?: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function PropertyCardMini({
  code,
  title,
  type,
  city,
  price,
  area,
  beds,
  baths,
  parking,
  coverUrl,
  className,
}: PropertyCardMiniProps) {
  return (
    <div
      className={cn(
        'flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        className,
      )}
    >
      <div className="hidden h-24 w-24 overflow-hidden rounded-lg bg-gray-100 sm:block">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            sem foto
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="text-gray-900">{code}</span>
          <span className="text-gray-300">•</span>
          <span>{type}</span>
        </div>
        <h4 className="mt-1 line-clamp-1 text-base font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-muted-foreground">{city}</p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {typeof area === 'number' && (
            <span className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" /> {area} m²
            </span>
          )}
          {typeof beds === 'number' && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" /> {beds}
            </span>
          )}
          {typeof baths === 'number' && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" /> {baths}
            </span>
          )}
          {typeof parking === 'number' && (
            <span className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5" /> {parking}
            </span>
          )}
        </div>
      </div>

      {typeof price === 'number' && (
        <div className="hidden flex-shrink-0 flex-col items-end justify-center text-right text-xs sm:flex">
          <span className="font-medium text-muted-foreground">Valor anúncio</span>
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(price)}</span>
        </div>
      )}
    </div>
  );
}

export default PropertyCardMini;
