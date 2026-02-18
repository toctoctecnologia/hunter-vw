import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import type {
  SituacaoValorItem,
  SituacaoVolumeItem
} from '@/data/imoveis/gestaoMock';

const COLORS = ['hsl(var(--accent))', 'hsl(var(--accentSoft))', '#FACC15', '#6366F1', '#0EA5E9', '#22C55E'];

const numberFormatter = new Intl.NumberFormat('pt-BR');
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

interface SituacoesPieProps {
  volume: SituacaoVolumeItem[];
  valor: SituacaoValorItem[];
}

type ChartMode = 'volume' | 'valor';

export function SituacoesPie({ volume, valor }: SituacoesPieProps) {
  const [mode, setMode] = useState<ChartMode>('volume');

  const chartData = useMemo(() => {
    if (mode === 'volume') {
      return volume.map(item => ({
        id: item.situacao,
        name: item.label,
        value: item.quantidade,
        percentual: item.percentual,
        variacao: item.variacao,
      }));
    }

    return valor.map(item => ({
      id: item.situacao,
      name: item.label,
      value: item.valor,
      percentual: item.percentual,
      variacao: undefined,
    }));
  }, [mode, volume, valor]);

  const descriptionId = 'situacoes-pie-description';

  return (
    <section className="card flex h-full flex-col p-6" aria-describedby={descriptionId}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Situação das captações
          </h3>
          <p id={descriptionId} className="sr-only">
            Gráfico de pizza com a distribuição das captações por situação. Utilize os botões para alternar entre volume de imóveis e valor financeiro.
          </p>
        </div>
        <div
          role="group"
          aria-label="Alternar exibição do gráfico de situação"
          className="inline-flex items-center gap-px rounded-full bg-zinc-100 p-1"
        >
          {(['volume', 'valor'] as ChartMode[]).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                mode === option
                  ? 'bg-white text-[hsl(var(--accent))] shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {option === 'volume' ? 'Volume' : 'Valor'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                mode === 'valor'
                  ? [currencyFormatter.format(value), 'Valor']
                  : [numberFormatter.format(value), 'Volume']
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-6 space-y-3 text-sm text-zinc-600">
        {chartData.map((item, index) => {
          const variationClass =
            (item.variacao ?? 0) > 0
              ? 'text-emerald-600'
              : (item.variacao ?? 0) < 0
              ? 'text-red-600'
              : 'text-zinc-500';

          return (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <dt className="font-medium text-zinc-700">{item.name}</dt>
              </div>
              <dd className="text-right">
                <div className="font-semibold text-zinc-900">
                  {mode === 'valor'
                    ? currencyFormatter.format(item.value)
                    : numberFormatter.format(item.value)}
                </div>
                <div className="text-xs text-zinc-500">
                  {item.percentual.toLocaleString('pt-BR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1,
                  })}
                  % do total
                </div>
                {mode === 'volume' && item.variacao !== undefined && (
                  <div className={`text-xs font-medium ${variationClass}`}>
                    {`${item.variacao > 0 ? '+' : ''}${item.variacao.toLocaleString('pt-BR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })}% vs período anterior`}
                  </div>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
