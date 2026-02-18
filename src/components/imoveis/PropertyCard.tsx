import { Clock, Ruler, Bed, Car, Bath, Building2, ChevronRight, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type {
  Availability,
  PersonRef,
  Proprietario,
  PropertySummary,
} from '@/features/properties/types';
import AvailabilityBadge from './AvailabilityBadge';
import useCurrentUser from '@/hooks/useCurrentUser';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProposalStatusBadge, type ProposalSummary } from './ProposalStatusBadge';

export interface PropertyCardProps
  extends Pick<
    PropertySummary,
    'id' | 'code' | 'type' | 'title' | 'city' | 'area' | 'beds' | 'baths' | 'parking'
  > {
  /** Listing price */
  price: number;
  /** Optional badge to show over the image (e.g. availability/status) */
  statusBadge?: string;
  /** Last contact date string */
  lastContact?: string;
  /** Label displayed before the date (defaults to 'Último contato:') */
  lastContactLabel?: string;
  /** Cover image URL */
  coverUrl?: string;
  /** Days without contact used to color the indicators */
  daysWithoutContact?: number;
  /** Optional actions rendered at the bottom of the card */
  actions?: ReactNode;
  /** Compact variant for smaller spacing */
  compact?: boolean;
  /** Optional draggable handle rendered outside the card */
  draggableHandle?: ReactNode;
  /** Property availability */
  disponibilidade?: Availability;
  /** Property captador */
  captador?: PersonRef;
  /** Property owner */
  proprietario?: Proprietario;
  /** Property features */
  areaPrivativa?: number;
  quartos?: number;
  suites?: number;
  vagas?: number;
  pavimentos?: number;
  /** Property address */
  address?: string;
  /** Condominium name for apartments */
  condominio?: string;
  /** Unit number for apartments */
  unidade?: string;
  /** @deprecated Use proposalData instead - Proposal summary for properties in negotiation */
  proposalSummary?: string;
  /** Structured proposal data for the property */
  proposalData?: ProposalSummary;
  /** Whether detailed proposal info should be displayed */
  showProposalDetails?: boolean;
  /** Handler to open proposal details */
  onProposalClick?: () => void;
  /** Whether the card supports bulk selection */
  selectable?: boolean;
  /** Current selection state */
  selected?: boolean;
  /** Toggle selection handler */
  onToggleSelect?: () => void;
}

const getStatusColor = (daysWithoutContact: number) => {
  if (daysWithoutContact <= 25) return '#4CAF50';
  if (daysWithoutContact <= 30) return '#FFC107';
  return '#F44336';
};

const getClockIconColor = (daysWithoutContact: number) => {
  if (daysWithoutContact <= 25) return '#10B981';
  if (daysWithoutContact <= 30) return '#F59E0B';
  return '#EF4444';
};

