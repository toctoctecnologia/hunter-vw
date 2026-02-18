import type { KpiItem, StatusListItem } from '@/data/imoveis/gestaoMock';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

interface KpiDisponiveisProps {
  kpi?: KpiItem;
  statusList: StatusListItem[];
}

const STATUS_COLORS: Record<StatusListItem['status'], string> = {
  disponivel_site: '#22C55E',
  disponivel_interno: 'hsl(var(--accentSoft))',
  reservado: '#FACC15',
  indisponivel: '#EF4444'
};

export function KpiDisponiveis({ kpi, statusList }: KpiDisponiveisProps) {
  const descriptionId = 'kpi-disponiveis-description';
  const total = statusList.reduce((acc, status) => acc + status.quantidade, 0);

  const variation = kpi?.variation ?? 0;
  const variationText = `${variation > 0 ? '+' : ''}${variation.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  })}%`;
  const variationClass = variation > 0 ? 'text-emerald-600' : variation < 0 ? 'text-red-600' : 'text-zinc-500';

  return (
    <section className="card flex h-full flex-col p-6" aria-describedby={descriptionId}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Imóveis disponíveis
          </h3>
          <p id={descriptionId} className="sr-only">
            Indicador de imóveis ativos no período selecionado e distribuição por status de disponibilidade.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        <p className="text-3xl font-semibold text-zinc-900">
          {kpi ? kpi.value.toLocaleString('pt-BR') : '0'}
        </p>
        <p className="text-sm text-zinc-500">
          Ativos no período selecionado
        </p>
        {kpi && (
          <p className={`text-xs font-medium ${variationClass}`}>
            {variationText} vs período anterior
          </p>
        )}
      </div>

      <div className="mt-6 space-y-4" role="list" aria-label="Distribuição por status de disponibilidade">
        {statusList.map(status => {
          const color = STATUS_COLORS[status.status] ?? '#CBD5F5';
          const width = Math.max(0, Math.min(100, status.percentual));

          return (
            <div key={status.status} role="listitem">
              <div className="flex items-center justify-between text-sm font-medium text-zinc-600">
                <span>{status.label}</span>
                <span className="text-zinc-900">
                  {status.quantidade.toLocaleString('pt-BR')}
                  <span className="ml-1 text-xs text-zinc-500">
                    ({status.percentual.toLocaleString('pt-BR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1
                    })}%)
                  </span>
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-100">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${width}%`, backgroundColor: color }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {currencyFormatter.format(status.valor)} em carteira
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-auto pt-4 text-xs text-zinc-500">
        Total considerado: {total.toLocaleString('pt-BR')} imóveis.
      </p>
    </section>
  );
}
