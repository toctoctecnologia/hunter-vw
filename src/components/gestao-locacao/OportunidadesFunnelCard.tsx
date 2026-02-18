import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Filter as FilterIcon } from 'lucide-react';
import { SalesFunnel } from './SalesFunnel';

type FunnelTab = 'vendas' | 'short_stay' | 'locacao';

interface FunnelData {
  stages: { label: string; count: number; percentage: number }[];
  stats: {
    atualizadas: number;
    estagnadas: number;
    novas: number;
    transferidas: number;
    semAtividade: number;
  };
}

const funnelDataByTab: Record<FunnelTab, FunnelData> = {
  vendas: {
    stages: [
      { label: 'Pré-Atendimento', count: 109, percentage: 25 },
      { label: 'Em Atendimento', count: 81, percentage: 19 },
      { label: 'Agendamento', count: 154, percentage: 36 },
      { label: 'Visita', count: 77, percentage: 18 },
      { label: 'Proposta Enviada', count: 6, percentage: 1 },
    ],
    stats: {
      atualizadas: 169,
      estagnadas: 261,
      novas: 4,
      transferidas: 43,
      semAtividade: 175,
    },
  },
  short_stay: {
    stages: [
      { label: 'Pré-Atendimento', count: 45, percentage: 30 },
      { label: 'Em Atendimento', count: 32, percentage: 21 },
      { label: 'Agendamento', count: 40, percentage: 27 },
      { label: 'Visita', count: 25, percentage: 17 },
      { label: 'Proposta Enviada', count: 8, percentage: 5 },
    ],
    stats: {
      atualizadas: 85,
      estagnadas: 42,
      novas: 12,
      transferidas: 8,
      semAtividade: 34,
    },
  },
  locacao: {
    stages: [
      { label: 'Pré-Atendimento', count: 200, percentage: 28 },
      { label: 'Em Atendimento', count: 150, percentage: 21 },
      { label: 'Agendamento', count: 180, percentage: 25 },
      { label: 'Visita', count: 120, percentage: 17 },
      { label: 'Proposta Enviada', count: 60, percentage: 8 },
    ],
    stats: {
      atualizadas: 320,
      estagnadas: 180,
      novas: 25,
      transferidas: 55,
      semAtividade: 210,
    },
  },
};

export const OportunidadesFunnelCard = () => {
  const [activeTab, setActiveTab] = useState<FunnelTab>('vendas');
  const currentData = funnelDataByTab[activeTab];

  const tabs: { key: FunnelTab; label: string }[] = [
    { key: 'vendas', label: 'Vendas' },
    { key: 'short_stay', label: 'Short Stay' },
    { key: 'locacao', label: 'Locação' },
  ];

  return (
    <Card className="border border-border bg-[var(--ui-card)]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <FilterIcon className="w-5 h-5 text-[hsl(var(--icon))]" />
            Funil Ampuleta
          </CardTitle>
          <Button variant="outline" size="sm" className="text-sm text-[hsl(var(--textSecondary))] rounded-full px-4">
            Vendo todas <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab.key
                  ? 'bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))]'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Funnel */}
        <SalesFunnel stages={currentData.stages} />

        {/* Stats links */}
        <div className="mt-4 space-y-2">
          <button className="w-full flex items-center justify-between text-sm hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors">
            <span className="text-[hsl(var(--textSecondary))]">{currentData.stats.atualizadas} atualizadas</span>
            <ChevronRight className="w-4 h-4 text-[hsl(var(--icon))]" />
          </button>
          <button className="w-full flex items-center justify-between text-sm hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors">
            <span className="text-[hsl(var(--textSecondary))]">{currentData.stats.estagnadas} estagnadas</span>
            <ChevronRight className="w-4 h-4 text-[hsl(var(--icon))]" />
          </button>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{currentData.stats.novas}</p>
            <p className="text-xs text-muted-foreground">Novas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{currentData.stats.transferidas}</p>
            <p className="text-xs text-muted-foreground">Transferidas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{currentData.stats.semAtividade}</p>
            <p className="text-xs text-muted-foreground">Sem atividade agendada</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OportunidadesFunnelCard;
