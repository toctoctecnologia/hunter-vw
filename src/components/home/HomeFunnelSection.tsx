import React, { useState, useMemo } from 'react';
import { Filter, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface FunnelStep {
  id: string;
  label: string;
  value: number;
  percent: number;
  type: 'pre' | 'conversion' | 'post';
  advanced: number;
  discarded: number;
  groupAvgDiff: number;
}

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  faseFunil: string;
  corretor: string;
  midiaOrigem: string;
  dataInclusao: string;
  ultimaInteracao: string;
  situacao: string;
}

const MOCK_LEADS: Lead[] = [
  { id: '78190', nome: 'Cleide Claudio', telefone: '(13) 99604-5308', email: 'cleidealclaudio@msn.com', faseFunil: 'Seleção do perfil', corretor: 'Aline de Fatima Fernandes Martins', midiaOrigem: 'Instagram Leads / Inter...', dataInclusao: '01/12/2025 00:57', ultimaInteracao: '10/12/2025 14:01', situacao: 'Descartado' },
  { id: '78191', nome: 'Cleide Claudio', telefone: '(13) 99604-5308', email: 'cleidealclaudio@msn.com', faseFunil: 'Seleção do perfil', corretor: 'Brayann Germano', midiaOrigem: 'Abordou ou foi aborda...', dataInclusao: '01/12/2025 00:57', ultimaInteracao: '06/12/2025 06:21', situacao: 'Descartado' },
  { id: '78192', nome: 'Vhania Flor 81111', telefone: '(48) 9977-7076', email: 'vhaniaflor2@gmail.com', faseFunil: 'Seleção do perfil', corretor: 'Amanda Aylon', midiaOrigem: 'Instagram Leads / Inter...', dataInclusao: '01/12/2025 01:11', ultimaInteracao: '04/12/2025 14:58', situacao: 'Descartado' },
  { id: '78193', nome: 'Vhania Flor 81111', telefone: '(48) 9977-7076', email: 'vhaniaflor2@gmail.com', faseFunil: 'Seleção do perfil', corretor: 'Brayann Germano', midiaOrigem: 'Abordou ou foi aborda...', dataInclusao: '01/12/2025 01:11', ultimaInteracao: '01/12/2025 07:16', situacao: 'Descartado' },
  { id: '78194', nome: 'Erileny', telefone: '(92) 98533-7350', email: '', faseFunil: 'Seleção do perfil', corretor: 'Ana Zauer', midiaOrigem: 'Google Ads / Internet', dataInclusao: '01/12/2025 02:15', ultimaInteracao: '01/12/2025 02:15', situacao: 'Em atendimento' },
  { id: '78195', nome: 'Erileny', telefone: '5592985337350', email: '', faseFunil: 'Seleção do perfil', corretor: 'Brayann Germano', midiaOrigem: 'Abordou ou foi aborda...', dataInclusao: '01/12/2025 02:15', ultimaInteracao: '01/12/2025 08:40', situacao: 'Descartado' },
  { id: '78196', nome: 'Fernando Pilz', telefone: '(47) 99973-4047', email: 'fernando@urbano.com.br', faseFunil: 'Visita', corretor: 'Marcia Camargo', midiaOrigem: 'Instagram Leads / Inter...', dataInclusao: '01/12/2025 03:26', ultimaInteracao: '03/12/2025 13:09', situacao: 'Em atendimento' },
  { id: '78197', nome: 'Carlos Silva', telefone: '(11) 99888-7766', email: 'carlos@email.com', faseFunil: 'Agendamento', corretor: 'Pedro Santos', midiaOrigem: 'Google Ads / Internet', dataInclusao: '02/12/2025 10:30', ultimaInteracao: '05/12/2025 15:20', situacao: 'Em atendimento' },
];

