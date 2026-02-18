import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopSearchBar } from '@/components/common/TopSearchBar';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LeadDetailModal } from '@/components/vendas/LeadDetailModal';
import { ConfigurationSection } from '@/components/gestao-roletao/ConfigurationSection';
import { RankingSection, type RankingFilters } from '@/components/gestao-roletao/RankingSection';
import { QueueSection } from '@/components/gestao-roletao/QueueSection';
import type { Lead } from '@/types/lead';
export default function GestaoRoletao() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roletao');
  const [bolaoAtivo, setBolaoAtivo] = useState(false);
  const [limiteTempo, setLimiteTempo] = useState<number[]>([30]);
  const [distribuicaoTipo, setDistribuicaoTipo] = useState('equipe');
  const [horarioInicio, setHorarioInicio] = useState('09:00');
  const [horarioFim, setHorarioFim] = useState('18:00');
  const [diasAtivos, setDiasAtivos] = useState({
    segunda: true,
    terca: true,
    quarta: true,
    quinta: true,
    sexta: true,
    sabado: true,
    domingo: true
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRankingFilterOpen, setIsRankingFilterOpen] = useState(false);
  const [rankingFilters, setRankingFilters] = useState<RankingFilters>({
    dataInicio: '2025-01-13',
    dataFim: '2025-02-13',
    usuario: '',
    equipe: '',
    resultado: 'todos'
  });
  const [activeQualification, setActiveQualification] = useState('todas');
  const qualificacoes = [{
    id: 'todas',
    label: 'Todas'
  }, {
    id: 'pre_atendimento',
    label: 'Pré-atendimento'
  }, {
    id: 'em_atendimento',
    label: 'Em atendimento'
  }, {
    id: 'agendamento',
    label: 'Agendamento'
  }];
  const rankingFiltersCount = useMemo(() => {
    const extraFilters = Number(Boolean(rankingFilters.usuario)) + Number(Boolean(rankingFilters.equipe)) + Number(rankingFilters.resultado !== 'todos');
    return 2 + extraFilters;
  }, [rankingFilters]);
  const handleMainTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
        navigate('/distribuicao');
        break;
      case 'gestao-api':
        navigate('/gestao-api');
        break;
      case 'gestao-roletao':
        navigate('/gestao-roletao');
        break;
      default:
        break;
    }
  };
  return <ResponsiveLayout activeTab="gestao-roletao" setActiveTab={handleMainTabChange}>
      <div className="min-h-screen bg-gray-50">
        <div className="space-y-4 bg-white p-6 shadow-sm">
          <TopSearchBar placeholder="Buscar oportunidades" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} onOpenFilter={activeTab === 'ranking' ? () => setIsRankingFilterOpen(true) : undefined} filtersCount={activeTab === 'ranking' ? rankingFiltersCount : 0} className="w-full" />

          
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
          <div className="border-b border-gray-200 bg-white px-6">
            <TabsList className="grid w-fit grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
              <TabsTrigger value="roletao" className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
                Roletão
              </TabsTrigger>
              <TabsTrigger value="ranking" className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
                Ranking
              </TabsTrigger>
              <TabsTrigger value="proximo" className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
                Próximo da fila
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="roletao" className="flex-1 overflow-y-auto">
            <ConfigurationSection bolaoAtivo={bolaoAtivo} setBolaoAtivo={setBolaoAtivo} limiteTempo={limiteTempo} setLimiteTempo={setLimiteTempo} distribuicaoTipo={distribuicaoTipo} setDistribuicaoTipo={setDistribuicaoTipo} horarioInicio={horarioInicio} setHorarioInicio={setHorarioInicio} horarioFim={horarioFim} setHorarioFim={setHorarioFim} diasAtivos={diasAtivos} setDiasAtivos={setDiasAtivos} />
          </TabsContent>
          
          <TabsContent value="ranking" className="flex-1 overflow-y-auto">
            <RankingSection selectedLead={selectedLead} setSelectedLead={setSelectedLead} filters={rankingFilters} onFiltersChange={setRankingFilters} isFilterOpen={isRankingFilterOpen} onFilterOpenChange={setIsRankingFilterOpen} />
          </TabsContent>

          <TabsContent value="proximo" className="flex-1 overflow-y-auto">
            <QueueSection />
          </TabsContent>

          {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
        </Tabs>
      </div>
    </ResponsiveLayout>;
}