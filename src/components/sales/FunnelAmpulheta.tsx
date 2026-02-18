import React, { useId, useMemo, useState } from 'react';
import clsx from 'clsx';

type NormalizedStep = FunnelStep & { computedWidth: number };

export interface FunnelStep {
  id?: string;
  label: string;
  percent: number;
  value?: number;
  trend?: number;
  description?: string;
}

interface FunnelAmpulhetaProps {
  data?: FunnelStep[];
  onStepSelect?: (step: FunnelStep) => void;
  className?: string;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
}

const MIN_WIDTH_FACTOR = 6; // 6%
const HIGHLIGHT_STAGE = 'Negócio Fechado';

const DEFAULT_STEPS: FunnelStep[] = [
  { label: 'Captação', percent: 100, value: 320, description: 'Leads recém adicionados ao pipeline.' },
  { label: 'Qualificação', percent: 62, value: 198, description: 'Leads qualificados e prontos para contato.' },
  { label: 'Contato Inicial', percent: 48, value: 154, description: 'Contato realizado com decisores.' },
  { label: 'Negociação', percent: 26, value: 84, description: 'Negociações e follow-ups ativos.' },
  { label: 'Proposta', percent: 18, value: 58, description: 'Propostas comerciais enviadas.' },
  { label: 'Fechamento', percent: 12, value: 36, description: 'Clientes com acordos assinados.' }
];

export const FunnelAmpulheta: React.FC<FunnelAmpulhetaProps> = ({
  data = DEFAULT_STEPS,
  onStepSelect,
  className,
  showHeader = true,
  title = 'Desempenho do Pipeline',
  subtitle = 'Visualização em ampulheta com destaque para retenção e conversão entre as etapas do funil.'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();

  const normalizedSteps = useMemo<NormalizedStep[]>(() => {
    const steps = data.length === 0 ? DEFAULT_STEPS : data;
    const maxPercent = Math.max(1, ...steps.map((step) => step.percent));

    return steps.map((step, index) => {
      const widthPercent = Math.max((step.percent / maxPercent) * 100, MIN_WIDTH_FACTOR);
      return {
        ...step,
        computedWidth: widthPercent
      };
    });
  }, [data]);

  const handleActivate = (index: number) => {
    setActiveIndex(index);
    const step = normalizedSteps[index];
    if (step && onStepSelect) {
      onStepSelect(step);
    }
  };

  const handleDeactivate = () => setActiveIndex(null);

  return (
    <section
      className={clsx(
        'relative isolate overflow-hidden rounded-[24px] bg-card border border-border px-4 py-6 shadow-sm sm:px-6',
        className
      )}
      aria-labelledby={showHeader ? titleId : undefined}
      aria-label={showHeader ? undefined : 'Visualização do funil de vendas em formato de ampulheta'}
    >
      {showHeader && (
        <header className="mb-4 flex flex-col gap-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Visão Funil</p>
          <h2 id={titleId} className="text-xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </header>
      )}

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-90"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--accent-foreground)) 50%, hsl(var(--primary)) 100%)',
          clipPath: 'polygon(10% 0%, 90% 0%, 72% 50%, 90% 100%, 10% 100%, 28% 50%)'
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[360px] flex-col gap-2 sm:gap-3">
        <ol
          className="flex flex-col gap-2 sm:gap-3"
          role="list"
          aria-label="Etapas do funil de vendas em formato de ampulheta"
        >
          {normalizedSteps.map((step, index) => {
            const nextWidth = normalizedSteps[index + 1]?.computedWidth ?? Math.max(step.computedWidth * 0.6, MIN_WIDTH_FACTOR);
            const topOffset = (100 - step.computedWidth) / 2;
            const bottomOffset = (100 - nextWidth) / 2;
            const isActive = activeIndex === index;
            const isHighlight = step.label.toLowerCase() === HIGHLIGHT_STAGE.toLowerCase();

            const handleInteraction = () => {
              handleActivate(index);
            };

            return (
              <li key={step.id ?? step.label} className="flex flex-col items-center" role="listitem">
                <button
                  type="button"
                  className={clsx(
                    'relative w-full max-w-[340px] rounded-full px-3 py-2 text-center outline-none transition-transform duration-200',
                    isHighlight
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-transparent text-primary-foreground',
                    isActive && !isHighlight ? 'scale-[1.015]' : 'hover:scale-[1.01]'
                  )}
                  onClick={handleInteraction}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={handleDeactivate}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={handleDeactivate}
                  style={{
                    clipPath: isHighlight
                      ? undefined
                      : `polygon(${topOffset}% 0%, ${100 - topOffset}% 0%, ${100 - bottomOffset}% 100%, ${bottomOffset}% 100%)`
                  }}
                >
                  <div className="flex flex-col items-center gap-0.5 py-1">
                    <span className={clsx('font-semibold', isHighlight ? 'text-base sm:text-lg' : 'text-sm sm:text-base')}>
                      {step.label}
                    </span>
                    <span className={clsx('text-xs font-medium', isHighlight ? 'text-white/90' : 'text-primary-foreground/80')}>
                      {(step.value ?? 0).toLocaleString('pt-BR')} Lead(s) ({step.percent.toFixed(0)}%)
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default FunnelAmpulheta;
