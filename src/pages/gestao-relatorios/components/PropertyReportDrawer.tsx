import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import JSZip from 'jszip'
import { ArrowDownRight, ArrowUpRight, Download, Loader2, Minus, X } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import reportsPropertiesService from '@/services/reportsPropertiesService'
import type {
  PropertyDealRow,
  PropertyInterestedRow,
  PropertyPortalStatus,
  PropertyProposalRow,
  PropertyReportDetail,
  PropertyVisitRow,
  PropertyCartRow,
} from '@/types/reports-properties'
import { useToast } from '@/hooks/use-toast'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

interface PropertyReportDrawerProps {
  open: boolean
  propertyId: number | null
  onClose: () => void
}

interface CsvColumn<T> {
  key: keyof T
  header: string
  transform?: (item: T) => string
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return dateFormatter.format(parsed)
}

function formatDateTime(value?: string | null) {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return dateTimeFormatter.format(parsed)
}

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return '-'
  return currencyFormatter.format(value)
}

function buildCsv<T extends Record<string, unknown>>(items: T[], columns: CsvColumn<T>[]) {
  const header = columns.map(col => `"${col.header}"`).join(';')
  const rows = items.map(item =>
    columns
      .map(col => {
        const rawValue = col.transform ? col.transform(item) : item[col.key]
        const normalized = rawValue === undefined || rawValue === null ? '' : String(rawValue)
        return `"${normalized.replace(/"/g, '""')}"`
      })
      .join(';'),
  )
  return [header, ...rows].join('\n')
}

function PortalStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  let variant: 'success' | 'destructive' | 'secondary' = 'secondary'
  if (normalized.includes('publicado') || normalized.includes('ativo')) {
    variant = 'success'
  } else if (normalized.includes('pendente') || normalized.includes('erro') || normalized.includes('inativo')) {
    variant = 'destructive'
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  )
}