const FUNNEL_DATA: Record<string, FunnelStep[]> = {
  locacao: [
    { id: 'pre-atendimento', label: 'Pré-Atendimento', value: 12, percent: 100, type: 'pre', advanced: 8, discarded: 4, groupAvgDiff: 2 },
    { id: 'em-atendimento', label: 'Em Atendimento', value: 8, percent: 67, type: 'pre', advanced: 5, discarded: 3, groupAvgDiff: -1 },
    { id: 'agendamento', label: 'Agendamento', value: 5, percent: 42, type: 'pre', advanced: 3, discarded: 2, groupAvgDiff: 3 },
    { id: 'visita', label: 'Visita', value: 3, percent: 25, type: 'pre', advanced: 2, discarded: 1, groupAvgDiff: 0 },
    { id: 'proposta', label: 'Proposta Enviada', value: 2, percent: 17, type: 'pre', advanced: 1, discarded: 1, groupAvgDiff: 1 },
    { id: 'negocio-fechado', label: 'Negócio Fechado', value: 1, percent: 8, type: 'conversion', advanced: 1, discarded: 0, groupAvgDiff: 2 },
    { id: 'indicacao', label: 'Indicação', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: -2 },
    { id: 'receita', label: 'Receita Gerada', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: 0 },
    { id: 'pos-venda', label: 'Pós-venda', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: 1 },
  ],
  venda: [
    { id: 'pre-atendimento', label: 'Pré-Atendimento', value: 25, percent: 100, type: 'pre', advanced: 18, discarded: 7, groupAvgDiff: 5 },
    { id: 'em-atendimento', label: 'Em Atendimento', value: 18, percent: 72, type: 'pre', advanced: 10, discarded: 8, groupAvgDiff: 2 },
    { id: 'agendamento', label: 'Agendamento', value: 10, percent: 40, type: 'pre', advanced: 6, discarded: 4, groupAvgDiff: -3 },
    { id: 'visita', label: 'Visita', value: 6, percent: 24, type: 'pre', advanced: 4, discarded: 2, groupAvgDiff: 1 },
    { id: 'proposta', label: 'Proposta Enviada', value: 4, percent: 16, type: 'pre', advanced: 2, discarded: 2, groupAvgDiff: -1 },
    { id: 'negocio-fechado', label: 'Negócio Fechado', value: 2, percent: 8, type: 'conversion', advanced: 2, discarded: 0, groupAvgDiff: 4 },
    { id: 'indicacao', label: 'Indicação', value: 1, percent: 4, type: 'post', advanced: 1, discarded: 0, groupAvgDiff: 0 },
    { id: 'receita', label: 'Receita Gerada', value: 1, percent: 4, type: 'post', advanced: 0, discarded: 1, groupAvgDiff: 2 },
    { id: 'pos-venda', label: 'Pós-venda', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: -1 },
  ],
  shortstay: [
    { id: 'pre-atendimento', label: 'Pré-Atendimento', value: 8, percent: 100, type: 'pre', advanced: 5, discarded: 3, groupAvgDiff: 1 },
    { id: 'em-atendimento', label: 'Em Atendimento', value: 5, percent: 63, type: 'pre', advanced: 3, discarded: 2, groupAvgDiff: 0 },
    { id: 'agendamento', label: 'Agendamento', value: 3, percent: 38, type: 'pre', advanced: 2, discarded: 1, groupAvgDiff: 2 },
    { id: 'visita', label: 'Visita', value: 2, percent: 25, type: 'pre', advanced: 1, discarded: 1, groupAvgDiff: -1 },
    { id: 'proposta', label: 'Proposta Enviada', value: 1, percent: 13, type: 'pre', advanced: 1, discarded: 0, groupAvgDiff: 1 },
    { id: 'negocio-fechado', label: 'Negócio Fechado', value: 1, percent: 13, type: 'conversion', advanced: 1, discarded: 0, groupAvgDiff: 3 },
    { id: 'indicacao', label: 'Indicação', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: 0 },
    { id: 'receita', label: 'Receita Gerada', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: -2 },
    { id: 'pos-venda', label: 'Pós-venda', value: 0, percent: 0, type: 'post', advanced: 0, discarded: 0, groupAvgDiff: 1 },
  ],
};

const FUNNEL_TYPE_OPTIONS = [
  { value: 'operacional', label: 'Funil operacional' },
  { value: 'financeiro', label: 'Funil financeiro' },
  { value: 'contabil', label: 'Funil contábil' },
];

const STEP_TARGETS: Record<string, number> = {
  'pre-atendimento': 100,
  'em-atendimento': 75,
  agendamento: 55,
  visita: 40,
  proposta: 25,
  'negocio-fechado': 10,
  indicacao: 5,
};

const FINANCIAL_SUMMARY: Record<string, { newLeadsGrowth: number; discardedDelta: number }> = {
  locacao: { newLeadsGrowth: 0, discardedDelta: -33 },
  venda: { newLeadsGrowth: 2, discardedDelta: -18 },
  shortstay: { newLeadsGrowth: 1, discardedDelta: -12 },
};

const MONTHS = [
  { value: 'todos', label: 'Todos' },
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const YEARS = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
];

