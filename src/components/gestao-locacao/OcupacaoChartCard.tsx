import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const ocupacaoData = {
  total: 213,
  alugado: 82,
  vago: 131
};
const chartData = [{
  name: 'Alugado',
  value: ocupacaoData.alugado,
  color: '#22c55e',
  percent: Math.round(ocupacaoData.alugado / ocupacaoData.total * 100)
}, {
  name: 'Vago',
  value: ocupacaoData.vago,
  color: 'hsl(var(--accentSoft))',
  percent: Math.round(ocupacaoData.vago / ocupacaoData.total * 100)
}];
export const OcupacaoChartCard = () => {
  return <Card className="border border-border bg-[var(--ui-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-foreground">Ocupação de imóveis de locação<BarChart3 className="w-5 h-5 text-muted-foreground" />
          Ocupação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{ocupacaoData.total}</span>
              <span className="text-sm text-muted-foreground text-center leading-tight">Imóveis de<br />locação</span>
            </div>
          </div>
          
          <div className="w-full mt-4 flex justify-center gap-8">
            {chartData.map((item, index) => <button key={index} className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: item.color
              }} />
                  <span className="text-lg font-bold text-foreground">{item.percent}%</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.name} <span className="font-semibold text-foreground">{item.value}</span>
                </span>
              </button>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default OcupacaoChartCard;