export default function PropertyReportDrawer({ open, propertyId, onClose }: PropertyReportDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<PropertyReportDetail | null>(null)
  const [exporting, setExporting] = useState(false)
  const requestIdRef = useRef(0)
  const { toast } = useToast()

  const fetchDetail = useCallback(
    (id: number) => {
      requestIdRef.current += 1
      const requestId = requestIdRef.current
      setLoading(true)
      setError(null)

      reportsPropertiesService
        .getDetail(id)
        .then(result => {
          if (requestId === requestIdRef.current) {
            setDetail(result)
          }
        })
        .catch(err => {
          if (requestId === requestIdRef.current) {
            console.error(err)
            setError(err?.message ?? 'Não foi possível carregar os dados do relatório do imóvel.')
          }
        })
        .finally(() => {
          if (requestId === requestIdRef.current) {
            setLoading(false)
          }
        })
    },
    [],
  )

  useEffect(() => {
    if (!open) {
      requestIdRef.current += 1
      setDetail(null)
      setError(null)
      setLoading(false)
      return
    }

    if (propertyId) {
      fetchDetail(propertyId)
    }
  }, [open, propertyId, fetchDetail])

  const handleExport = async () => {
    if (!detail) return
    setExporting(true)

    try {
      const zip = new JSZip()
      const fileDate = detail.property.updatedAt ? formatDate(detail.property.updatedAt).replace(/\//g, '-') : 'relatorio'

      const interestedCsv = buildCsv<PropertyInterestedRow>(detail.interested.items, [
        { key: 'name', header: 'Nome' },
        { key: 'email', header: 'E-mail' },
        { key: 'phone', header: 'Telefone' },
        { key: 'status', header: 'Status' },
        { key: 'createdAt', header: 'Criado em', transform: item => formatDateTime(item.createdAt) },
        { key: 'leadId', header: 'Lead ID' },
      ])
      zip.file('interessados.csv', interestedCsv)

      const visitsCsv = buildCsv<PropertyVisitRow>(detail.visits.items, [
        { key: 'visitor', header: 'Visitante' },
        { key: 'broker', header: 'Corretor' },
        { key: 'status', header: 'Status' },
        { key: 'scheduledAt', header: 'Agendado para', transform: item => formatDateTime(item.scheduledAt) },
        { key: 'leadId', header: 'Lead ID' },
      ])
      zip.file('visitas.csv', visitsCsv)

      const cartCsv = buildCsv<PropertyCartRow>(detail.cart.items, [
        { key: 'buyer', header: 'Comprador' },
        { key: 'broker', header: 'Corretor' },
        { key: 'stage', header: 'Etapa' },
        { key: 'createdAt', header: 'Criado em', transform: item => formatDateTime(item.createdAt) },
        { key: 'leadId', header: 'Lead ID' },
      ])
      zip.file('carrinho.csv', cartCsv)

      const proposalsCsv = buildCsv<PropertyProposalRow>(detail.proposals.items, [
        { key: 'buyer', header: 'Comprador' },
        { key: 'broker', header: 'Corretor' },
        { key: 'amount', header: 'Valor', transform: item => formatCurrency(item.amount) },
        { key: 'status', header: 'Status' },
        { key: 'createdAt', header: 'Criado em', transform: item => formatDateTime(item.createdAt) },
        { key: 'leadId', header: 'Lead ID' },
      ])
      zip.file('propostas.csv', proposalsCsv)

      const dealsCsv = buildCsv<PropertyDealRow>(detail.deals.items, [
        { key: 'buyer', header: 'Comprador' },
        { key: 'broker', header: 'Corretor' },
        { key: 'amount', header: 'Valor', transform: item => formatCurrency(item.amount) },
        { key: 'status', header: 'Status' },
        { key: 'closedAt', header: 'Fechado em', transform: item => formatDateTime(item.closedAt) },
        { key: 'leadId', header: 'Lead ID' },
      ])
      zip.file('negocios.csv', dealsCsv)

      const blob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `relatorio-imovel-${detail.property.id}-${fileDate}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      toast({
        title: 'Exportação concluída',
        description: 'Arquivo ZIP com CSVs gerado com sucesso.',
        variant: 'success',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível gerar o arquivo de exportação.',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  const timelineEvents = detail?.timeline ?? []
  const portalStatus = detail?.portals ?? []

  const quickActions = useMemo(() => detail?.quickActions ?? [], [detail?.quickActions])

  const renderTableSection = <T extends { id: string | number }>(
    title: string,
    description: string,
    items: T[],
    columns: { key: keyof T; label: string; render?: (item: T) => ReactNode }[],
    emptyMessage: string,
  ) => (
    <Card key={title}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  {columns.map(col => (
                    <TableHead key={String(col.key)} className="text-gray-700">
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id} className="even:bg-gray-50/60">
                    {columns.map(col => {
                      const cellValue = item[col.key]
                      return (
                        <TableCell key={String(col.key)} className="text-sm text-gray-900">
                          {col.render ? col.render(item) : String(cellValue ?? '-')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const handleDrawerChange = (value: boolean) => {
    if (!value) onClose()
  }

  return (
    <Drawer open={open} onOpenChange={handleDrawerChange}>
      <DrawerContent className="mx-auto w-full max-w-6xl p-0">
        <DrawerHeader className="flex flex-col gap-1 border-b px-6 py-4 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DrawerTitle className="text-2xl font-semibold text-gray-900">
                {detail?.property.title ?? 'Relatório do imóvel'}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-gray-600">
                Código {detail?.property.code ?? propertyId} • {detail?.property.city ?? '---'}
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar detalhes do imóvel">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {detail?.property.status && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge className="capitalize">{detail.property.status}</Badge>
              {detail.property.price && (
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(detail.property.price)}
                </span>
              )}
              {detail.property.responsible?.name && (
                <span className="text-sm text-gray-600">
                  Responsável: {detail.property.responsible.name}
                </span>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {quickActions.map(action => (
              <Button
                key={`${action.label}-${action.href}`}
                variant={action.variant ?? 'outline'}
                asChild
              >
                <a href={action.href} target={action.target ?? '_self'} rel="noreferrer">
                  {action.label}
                </a>
              </Button>
            ))}
            <Button onClick={handleExport} disabled={exporting || !detail} variant="default">
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Exportar CSVs
            </Button>
          </div>
        </DrawerHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 bg-gray-50 px-6 py-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              </div>
            ) : error ? (
              <Card className="border-red-200 bg-red-50/70">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900">Erro ao carregar dados</CardTitle>
                  <CardDescription className="text-sm text-red-700">{error}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => propertyId && fetchDetail(propertyId)}>
                    Tentar novamente
                  </Button>
                </CardContent>
              </Card>
            ) : !detail ? (
              <div className="flex h-64 items-center justify-center text-sm text-gray-500">
                Selecione um imóvel para visualizar os detalhes.
              </div>
            ) : (
              <div className="space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {detail.kpis.map(kpi => {
                    const TrendIcon =
                      kpi.trend?.direction === 'up'
                        ? ArrowUpRight
                        : kpi.trend?.direction === 'down'
                        ? ArrowDownRight
                        : Minus
                    return (
                      <Card key={kpi.id} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <CardDescription className="text-sm text-gray-500">{kpi.label}</CardDescription>
                          <CardTitle className="text-2xl font-semibold text-gray-900">{kpi.value}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between text-sm text-gray-600">
                          <span>{kpi.helperText}</span>
                          {kpi.trend && (
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                kpi.trend.direction === 'up'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : kpi.trend.direction === 'down'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-gray-100 text-gray-600',
                              )}
                            >
                              <TrendIcon className="h-3.5 w-3.5" />
                              {kpi.trend.value}
                            </span>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                  {detail.summary.map(section => (
                    <Card key={section.id} className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-3">
                          {section.items.map(item => (
                            <div key={item.label} className="flex flex-col">
                              <dt className="text-sm text-gray-500">{item.label}</dt>
                              <dd className="text-base font-medium text-gray-900">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Linha do tempo</CardTitle>
                      <CardDescription>Acompanhe os principais eventos relacionados ao imóvel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {timelineEvents.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum evento registrado até o momento.</p>
                      ) : (
                        <div className="space-y-6">
                          {timelineEvents.map(event => (
                            <div key={event.id} className="flex gap-3">
                              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                                {event.description && (
                                  <p className="text-sm text-gray-600">{event.description}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                  {formatDateTime(event.createdAt)}
                                  {event.actor ? ` • ${event.actor}` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {renderTableSection<PropertyInterestedRow>(
                  'Interessados',
                  `${detail.interested.pagination.total} cadastros`,
                  detail.interested.items,
                  [
                    { key: 'name', label: 'Nome' },
                    { key: 'email', label: 'E-mail' },
                    { key: 'phone', label: 'Telefone' },
                    { key: 'status', label: 'Status' },
                    {
                      key: 'createdAt',
                      label: 'Criado em',
                      render: item => formatDateTime(item.createdAt),
                    },
                    {
                      key: 'leadId',
                      label: 'Lead',
                      render: item =>
                        item.leadId ? (
                          <Button variant="link" asChild className="px-0">
                            <a href={`/leads/${item.leadId}`}>Abrir lead</a>
                          </Button>
                        ) : (
                          '-'
                        ),
                    },
                  ],
                  'Nenhum interessado encontrado para este período.',
                )}

                {renderTableSection<PropertyVisitRow>(
                  'Visitas',
                  `${detail.visits.pagination.total} registros`,
                  detail.visits.items,
                  [
                    { key: 'visitor', label: 'Visitante' },
                    { key: 'broker', label: 'Corretor' },
                    { key: 'status', label: 'Status' },
                    {
                      key: 'scheduledAt',
                      label: 'Agendada',
                      render: item => formatDateTime(item.scheduledAt),
                    },
                    {
                      key: 'leadId',
                      label: 'Lead',
                      render: item =>
                        item.leadId ? (
                          <Button variant="link" asChild className="px-0">
                            <a href={`/leads/${item.leadId}`}>Abrir lead</a>
                          </Button>
                        ) : (
                          '-'
                        ),
                    },
                  ],
                  'Nenhuma visita agendada para este imóvel.',
                )}

                {renderTableSection<PropertyCartRow>(
                  'Carrinho',
                  `${detail.cart.pagination.total} oportunidades`,
                  detail.cart.items,
                  [
                    { key: 'buyer', label: 'Comprador' },
                    { key: 'broker', label: 'Corretor' },
                    { key: 'stage', label: 'Etapa' },
                    {
                      key: 'createdAt',
                      label: 'Criado em',
                      render: item => formatDateTime(item.createdAt),
                    },
                    {
                      key: 'leadId',
                      label: 'Lead',
                      render: item =>
                        item.leadId ? (
                          <Button variant="link" asChild className="px-0">
                            <a href={`/leads/${item.leadId}`}>Abrir lead</a>
                          </Button>
                        ) : (
                          '-'
                        ),
                    },
                  ],
                  'Nenhuma oportunidade de carrinho vinculada a este imóvel.',
                )}

                {renderTableSection<PropertyProposalRow>(
                  'Propostas',
                  `${detail.proposals.pagination.total} propostas`,
                  detail.proposals.items,
                  [
                    { key: 'buyer', label: 'Comprador' },
                    { key: 'broker', label: 'Corretor' },
                    {
                      key: 'amount',
                      label: 'Valor',
                      render: item => formatCurrency(item.amount),
                    },
                    { key: 'status', label: 'Status' },
                    {
                      key: 'createdAt',
                      label: 'Criado em',
                      render: item => formatDateTime(item.createdAt),
                    },
                    {
                      key: 'leadId',
                      label: 'Lead',
                      render: item =>
                        item.leadId ? (
                          <Button variant="link" asChild className="px-0">
                            <a href={`/leads/${item.leadId}`}>Abrir lead</a>
                          </Button>
                        ) : (
                          '-'
                        ),
                    },
                  ],
                  'Nenhuma proposta registrada.',
                )}

                {renderTableSection<PropertyDealRow>(
                  'Negócios',
                  `${detail.deals.pagination.total} negócios`,
                  detail.deals.items,
                  [
                    { key: 'buyer', label: 'Comprador' },
                    { key: 'broker', label: 'Corretor' },
                    {
                      key: 'amount',
                      label: 'Valor',
                      render: item => formatCurrency(item.amount),
                    },
                    { key: 'status', label: 'Status' },
                    {
                      key: 'closedAt',
                      label: 'Fechado em',
                      render: item => formatDateTime(item.closedAt),
                    },
                    {
                      key: 'leadId',
                      label: 'Lead',
                      render: item =>
                        item.leadId ? (
                          <Button variant="link" asChild className="px-0">
                            <a href={`/leads/${item.leadId}`}>Abrir lead</a>
                          </Button>
                        ) : (
                          '-'
                        ),
                    },
                  ],
                  'Nenhum negócio fechado ainda.',
                )}

                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Espelho de portais</CardTitle>
                      <CardDescription>Monitore a situação do anúncio nos principais portais.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {portalStatus.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum portal configurado para este imóvel.</p>
                      ) : (
                        <div className="space-y-4">
                          {portalStatus.map((portal: PropertyPortalStatus) => (
                            <div
                              key={`${portal.portal}-${portal.status}`}
                              className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-900">{portal.portal}</p>
                                  {portal.link && (
                                    <a
                                      href={portal.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-orange-600 hover:underline"
                                    >
                                      Abrir no portal
                                    </a>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1 text-right">
                                  <PortalStatusBadge status={portal.status} />
                                  {portal.lastSync && (
                                    <span className="text-xs text-gray-500">
                                      Atualizado em {formatDateTime(portal.lastSync)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {portal.notes && (
                                <Separator className="my-3" />
                              )}
                              {portal.notes && (
                                <p className="text-xs text-gray-600">{portal.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>
              </div>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
