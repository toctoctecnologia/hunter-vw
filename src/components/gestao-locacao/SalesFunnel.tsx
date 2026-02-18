interface FunnelStage {
  label: string;
  count: number;
  percentage: number;
}

interface SalesFunnelProps {
  stages?: FunnelStage[];
}

const defaultStages: FunnelStage[] = [
  { label: 'Pré-Atendimento', count: 0, percentage: 0 },
  { label: 'Em Atendimento', count: 0, percentage: 0 },
  { label: 'Agendamento', count: 0, percentage: 0 },
  { label: 'Visita', count: 0, percentage: 0 },
  { label: 'Proposta Enviada', count: 0, percentage: 0 },
];

const postConversionStages: FunnelStage[] = [
  { label: 'Negócio Fechado', count: 0, percentage: 0 },
  { label: 'Indicação', count: 0, percentage: 0 },
  { label: 'Receita Gerada', count: 0, percentage: 0 },
];

export const SalesFunnel = ({ stages = defaultStages }: SalesFunnelProps) => {
  return (
    <div className="w-full flex flex-col items-center py-2">
      {/* Top funnel section - Red gradient narrowing */}
      <svg viewBox="0 0 300 220" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="hsl(var(--accentSoft))" />
          </linearGradient>
        </defs>
        {/* Main funnel shape */}
        <path
          d="M30,0 L270,0 Q280,0 280,10 L280,10 L240,210 Q238,220 228,220 L72,220 Q62,220 60,210 L20,10 Q20,0 30,0 Z"
          fill="url(#funnelGradient)"
        />
        {/* Stage labels */}
        {stages.map((stage, index) => (
          <g key={stage.label}>
            <text
              x="150"
              y={28 + index * 42}
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="600"
              fontStyle="italic"
            >
              {stage.label}
            </text>
            <text
              x="150"
              y={44 + index * 42}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              opacity="0.9"
            >
              {stage.count} Lead(s) ({stage.percentage}%)
            </text>
          </g>
        ))}
      </svg>

      {/* Green conversion badge */}
      <div className="relative -mt-2 z-10">
        <div className="bg-[#22c55e] text-white px-6 py-2 rounded-full shadow-lg">
          <p className="text-sm font-semibold italic">Negócio Fechado</p>
          <p className="text-xs text-center opacity-90">0 Lead(s) (0%)</p>
        </div>
      </div>

      {/* Bottom section - Orange */}
      <svg viewBox="0 0 300 140" className="w-full max-w-[220px] -mt-1">
        <defs>
          <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accentSoft))" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {/* Bottom section shape - narrower at top, wider, then rounded at bottom */}
        <path
          d="M80,0 L220,0 L230,40 L240,80 L240,110 Q240,130 220,130 L80,130 Q60,130 60,110 L60,80 L70,40 Z"
          fill="url(#bottomGradient)"
        />
        {/* Stage labels */}
        {postConversionStages.map((stage, index) => (
          <g key={stage.label}>
            <text
              x="150"
              y={30 + index * 38}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="600"
              fontStyle="italic"
            >
              {stage.label}
            </text>
            <text
              x="150"
              y={44 + index * 38}
              textAnchor="middle"
              fill="white"
              fontSize="9"
              opacity="0.9"
            >
              {stage.count} Lead(s) ({stage.percentage}%)
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default SalesFunnel;
