'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { Period, PeriodRange, RoletaoKPIs, RoletaoPresetPeriod } from '@/features/users/types';

interface RoletaoKpisProps {
  title?: string;
  description?: string;
  data: RoletaoKPIs;
  period: Period;
  updatedAt?: string;
  onChangePeriod: (period: Period) => void;
}

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('pt-BR');
const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const presetOptions: Array<{ value: RoletaoPresetPeriod; label: string }> = [
  { value: '7d', label: '7d' },
  { value: '15d', label: '15d' },
  { value: '30d', label: '30d' },
];

const presetDescriptions: Record<RoletaoPresetPeriod, string> = {
  '7d': 'últimos 7 dias',
  '15d': 'últimos 15 dias',
  '30d': 'últimos 30 dias',
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

type SegmentedValue = RoletaoPresetPeriod | 'custom';

function formatUpdatedAt(updatedAt?: string) {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatCustomRange(range: PeriodRange | null | undefined): string {
  if (!range) return 'período personalizado';
  const start = new Date(range.start);
  const end = new Date(range.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'período personalizado';
  }
  return `de ${dateFormatter.format(start)} a ${dateFormatter.format(end)}`;
}

function getPeriodDescription(period: Period, fallback: RoletaoPresetPeriod): string {
  if (period.type === 'custom') {
    return formatCustomRange(period.range);
  }
  return presetDescriptions[period.type] ?? presetDescriptions[fallback];
}

function resolveMetrics(data: RoletaoKPIs, period: Period) {
  const fallback = data.periods[data.defaultPeriod] ?? Object.values(data.periods)[0];
  if (period.type === 'custom') {
    return data.custom?.metrics ?? fallback;
  }
  return data.periods[period.type] ?? fallback;
}

export function RoletaoKpis({
  title = 'Roletão',
  description = 'Saúde do funil de distribuição automática',
  data,
  period,
  updatedAt,
  onChangePeriod,
}: RoletaoKpisProps) {
  const formattedUpdatedAt = formatUpdatedAt(updatedAt);
  const [selectedSegment, setSelectedSegment] = useState<SegmentedValue>(
    period.type === 'custom' ? 'custom' : period.type,
  );
  const [rangePickerOpen, setRangePickerOpen] = useState(false);

  useEffect(() => {
    setSelectedSegment(period.type === 'custom' ? 'custom' : period.type);
  }, [period]);

  const metrics = useMemo(() => resolveMetrics(data, period), [data, period]);
  const periodDescription = getPeriodDescription(period, data.defaultPeriod);

  const detailsHref = useMemo(() => {
    const params = new URLSearchParams({
      source: 'roletao',
      owner: ':usuarioId',
    });
    if (period.type === 'custom') {
      params.set('period', 'custom');
      params.set('start', period.range.start);
      params.set('end', period.range.end);
    } else {
      params.set('period', period.type);
    }
    return `/vendas/lista?${params.toString()}`;
  }, [period]);

  const handleSegmentChange = (value: string) => {
    if (!value) return;
    if (value === 'custom') {
      setSelectedSegment('custom');
      setRangePickerOpen(true);
      return;
    }

    const preset = value as RoletaoPresetPeriod;
    setSelectedSegment(preset);
    if (period.type !== preset) {
      onChangePeriod({ type: preset });
    }
  };

  const handleRangePickerChange = (open: boolean) => {
    setRangePickerOpen(open);
    if (!open) {
      setSelectedSegment(period.type === 'custom' ? 'custom' : period.type);
    }
  };

  const handleCustomRangeSelect = (range: PeriodRange) => {
    setRangePickerOpen(false);
    onChangePeriod({ type: 'custom', range });
  };

  const customRange = period.type === 'custom' ? period.range : data.custom?.range ?? null;

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <ToggleGroup
          type="single"
          value={selectedSegment}
          onValueChange={handleSegmentChange}
          className="w-full justify-start"
        >
          {presetOptions.map(option => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              variant="outline"
              size="sm"
              className="rounded-full px-3"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
          <ToggleGroupItem
            value="custom"
            variant="outline"
            size="sm"
            className="rounded-full px-3"
          >
            Data
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 shadow-inner">
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Leads PEGOS no roletão ({periodDescription})
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {numberFormatter.format(metrics.banner.claimed)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {numberFormatter.format(metrics.banner.awaitingToday)} aguardando avanço hoje
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link to={detailsHref}>Ver detalhes</Link>
          </Button>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tempo médio para avançar</dt>
            <dd className="mt-2 text-2xl font-semibold text-gray-900">{metrics.avgAdvanceTime} min</dd>
            <dd className="text-xs text-muted-foreground">Meta: até 10 minutos</dd>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Taxa de conversão</dt>
            <dd className="mt-2 text-2xl font-semibold text-gray-900">{percentFormatter.format(metrics.convRate)}</dd>
            <dd className="text-xs text-muted-foreground">Leads que viram oportunidades</dd>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Participação ativa</dt>
            <dd className="mt-2 text-2xl font-semibold text-gray-900">{percentFormatter.format(metrics.activeParticipation)}</dd>
            <dd className="text-xs text-muted-foreground">Corretores que pegaram ao menos 1 lead</dd>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Claims por dia</dt>
            <dd className="mt-2 text-2xl font-semibold text-gray-900">{decimalFormatter.format(metrics.claimsPerDay)}</dd>
            <dd className="text-xs text-muted-foreground">Média considerando o período selecionado</dd>
          </div>
        </dl>
        {formattedUpdatedAt ? (
          <p className="text-xs text-muted-foreground">Atualizado em {formattedUpdatedAt}</p>
        ) : null}
      </CardContent>
      <DateRangePicker
        open={rangePickerOpen}
        onOpenChange={handleRangePickerChange}
        initialRange={customRange ?? undefined}
        onSelect={handleCustomRangeSelect}
      />
    </Card>
  );
}

export default RoletaoKpis;
