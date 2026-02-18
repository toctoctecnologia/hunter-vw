'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { SalePartyShare } from '../types';

interface Props {
  shares: SalePartyShare[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SaleDistributionChart({ shares }: Props) {
  if (!shares?.length) return null;

  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Distribuição</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={shares}
              dataKey="percentage"
              nameKey="party"
              outerRadius={100}
              label
            >
              {shares.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