const PERIOD_OPTIONS = [
  { value: 'indicadores', label: 'Aplicar período somente nos indicadores dos...' },
  { value: 'todos', label: 'Aplicar em todos os dados' },
];

const FUNNEL_ORIGIN_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
];

const UNITS = [
  { value: 'todas', label: 'Todas' },
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial-1', label: 'Filial 1' },
  { value: 'filial-2', label: 'Filial 2' },
];

const MIDIAS_ORIGEM = [
  { value: 'todas', label: 'Todas' },
  { value: 'instagram', label: 'Instagram Leads / Internet' },
  { value: 'abordagem', label: 'Abordou ou foi abordado' },
  { value: 'google', label: 'Google Ads / Internet' },
];

const CORRETORES = [
  { value: 'todos', label: 'Todos' },
  { value: 'aline', label: 'Aline de Fatima Fernandes Martins' },
  { value: 'brayann', label: 'Brayann Germano' },
  { value: 'amanda', label: 'Amanda Aylon' },
  { value: 'ana', label: 'Ana Zauer' },
  { value: 'marcia', label: 'Marcia Camargo' },
  { value: 'pedro', label: 'Pedro Santos' },
];

export const HomeFunnelSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'locacao' | 'venda' | 'shortstay'>('locacao');
  const [funnelType, setFunnelType] = useState<'operacional' | 'financeiro' | 'contabil'>('operacional');
  const [month, setMonth] = useState('todos');
  const [year, setYear] = useState('2025');
  const [periodOption, setPeriodOption] = useState('indicadores');
  const [funnelOrigin, setFunnelOrigin] = useState('todos');
  const [unit, setUnit] = useState('todas');
  const [midiaOrigem, setMidiaOrigem] = useState('todas');
  const [corretor, setCorretor] = useState('todos');
  const [selectedStep, setSelectedStep] = useState<FunnelStep | null>(null);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    if (midiaOrigem === 'todas') return MOCK_LEADS;

    return MOCK_LEADS.filter(lead => {
      if (midiaOrigem === 'instagram') return lead.midiaOrigem.toLowerCase().includes('instagram');
      if (midiaOrigem === 'abordagem') return lead.midiaOrigem.toLowerCase().includes('abordou');
      if (midiaOrigem === 'google') return lead.midiaOrigem.toLowerCase().includes('google');
      return true;
    });
  }, [midiaOrigem]);

  const funnelData = useMemo(() => {
    const baseData = FUNNEL_DATA[activeTab] || FUNNEL_DATA.locacao;
    if (funnelType === 'financeiro') {
      return baseData.map(step => ({ ...step, groupAvgDiff: step.groupAvgDiff + 1 }));
    }
    if (funnelType === 'contabil') {
      return baseData.map(step => ({ ...step, groupAvgDiff: step.groupAvgDiff - 1 }));
    }
    return baseData;
  }, [activeTab, funnelType]);

  const preSteps = funnelData.filter(s => s.type === 'pre');
  const conversionStep = funnelData.find(s => s.type === 'conversion');
  const postSteps = funnelData.filter(s => s.type === 'post');
  const summary = FINANCIAL_SUMMARY[activeTab] ?? FINANCIAL_SUMMARY.locacao;

  const handleStepClick = (step: FunnelStep) => {
    setSelectedStep(step);
    setIsLeadsModalOpen(true);
  };

  const handleNavigateToLead = (leadId: string) => {
    setIsLeadsModalOpen(false);
    navigate(`/lead-vendas/${leadId}`);
  };

  const getSituacaoStyle = (situacao: string) => {
    if (situacao === 'Descartado') return 'text-red-600 font-medium';
    if (situacao === 'Em atendimento') return 'text-green-600 font-medium';
    return 'text-gray-600';
  };

  const getConversionRate = (currentStep: FunnelStep, nextStep?: FunnelStep) => {
    if (!nextStep || currentStep.value === 0) return 0;
    return Math.round((nextStep.value / currentStep.value) * 100);
  };

  const renderConversionBadge = (currentStep: FunnelStep, nextStep?: FunnelStep) => {
    if (!nextStep) return null;
    const rate = getConversionRate(currentStep, nextStep);
    const target = STEP_TARGETS[nextStep.id] ?? 0;

    return (
      <>
        <div className="absolute right-[-110px] top-1/2 hidden -translate-y-1/2 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-700">
              {rate}%
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-muted-foreground">Taxa média</span>
              <span className="text-[11px] font-semibold text-orange-700">Meta {target}%</span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-2 shadow-sm md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-700">
            {rate}%
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-muted-foreground">Taxa média</span>
            <span className="text-[11px] font-semibold text-orange-700">Meta {target}%</span>
          </div>
        </div>
      </>
    );
  };

  // Calculate funnel segment styles for hourglass shape
  const getFunnelSegmentStyle = (index: number, total: number, type: 'pre' | 'post'): React.CSSProperties => {
    if (type === 'pre') {
      // Pre-conversion: narrowing from top
      const topWidth = 100 - (index * (40 / total));
      const bottomWidth = 100 - ((index + 1) * (40 / total));
      return {
        clipPath: `polygon(${(100 - topWidth) / 2}% 0, ${(100 + topWidth) / 2}% 0, ${(100 + bottomWidth) / 2}% 100%, ${(100 - bottomWidth) / 2}% 100%)`,
      };
    } else {
      // Post-conversion: widening from conversion point
      const topWidth = 50 + (index * (35 / total));
      const bottomWidth = 50 + ((index + 1) * (35 / total));
      return {
        clipPath: `polygon(${(100 - topWidth) / 2}% 0, ${(100 + topWidth) / 2}% 0, ${(100 + bottomWidth) / 2}% 100%, ${(100 - bottomWidth) / 2}% 100%)`,
      };
    }
  };

  const getStepColor = (index: number, type: 'pre' | 'post'): string => {
    if (type === 'pre') {
      // Red to orange gradient for pre-conversion
      if (index < 2) return '#DC2626'; // Red
      return 'hsl(var(--accentSoft))'; // Orange
    } else {
      // Orange to red for post-conversion
      if (index === postSteps.length - 1) return '#DC2626'; // Red for last
      return 'hsl(var(--accentSoft))'; // Orange
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header with title and tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-gray-200 shadow-sm">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Funil Ampulheta</span>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="locacao" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#FF5506] data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-[#FF5506]/20 rounded-md px-5 py-2 text-sm font-medium"
            >
              Locação
            </TabsTrigger>
            <TabsTrigger 
              value="venda" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#FF5506] data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-[#FF5506]/20 rounded-md px-5 py-2 text-sm font-medium"
            >
              Venda
            </TabsTrigger>
            <TabsTrigger 
              value="shortstay" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#FF5506] data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-[#FF5506]/20 rounded-md px-5 py-2 text-sm font-medium"
            >
              Short Stay
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Funnel Visualization */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-lg relative md:pr-24">
            {/* Pre-conversion steps */}
            {preSteps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div className="w-full relative flex items-center justify-center text-white text-center cursor-pointer transition-all duration-200 hover:brightness-110"
                  onClick={() => handleStepClick(step)}
                  style={{
                    height: '60px',
                    background: getStepColor(index, 'pre'),
                    ...getFunnelSegmentStyle(index, preSteps.length, 'pre'),
                  }}
                >
                  <div className="z-10">
                    <p className="font-bold text-sm drop-shadow-sm">{step.label}</p>
                    <p className="text-xs opacity-95">{step.value} Lead(s) ({step.percent}%)</p>
                  </div>
                </div>
                {renderConversionBadge(step, index < preSteps.length - 1 ? preSteps[index + 1] : conversionStep)}
                {/* Stats badges between steps */}
                <div className="flex items-center justify-center gap-0.5 my-1">
                  <span className="bg-[#7B9BC7] text-white px-2.5 py-0.5 rounded-l text-[11px] font-medium">
                    {step.groupAvgDiff >= 0 ? '+' : ''}{step.groupAvgDiff}%
                  </span>
                  <span className="bg-[#C08B7A] text-white px-2.5 py-0.5 rounded-r text-[11px] font-medium">
                    -{step.discarded}
                  </span>
                </div>
              </div>
            ))}

            {/* Conversion step (green oval) */}
            {conversionStep && (
              <div className="relative flex flex-col items-center my-3">
                <div
                  className="relative flex items-center justify-center text-white text-center cursor-pointer transition-all duration-200 hover:brightness-110 shadow-lg"
                  onClick={() => handleStepClick(conversionStep)}
                  style={{
                    width: '85%',
                    height: '70px',
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    borderRadius: '9999px',
                  }}
                >
                  <div className="z-10">
                    <p className="font-bold text-base drop-shadow-sm">{conversionStep.label}</p>
                    <p className="text-sm opacity-95">{conversionStep.value} Lead(s) ({conversionStep.percent}%)</p>
                  </div>
                </div>
                {renderConversionBadge(conversionStep, postSteps[0])}
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  <span className="bg-[#7B9BC7] text-white px-2.5 py-0.5 rounded-l text-[11px] font-medium">
                    {conversionStep.groupAvgDiff >= 0 ? '+' : ''}{conversionStep.groupAvgDiff}%
                  </span>
                  <span className="bg-[#C08B7A] text-white px-2.5 py-0.5 rounded-r text-[11px] font-medium">
                    -{conversionStep.discarded}
                  </span>
                </div>
              </div>
            )}

            {/* Post-conversion steps (expanding) */}
            {postSteps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div
                  className="w-full relative flex items-center justify-center text-white text-center cursor-pointer transition-all duration-200 hover:brightness-110"
                  onClick={() => handleStepClick(step)}
                  style={{
                    height: '55px',
                    background: getStepColor(index, 'post'),
                    ...getFunnelSegmentStyle(index, postSteps.length, 'post'),
                  }}
                >
                  <div className="z-10">
                    <p className="font-bold text-sm drop-shadow-sm">{step.label}</p>
                    <p className="text-xs opacity-95">{step.value} Lead(s) ({step.percent}%)</p>
                  </div>
                </div>
                {renderConversionBadge(step, postSteps[index + 1])}
                {index < postSteps.length - 1 && (
                  <div className="flex items-center justify-center gap-0.5 my-1">
                    <span className="bg-[#7B9BC7] text-white px-2.5 py-0.5 rounded-l text-[11px] font-medium">
                      {step.groupAvgDiff >= 0 ? '+' : ''}{step.groupAvgDiff}%
                    </span>
                    <span className="bg-[#C08B7A] text-white px-2.5 py-0.5 rounded-r text-[11px] font-medium">
                      -{step.discarded}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {funnelType === 'financeiro' && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 text-green-800">
                    {summary.newLeadsGrowth >= 0 ? '+' : ''}{summary.newLeadsGrowth}%
                  </span>
                  Novos leads no mês
                </div>
                <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700 font-semibold shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-800">
                    {summary.discardedDelta}
                  </span>
                  Descartados no mês
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-5">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Filtros</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Funil</label>
                <Select value={funnelType} onValueChange={(value) => setFunnelType(value as typeof funnelType)}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {FUNNEL_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Mês (funil)</label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {MONTHS.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Ano (funil)</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {YEARS.map(y => (
                      <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Opção período</label>
                <Select value={periodOption} onValueChange={setPeriodOption}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {PERIOD_OPTIONS.map(p => (
                      <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Funil (Inbound/Outbound)</label>
                <Select value={funnelOrigin} onValueChange={setFunnelOrigin}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {FUNNEL_ORIGIN_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Unidade</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {UNITS.map(u => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Corretor</label>
                <Select value={corretor} onValueChange={setCorretor}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {CORRETORES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Mídia de origem</label>
                <Select value={midiaOrigem} onValueChange={setMidiaOrigem}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {MIDIAS_ORIGEM.map(midia => (
                      <SelectItem key={midia.value} value={midia.value}>
                        {midia.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg h-11 mt-3 font-medium"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Modal */}
      <Dialog open={isLeadsModalOpen} onOpenChange={setIsLeadsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-gray-900">
              <span className="text-lg font-semibold">
                Leads - {selectedStep?.label}
              </span>
              <span className="text-sm font-normal text-gray-500">
                ({selectedStep?.value} leads)
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Cód.</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Lead</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Fase do funil</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Corretor</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Mídia de origem</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Data inclusão</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Última interação</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Situação</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm py-3">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="text-sm text-gray-600 py-4">{lead.id}</TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.nome}</p>
                        <p className="text-xs text-gray-500">{lead.telefone} {lead.email ? `- ${lead.email}` : ''}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 py-4">{lead.faseFunil}</TableCell>
                    <TableCell className="text-sm text-gray-600 py-4">{lead.corretor}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[150px] truncate py-4">{lead.midiaOrigem}</TableCell>
                    <TableCell className="text-sm text-gray-600 py-4">{lead.dataInclusao}</TableCell>
                    <TableCell className="text-sm text-gray-600 py-4">{lead.ultimaInteracao}</TableCell>
                    <TableCell className={`text-sm py-4 ${getSituacaoStyle(lead.situacao)}`}>
                      {lead.situacao}
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 border-gray-200">
                            Ações <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                          <DropdownMenuItem 
                            onClick={() => handleNavigateToLead(lead.id)}
                            className="cursor-pointer"
                          >
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleNavigateToLead(lead.id)}
                            className="cursor-pointer"
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            Transferir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeFunnelSection;
