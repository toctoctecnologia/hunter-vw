import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip } from 'recharts';
import { LeadsList } from '@/components/vendas/lista/LeadsList';

import { TopSearchBar } from '@/components/common/TopSearchBar';
import { Clock, TrendingUp, BarChart3, Home, Phone, Calendar, Target, Filter, Activity, Timer, Zap } from 'lucide-react';
import CampaignsTab, { CampaignFilters, CampaignTableRow } from '@/features/leads/tabs/CampaignsTab';
import { LeadsFunnelSection } from './LeadsFunnelSection';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { LeadFilters, LeadFiltersSheet, LEAD_FILTER_DEFAULTS } from './LeadFiltersSheet';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data baseado nos prints
const leadsArquivadosPorCanal = [
  { name: 'Importado da planilha', value: 54, color: 'hsl(var(--accentSoft))' },
  { name: 'Internet', value: 40, color: '#fb923c' },
  { name: 'WhatsApp', value: 2, color: '#fdba74' },
  { name: 'Telefone', value: 1, color: '#fed7aa' },
  { name: 'Showroom', value: 2, color: '#ffedd5' },
  { name: 'Rede Social', value: 1, color: '#fff7ed' }
];

const leadsRecebidosPorFonte = [
  { fonte: 'Importado da planilha', leads: 3200 },
  { fonte: 'Internet', leads: 2800 },
  { fonte: 'WhatsApp', leads: 2400 },
  { fonte: 'Telefone', leads: 2000 },
  { fonte: 'Showroom', leads: 1600 },
  { fonte: 'Rede Social', leads: 1200 },
  { fonte: 'Indicação', leads: 800 },
  { fonte: 'Outros', leads: 400 }
];

const leadsRecebidosPorVendedor = [
  { vendedor: 'Sandra Cardoso', leads: 175, equipe: 'Equipe Comercial' },
  { vendedor: 'Fábio Peglow', leads: 150, equipe: 'Equipe Comercial' },
  { vendedor: 'Silveira', leads: 125, equipe: 'Equipe Documental' },
  { vendedor: 'Juan Michel', leads: 100, equipe: 'Equipe Comercial' },
  { vendedor: 'Maba', leads: 75, equipe: 'Equipe Jurídica' },
  { vendedor: 'Roger da Silva', leads: 50, equipe: 'Equipe SDR' },
  { vendedor: 'Fernando Menon', leads: 25, equipe: 'Equipe SDR' }
];

const imoveisComMaisLeads = [
  { nome: 'SWISS - LANÇAMENTO V3', leads: 1145, icon: '🥇' },
  { nome: 'Interesse no Garden Park - Dis...', leads: 626, icon: '🥈' },
  { nome: 'Interesse no Central Tower - Di...', leads: 485, icon: '🥉' }
];

const indicadoresImoveis = [
  { nome: 'SWISS - LANÇAMENTO V3', leads: 1145, visitas: 220, propostas: 58, vendas: 21, ticketMedio: 550000 },
  { nome: 'Interesse no Garden Park - Dis...', leads: 626, visitas: 140, propostas: 32, vendas: 12, ticketMedio: 470000 },
  { nome: 'Interesse no Central Tower - Di...', leads: 485, visitas: 110, propostas: 25, vendas: 9, ticketMedio: 520000 },
  { nome: 'Residencial Horizonte', leads: 350, visitas: 90, propostas: 18, vendas: 6, ticketMedio: 430000 },
  { nome: 'Vivace Urban', leads: 290, visitas: 70, propostas: 15, vendas: 5, ticketMedio: 410000 },
];

const leadsRecebidosPorDia = [
  { dia: 'Segunda-feira', leads: 120 },
  { dia: 'Terça-feira', leads: 145 },
  { dia: 'Quarta-feira', leads: 132 },
  { dia: 'Quinta-feira', leads: 160 },
  { dia: 'Sexta-feira', leads: 175 },
  { dia: 'Sábado', leads: 98 },
  { dia: 'Domingo', leads: 76 },
];

const funilVendasSemanal = [
  { semana: 'Sem 1', emAtendimento: 8, visita: 0, proposta: 0, negocioFechado: 0, descartes: 17 },
  { semana: 'Sem 2', emAtendimento: 11, visita: 2, proposta: 0, negocioFechado: 0, descartes: 17 },
  { semana: 'Sem 3', emAtendimento: 1, visita: 2, proposta: 0, negocioFechado: 0, descartes: 0 },
  { semana: 'Sem 4', emAtendimento: 0, visita: 0, proposta: 0, negocioFechado: 0, descartes: 0 },
  { semana: 'Sem 5', emAtendimento: 0, visita: 0, proposta: 0, negocioFechado: 0, descartes: 0 },
  { semana: 'Sem 6', emAtendimento: 0, visita: 0, proposta: 0, negocioFechado: 0, descartes: 0 }
];

