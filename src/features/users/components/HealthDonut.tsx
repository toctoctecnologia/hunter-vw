'use client';

import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { HealthSegment } from '@/features/users/types';
import { cn } from '@/lib/utils';
import {
  ManagementDonut,
  type ManagementDonutDatum,
  MANAGEMENT_DONUT_COLORS
} from '@/components/charts/ManagementDonut';

type HealthDonutDatum = ManagementDonutDatum & { segment: HealthSegment };

interface HealthDonutProps {
  title: string;
  description?: string;
  segments: HealthSegment[];
  updatedAt?: string;
}

const SEGMENT_DEEP_LINK_MAP: Record<string, { href: string; range?: string }> = {
  'em-dia': { href: '/vendas', range: 'em-dia' },
  atencao: { href: '/vendas', range: 'atencao' },
  critico: { href: '/vendas', range: 'critico' },
};

interface SegmentLinkResult {
  to: string | null;
  range?: string;
}

function resolveSegmentLink(segment: HealthSegment): SegmentLinkResult {
  const mappedFromDeepLink = segment.deepLinkId ? SEGMENT_DEEP_LINK_MAP[segment.deepLinkId] : undefined;
  const mappedFromId = SEGMENT_DEEP_LINK_MAP[segment.id];
  const baseHref = segment.href ?? mappedFromDeepLink?.href ?? mappedFromId?.href;
  const fallbackRange = mappedFromDeepLink?.range ?? mappedFromId?.range;
  const rangeValue = segment.range ?? segment.deepLinkId ?? fallbackRange ?? segment.id;

  if (!baseHref) {
    return { to: null, range: rangeValue };
  }

  try {
    const url = new URL(baseHref, 'https://placeholder.local');
    if (rangeValue) {
      url.searchParams.set('range', rangeValue);
    }
    return {
      to: `${url.pathname}${url.search}${url.hash}`,
      range: rangeValue,
    };
  } catch (_error) {
    return { to: null, range: rangeValue };
  }
}

const numberFormatter = new Intl.NumberFormat('pt-BR');

function formatUpdatedAt(updatedAt?: string) {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function HealthDonut({ title, description, segments, updatedAt }: HealthDonutProps) {
  const total = useMemo(() => segments.reduce((acc, segment) => acc + segment.value, 0), [segments]);

  const navigate = useNavigate();

  const donutData = useMemo(
    () =>
      segments.map(segment => {
        const colorToken =
          (
            {
              'em-dia': 'green',
              atencao: 'yellow',
              critico: 'red',
            } as Record<string, keyof typeof MANAGEMENT_DONUT_COLORS>
          )[segment.id] ?? null;

        const color = colorToken ? MANAGEMENT_DONUT_COLORS[colorToken] : segment.color;

        return {
          id: segment.id,
          name: segment.label,
          value: segment.value,
          color,
          configKey: segment.id,
          segment,
        } satisfies HealthDonutDatum;
      }),
    [segments],
  );

  const colorBySegmentId = useMemo(
    () =>
      donutData.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.color;
        return acc;
      }, {}),
    [donutData],
  );

  const formattedUpdatedAt = formatUpdatedAt(updatedAt);

  const handleSliceClick = useCallback(
    (item: HealthDonutDatum) => {
      const link = resolveSegmentLink(item.segment);
      if (link.to) {
        navigate(link.to);
      }
    },
    [navigate],
  );

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
          <ManagementDonut
            data={donutData}
            className="mx-auto h-[200px] w-full max-w-[200px]"
            onSliceClick={handleSliceClick}
            tooltipFormatter={(value, _name, item) => {
              const payload = item?.payload as HealthDonutDatum | undefined;
              if (!payload) return [value, ''];
              const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
              const percentage = total > 0 ? Math.round((numericValue / total) * 100) : 0;
              return [
                `${numberFormatter.format(numericValue)} (${percentage}%)`,
                payload.name,
              ];
            }}
          />
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-semibold text-gray-900">{numberFormatter.format(total)}</p>
              <p className="text-sm text-muted-foreground">Total no período</p>
            </div>
            <div className="space-y-3">
              {segments.map(segment => {
                const percentage = total > 0 ? Math.round((segment.value / total) * 100) : 0;
                const link = resolveSegmentLink(segment);
                const isInteractive = Boolean(link.to);
                const legendClasses = cn(
                  'group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors',
                  isInteractive
                    ? 'cursor-pointer hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                    : 'cursor-default',
                );
                const dotClasses = cn(
                  'mt-1 h-2.5 w-2.5 rounded-full border border-border/40 transition-transform',
                  isInteractive ? 'group-hover:scale-110 group-focus-visible:scale-110' : '',
                );
                const ariaLabel = isInteractive
                  ? `Ver detalhes de ${segment.label} filtrando por ${link.range ?? segment.label}`
                  : undefined;
                const content = (
                  <>
                    <span
                      aria-hidden
                      className={dotClasses}
                      style={{ backgroundColor: colorBySegmentId[segment.id] ?? segment.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{segment.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {numberFormatter.format(segment.value)}
                        <span className="ml-1 text-xs">({percentage}%)</span>
                      </p>
                      {segment.description ? (
                        <p className="text-xs text-muted-foreground/80">{segment.description}</p>
                      ) : null}
                    </div>
                  </>
                );

                return (
                  <div key={segment.id}>
                    {isInteractive ? (
                      <Link to={link.to ?? '#'} className={legendClasses} aria-label={ariaLabel}>
                        {content}
                      </Link>
                    ) : (
                      <div className={legendClasses}>{content}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {formattedUpdatedAt ? (
          <p className="text-xs text-muted-foreground">Atualizado em {formattedUpdatedAt}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default HealthDonut;
