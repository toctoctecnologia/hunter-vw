import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import {
  Line as RechartsLine,
  LineChart as RechartsLineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PropertiesAggregateMetric, PropertiesAggregates } from '@/types/reports-properties'

interface PropertiesAggregatesSummaryProps {
  data: PropertiesAggregates | null
  loading: boolean
  error: string | null
  onRetry?: () => void
}

const numberFormatter = new Intl.NumberFormat('pt-BR')
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

function formatMetricValue(metric: PropertiesAggregateMetric) {
  if (metric.format === 'currency') {
    return currencyFormatter.format(metric.value)
  }
  if (metric.format === 'percentage') {
    return `${metric.value.toFixed(1)}%`
  }
  return numberFormatter.format(metric.value)
}

function resolveHelperText(
  metric: PropertiesAggregateMetric,
  totals: PropertiesAggregates['totals'],
) {
  if (metric.id === 'deals' && totals.dealsVolume) {
    return `Volume negociado: ${currencyFormatter.format(totals.dealsVolume)}`
  }
  return metric.helperText ?? null
}

function resolveChange(metric: PropertiesAggregateMetric) {
  if (!metric.change) return null
  if (metric.change.label) return metric.change.label
  if (typeof metric.change.value === 'number') {
    const value = metric.change.value
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }
  return null
}

function resolveChangeIcon(metric: PropertiesAggregateMetric) {
  if (!metric.change) return null
  switch (metric.change.type) {
    case 'increase':
      return <ArrowUpRight className="h-4 w-4 text-emerald-600" aria-hidden />
    case 'decrease':
      return <ArrowDownRight className="h-4 w-4 text-red-600" aria-hidden />
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden />
  }
}

function resolveChangeClasses(metric: PropertiesAggregateMetric) {
  if (!metric.change) return 'text-muted-foreground'
  switch (metric.change.type) {
    case 'increase':
      return 'text-emerald-600'
    case 'decrease':
      return 'text-red-600'
    default:
      return 'text-muted-foreground'
  }
}

function formatDateLabel(value?: string) {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('pt-BR')
}

function formatPeriod(period?: PropertiesAggregates['period']) {
  if (!period) return null
  const fromLabel = formatDateLabel(period.from)
  const toLabel = formatDateLabel(period.to)
  if (period.label && fromLabel && toLabel) {
    return `${period.label} (${fromLabel} - ${toLabel})`
  }
  if (period.label) return period.label
  if (fromLabel && toLabel) {
    return `${fromLabel} - ${toLabel}`
  }
  if (fromLabel) {
    return `Desde ${fromLabel}`
  }
  if (toLabel) {
    return `Até ${toLabel}`
  }
  return null
}

function buildChartData(series: PropertiesAggregates['series']) {
  return series.map(point => {
    const parsed = new Date(point.date)
    const isValid = !Number.isNaN(parsed.getTime())
    return {
      date: isValid
        ? parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        : point.date,
      tooltip: isValid ? parsed.toLocaleDateString('pt-BR') : point.date,
      visits: point.visits,
      proposals: point.proposals,
    }
  })
}

export default function PropertiesAggregatesSummary({
  data,
  loading,
  error,
  onRetry,
}: PropertiesAggregatesSummaryProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col gap-3 p-6 text-red-700">
          <div className="font-medium">{error}</div>
          {onRetry && (
            <div>
              <Button variant="outline" size="sm" onClick={onRetry}>
                Tentar novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const metrics = data?.metrics ?? []
  const totals = data?.totals ?? {
    properties: 0,
    active: 0,
    published: 0,
    interested: 0,
    visits: 0,
    proposals: 0,
    deals: 0,
    dealsVolume: 0,
  }

  if (!metrics.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-sm text-muted-foreground">
          {data?.message ?? 'Não há dados disponíveis para o período selecionado.'}
          {onRetry && (
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={onRetry}>
                Recarregar indicadores
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const periodText = formatPeriod(data?.period)
  const chartData = buildChartData(data?.series ?? [])
  const hasChart = chartData.some(point => (point.visits ?? 0) > 0 || (point.proposals ?? 0) > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Indicadores dos imóveis</h2>
          <p className="text-sm text-muted-foreground">
            {periodText ?? `Total considerado: ${numberFormatter.format(totals.properties)} imóveis`}
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Atualizar indicadores
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map(metric => {
          const helperText = resolveHelperText(metric, totals)
          const changeText = resolveChange(metric)
          const changeIcon = resolveChangeIcon(metric)
          return (
            <Card key={metric.id} className="border border-gray-200 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                <div className="text-3xl font-semibold text-gray-900">
                  {formatMetricValue(metric)}
                </div>
                {(helperText || changeText) && (
                  <div className="flex items-center gap-2 text-xs">
                    {helperText && <span className="text-muted-foreground">{helperText}</span>}
                    {changeText && (
                      <span className={`flex items-center gap-1 ${resolveChangeClasses(metric)}`}>
                        {changeIcon}
                        {changeText}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {hasChart && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              Evolução de visitas e propostas por dia
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData} margin={{ top: 8, left: 4, right: 16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip
                  formatter={value => numberFormatter.format(value as number)}
                  labelFormatter={(label, payload) => (payload?.[0]?.payload?.tooltip as string) ?? String(label)}
                />
                <Legend />
                <RechartsLine
                  type="monotone"
                  dataKey="visits"
                  name="Visitas"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <RechartsLine
                  type="monotone"
                  dataKey="proposals"
                  name="Propostas"
                  stroke="hsl(var(--accentSoft))"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