const funilVendaVisual = [
  { name: 'Em atendimento', value: 20, percentage: 20 },
  { name: 'Visita', value: 4, percentage: 0 },
  { name: 'Proposta', value: 0, percentage: 0 },
  { name: 'Negócio fechado', value: 0 }
];

const conversionTimeSamplesSeconds = [172800, 194400, 151200, 241920];
const firstInteractionSamplesSeconds = [1800, 2700, 3600, 4200, 5400, 6600];

const tipoAtendimento = [
  { name: 'Presencial', value: 75, color: '#dc2626' },
  { name: 'Online', value: 25, color: '#9ca3af' }
];

const termometro = [
  { name: 'Frio', value: 80, color: '#9ca3af' },
  { name: 'Quente', value: 20, color: '#dc2626' }
];

const motivosDescarte = [
  { name: 'Não respondeu', value: 40, color: '#3b82f6' },
  { name: 'Preço alto', value: 25, color: '#8b5cf6' },
  { name: 'Não se interessou', value: 15, color: '#10b981' },
  { name: 'Localização', value: 10, color: '#9ca3af' },
  { name: 'Outros', value: 10, color: '#f59e0b' }
];

const ultimaInteracao = [
  { name: 'Última semana', value: 60, color: '#10b981' },
  { name: 'Último mês', value: 25, color: '#dc2626' },
  { name: 'Mais de um mês', value: 15, color: '#f59e0b' }
];

const formatCurrencyBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type InsightColumnKey =
  | 'codigo'
  | 'lead'
  | 'faseFunil'
  | 'corretor'
  | 'origem'
  | 'dataEntrada'
  | 'ultimaInteracao'
  | 'situacao';

type InsightRow = Record<InsightColumnKey, string>;

const baseInsightColumns: { key: InsightColumnKey; label: string; className?: string }[] = [
  { key: 'codigo', label: 'Cód.', className: 'w-[72px]' },
  { key: 'lead', label: 'Lead' },
  { key: 'faseFunil', label: 'Fase do funil', className: 'w-[140px]' },
  { key: 'corretor', label: 'Corretor', className: 'w-[160px]' },
  { key: 'origem', label: 'Mídia de origem', className: 'w-[150px]' },
  { key: 'dataEntrada', label: 'Data de entrada', className: 'w-[140px]' },
  { key: 'ultimaInteracao', label: 'Última interação', className: 'w-[140px]' },
  { key: 'situacao', label: 'Situação', className: 'w-[130px]' },
];

const insightLeads: InsightRow[] = [
  {
    codigo: '78190',
    lead: 'Cleide Claudio',
    faseFunil: 'Atendimentos',
    corretor: 'Aline de Fatima',
    origem: 'Instagram Lead Ads',
    dataEntrada: '07/12/2025 05:57',
    ultimaInteracao: '01/12/2025 05:57',
    situacao: 'Descartado',
  },
  {
    codigo: '78190',
    lead: 'Cleide Claudio',
    faseFunil: 'Atendimentos',
    corretor: 'Brayam Germano',
    origem: 'Abordagem',
    dataEntrada: '07/12/2025 05:57',
    ultimaInteracao: '01/12/2025 05:57',
    situacao: 'Descartado',
  },
  {
    codigo: '78190',
    lead: 'Vihanla Flor',
    faseFunil: 'Atendimentos',
    corretor: 'Brayam Germano',
    origem: 'Abordagem',
    dataEntrada: '07/12/2025 05:57',
    ultimaInteracao: '01/12/2025 05:57',
    situacao: 'Descartado',
  },
  {
    codigo: '78194',
    lead: 'Erlainey',
    faseFunil: 'Atendimentos',
    corretor: 'Ana Zauer',
    origem: 'Google Ads',
    dataEntrada: '07/12/2025 05:57',
    ultimaInteracao: '01/12/2025 05:57',
    situacao: 'Em atendimento',
  },
];

const formatNumberBR = (value: number) =>
  value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

const formatDateLabel = (value: string) => new Date(value).toLocaleDateString('pt-BR');