export function PropertyCard({
  code,
  title,
  city,
  type,
  price,
  area,
  beds,
  baths,
  parking,
  statusBadge,
  lastContact,
  lastContactLabel = 'Último contato:',
  coverUrl,
  daysWithoutContact,
  actions,
  compact = false,
  draggableHandle,
  disponibilidade,
  captador,
  proprietario,
  areaPrivativa,
  quartos,
  suites,
  vagas,
  pavimentos,
  address,
  condominio,
  unidade,
  proposalSummary,
  proposalData,
  showProposalDetails = false,
  onProposalClick,
  selectable = false,
  selected = false,
  onToggleSelect,
}: PropertyCardProps) {
  const currentUser = useCurrentUser();
  const showOwner = currentUser?.id === captador?.id;

  const lastContactFormatted = formatDate(lastContact);
  const priceFormatted = formatMoney(price);

  const areaP = areaPrivativa ?? area;
  const quartosP = quartos ?? beds;
  const suitesP = suites ?? baths;
  const vagasP = vagas ?? parking;

  // Format property title based on type
  const displayTitle = type === 'Apartamento' && condominio && unidade 
    ? `${condominio} ${unidade}`
    : title;

  // Format address/location
  const displayLocation = address || city;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-6 md:flex-row rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors hover:shadow-md',
        compact ? 'p-4' : 'p-6',
      )}
    >
      {selectable && (
        <button
          type="button"
          aria-label={selected ? 'Desmarcar imóvel' : 'Selecionar imóvel'}
          onClick={event => {
            event.stopPropagation();
            onToggleSelect?.();
          }}
          className={cn(
            'absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm transition',
            selected
              ? 'border-orange-500 bg-orange-500 text-white'
              : 'border-gray-200 bg-white text-gray-400 hover:border-orange-400 hover:text-orange-500'
          )}
        >
          <div className={cn('h-3 w-3 rounded-full', selected ? 'bg-white' : 'bg-transparent')} />
        </button>
      )}

      {/* Image with status */}
      <div className="flex-shrink-0 w-full md:w-72 relative overflow-hidden rounded-lg">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={displayTitle}
            className="w-full h-48 md:h-64 object-cover"
          />
        )}

        {disponibilidade && (
          <div className="absolute top-3 left-3">
            <AvailabilityBadge value={disponibilidade} />
          </div>
        )}

        {!disponibilidade && statusBadge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-orange-600 text-white text-xs font-medium rounded-md">
            {statusBadge}
          </div>
        )}

        {typeof daysWithoutContact === 'number' && (
          <div
            className="absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: getStatusColor(daysWithoutContact) }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{code}</span>
            <span>—</span>
            <span>{type}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" style={{ color: getClockIconColor(daysWithoutContact || 0) }} />
            <span>Último contato: {lastContactFormatted}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{displayTitle}</h3>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-4">{displayLocation}</p>

        {/* Price */}
        <p className="text-2xl font-bold text-orange-600 mb-6">{priceFormatted}</p>

        {/* Property features */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          {typeof areaP === 'number' && (
            <div className="flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{areaP} m²</span>
            </div>
          )}
          {typeof quartosP === 'number' && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{quartosP}</span>
            </div>
          )}
          {typeof suitesP === 'number' && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{suitesP}</span>
            </div>
          )}
          {typeof vagasP === 'number' && (
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{vagasP}</span>
            </div>
          )}
          {typeof pavimentos === 'number' && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{pavimentos}</span>
            </div>
          )}
        </div>

        {/* Captador and Proposal Status */}
        <div className={cn('grid gap-3', (proposalSummary || proposalData) && 'md:grid-cols-[1fr,1.35fr]')}>
          {captador && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Captador</p>
              <p className="text-sm font-semibold text-gray-900">{captador.nome}</p>
            </div>
          )}

          {/* New structured proposal badge */}
          {proposalData && proposalData.hasActiveProposal && (
            <ProposalStatusBadge
              summary={proposalData}
              onViewProposal={onProposalClick}
            />
          )}

          {/* Legacy proposal summary - for backwards compatibility */}
          {!proposalData && proposalSummary && (
            <button
              type="button"
              onClick={onProposalClick}
              className="group flex w-full flex-col gap-1 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-700">Proposta ativa</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-700">
                  Ver proposta
                  <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
              <p className="text-sm text-gray-800 line-clamp-2">{proposalSummary}</p>
            </button>
          )}
        </div>

        {showProposalDetails && proposalData?.hasActiveProposal && (
          <div className="mt-4 space-y-3 rounded-2xl border border-border bg-muted/50 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Proposta</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-bold text-foreground">{formatMoney(proposalData.proposalValue ?? price)}</p>
                  <ProposalStatusBadge summary={proposalData} compact />
                </div>
                <p className="text-xs text-muted-foreground">
                  {proposalData.activeProposalCount || 1} proposta(s) ativa(s)
                  {proposalData.lastProposalUpdateAt && ` • Última atualização em ${formatProposalDate(proposalData.lastProposalUpdateAt)}`}
                </p>
              </div>
              {onProposalClick && (
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <button
                    type="button"
                    onClick={onProposalClick}
                    className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-border transition hover:bg-muted"
                  >
                    Ver proposta
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  {proposalData.linkedNegotiationId && (
                    <p className="text-[11px] text-muted-foreground">Negociação #{proposalData.linkedNegotiationId}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Proposal Description Block */}
            {proposalData.proposalDescription && (
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Descrição da proposta</p>
                <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                  {proposalData.proposalDescription}
                </p>
              </div>
            )}
          </div>
        )}

        {showOwner && proprietario && (
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
              <span className="text-xs font-medium text-gray-600">
                {maskName(proprietario.nome)}
                {proprietario.telefone && (
                  <>
                    {' '}
                    • {maskPhone(proprietario.telefone)}
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {actions && (
          <div className={cn('flex flex-col sm:flex-row gap-3 mt-6', compact && 'mt-4')}>
            {actions}
          </div>
        )}
      </div>

      {draggableHandle && (
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-full">
          {draggableHandle}
        </div>
      )}
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return '';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: ptBR });
  } catch {
    return '';
  }
}

function formatMoney(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
}

function formatProposalDate(value?: string) {
  if (!value) return 'Atualização recente';
  try {
    return new Date(value).toLocaleDateString('pt-BR');
  } catch {
    return 'Atualização recente';
  }
}

function getProposalStageLabel(stage?: ProposalSummary['proposalStage']) {
  switch (stage) {
    case 'em_negociacao':
      return 'Em negociação';
    case 'reservado':
      return 'Reservado';
    case 'proposta':
      return 'Proposta recebida';
    default:
      return 'Proposta';
  }
}

function maskName(name: string) {
  return name
    .split(' ')
    .map(part => part[0] + '*'.repeat(Math.max(part.length - 1, 0)))
    .join(' ');
}

function maskPhone(phone: string) {
  return phone.replace(/\d(?=\d{4})/g, '*');
}

export default PropertyCard;

