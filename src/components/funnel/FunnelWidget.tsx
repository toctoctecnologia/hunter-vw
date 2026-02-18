import { useEffect, useMemo, useState } from 'react';
import { Pencil, Target, Trash2 } from 'lucide-react';
import type { DashboardContext, FunnelResponse, FunnelStage } from '@/types/dashboard';
import { getFunnelData } from '@/services/funnelService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FunnelWidgetProps {
  context: DashboardContext;
}

interface FunnelCustomization {
  labels: Record<string, string>;
  hiddenStageIds: string[];
  metas: Record<string, string>;
}

const CUSTOMIZATION_STORAGE_PREFIX = 'hunter:funnel:customizacao';

const FUNNEL_BASE_STYLE =
  'polygon(14% 0, 86% 0, 78% 42%, 100% 42%, 100% 58%, 78% 58%, 86% 100%, 14% 100%, 22% 58%, 0 58%, 0 42%, 22% 42%)';

const readCustomization = (context: DashboardContext): FunnelCustomization => {
  if (typeof window === 'undefined') return { labels: {}, hiddenStageIds: [], metas: {} };
  const raw = window.localStorage.getItem(`${CUSTOMIZATION_STORAGE_PREFIX}:${context}`);
  if (!raw) return { labels: {}, hiddenStageIds: [], metas: {} };
  try {
    const parsed = JSON.parse(raw) as FunnelCustomization;
    return {
      labels: parsed.labels ?? {},
      hiddenStageIds: parsed.hiddenStageIds ?? [],
      metas: parsed.metas ?? {},
    };
  } catch {
    return { labels: {}, hiddenStageIds: [], metas: {} };
  }
};

