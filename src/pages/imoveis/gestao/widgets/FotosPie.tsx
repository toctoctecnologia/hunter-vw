import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import type { FotosResumoItem } from '@/data/imoveis/gestaoMock';

const COLORS = ['hsl(var(--accent))', 'hsl(var(--accentSoft))', '#FACC15', '#6366F1'];

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

interface FotosPieProps {
  data: FotosResumoItem[];
}

export function FotosPie({ data }: FotosPieProps) {
  const descriptionId = 'fotos-pie-description';

  return (
    <section className="card flex h-full flex-col p-6" aria-describedby={descriptionId}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Biblioteca de fotos</h3>
          <p id={descriptionId} className="sr-only">
            Distribuição dos imóveis por status da biblioteca de fotos no período selecionado.
          </p>
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="quantidade"
              nameKey="label"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString('pt-BR')} imóveis`,
                'Quantidade'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-6 space-y-3 text-sm text-zinc-600">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <dt className="font-medium text-zinc-700">{item.label}</dt>
            </div>
            <dd className="text-right">
              <div className="font-semibold text-zinc-900">
                {item.quantidade.toLocaleString('pt-BR')} imóveis
              </div>
              <div className="text-xs text-zinc-500">
                {numberFormatter.format(item.percentual)}% da base
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
