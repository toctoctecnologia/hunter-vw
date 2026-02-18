import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarDays,
  Clock3,
  Download,
  FileText,
  FileWarning,
  Landmark,
  Users,
} from 'lucide-react';

import type { LeadDeal } from '@/api/deals';
import { PropertyCard } from '@/components/imoveis/PropertyCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const safeFormatDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return format(parsed, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const kindBadge: Record<LeadDeal['kind'], { label: string; className: string }> = {
  sale: {
    label: 'Negócio ganho',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  won: {
    label: 'Negócio ganho',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  proposal_sale: {
    label: 'Proposta de venda',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  proposal_rent: {
    label: 'Proposta de locação',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
};

const defaultStatusBadge = {
  label: 'Status indefinido',
  className: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusBadge: Record<LeadDeal['status'], { label: string; className: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  negotiating: {
    label: 'Em negociação',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  sent: {
    label: 'Proposta enviada',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  approved: {
    label: 'Proposta aprovada',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Proposta recusada',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  won: {
    label: 'Negócio ganho',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  lost: {
    label: 'Negócio perdido',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

const eventIcon: Record<LeadDeal['timeline'][number]['kind'], JSX.Element> = {
  interaction: <Users className="h-4 w-4 text-blue-500" />,
  document: <FileText className="h-4 w-4 text-purple-500" />,
  milestone: <Landmark className="h-4 w-4 text-emerald-500" />,
};

const isProposalKind = (kind: LeadDeal['kind']) => kind === 'proposal_sale' || kind === 'proposal_rent';

const formatCommissionBase = (deal: LeadDeal) => {
  if (typeof deal.commissionBase === 'number') return deal.commissionBase;
  if (typeof deal.commissionPercentage === 'number') {
    return Number(((deal.amount * deal.commissionPercentage) / 100).toFixed(2));
  }
  return undefined;
};

export interface DealDrawerProps {
  open: boolean;
  deal: LeadDeal | null;
  onClose: () => void;
  onEdit?: (deal: LeadDeal) => void;
  onDelete?: (deal: LeadDeal) => void | Promise<void>;
  isDeleting?: boolean;
}

export function DealDrawer({
  open,
  deal,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: DealDrawerProps) {
  const handleOpenChange = (value: boolean) => {
    if (!value) onClose();
  };

  const commissionValue = deal ? formatCommissionBase(deal) : undefined;
  const commissionBase = deal
    ? typeof deal.commissionBase === 'number'
      ? deal.commissionBase
      : deal.amount
    : undefined;
  const updatedDistance = deal
    ? formatDistanceToNow(new Date(deal.updatedAt), { locale: ptBR, addSuffix: true })
    : null;
  const status = deal
    ? statusBadge[deal.status] ?? { ...defaultStatusBadge, label: deal.status }
    : defaultStatusBadge;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        {deal ? (
          <div className="flex h-full flex-col">
            <DrawerHeader className="px-6 pb-4 text-left">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={kindBadge[deal.kind].className}>
                      {kindBadge[deal.kind].label}
                    </Badge>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                  <DrawerTitle className="text-xl font-semibold text-gray-900">
                    {deal.title}
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-muted-foreground">
                    Atualizado {updatedDistance ?? '—'}
                  </DrawerDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Valor do negócio
                  </span>
                  <span className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(deal.amount)}
                  </span>
                  {deal.closedAt && (
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" /> {safeFormatDate(deal.closedAt)}
                    </span>
                  )}
                </div>
              </div>
            </DrawerHeader>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-8 pb-8">
                <section className="grid gap-4 lg:grid-cols-[380px_1fr]">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">Imóvel relacionado</h3>
                    {deal.property ? (
                      <PropertyCard
                        compact
                        id={Number(deal.property.id) || 0}
                        code={deal.property.code}
                        title={deal.property.title}
                        type={deal.property.type}
                        city={deal.property.city}
                        price={typeof deal.property.price === 'number' ? deal.property.price : Number(deal.property.price) || 0}
                        area={deal.property.area}
                        beds={deal.property.beds}
                        baths={deal.property.baths}
                        parking={deal.property.parking}
                        coverUrl={deal.property.coverUrl}
                      />
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-muted-foreground">
                        Nenhum imóvel vinculado a este registro.
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Comissão prevista
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          {commissionValue != null ? formatCurrency(commissionValue) : '—'}
                        </p>
                        {typeof deal.commissionPercentage === 'number' && (
                          <p className="text-xs text-muted-foreground">
                            Percentual: {deal.commissionPercentage.toFixed(2)}%
                          </p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Base da comissão
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          {commissionBase != null ? formatCurrency(commissionBase) : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">Referência para divisão entre participantes.</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Interessado
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {deal.buyerName ?? '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Proprietário
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {deal.sellerName ?? '—'}
                        </p>
                      </div>
                      {deal.paymentMethod && (
                        <div>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Forma de pagamento
                          </span>
                          <p className="text-sm font-medium text-gray-900">{deal.paymentMethod}</p>
                        </div>
                      )}
                      {isProposalKind(deal.kind) && (
                        <div>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Enviada em
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {safeFormatDate(deal.proposalSentAt)}
                          </p>
                        </div>
                      )}
                      {isProposalKind(deal.kind) && (
                        <div>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Validade da proposta
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {safeFormatDate(deal.proposalValidUntil)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Participantes</h3>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      {deal.participants.length} envolvidos
                    </Badge>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 bg-gray-50 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <span>Responsável</span>
                      <span className="text-right">Percentual</span>
                      <span className="text-right">Valor</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {deal.participants.map(participant => (
                        <div key={participant.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 px-5 py-4 text-sm">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {participant.role ? participant.role : 'Sem função definida'}
                            </p>
                          </div>
                          <span className="text-right text-sm font-medium text-gray-900">
                            {participant.percent.toFixed(2)}%
                          </span>
                          <span className="text-right text-sm font-medium text-gray-900">
                            {formatCurrency(participant.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Linha do tempo</h3>
                  </div>
                  {deal.timeline.length ? (
                    <div className="space-y-3">
                      {deal.timeline.map(event => (
                        <div
                          key={event.id}
                          className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                          <div className="rounded-full bg-gray-100 p-2">{eventIcon[event.kind]}</div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">{safeFormatDate(event.date)}</p>
                            <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-muted-foreground">
                      Nenhum evento registrado na linha do tempo.
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Documentos</h3>
                  </div>
                  {deal.documents.length ? (
                    <div className="grid gap-2">
                      {deal.documents.map(document => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{document.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Enviado por {document.uploadedBy ?? 'Equipe'} em {safeFormatDate(document.uploadedAt)}
                            </p>
                          </div>
                          <Button type="button" size="sm" variant="outline" disabled>
                            <Download className="mr-2 h-4 w-4" /> Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-muted-foreground">
                      <FileWarning className="h-4 w-4" /> Nenhum documento anexado ainda.
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Notas internas</h3>
                  <p className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700 shadow-sm">
                    {deal.notes ?? 'Nenhuma anotação registrada.'}
                  </p>
                </section>
              </div>
            </ScrollArea>

            <DrawerFooter className="border-t border-gray-100 bg-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" disabled>
                    <CalendarDays className="mr-2 h-4 w-4" /> Agendar follow-up (em breve)
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled>
                    <FileText className="mr-2 h-4 w-4" /> Gerar resumo (em breve)
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {onDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onDelete(deal)}
                      disabled={isDeleting}
                    >
                      Excluir
                    </Button>
                  )}
                  {onEdit && (
                    <Button type="button" onClick={() => onEdit(deal)}>
                      Editar negócio
                    </Button>
                  )}
                </div>
              </div>
            </DrawerFooter>
          </div>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Selecione um negócio para visualizar os detalhes.</div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