const saveCustomization = (context: DashboardContext, customization: FunnelCustomization) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${CUSTOMIZATION_STORAGE_PREFIX}:${context}`, JSON.stringify(customization));
};

const formatRate = (value: number | null) => {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) return '-';
  return `${Math.round(value)}%`;
};

const FunnelWidget = ({ context }: FunnelWidgetProps) => {
  const [data, setData] = useState<FunnelResponse | null>(null);
  const [customization, setCustomization] = useState<FunnelCustomization>(() => readCustomization(context));
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState('');
  const [editingMetaStageId, setEditingMetaStageId] = useState<string | null>(null);
  const [draftMeta, setDraftMeta] = useState('');

  useEffect(() => {
    let isMounted = true;
    getFunnelData({ funnelType: 'financeiro' }).then((response) => {
      if (isMounted) setData(response);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const stages = useMemo(() => {
    const responseStages = data?.stages ?? [];
    if (!responseStages.length) return [];

    const hiddenIds = new Set(customization.hiddenStageIds);
    const visibleIndexes = responseStages
      .map((stage, index) => ({ stage, index }))
      .filter(({ stage }) => !hiddenIds.has(stage.id))
      .map(({ index }) => index);

    if (!visibleIndexes.length) return [];

    const stageValues = responseStages.map((stage) => stage.value);

    responseStages.forEach((stage, index) => {
      if (!hiddenIds.has(stage.id)) return;

      const nextVisibleIndex = visibleIndexes.find((visibleIndex) => visibleIndex > index);
      const fallbackClosedIndex = responseStages.findIndex(
        (candidate) => candidate.id === 'negocio-fechado' && !hiddenIds.has(candidate.id),
      );
      const targetIndex = nextVisibleIndex ?? fallbackClosedIndex;

      if (targetIndex !== undefined && targetIndex >= 0) {
        stageValues[targetIndex] += stageValues[index];
      }
    });

    const totalLeads = Math.max(responseStages[0]?.value ?? 0, 1);

    return responseStages
      .filter((stage) => !hiddenIds.has(stage.id))
      .map((stage, index, visibleStages) => {
        const originalIndex = responseStages.findIndex((candidate) => candidate.id === stage.id);
        const value = stageValues[originalIndex] ?? 0;
        const nextStage = visibleStages[index + 1];
        const nextIndex = nextStage
          ? responseStages.findIndex((candidate) => candidate.id === nextStage.id)
          : -1;
        const nextValue = nextIndex >= 0 ? stageValues[nextIndex] : null;

        return {
          ...stage,
          label: customization.labels[stage.id] ?? stage.label,
          value,
          percent: Math.round((value / totalLeads) * 100),
          averageRate: nextValue === null || value === 0 ? null : (nextValue / value) * 100,
        };
      });
  }, [customization.hiddenStageIds, customization.labels, data?.stages]);

  const startEdit = (stage: FunnelStage) => {
    setEditingStageId(stage.id);
    setDraftLabel(stage.label);
  };

  const applyLabel = (stageId: string) => {
    const next = {
      ...customization,
      labels: {
        ...customization.labels,
        [stageId]: draftLabel.trim() || 'Etapa sem nome',
      },
    };
    setCustomization(next);
    saveCustomization(context, next);
    setEditingStageId(null);
  };

  const removeStage = (stageId: string) => {
    const next = {
      ...customization,
      hiddenStageIds: Array.from(new Set([...customization.hiddenStageIds, stageId])),
    };
    setCustomization(next);
    saveCustomization(context, next);
  };

  const startMetaEdit = (stageId: string) => {
    setEditingMetaStageId(stageId);
    setDraftMeta(customization.metas[stageId] ?? '');
  };

  const applyMeta = (stageId: string) => {
    const normalized = draftMeta.trim();
    const next = {
      ...customization,
      metas: {
        ...customization.metas,
        [stageId]: normalized || 'N/A',
      },
    };

    setCustomization(next);
    saveCustomization(context, next);
    setEditingMetaStageId(null);
  };

  const restoreDefault = () => {
    const next = { labels: {}, hiddenStageIds: [], metas: {} };
    setCustomization(next);
    saveCustomization(context, next);
  };

  return (
    <div className="w-full rounded-[28px] border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Funil Ampulheta • Gestão de Locação</h2>
          <p className="text-sm text-muted-foreground">Duplo clique para renomear etapas, clique na meta para editar e remova etapas para redirecionar leads para a próxima.</p>
        </div>
        <Button type="button" variant="outline" className="rounded-full" onClick={restoreDefault}>
          Restaurar padrão
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <div
          className="mx-auto w-full max-w-[380px] rounded-[26px] bg-gradient-to-b from-[#ff2d44] via-[#ff6a00] to-[#ff2d44] px-6 py-5 text-white shadow-md"
          style={{ clipPath: FUNNEL_BASE_STYLE }}
        >
          <div className="flex flex-col gap-2.5">
            {stages.map((stage) => {
              const isClosed = stage.id === 'negocio-fechado';
              const allowRemove = !isClosed;

              return (
                <div
                  key={stage.id}
                  className={cn('relative min-h-[64px] px-2 py-1.5 text-center', isClosed && '-mx-4 rounded-2xl bg-[#09c74f] shadow-lg')}
                  onDoubleClick={() => startEdit(stage)}
                >
                  {allowRemove && (
                    <button
                      type="button"
                      className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1 text-white/90 hover:bg-black/35"
                      onClick={() => removeStage(stage.id)}
                      aria-label={`Remover etapa ${stage.label}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {editingStageId === stage.id ? (
                    <Input
                      value={draftLabel}
                      autoFocus
                      onChange={(event) => setDraftLabel(event.target.value)}
                      onBlur={() => applyLabel(stage.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') applyLabel(stage.id);
                      }}
                      className="mx-auto h-8 max-w-[260px] border-white/40 bg-white/10 text-center text-sm font-semibold text-white placeholder:text-white/70"
                    />
                  ) : (
                    <div className="space-y-0.5">
                      <p className="text-[clamp(18px,1.6vw,34px)] font-bold leading-tight">{stage.label}</p>
                      <p className="text-lg font-medium text-white/95">{stage.value} Lead(s) ({stage.percent}%)</p>
                    </div>
                  )}
                </div>
              );
            })}

            {!stages.length && <div className="py-16 text-center text-lg font-semibold">Todas as etapas foram removidas.</div>}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {stages.map((stage) => {
            const averageRate = formatRate(stage.averageRate);
            const meta = customization.metas[stage.id] ?? 'N/A';

            return (
              <div
                key={`rate-${stage.id}`}
                className="flex min-h-[64px] items-center justify-between rounded-2xl border border-border bg-muted/60 px-4 py-3 text-lg text-muted-foreground shadow-sm"
              >
                <span>
                  Taxa Média: <strong className="text-[#ff5a1f]">{averageRate}</strong>
                </span>

                {editingMetaStageId === stage.id ? (
                  <Input
                    autoFocus
                    value={draftMeta}
                    onChange={(event) => setDraftMeta(event.target.value)}
                    onBlur={() => applyMeta(stage.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') applyMeta(stage.id);
                    }}
                    placeholder="Meta"
                    className="h-8 w-24 border-border bg-white text-right text-sm"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startMetaEdit(stage.id)}
                    className="inline-flex items-center gap-1.5 font-semibold text-foreground"
                    aria-label={`Editar meta da etapa ${stage.label}`}
                  >
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Meta: {meta}
                  </button>
                )}
              </div>
            );
          })}

          {!stages.length && (
            <div className="rounded-2xl border border-border bg-muted/60 px-5 py-4 text-lg text-muted-foreground">
              Taxa Média: - &nbsp; Meta: N/A
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Pencil className="h-4 w-4" /> Edição rápida
            </p>
            <p className="mt-1">Dê dois cliques para renomear etapa, clique em Meta para definir objetivos e use a lixeira para ocultar etapas sem perder o fluxo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelWidget;
