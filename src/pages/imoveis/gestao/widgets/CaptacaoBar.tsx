import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import type { CaptacaoMensalItem } from '@/data/imoveis/gestaoMock';

const numberFormatter = new Intl.NumberFormat('pt-BR');
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

interface CaptacaoBarProps {
  data: CaptacaoMensalItem[];
}

export function CaptacaoBar({ data }: CaptacaoBarProps) {
  const chartData = useMemo(
    () =>
      data.map(item => {
        const [year, month] = item.mes.split('-');
        const monthDate = new Date(Number(year), Number(month) - 1);
        const label = monthDate.toLocaleDateString('pt-BR', {
          month: 'short'
        });

        return {
          month: label.replace('.', ''),
          captados: item.captados,
          vendidos: item.vendidos,
          valorCaptado: item.valorCaptado,
          valorVendido: item.valorVendido
        };
      }),
    [data]
  );

  const descriptionId = 'captacao-bar-description';

  return (
    <section className="card flex h-full flex-col p-6" aria-describedby={descriptionId}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Evolução das captações
          </h3>
          <p id={descriptionId} className="sr-only">
            Gráfico de barras com o total de imóveis captados e vendidos por mês no período selecionado.
          </p>
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717A', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717A', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name, payload) => {
                if (name === 'Captados' || name === 'Vendidos') {
                  return [numberFormatter.format(value), name];
                }

                const key = payload?.payload ? `${name}` : name;
                if (key === 'valorCaptado') {
                  return [currencyFormatter.format(value), 'Valor captado'];
                }
                if (key === 'valorVendido') {
                  return [currencyFormatter.format(value), 'Valor vendido'];
                }
                return [numberFormatter.format(value), name];
              }}
              labelFormatter={(label, payload) => {
                if (!payload?.length) return label;
                const [{ payload: item }] = payload;
                return `${label.toString()} · ${currencyFormatter.format(
                  item.valorCaptado
                )} captado / ${currencyFormatter.format(
                  item.valorVendido
                )} vendido`;
              }}
            />
            <Bar
              dataKey="captados"
              name="Captados"
              radius={[6, 6, 0, 0]}
              fill="hsl(var(--accent))"
            />
            <Bar
              dataKey="vendidos"
              name="Vendidos"
              radius={[6, 6, 0, 0]}
              fill="#6366F1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 text-sm text-zinc-600 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]"
          />
          <div>
            <dt className="font-medium text-zinc-700">Captados</dt>
            <dd className="text-xs text-zinc-500">
              Valores no tooltip mostram volume e valor captado por mês.
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-[#6366F1]"
          />
          <div>
            <dt className="font-medium text-zinc-700">Vendidos</dt>
            <dd className="text-xs text-zinc-500">
              Inclui quantidade de unidades vendidas e volume financeiro.
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
