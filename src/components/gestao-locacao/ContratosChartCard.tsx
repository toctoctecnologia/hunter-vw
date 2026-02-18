import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const contratosData = {
  total: 82,
  atualizados: 30,
  vencem30dias: 30,
  vencem60dias: 30,
  vencidos: 30
};
const chartData = [{
  name: 'Atualizados',
  value: contratosData.atualizados,
  color: '#22c55e'
}, {
  name: 'Vencem em 30 dias',
  value: contratosData.vencem30dias,
  color: '#3b82f6'
}, {
  name: 'Vencem em 60 dias',
  value: contratosData.vencem60dias,
  color: 'hsl(var(--accentSoft))'
}, {
  name: 'Vencidos',
  value: contratosData.vencidos,
  color: '#ef4444'
}];
export const ContratosChartCard = () => {
  return <Card className="border border-border bg-[var(--ui-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-foreground">Contratos de locação <FileText className="w-5 h-5 text-muted-foreground" />
          Contratos de locação
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
              <span className="text-4xl font-bold text-foreground">{contratosData.total}</span>
              <span className="text-sm text-muted-foreground">Contratos de locação</span>
            </div>
          </div>
          
          <div className="w-full mt-4 space-y-2">
            {chartData.map((item, index) => <button key={index} className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: item.color
              }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </button>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ContratosChartCard;
