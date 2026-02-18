import { useMemo, useState } from 'react';
import { Clock3, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface QualificationThresholds {
  recentMax: number;
  attentionMin: number;
  attentionMax: number;
  urgentMin: number;
}

interface QualificationManagementWidgetProps {
  title: string;
  entityLabel: string;
  itemLabel: string;
  storageKey: string;
  data: Array<{ id: string; name: string; daysWithoutUpdate: number }>;
}

const DEFAULT_THRESHOLDS: QualificationThresholds = {
  recentMax: 25,
  attentionMin: 26,
  attentionMax: 30,
  urgentMin: 31,
};

const STATUS_META = {
  recent: {
    label: 'Recente',
    color: '#22c55e',
    subtitle: 'Atualização recente',
  },
  attention: {
    label: 'Atenção',
    color: '#eab308',
    subtitle: 'Precisa de acompanhamento',
  },
  urgent: {
    label: 'Urgente',
    color: '#ef4444',
    subtitle: 'Acima do prazo crítico',
  },
} as const;

const readThresholds = (storageKey: string): QualificationThresholds => {
  if (typeof window === 'undefined') return DEFAULT_THRESHOLDS;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return DEFAULT_THRESHOLDS;

  try {
    const parsed = JSON.parse(raw) as Partial<QualificationThresholds>;
    if (
      typeof parsed.recentMax !== 'number'
      || typeof parsed.attentionMin !== 'number'
      || typeof parsed.attentionMax !== 'number'
      || typeof parsed.urgentMin !== 'number'
    ) {
      return DEFAULT_THRESHOLDS;
    }

    return parsed as QualificationThresholds;
  } catch {
    return DEFAULT_THRESHOLDS;
  }
};

const normalizeThresholds = (thresholds: QualificationThresholds): QualificationThresholds => {
  const recentMax = Math.max(1, thresholds.recentMax);
  const attentionMin = Math.max(recentMax + 1, thresholds.attentionMin);
  const attentionMax = Math.max(attentionMin, thresholds.attentionMax);
  const urgentMin = Math.max(attentionMax + 1, thresholds.urgentMin);

  return {
    recentMax,
    attentionMin,
    attentionMax,
    urgentMin,
  };
};

export const QualificationManagementWidget = ({
  title,
  entityLabel,
  itemLabel,
  storageKey,
  data,
}: QualificationManagementWidgetProps) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [thresholds, setThresholds] = useState<QualificationThresholds>(() => readThresholds(storageKey));
  const [draftThresholds, setDraftThresholds] = useState<QualificationThresholds>(thresholds);

  const summary = useMemo(() => {
    const normalized = normalizeThresholds(thresholds);

    const counts = data.reduce(
      (acc, current) => {
        if (current.daysWithoutUpdate <= normalized.recentMax) {
          acc.recent += 1;
        } else if (
          current.daysWithoutUpdate >= normalized.attentionMin
          && current.daysWithoutUpdate <= normalized.attentionMax
        ) {
          acc.attention += 1;
        } else {
          acc.urgent += 1;
        }
        return acc;
      },
      { recent: 0, attention: 0, urgent: 0 }
    );

    const total = data.length;

    return {
      total,
      counts,
      percentages: {
        recent: total ? (counts.recent / total) * 100 : 0,
        attention: total ? (counts.attention / total) * 100 : 0,
        urgent: total ? (counts.urgent / total) * 100 : 0,
      },
      normalized,
    };
  }, [data, thresholds]);

  const handleOpenConfig = () => {
    setDraftThresholds(summary.normalized);
    setIsConfigOpen(true);
  };

  const handleSave = () => {
    const normalized = normalizeThresholds(draftThresholds);
    setThresholds(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(normalized));
    }
    setIsConfigOpen(false);
  };

  const chartData = [
    { name: 'Recente', value: summary.counts.recent, color: STATUS_META.recent.color },
    { name: 'Atenção', value: summary.counts.attention, color: STATUS_META.attention.color },
    { name: 'Urgente', value: summary.counts.urgent, color: STATUS_META.urgent.color },
  ];

  return (
    <>
      <Card className="h-full border-border bg-[var(--ui-card)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <Clock3 className="h-5 w-5" />
              {title}
            </CardTitle>
            <Button type="button" variant="outline" size="icon" className="rounded-xl" onClick={handleOpenConfig}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 rounded-2xl border border-border bg-background p-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
            <div className="h-[190px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none">
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {(['recent', 'attention', 'urgent'] as const).map((status) => {
                const meta = STATUS_META[status];
                return (
                  <div key={status} className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: meta.color }} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                        <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{summary.percentages[status].toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background px-4 py-4 text-center">
            <p className="text-3xl font-bold text-foreground">{summary.total}</p>
            <p className="text-sm text-muted-foreground">{itemLabel}</p>
          </div>

          <Button className="w-full" variant="default">
            Ver {entityLabel}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5" />
              Configurar Tempos de Qualificação
            </DialogTitle>
            <DialogDescription>
              Configure os intervalos de dias para classificar {entityLabel.toLowerCase()} como Recente, Atenção ou Urgente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border p-4 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#22c55e]" />Recente</p>
              <label className="text-sm text-foreground">Até quantos dias?</label>
              <Input
                type="number"
                min={1}
                value={draftThresholds.recentMax}
                onChange={(event) => setDraftThresholds((prev) => ({ ...prev, recentMax: Number(event.target.value || 0) }))}
              />
            </div>

            <div className="rounded-2xl border border-border p-4 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#eab308]" />Atenção</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-foreground">De (dias)</label>
                  <Input
                    type="number"
                    min={1}
                    value={draftThresholds.attentionMin}
                    onChange={(event) => setDraftThresholds((prev) => ({ ...prev, attentionMin: Number(event.target.value || 0) }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Até (dias)</label>
                  <Input
                    type="number"
                    min={1}
                    value={draftThresholds.attentionMax}
                    onChange={(event) => setDraftThresholds((prev) => ({ ...prev, attentionMax: Number(event.target.value || 0) }))}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-4 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#ef4444]" />Urgente</p>
              <label className="text-sm text-foreground">A partir de quantos dias?</label>
              <Input
                type="number"
                min={1}
                value={draftThresholds.urgentMin}
                onChange={(event) => setDraftThresholds((prev) => ({ ...prev, urgentMin: Number(event.target.value || 0) }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QualificationManagementWidget;