const formatDateRangeLabel = (range: { start: string; end: string } | null) =>
  range ? `${formatDateLabel(range.start)} até ${formatDateLabel(range.end)}` : '';

const averageFromSeconds = (values: number[]) =>
  values.length ? Math.round(values.reduce((total, current) => total + current, 0) / values.length) : 0;

const formatDuration = (seconds: number) => {
  if (!seconds) return '0 segundos';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds} segundos`;
};

interface GestaoLeadsTabProps {
  defaultTab?: 'dashboard' | 'lista' | 'campanhas';
  onTabChange?: (tab: string) => void;
}

export function GestaoLeadsTab({ defaultTab = 'dashboard', onTabChange }: GestaoLeadsTabProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lista' | 'campanhas'>(defaultTab);
  const [searchValue, setSearchValue] = useState('');
  const [campaignFilters, setCampaignFilters] = useState<CampaignFilters>({
    period: '30d',
    channels: [],
    campaigns: [],
  });
  const [leadFilters, setLeadFilters] = useState<LeadFilters>(LEAD_FILTER_DEFAULTS);
  const isMobile = useIsMobile();
  const [isCampaignDrawerOpen, setCampaignDrawerOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignTableRow | null>(null);
  const [isCampaignsLoading, setCampaignsLoading] = useState(false);
  const [isLeadFiltersOpen, setLeadFiltersOpen] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<string>(imoveisComMaisLeads[0].nome);
  const [leadsRecebidosTab, setLeadsRecebidosTab] = useState<'fonte' | 'vendedor' | 'dia'>('fonte');
  const [leadsRecebidosRange, setLeadsRecebidosRange] = useState<'7-dias' | '15-dias' | '30-dias' | 'custom'>(
    '30-dias'
  );
  const [customIndicatorsRange, setCustomIndicatorsRange] = useState<{ start: string; end: string } | null>(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [insightDialog, setInsightDialog] = useState<{
    title: string;
    description?: string;
    rows: InsightRow[];
  } | null>(null);
  const [isLeadsRecebidosFilterOpen, setLeadsRecebidosFilterOpen] = useState(false);
  const [selectedLeadSources, setSelectedLeadSources] = useState<string[]>([]);
  const [selectedLeadSellers, setSelectedLeadSellers] = useState<string[]>([]);
  const [selectedLeadTeams, setSelectedLeadTeams] = useState<string[]>([]);
  const totaisFunilVendas = funilVendasSemanal.reduce(
    (acumulado, etapa) => ({
      emAtendimento: acumulado.emAtendimento + etapa.emAtendimento,
      visita: acumulado.visita + etapa.visita,
      proposta: acumulado.proposta + etapa.proposta,
      negocioFechado: acumulado.negocioFechado + etapa.negocioFechado,
      descartes: acumulado.descartes + etapa.descartes,
    }),
    { emAtendimento: 0, visita: 0, proposta: 0, negocioFechado: 0, descartes: 0 }
  );

  const performanceMetrics = useMemo(() => {
    const totalLeadsPeriodo =
      totaisFunilVendas.emAtendimento +
      totaisFunilVendas.visita +
      totaisFunilVendas.proposta +
      totaisFunilVendas.negocioFechado +
      totaisFunilVendas.descartes;

    const conversionRate =
      totalLeadsPeriodo > 0 ? (totaisFunilVendas.negocioFechado / totalLeadsPeriodo) * 100 : 0;

    const averageConversionTime = formatDuration(averageFromSeconds(conversionTimeSamplesSeconds));
    const averageFirstInteraction = formatDuration(averageFromSeconds(firstInteractionSamplesSeconds));

    return {
      conversionRate: `${conversionRate.toFixed(1)}%`,
      totalConversions: formatNumberBR(totaisFunilVendas.negocioFechado),
      averageConversionTime,
      averageFirstInteraction,
      totalLeadsPeriodo: formatNumberBR(totalLeadsPeriodo),
    };
  }, [totaisFunilVendas]);

  const handleTabChange = (tab: string) => {
    if (tab === 'campanhas' && isMobile) {
      onTabChange?.(tab);
      return;
    }

    setActiveTab(tab as 'dashboard' | 'lista' | 'campanhas');
    onTabChange?.(tab);
  };

  const toggleLeadSource = (value: string) => {
    setSelectedLeadSources(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]));
  };

  const toggleLeadSeller = (value: string) => {
    setSelectedLeadSellers(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]));
  };

  const toggleLeadTeam = (value: string) => {
    setSelectedLeadTeams(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]));
  };

  const clearLeadRecebidosFilters = () => {
    setSelectedLeadSources([]);
    setSelectedLeadSellers([]);
    setSelectedLeadTeams([]);
  };

  const searchPlaceholder = activeTab === 'campanhas' ? 'Buscar campanhas…' : 'Buscar oportunidades';

  const activeCampaignFiltersCount = useMemo(() => {
    if (activeTab !== 'campanhas') return 0;
    const periodCount = campaignFilters.period !== '30d' ? 1 : 0;
    return periodCount + campaignFilters.channels.length + campaignFilters.campaigns.length;
  }, [activeTab, campaignFilters]);

  const leadFiltersCount = useMemo(() => {
    return Object.entries(leadFilters).reduce((count, [key, value]) => {
      return value !== LEAD_FILTER_DEFAULTS[key as keyof LeadFilters] ? count + 1 : count;
    }, 0);
  }, [leadFilters]);

  const filtersCount = useMemo(() => {
    if (activeTab === 'campanhas') return activeCampaignFiltersCount;
    if (activeTab === 'dashboard') return leadFiltersCount;
    return 0;
  }, [activeCampaignFiltersCount, activeTab, leadFiltersCount]);

  const imovelSelecionado = useMemo(
    () => indicadoresImoveis.find((item) => item.nome === selectedImovel) ?? indicadoresImoveis[0],
    [selectedImovel]
  );

  const leadsRecebidosRangeLabel = useMemo(() => {
    if (leadsRecebidosRange === 'custom') {
      return customIndicatorsRange
        ? `Período personalizado: ${formatDateRangeLabel(customIndicatorsRange)}`
        : 'Selecione um período específico';
    }

    if (leadsRecebidosRange === '7-dias') return 'Últimos 7 dias';
    if (leadsRecebidosRange === '15-dias') return 'Últimos 15 dias';
    return 'Últimos 30 dias';
  }, [customIndicatorsRange, leadsRecebidosRange]);

  const availableLeadSources = useMemo(() => leadsRecebidosPorFonte.map(item => item.fonte), []);
  const availableLeadSellers = useMemo(() => leadsRecebidosPorVendedor.map(item => item.vendedor), []);
  const availableLeadTeams = useMemo(
    () => Array.from(new Set(leadsRecebidosPorVendedor.map(item => item.equipe))),
    []
  );

  const filteredLeadsPorFonte = useMemo(
    () =>
      selectedLeadSources.length
        ? leadsRecebidosPorFonte.filter(item => selectedLeadSources.includes(item.fonte))
        : leadsRecebidosPorFonte,
    [selectedLeadSources]
  );

  const filteredLeadsPorVendedor = useMemo(
    () =>
      leadsRecebidosPorVendedor.filter(item => {
        if (selectedLeadSellers.length && !selectedLeadSellers.includes(item.vendedor)) return false;
        if (selectedLeadTeams.length && !selectedLeadTeams.includes(item.equipe)) return false;
        return true;
      }),
    [selectedLeadSellers, selectedLeadTeams]
  );

  const hasLeadRecebidosFilters =
    selectedLeadSources.length > 0 || selectedLeadSellers.length > 0 || selectedLeadTeams.length > 0;

  const leadsRecebidosInsights: Record<'fonte' | 'vendedor' | 'dia', { title: string; description: string }> = {
    fonte: {
      title: 'Leads recebidos por fonte',
      description: 'Tabela com a jornada completa dos leads por origem.',
    },
    vendedor: {
      title: 'Leads recebidos por vendedor',
      description: 'Visualize a lista de leads por corretor responsável.',
    },
    dia: {
      title: 'Leads recebidos por dia',
      description: 'Distribuição diária de leads para identificar picos de entrada.',
    },
  };

  const handleOpenCampaignDetails = (campaign: CampaignTableRow) => {
    setSelectedCampaign(campaign);
    setCampaignDrawerOpen(true);
  };

  const handleApplyLeadFilters = (filters: LeadFilters) => {
    setLeadFilters(filters);
  };

  const handleCampaignDrawerOpenChange = (open: boolean) => {
    setCampaignDrawerOpen(open);
    if (!open) {
      setSelectedCampaign(null);
    }
  };

  const openInsightDialog = (title: string, description?: string) => {
    setInsightDialog({
      title,
      description,
      rows: insightLeads,
    });
  };

  const handleIndicatorsRangeChange = (value: string) => {
    if (value === 'custom') {
      setLeadsRecebidosRange('custom');
      setDatePickerOpen(true);
      return;
    }

    setCustomIndicatorsRange(null);
    setLeadsRecebidosRange(value as '7-dias' | '15-dias' | '30-dias');
  };

  const handleCustomRangeSelect = (range: { start: string; end: string }) => {
    setCustomIndicatorsRange(range);
    setLeadsRecebidosRange('custom');
    setDatePickerOpen(false);
  };

  const handleLeadChartClick = (
    type: 'fonte' | 'vendedor' | 'dia',
    payload?: { fonte?: string; vendedor?: string; dia?: string }
  ) => {
    if (!payload) return;

    const titleMap = {
      fonte: payload.fonte ? `Leads da fonte ${payload.fonte}` : 'Leads por fonte',
      vendedor: payload.vendedor ? `Leads do vendedor ${payload.vendedor}` : 'Leads por vendedor',
      dia: payload.dia ? `Leads recebidos em ${payload.dia}` : 'Leads por dia',
    } as const;

    openInsightDialog(titleMap[type], 'Visualização detalhada dos leads filtrados pela seleção.');
  };

  const handleOpenAtendimentos = () =>
    openInsightDialog('Atendimentos ativos', 'Listagem completa dos leads em atendimento no período.');

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-5 border-b bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Indicadores de Leads</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard analítico e lista de leads</p>
      </div>

      {/* Barra de busca e filtro */}
      <div className="flex-shrink-0 space-y-3 p-5 bg-white border-b">
        <TopSearchBar
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          filtersCount={filtersCount}
          onOpenFilter={activeTab === 'dashboard' ? () => setLeadFiltersOpen(true) : undefined}
        />
        {activeTab === 'campanhas' && isCampaignsLoading && (
          <span className="text-xs text-muted-foreground">Carregando campanhas...</span>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="flex-shrink-0 px-5 pb-3 pt-2 bg-white border-b">
          <TabsList className="grid w-full grid-cols-3 items-center rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="dashboard"
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="campanhas"
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Target className="w-4 h-4" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger
              value="lista"
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <TrendingUp className="w-4 h-4" />
              Lista de Leads
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="dashboard" className="p-5 space-y-6 m-0">
            {/* Métricas de performance */}
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Métricas de Performance</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Visão rápida da eficiência do funil: conversão, tempo médio de fechamento e tempo até a primeira interação.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-orange-700" />
                      </div>
                      <p className="text-sm font-semibold text-orange-800">Taxa de Conversão</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">{performanceMetrics.conversionRate}</p>
                    <p className="text-sm text-orange-700/80">
                      Leads convertidos em vendas no período: {performanceMetrics.totalConversions} de {performanceMetrics.totalLeadsPeriodo}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Timer className="w-5 h-5 text-blue-700" />
                      </div>
                      <p className="text-sm font-semibold text-blue-800">Tempo Médio de Conversão</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{performanceMetrics.averageConversionTime}</p>
                    <p className="text-sm text-blue-700/80">Do primeiro contato até o fechamento.</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        <Zap className="w-5 h-5 text-emerald-700" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-800">Tempo de Primeira Interação</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700">{performanceMetrics.averageFirstInteraction}</p>
                    <p className="text-sm text-emerald-700/80">Primeiro contato após receber o lead.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Atendimentos Ativos */}
              <Card
                role="button"
                onClick={handleOpenAtendimentos}
                className="cursor-pointer transition hover:border-orange-200 h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Phone className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Atendimentos ativos</p>
                      <p className="text-3xl font-bold text-gray-900">105</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Clique para ver todos os atendimentos ativos.</p>
                </CardContent>
              </Card>

              {/* Visitas sem parecer */}
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Calendar className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Visitas sem parecer</p>
                      <p className="text-3xl font-bold text-gray-900">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Funil de Vendas Section */}
            <LeadsFunnelSection />

            {/* Gráficos de pizza adicionais (agora interativos) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tipo atendimento */}
              <Card
                role="button"
                onClick={() => openInsightDialog('Tipo de atendimento', 'Visualize os atendimentos presenciais e online.')}
                className="transition hover:border-orange-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg">Tipo atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tipoAtendimento}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {tipoAtendimento.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Clique para abrir a visão detalhada.</p>
                </CardContent>
              </Card>

              {/* Termômetro */}
              <Card
                role="button"
                onClick={() => openInsightDialog('Termômetro', 'Detalhe dos leads frios e quentes.')}
                className="transition hover:border-orange-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg">Termômetro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={termometro}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {termometro.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Clique para abrir a visão detalhada.</p>
                </CardContent>
              </Card>
            </div>

            {/* Motivos descarte e Última interação */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Motivos descarte */}
              <Card
                role="button"
                onClick={() => openInsightDialog('Motivos de descarte', 'Veja os leads por motivo de descarte.')}
                className="transition hover:border-orange-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg">Motivos descarte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={motivosDescarte}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {motivosDescarte.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Clique para abrir a visão detalhada.</p>
                </CardContent>
              </Card>

              {/* Última interação */}
              <Card
                role="button"
                onClick={() => openInsightDialog('Última interação', 'Acompanhe a distribuição por período de contato.')}
                className="transition hover:border-orange-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg">Última interação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ultimaInteracao}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {ultimaInteracao.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Clique para abrir a visão detalhada.</p>
                </CardContent>
              </Card>
            </div>

            {/* Leads Arquivados por Canal */}
            <Card
              role="button"
              onClick={() =>
                openInsightDialog(
                  'Leads arquivados por canal',
                  'Detalhamento completo dos leads arquivados em cada canal.'
                )
              }
              className="transition hover:border-orange-200"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Leads Arquivados por Canal</CardTitle>
                </div>
                <Select defaultValue="15-dias">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7-dias">7 dias</SelectItem>
                    <SelectItem value="15-dias">15 dias</SelectItem>
                    <SelectItem value="30-dias">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="w-full lg:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadsArquivadosPorCanal}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {leadsArquivadosPorCanal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-3">
                    {leadsArquivadosPorCanal.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700 flex-1">{item.name}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráficos de Leads Recebidos */}
            <Card className="transition hover:border-orange-200">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Leads Recebidos</CardTitle>
                </div>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={leadsRecebidosRange} onValueChange={handleIndicatorsRangeChange}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7-dias">7 dias</SelectItem>
                        <SelectItem value="15-dias">15 dias</SelectItem>
                        <SelectItem value="30-dias">30 dias</SelectItem>
                        <SelectItem value="custom">Data específica</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => setDatePickerOpen(true)}
                    >
                      Escolher datas
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => setLeadsRecebidosFilterOpen(true)}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filtrar fontes e vendedores
                    </Button>
                    <span className="text-sm text-muted-foreground">{leadsRecebidosRangeLabel}</span>
                    {hasLeadRecebidosFilters && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-200">
                        Filtros ativos
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-orange-600"
                    onClick={() =>
                      openInsightDialog(
                        leadsRecebidosInsights[leadsRecebidosTab].title,
                        leadsRecebidosInsights[leadsRecebidosTab].description
                      )
                    }
                  >
                    Ver indicadores
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={leadsRecebidosTab}
                  onValueChange={(value) => setLeadsRecebidosTab(value as 'fonte' | 'vendedor' | 'dia')}
                >
                  <TabsList className="grid w-full grid-cols-3 items-center rounded-lg bg-muted/60 p-1">
                    <TabsTrigger
                      value="fonte"
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Por fonte
                    </TabsTrigger>
                    <TabsTrigger
                      value="vendedor"
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Por vendedor
                    </TabsTrigger>
                    <TabsTrigger
                      value="dia"
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Por dia
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fonte" className="mt-4">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredLeadsPorFonte} margin={{ bottom: 80 }}>
                          <XAxis
                            dataKey="fonte"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={10}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="leads"
                            fill="hsl(var(--accentSoft))"
                            radius={[6, 6, 0, 0]}
                            cursor="pointer"
                            onClick={(data) => handleLeadChartClick('fonte', data.payload)}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="vendedor" className="mt-4">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredLeadsPorVendedor}>
                          <XAxis
                            dataKey="vendedor"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={10}
                          />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="leads"
                            stroke="hsl(var(--accentSoft))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--accentSoft))', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="dia" className="mt-4">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={leadsRecebidosPorDia}>
                          <XAxis dataKey="dia" tickLine={false} axisLine={false} fontSize={12} interval={0} angle={-25} textAnchor="end" height={70} />
                          <YAxis tickLine={false} axisLine={false} fontSize={12} />
                          <Tooltip />
                          <Bar
                            dataKey="leads"
                            fill="#fb923c"
                            radius={[6, 6, 0, 0]}
                            cursor="pointer"
                            onClick={(data) => handleLeadChartClick('dia', data.payload)}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Veja quantos leads foram recebidos em cada dia da semana para identificar os melhores momentos de entrada.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Imóveis com mais leads */}
            <Card className="transition hover:border-orange-200">
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Imóveis com mais leads</CardTitle>
                </div>
                <div className="w-full lg:w-80">
                  <p className="text-sm text-muted-foreground mb-2">Filtrar imóvel</p>
                  <Select value={selectedImovel} onValueChange={setSelectedImovel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      {indicadoresImoveis.map((imovel) => (
                        <SelectItem key={imovel.nome} value={imovel.nome}>
                          {imovel.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-start">
                  <div className="space-y-3">
                    {imoveisComMaisLeads.map((imovel, index) => {
                      const isSelected = imovel.nome === selectedImovel;
                      return (
                        <button
                          key={imovel.nome}
                          type="button"
                          onClick={() => setSelectedImovel(imovel.nome)}
                          className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                            isSelected ? 'border-orange-300 bg-orange-50' : 'border-transparent bg-gray-50 hover:border-orange-200'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{imovel.icon}</span>
                            <span className="font-medium text-gray-900">{imovel.nome}</span>
                          </div>
                          <span className="text-lg font-semibold text-orange-600">{imovel.leads} leads</span>
                        </button>
                      );
                    })}
                    <div className="text-center mt-4">
                      <Button
                        variant="ghost"
                        className="text-orange-600"
                        onClick={() =>
                          openInsightDialog(
                            'Imóveis com mais leads',
                            'Consulte todos os leads relacionados aos imóveis em destaque.'
                          )
                        }
                      >
                        Ver todos
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/40 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Leads recebidos</span>
                      <span className="text-2xl font-semibold text-orange-600">{formatNumberBR(imovelSelecionado?.leads ?? 0)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md bg-white p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">Visitas agendadas</p>
                        <p className="text-lg font-semibold">{formatNumberBR(imovelSelecionado?.visitas ?? 0)}</p>
                      </div>
                      <div className="rounded-md bg-white p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">Propostas enviadas</p>
                        <p className="text-lg font-semibold">{formatNumberBR(imovelSelecionado?.propostas ?? 0)}</p>
                      </div>
                      <div className="rounded-md bg-white p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">Vendas realizadas</p>
                        <p className="text-lg font-semibold">{formatNumberBR(imovelSelecionado?.vendas ?? 0)}</p>
                      </div>
                      <div className="rounded-md bg-white p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">Ticket médio</p>
                        <p className="text-lg font-semibold">{formatCurrencyBRL(imovelSelecionado?.ticketMedio ?? 0)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-orange-600"
                      onClick={() =>
                        openInsightDialog(
                          'Indicadores do imóvel selecionado',
                          'Detalhe completo dos leads recebidos para o imóvel escolhido.'
                        )
                      }
                    >
                      Ver indicadores completos
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Clique no ranking ou selecione no filtro para ver quantos leads e indicadores cada imóvel recebeu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campanhas" className="m-0 p-4">
            {activeTab === 'campanhas' && (
              <CampaignsTab
                search={searchValue}
                filters={campaignFilters}
                onFiltersChange={setCampaignFilters}
                onOpenDetails={handleOpenCampaignDetails}
                onLoadingChange={setCampaignsLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="lista" className="p-4 m-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lista de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadsList />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <LeadFiltersSheet
        open={isLeadFiltersOpen}
        onOpenChange={setLeadFiltersOpen}
      filters={leadFilters}
      onApply={handleApplyLeadFilters}
    />

      <Dialog open={isLeadsRecebidosFilterOpen} onOpenChange={setLeadsRecebidosFilterOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filtrar por fonte e vendedor</DialogTitle>
            <DialogDescription>
              Selecione as origens, vendedores ou equipes para ajustar os gráficos de leads recebidos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Fontes</p>
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                {availableLeadSources.map(source => (
                  <label key={source} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-white">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedLeadSources.includes(source)}
                        onCheckedChange={() => toggleLeadSource(source)}
                      />
                      <span className="text-sm text-foreground">{source}</span>
                    </div>
                    {selectedLeadSources.includes(source) && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-200">
                        Ativo
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Vendedores</p>
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                {availableLeadSellers.map(seller => (
                  <label key={seller} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-white">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedLeadSellers.includes(seller)}
                        onCheckedChange={() => toggleLeadSeller(seller)}
                      />
                      <span className="text-sm text-foreground">{seller}</span>
                    </div>
                    {selectedLeadSellers.includes(seller) && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-200">
                        Selecionado
                      </Badge>
                    )}
                  </label>
                ))}
              </div>

              <p className="text-sm font-semibold text-foreground">Equipe</p>
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                {availableLeadTeams.map(team => (
                  <label key={team} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white">
                    <Checkbox
                      checked={selectedLeadTeams.includes(team)}
                      onCheckedChange={() => toggleLeadTeam(team)}
                    />
                    <span className="text-sm text-foreground">{team}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {selectedLeadSources.map(source => (
                <Badge key={source} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                  Fonte: {source}
                </Badge>
              ))}
              {selectedLeadSellers.map(seller => (
                <Badge key={seller} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                  Vendedor: {seller}
                </Badge>
              ))}
              {selectedLeadTeams.map(team => (
                <Badge key={team} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                  Equipe: {team}
                </Badge>
              ))}
              {!hasLeadRecebidosFilters && (
                <span className="text-sm text-muted-foreground">Nenhum filtro aplicado.</span>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={clearLeadRecebidosFilters}>
                Limpar
              </Button>
              <Button onClick={() => setLeadsRecebidosFilterOpen(false)}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DateRangePicker
        open={isDatePickerOpen}
        onOpenChange={setDatePickerOpen}
        onSelect={handleCustomRangeSelect}
        initialRange={customIndicatorsRange}
      />

      <Dialog open={!!insightDialog} onOpenChange={(open) => !open && setInsightDialog(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{insightDialog?.title}</DialogTitle>
            {insightDialog?.description && (
              <DialogDescription>{insightDialog.description}</DialogDescription>
            )}
            <p className="text-sm text-muted-foreground">
              Nesta visão você vê a fase do funil e a etapa do atendimento separadamente, como no detalhamento do
              print de atendimentos.
            </p>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/20">
            <Table>
              <TableHeader>
                <TableRow>
                  {baseInsightColumns.map((column) => (
                    <TableHead key={column.key} className={column.className}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {insightDialog?.rows.map((row, index) => (
                  <TableRow key={`${row.codigo}-${index}`}>
                    {baseInsightColumns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Drawer open={isCampaignDrawerOpen} onOpenChange={handleCampaignDrawerOpenChange}>
        <DrawerContent className="max-h-[85dvh] p-0">
          <DrawerHeader className="px-6 pt-6 text-left">
            <DrawerTitle>Detalhes da campanha</DrawerTitle>
            {selectedCampaign ? (
              <DrawerDescription className="space-y-2">
                <div>
                  <p className="text-base font-semibold text-foreground">{selectedCampaign.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.channelName}</p>
                </div>
                <Badge variant={selectedCampaign.status === 'ativo' ? 'success' : 'secondary'}>
                  {selectedCampaign.status === 'ativo' ? 'Ativa' : 'Pausada'}
                </Badge>
              </DrawerDescription>
            ) : (
              <DrawerDescription>
                Selecione uma campanha para visualizar seus indicadores.
              </DrawerDescription>
            )}
          </DrawerHeader>
          {selectedCampaign && (
            <div className="space-y-6 px-6 pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Leads captados', value: formatNumberBR(selectedCampaign.leads) },
                  { label: 'Oportunidades', value: formatNumberBR(selectedCampaign.opportunities) },
                  { label: 'Vendas', value: formatNumberBR(selectedCampaign.conversions) },
                  {
                    label: 'Taxa de conversão',
                    value: `${selectedCampaign.conversionRate.toFixed(1)}%`,
                  },
                ].map(metric => (
                  <Card key={metric.label}>
                    <CardContent className="space-y-1 p-4">
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {metric.label}
                      </span>
                      <span className="text-xl font-semibold text-foreground">{metric.value}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Investimento', value: formatCurrencyBRL(selectedCampaign.spend) },
                  { label: 'Receita gerada', value: formatCurrencyBRL(selectedCampaign.revenue) },
                  { label: 'Custo por lead', value: formatCurrencyBRL(selectedCampaign.costPerLead) },
                  { label: 'ROI', value: `${selectedCampaign.roi.toFixed(1)}x` },
                ].map(metric => (
                  <Card key={metric.label}>
                    <CardContent className="space-y-1 p-4">
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {metric.label}
                      </span>
                      <span className="text-xl font-semibold text-foreground">{metric.value}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <DrawerFooter className="border-t bg-muted/40">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Fechar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
