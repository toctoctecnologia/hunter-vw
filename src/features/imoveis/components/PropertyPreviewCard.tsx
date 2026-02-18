import { Ruler, Bed, Bath, Car } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AvailabilityBadge from '@/components/imoveis/AvailabilityBadge';
import { Button } from '@/components/ui/button';
import type { Availability } from '@/features/properties/types';
import { cn } from '@/lib/utils';

export interface PropertyPreviewCardProps {
  code: string;
  type: string;
  title: string;
  address: string;
  price: number;
  area?: number;
  beds?: number;
  baths?: number;
  parking?: number;
  lastContact?: string;
  disponibilidade?: Availability;
  captador?: string;
  /** Compact variant with reduced padding */
  compact?: boolean;
  /** Shows the "Atualizar" button when true */
  showUpdateButton?: boolean;
  /** Handler for the details button */
  onViewDetails?: () => void;
  /** Handler for the update button */
  onUpdate?: () => void;
}

export function PropertyPreviewCard({
  code,
  type,
  title,
  address,
  price,
  area,
  beds,
  baths,
  parking,
  lastContact,
  disponibilidade,
  captador,
  compact = false,
  showUpdateButton = false,
  onViewDetails,
  onUpdate,
}: PropertyPreviewCardProps) {
  const priceFormatted = formatMoney(price);
  const lastContactText = formatLastContact(lastContact);

  return (
    <div
      className={cn(
        'bg-white border rounded-lg',
        compact ? 'p-4 space-y-3' : 'p-6 space-y-4'
      )}
    >
      <div className="flex items-start justify-between">
        {disponibilidade && <AvailabilityBadge value={disponibilidade} />}
        <span className="text-xs text-gray-500">Último contato: {lastContactText}</span>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>{code}</span>
        <span>—</span>
        <span>{type}</span>
      </div>

      <h3 className={cn('font-semibold text-gray-900', compact ? 'text-lg' : 'text-xl')}>{title}</h3>
      <p className="text-sm text-gray-600">{address}</p>
      <div className="flex flex-col gap-1">
        <p className={cn('font-bold text-orange-600', compact ? 'text-xl' : 'text-2xl')}>{priceFormatted}</p>
        {captador && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Captador:</span> {captador}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 text-gray-600">
        {typeof area === 'number' && (
          <div className="flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{area} m²</span>
          </div>
        )}
        {typeof beds === 'number' && (
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{beds}</span>
          </div>
        )}
        {typeof baths === 'number' && (
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{baths}</span>
          </div>
        )}
        {typeof parking === 'number' && (
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{parking}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {showUpdateButton && (
          <Button variant="outline" onClick={onUpdate} className="flex-1">
            Atualizar
          </Button>
        )}
        <Button onClick={onViewDetails} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
          Ver Mais Detalhes
        </Button>
      </div>
    </div>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
}

function formatLastContact(date?: string) {
  if (!date) return '-';
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return '-';
    return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR });
  } catch {
    return '-';
  }
}

export default PropertyPreviewCard;

