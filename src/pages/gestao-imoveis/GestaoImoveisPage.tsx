import { useCallback, useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import {
  ArrowUpRight,
  BarChart3,
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Filter,
  Image as ImageIcon,
  Link2,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  X
} from 'lucide-react';
import { matchPath, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/routes/appRoutes';
import type { TeamRoute } from './components/equipe/EquipeTabContent';
import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard';
import { PropertyFilterModal, type PropertyFilters } from '@/components/imoveis/PropertyFilterModal';
import type { ProposalSummary } from '@/components/imoveis/ProposalStatusBadge';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { EquipeTabContent } from './components/equipe/EquipeTabContent';
import type { Availability } from '@/features/properties/types';
import {
  bulkAtualizarDisponibilidade,
  bulkAtualizarSituacao,
  fetchGestaoImoveis,
  fetchGestaoResumo,
  formatDisponibilidadeLabel,
  formatSituacaoLabel,
  getCondominioProperties,
  GESTAO_DISPONIBILIDADE_OPTIONS,
  GESTAO_SITUACAO_OPTIONS,
  linkPropertiesToCondominio,
  listCondominios,
  type GestaoCondominio,
  type GestaoImovel,
  type GestaoResumo,
  type GestaoResumoRange,
  unlinkPropertyFromCondominio
} from '@/services/gestaoImoveis';
import { FunnelAmpulheta, type FunnelStep } from '@/components/sales/FunnelAmpulheta';

const FILTER_STORAGE_KEY = 'gestao-imoveis.ui.filters.v2';
const LAYOUT_STORAGE_KEY = 'gestao-imoveis.ui.layout-collapsed';

interface FiltersState extends PropertyFilters {
  // Extend PropertyFilters for compatibility
  proposalUpdatedFrom?: string;
  proposalUpdatedTo?: string;
  proposalValueMin?: number;
  proposalValueMax?: number;
  proposalResponsible?: string;
  proposalSearch?: string;
}

const defaultFilters: FiltersState = {
  codigo: '',
  situacoes: [],
  disponibilidades: [],
  equipes: [],
  origens: [],
  proposalStatus: [],
  dateRange: undefined,
  proposalUpdatedFrom: undefined,
  proposalUpdatedTo: undefined,
  proposalValueMin: undefined,
  proposalValueMax: undefined,
  proposalResponsible: undefined,
  proposalSearch: ''
};

type CondoModalState = { type: null } | { type: 'linked'; condo: GestaoCondominio };

type TeamOverlayState = TeamRoute;

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('pt-BR');

const parseValidDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const resolveTab = (tab: string | null): 'imoveis' | 'condominios' | 'equipe' | 'relatorios' => {
  if (tab === 'condominios' || tab === 'equipe' || tab === 'relatorios') {
    return tab;
  }
  return 'imoveis';
};

function formatVariation(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return { text: '0%', className: 'text-muted-foreground' };
  }
  if (!value) {
    return { text: '0%', className: 'text-muted-foreground' };
  }
  const text = `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  const className = value > 0 ? 'text-emerald-600' : value < 0 ? 'text-red-500' : 'text-muted-foreground';
  return { text, className };
}

const loadStoredFilters = (): FiltersState => {
  if (typeof window === 'undefined') return defaultFilters;
  try {
    const raw = window.localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return defaultFilters;
    const parsed = JSON.parse(raw) as Partial<FiltersState & { dateRange?: { from?: string; to?: string } }>;
    const dateRange = parsed.dateRange
      ? {
          from: parsed.dateRange.from ? new Date(parsed.dateRange.from) : undefined,
          to: parsed.dateRange.to ? new Date(parsed.dateRange.to) : undefined
        }
      : undefined;
    return {
      ...defaultFilters,
      ...parsed,
      dateRange,
      situacoes: Array.isArray(parsed?.situacoes) ? parsed?.situacoes : [],
      disponibilidades: Array.isArray(parsed?.disponibilidades) ? parsed?.disponibilidades : [],
      equipes: Array.isArray(parsed?.equipes) ? parsed?.equipes : [],
      origens: Array.isArray(parsed?.origens) ? parsed?.origens : [],
      proposalStatus: Array.isArray(parsed?.proposalStatus) ? parsed?.proposalStatus : []
    };
  } catch (error) {
    console.warn('[GestaoImoveisPage] Failed to parse stored filters', error);
    return defaultFilters;
  }
};

const placeholderImages = [
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80'
];

type PropertyReportData = {
  leadsTotal: number;
  newLeads: number;
  visitsScheduled: number;
  visitsDone: number;
  proposals: number;
  proposalsApproved: number;
  proposalsUnderReview: number;
  archivedLeads: number;
  conversionRate: number;
  hotScore: number;
  lastUpdated: Date;
  averageTicket: number;
  projectedRevenue: number;
  leadsByPortal: { portal: string; novos: number; total: number }[];
  insights: string[];
  nextSteps: string[];
};

const FUNNEL_STAGE_ORDER: string[] = [
  'Pré-Atendimento',
  'Em Atendimento',
  'Agendamento',
  'Visita',
  'Proposta Enviada',
  'Negócio Fechado',
  'Indicação',
  'Receita Gerada',
  'Pós-venda'
];

const buildPropertyFunnel = (report: PropertyReportData): FunnelStep[] => {
  const total = Math.max(report.leadsTotal, 1);
  const weights = [18, 14, 12, 10, 10, 8, 8, 10, 10];
  const initialValues = weights.map(weight => Math.max(0, Math.round((weight / 100) * total)));
  const sum = initialValues.reduce((acc, value) => acc + value, 0);
  let remainder = total - sum;

  while (remainder !== 0) {
    for (let index = 0; index < initialValues.length && remainder !== 0; index += 1) {
      const nextValue = initialValues[index] + Math.sign(remainder);
      initialValues[index] = Math.max(0, nextValue);
      remainder -= Math.sign(remainder);
    }
  }

  return FUNNEL_STAGE_ORDER.map((label, index) => {
    const value = initialValues[index] ?? 0;
    return {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      value,
      percent: total > 0 ? (value / total) * 100 : 0
    };
  });
};

const buildReportData = (imovel: GestaoImovel): PropertyReportData => {
  const seed = imovel.codigo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const leadsTotal = (seed % 32) + 14;
  const newLeads = Math.max(4, seed % 14);
  const visitsScheduled = (seed % 10) + 5;
  const visitsDone = Math.max(2, visitsScheduled - ((seed % 3) + 1));
  const proposals = (seed % 6) + 1;
  const proposalsApproved = Math.max(0, Math.floor(proposals / 2));
  const proposalsUnderReview = Math.max(1, proposals - proposalsApproved);
  const archivedLeads = seed % 8;
  const conversionRate = Math.min(95, Math.round((visitsDone / Math.max(leadsTotal, 1)) * 100) + (seed % 8));
  const hotScore = Math.min(100, 60 + (seed % 38));
  const lastUpdated = new Date(Date.now() - (seed % 5) * 24 * 60 * 60 * 1000);
  const valorBase = imovel.valor ?? 750000;
  const averageTicket = Math.round(valorBase * (1 + (seed % 8) / 100));
  const projectedRevenue = proposalsApproved * averageTicket;

  const leadsByPortal = [
    { portal: 'Portal imobiliário', weight: 0.32 },
    { portal: 'Site próprio', weight: 0.24 },
    { portal: 'Social Ads', weight: 0.22 },
    { portal: 'Indicações', weight: 0.22 }
  ].map((portal, index) => {
    const total = Math.max(0, Math.round(leadsTotal * portal.weight + ((seed + index * 7) % 4) - 1));
    const novos = Math.max(0, Math.round(total * 0.45));
    return { portal: portal.portal, total, novos };
  });

  const insights = [
    `Maior tração vem de ${leadsByPortal[0]?.portal ?? 'portais digitais'}.`,
    `Taxa de conversão em ${conversionRate}% com ${visitsDone} visitas realizadas.`,
    `Ticket médio projetado em ${currencyFormatter.format(averageTicket)}.`
  ];

  const nextSteps = [
    'Reforce as fotos e a descrição em Social Ads.',
    'Ajuste o preço para ganhar competitividade nesta semana.',
    'Ative disparos de follow-up para leads mais antigos.'
  ];

  return {
    leadsTotal,
    newLeads,
    visitsScheduled,
    visitsDone,
    proposals,
    proposalsApproved,
    proposalsUnderReview,
    archivedLeads,
    conversionRate,
    hotScore,
    lastUpdated,
    averageTicket,
    projectedRevenue,
    leadsByPortal,
    insights,
    nextSteps
  };
};

export default function GestaoImoveisPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'imoveis' | 'condominios' | 'equipe' | 'relatorios'>(() =>
    resolveTab(searchParams.get('tab'))
  );
  const [filters, setFilters] = useState<FiltersState>(() => loadStoredFilters());
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.codigo);
  const [properties, setProperties] = useState<GestaoImovel[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [resumoRange, setResumoRange] = useState<GestaoResumoRange>('30d');
  const [resumo, setResumo] = useState<GestaoResumo | null>(null);
  const [resumoLoading, setResumoLoading] = useState(true);
  const [layoutCollapsed, setLayoutCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(LAYOUT_STORAGE_KEY) === 'true';
  });
  const [condominios, setCondominios] = useState<GestaoCondominio[]>([]);
  const [condominioSearch, setCondominioSearch] = useState('');
  const [condominiosLoading, setCondominiosLoading] = useState(true);
  const [condoModal, setCondoModal] = useState<CondoModalState>({ type: null });
  const [linkedProperties, setLinkedProperties] = useState<GestaoImovel[]>([]);
  const [linkedLoading, setLinkedLoading] = useState(false);
  const [linkSelection, setLinkSelection] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<GestaoImovel | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [proposalFiltersOpen, setProposalFiltersOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState('');
  const [reportSelectedCode, setReportSelectedCode] = useState<string | null>(null);
  const teamRoute = useMemo<TeamOverlayState | null>(() => {
    if (matchPath({ path: ROUTES.TEAM_NEW, end: true }, location.pathname)) {
      return { type: 'create' };
    }
    const performanceMatch = matchPath(
      { path: ROUTES.TEAM_PERF(':id'), end: true },
      location.pathname,
    );
    if (performanceMatch?.params?.id) {
      return { type: 'detail', teamId: performanceMatch.params.id, section: 'performance' };
    }
    const detailMatch = matchPath(
      { path: ROUTES.TEAM_VIEW(':id'), end: false },
      location.pathname,
    );
    if (detailMatch?.params?.id) {
      return { type: 'detail', teamId: detailMatch.params.id };
    }
    return null;
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    const tab = resolveTab(value);
    setActiveTab(tab);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (tab === 'imoveis') {
        next.delete('tab');
      } else {
        next.set('tab', tab);
      }
      return next;
    });
  };

  useEffect(() => {
    const tabFromParams = resolveTab(searchParams.get('tab'));
    const desiredTab = teamRoute ? 'equipe' : tabFromParams;
    if (desiredTab !== activeTab) {
      setActiveTab(desiredTab);
    }
  }, [activeTab, searchParams, teamRoute]);

  useEffect(() => {
    let active = true;
    setPropertiesLoading(true);
    fetchGestaoImoveis()
      .then(data => {
        if (!active) return;
        setProperties(data);
      })
      .finally(() => {
        if (active) setPropertiesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setResumoLoading(true);
    fetchGestaoResumo(resumoRange)
      .then(data => {
        if (!active) return;
        setResumo(data);
      })
      .finally(() => {
        if (active) setResumoLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resumoRange]);

  useEffect(() => {
    let active = true;
    setCondominiosLoading(true);
    listCondominios()
      .then(data => {
        if (!active) return;
        setCondominios(data);
      })
      .finally(() => {
        if (active) setCondominiosLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeCondo = useMemo(() => {
    if (condoModal.type === 'linked') {
      const linkedCondo = (condoModal as { type: 'linked'; condo: GestaoCondominio }).condo;
      return (
        condominios.find(condo => condo.id === linkedCondo.id) ?? linkedCondo
      );
    }
    return null;
  }, [condoModal, condominios]);

  useEffect(() => {
    if (condoModal.type === 'linked' && activeCondo) {
      setLinkedLoading(true);
      getCondominioProperties(activeCondo.id)
        .then(setLinkedProperties)
        .finally(() => setLinkedLoading(false));
    }
  }, [condoModal, activeCondo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters]);

  useEffect(() => {
    setSelectedProperties(prev => {
      const allowedIds = new Set(properties.map(item => item.id));
      const next = new Set(Array.from(prev).filter(id => allowedIds.has(id)));
      return next;
    });
  }, [properties]);

  useEffect(() => {
    if (!reportSelectedCode && properties.length) {
      setReportSelectedCode(properties[0].codigo);
    }
  }, [properties, reportSelectedCode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, layoutCollapsed ? 'true' : 'false');
  }, [layoutCollapsed]);

  const availableEquipes = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(item => {
      if (item.equipe) set.add(item.equipe);
    });
    return Array.from(set);
  }, [properties]);

  const availableOrigens = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(item => {
      if (item.origem) set.add(item.origem);
    });
    return Array.from(set);
  }, [properties]);

  const availableResponsaveis = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(item => {
      if (item.captador) set.add(item.captador);
    });
    return Array.from(set);
  }, [properties]);

  const filteredReportOptions = useMemo(() => {
    const query = reportSearch.trim().toLowerCase();
    if (!query) return properties;
    return properties.filter(item => {
      const haystack = `${item.codigo} ${item.titulo} ${item.bairro} ${item.cidade}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [properties, reportSearch]);

  const reportProperty = useMemo(() => {
    if (!reportSelectedCode) return null;
    return properties.find(item => item.codigo === reportSelectedCode) ?? null;
  }, [properties, reportSelectedCode]);

  const propertyReport = useMemo<PropertyReportData | null>(() => {
    if (!reportProperty) return null;
    return buildReportData(reportProperty);
  }, [reportProperty]);

  const propertyFunnelData = useMemo<FunnelStep[]>(() => {
    if (!propertyReport) return [];
    return buildPropertyFunnel(propertyReport);
  }, [propertyReport]);

  const handleCloseTeamRoute = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'equipe');
    next.delete('teamView');
    next.delete('teamSection');
    navigate({
      pathname: ROUTES.GESTAO_IMOVEIS,
      search: next.toString()
    });
  }, [navigate, searchParams]);
  const hasProposalFilter = filters.proposalStatus?.length > 0 || filters.situacoes.includes('proposta');

  const filteredProperties = useMemo(() => {
    const query = filters.codigo.trim().toLowerCase();
    return properties.filter(item => {
      if (hasProposalFilter && !item.hasActiveProposal) return false;

      if (query) {
        const haystack = `${item.codigo} ${item.titulo} ${item.bairro} ${item.cidade} ${item.origem}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.situacoes.length) {
        const wantsProposalStage = filters.situacoes.includes('proposta');
        const otherStages = filters.situacoes.filter(stage => stage !== 'proposta');
        const matchesStandardStage = otherStages.includes(item.situacao);
        const matchesProposalStage = wantsProposalStage &&
          (
            item.hasActiveProposal ||
            ['proposta', 'em_negociacao', 'reservado'].includes(item.proposalStage || 'sem_proposta')
          );

        if (!matchesStandardStage && !matchesProposalStage) return false;
      }
      if (filters.disponibilidades.length && !filters.disponibilidades.includes(item.disponibilidade)) return false;
      if (filters.equipes.length && !filters.equipes.includes(item.equipe)) return false;
      if (filters.origens.length && !filters.origens.includes(item.origem)) return false;

      // Filter by proposal status
      if (filters.proposalStatus?.length) {
        const matchesProposal = filters.proposalStatus.some(status => {
          if (status === 'sem_proposta') return !item.hasActiveProposal && !item.reservedFlag;
          if (status === 'com_proposta') return Boolean(item.hasActiveProposal);
          if (status === 'em_negociacao') return item.proposalStage === 'em_negociacao';
          if (status === 'reservado') return item.proposalStage === 'reservado' || item.reservedFlag;
          if (status === 'proposta') return item.proposalStage === 'proposta';
          return false;
        });

        if (!matchesProposal) return false;
      }
      
      // Filter by date range
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const captadoDate = new Date(item.captadoEm);
        if (filters.dateRange.from && captadoDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && captadoDate > filters.dateRange.to) return false;
      }

      if (hasProposalFilter) {
        if (filters.proposalUpdatedFrom || filters.proposalUpdatedTo) {
          const lastUpdate = item.lastProposalUpdateAt ? new Date(item.lastProposalUpdateAt) : null;
          if (filters.proposalUpdatedFrom) {
            const from = new Date(filters.proposalUpdatedFrom);
            if (!lastUpdate || lastUpdate < from) return false;
          }
          if (filters.proposalUpdatedTo) {
            const to = new Date(filters.proposalUpdatedTo);
            if (!lastUpdate || lastUpdate > to) return false;
          }
        }

        const proposalValue = item.proposalValue ?? item.valor;
        if (typeof filters.proposalValueMin === 'number' && proposalValue < filters.proposalValueMin) return false;
        if (typeof filters.proposalValueMax === 'number' && proposalValue > filters.proposalValueMax) return false;

        if (filters.proposalResponsible && item.captador !== filters.proposalResponsible) return false;

        if (filters.proposalSearch) {
          const haystack = `${item.titulo} ${item.codigo} ${item.origem} ${item.linkedNegotiationId ?? ''}`.toLowerCase();
          if (!haystack.includes(filters.proposalSearch.toLowerCase())) return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const activeFiltersCount = useMemo(
    () =>
      filters.situacoes.length +
      filters.disponibilidades.length +
      filters.equipes.length +
      filters.origens.length +
      filters.proposalStatus.length +
      (filters.dateRange?.from || filters.dateRange?.to ? 1 : 0) +
      (filters.codigo ? 1 : 0),
    [filters]
  );
  const proposalFiltersCount = useMemo(
    () =>
      (hasProposalFilter ?
        [
          filters.proposalStatus.length,
          filters.proposalUpdatedFrom ? 1 : 0,
          filters.proposalUpdatedTo ? 1 : 0,
          typeof filters.proposalValueMin === 'number' ? 1 : 0,
          typeof filters.proposalValueMax === 'number' ? 1 : 0,
          filters.proposalResponsible ? 1 : 0,
          filters.proposalSearch ? 1 : 0
        ].reduce((acc, curr) => acc + curr, 0)
        : 0
      ),
    [filters, hasProposalFilter]
  );
  const statusSelectValue = filters.situacoes[0] ?? 'todas';

  const handleApplyFilters = useCallback((newFilters: PropertyFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setSearchTerm(newFilters.codigo);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedProperties(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProperties(new Set());
  }, []);

  const selectAllOnPage = useCallback(() => {
    setSelectedProperties(new Set(filteredProperties.map(item => item.id)));
  }, [filteredProperties]);

  const selectedCount = selectedProperties.size;

  const filteredCondominios = useMemo(() => {
    const query = condominioSearch.trim().toLowerCase();
    if (!query) return condominios;
    return condominios.filter(condo =>
      [condo.nome, condo.cidade, condo.estado].some(field =>
        field.toLowerCase().includes(query)
      )
    );
  }, [condominios, condominioSearch]);

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/', { replace: false });
        break;
      case 'vendas':
        navigate('/vendas', { replace: false });
        break;
      case 'servicos':
        navigate('/servicos', { replace: false });
        break;
      case 'agenda':
        navigate('/agenda', { replace: false });
        break;
      case 'imoveis':
        navigate('/imoveis', { replace: false });
        break;
      case 'gestao-imoveis':
        setActiveTab('imoveis');
        navigate('/gestao-imoveis', { replace: false });
        break;
      default:
        break;
    }
  };

  const handleApplyReportFilter = useCallback(() => {
    if (reportSearch.trim()) {
      const match = properties.find(item => item.codigo.toLowerCase() === reportSearch.trim().toLowerCase());
      if (match) {
        setReportSelectedCode(match.codigo);
        return;
      }
      toast({
        title: 'Imóvel não encontrado',
        description: 'Nenhum resultado para o código informado.',
        variant: 'destructive'
      });
      return;
    }
    if (filteredReportOptions.length) {
      setReportSelectedCode(filteredReportOptions[0].codigo);
    }
  }, [filteredReportOptions, properties, reportSearch, toast]);

  const handleClearReportFilters = useCallback(() => {
    setReportSearch('');
    if (properties.length) {
      setReportSelectedCode(properties[0].codigo);
    } else {
      setReportSelectedCode(null);
    }
  }, [properties]);

  const applyPropertyUpdates = (updated: GestaoImovel[]) => {
    if (!updated.length) return;
    setProperties(prev =>
      prev.map(item => {
        const match = updated.find(u => u.id === item.id);
        return match ? match : item;
      })
    );
  };

  const handleSingleSituacao = async (imovel: GestaoImovel, situacao: string) => {
    try {
      const updated = await bulkAtualizarSituacao([imovel.id], situacao as any);
      applyPropertyUpdates(updated);
      toast({
        title: 'Situação atualizada',
        description: `Imóvel ${imovel.codigo} agora está em ${formatSituacaoLabel(
          situacao as any
        )}.`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Não foi possível atualizar o imóvel',
        description: 'Tente novamente em instantes.',
        variant: 'destructive'
      });
    }
  };

  const handleSingleDisponibilidade = async (imovel: GestaoImovel, disponibilidade: string) => {
    try {
      const updated = await bulkAtualizarDisponibilidade([imovel.id], disponibilidade as any);
      applyPropertyUpdates(updated);
      toast({
        title: 'Disponibilidade atualizada',
        description: `Imóvel ${imovel.codigo} agora está marcado como ${formatDisponibilidadeLabel(
          disponibilidade as any
        )}.`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Não foi possível atualizar o imóvel',
        description: 'Tente novamente em instantes.',
        variant: 'destructive'
      });
    }
  };

  const renderCardActions = (imovel: GestaoImovel) => (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="default"
        size="sm"
        className="bg-orange-500 text-white hover:bg-orange-400"
        onClick={() =>
          toast({
            title: 'Edição rápida em breve',
            description: 'A ficha completa do imóvel será aberta aqui assim que o serviço estiver disponível.'
          })
        }
      >
        <Pencil className="mr-1 h-3.5 w-3.5" />
        Editar ficha
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="gap-1">
            Mais ações
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>Situação</DropdownMenuLabel>
          {GESTAO_SITUACAO_OPTIONS.filter(option => option.value !== imovel.situacao).map(option => (
            <DropdownMenuItem
              key={option.value}
              onSelect={event => {
                event.preventDefault();
                handleSingleSituacao(imovel, option.value);
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Disponibilidade</DropdownMenuLabel>
          {GESTAO_DISPONIBILIDADE_OPTIONS.filter(option => option.value !== imovel.disponibilidade).map(option => (
            <DropdownMenuItem
              key={option.value}
              onSelect={event => {
                event.preventDefault();
                handleSingleDisponibilidade(imovel, option.value);
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={event => {
              event.preventDefault();
              navigate(`/condominios/${imovel.id}/atualizar?tab=lazer`);
            }}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Gerenciar fotos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const mapToCardProps = (imovel: GestaoImovel, index: number): PropertyCardProps => {
    const disponibilidade = formatDisponibilidadeLabel(imovel.disponibilidade) as Availability;
    const lastUpdatedDate = parseValidDate(imovel.atualizadoEm) ?? parseValidDate(imovel.captadoEm);
    const daysWithoutContact = lastUpdatedDate
      ? differenceInCalendarDays(new Date(), lastUpdatedDate)
      : undefined;
    const image = placeholderImages[index % placeholderImages.length];
    const hasProposalDetails = hasProposalFilter && imovel.hasActiveProposal;
    const captadoEmDate = parseValidDate(imovel.captadoEm);
    const lastUpdatedLabel = lastUpdatedDate?.toISOString() ?? imovel.atualizadoEm ?? imovel.captadoEm;

    return {
      id: index,
      code: imovel.codigo,
      title: imovel.titulo,
      city: `${imovel.bairro}, ${imovel.cidade} / ${imovel.estado}`,
      type: imovel.tipo,
      area: imovel.areaPrivativa,
      beds: imovel.quartos,
      baths: imovel.suites,
      parking: imovel.vagas,
      price: imovel.valor,
      disponibilidade,
      coverUrl: image,
      lastContact: lastUpdatedLabel,
      daysWithoutContact,
      statusBadge: formatSituacaoLabel(imovel.situacao),
      actions: renderCardActions(imovel),
      captador: imovel.captador
        ? {
            id: imovel.captador,
            nome: imovel.captador
          }
        : undefined,
      proposalData: hasProposalDetails
        ? {
            hasActiveProposal: Boolean(imovel.hasActiveProposal),
            activeProposalCount: imovel.activeProposalCount ?? 0,
            proposalStage: (imovel.proposalStage as ProposalSummary['proposalStage']) ?? 'proposta',
            lastProposalUpdateAt: imovel.lastProposalUpdateAt,
            reservedFlag: Boolean(imovel.reservedFlag),
            linkedNegotiationId: imovel.linkedNegotiationId,
            proposalValue: imovel.proposalValue,
            proposalDescription: imovel.proposalDescription
          }
        : undefined,
      showProposalDetails: hasProposalDetails,
      onProposalClick: hasProposalDetails ? () => setSelectedProposal(imovel) : undefined,
      selectable: true,
      selected: selectedProperties.has(imovel.id),
      onToggleSelect: () => toggleSelection(imovel.id),
      areaPrivativa: imovel.areaPrivativa,
      address: `${imovel.origem} • Captado em ${captadoEmDate ? captadoEmDate.toLocaleDateString('pt-BR') : 'Data não informada'}`
    };
  };

  const formatProposalDescription = (imovel: GestaoImovel) => {
    const statusLabel = imovel.situacao === 'em_negociacao' ? 'em negociação' : 'em proposta';
    const disponibilidade = formatDisponibilidadeLabel(imovel.disponibilidade);
    const lastUpdatedDate = parseValidDate(imovel.atualizadoEm);
    const lastUpdate = lastUpdatedDate
      ? lastUpdatedDate.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : 'Data não informada';

    return `Proposta ${statusLabel} para ${imovel.titulo} (${imovel.codigo}), com ${disponibilidade.toLowerCase()} e última atualização em ${lastUpdate}.`;
  };

  const closeCondoModal = () => {
    setCondoModal({ type: null });
    setLinkSelection('');
  };

  const handleLinkProperty = async () => {
    if (!activeCondo || !linkSelection) return;
    setLinkedLoading(true);
    try {
      const updated = await linkPropertiesToCondominio(activeCondo.id, [linkSelection]);
      if (updated) {
        setCondominios(prev => prev.map(item => (item.id === updated.id ? updated : item)));
        const list = await getCondominioProperties(updated.id);
        setLinkedProperties(list);
        setLinkSelection('');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Não foi possível vincular o imóvel',
        description: 'Confirme o código e tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLinkedLoading(false);
    }
  };

  const handleUnlinkProperty = async (code: string) => {
    if (!activeCondo) return;
    setLinkedLoading(true);
    try {
      const updated = await unlinkPropertyFromCondominio(activeCondo.id, code);
      if (updated) {
        setCondominios(prev => prev.map(item => (item.id === updated.id ? updated : item)));
        const list = await getCondominioProperties(updated.id);
        setLinkedProperties(list);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Não foi possível desvincular',
        description: 'Tente novamente em instantes.',
        variant: 'destructive'
      });
    } finally {
      setLinkedLoading(false);
    }
  };

  const availableLinkOptions = useMemo(() => {
    if (!activeCondo) return [];
    return properties.filter(item => !activeCondo.propertyCodes.includes(item.codigo));
  }, [activeCondo, properties]);

  return (
    <ResponsiveLayout activeTab="gestao-imoveis" setActiveTab={handleNavigate}>
      <div className="min-h-screen bg-white">

        <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Gestão de imóveis</h1>
                  <p className="text-sm text-gray-600">
                    Gerencie características, tipos e outras configurações relacionadas aos imóveis.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={resumoRange}
                  onValueChange={value => setResumoRange(value as GestaoResumoRange)}
                >
                  <SelectTrigger id="resumo-range" className="w-[200px] rounded-xl border-gray-200 bg-gray-50">
                    <SelectValue placeholder="Selecionar período" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="ytd">Ano atual (YTD)</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl border-gray-200 text-gray-700"
                  onClick={() => setLayoutCollapsed(prev => !prev)}
                >
                  {layoutCollapsed ? 'Expandir painel' : 'Recolher painel'}
                  {layoutCollapsed ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>

            {!layoutCollapsed && (
              <div className="mt-6">
                {resumoLoading ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : resumo ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {resumo.kpis
                      .filter(kpi => ['captados', 'ativos', 'vendidos', 'volumeCaptado'].includes(kpi.id))
                      .slice(0, 3)
                      .map(kpi => {
                        const variation = formatVariation(kpi.variation);
                        const value = kpi.type === 'currency'
                          ? currencyFormatter.format(kpi.value)
                          : numberFormatter.format(kpi.value);
                        return (
                          <div key={kpi.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                              <BadgeCheck className="h-4 w-4 text-orange-500" />
                            </div>
                            <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
                            <p className={cn('mt-2 text-xs font-medium', variation.className)}>
                              {variation.text} vs período anterior
                            </p>
                          </div>
                        );
                      })}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full max-w-4xl grid-cols-4 bg-gray-100 p-1">
              <TabsTrigger value="imoveis">Imóveis</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios por imóvel</TabsTrigger>
              <TabsTrigger value="condominios">Características</TabsTrigger>
              <TabsTrigger value="equipe">Segundo Bairro</TabsTrigger>
            </TabsList>


          <TabsContent value="imoveis" className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={event => {
                      setSearchTerm(event.target.value);
                      setFilters(prev => ({ ...prev, codigo: event.target.value }));
                    }}
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 pl-12 text-base text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <Button
                  type="button"
                  aria-label="Abrir filtros"
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-400"
                  onClick={() => setFilterModalOpen(true)}
                >
                  <Filter className="h-5 w-5" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-orange-600 shadow">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>

                {hasProposalFilter && (
                  <Popover open={proposalFiltersOpen} onOpenChange={setProposalFiltersOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="relative h-12 rounded-xl border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros de propostas
                        {proposalFiltersCount > 0 && (
                          <span className="ml-2 rounded-full bg-orange-600 px-2 py-0.5 text-xs font-semibold text-white">
                            {proposalFiltersCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[360px] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Propostas ativas</p>
                          <p className="text-xs text-muted-foreground">{properties.filter(item => item.hasActiveProposal).length} propostas disponíveis</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            proposalStatus: [],
                            proposalUpdatedFrom: undefined,
                            proposalUpdatedTo: undefined,
                            proposalValueMin: undefined,
                            proposalValueMax: undefined,
                            proposalResponsible: undefined,
                            proposalSearch: ''
                          }))}
                        >
                          Limpar filtros
                        </Button>
                      </div>

                      <div className="grid gap-3">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-700">Status da proposta</p>
                          <div className="flex flex-wrap gap-2">
                            {['proposta', 'em_negociacao', 'reservado'].map(status => (
                              <Button
                                key={status}
                                type="button"
                                variant={filters.proposalStatus.includes(status) ? 'default' : 'outline'}
                                size="sm"
                                className={filters.proposalStatus.includes(status) ? 'bg-orange-500 hover:bg-orange-400 text-white' : 'border-dashed'}
                                onClick={() => setFilters(prev => ({
                                  ...prev,
                                  proposalStatus: prev.proposalStatus.includes(status)
                                    ? prev.proposalStatus.filter(item => item !== status)
                                    : [...prev.proposalStatus, status]
                                }))}
                              >
                                {status === 'proposta' ? 'Recebida' : status === 'em_negociacao' ? 'Em negociação' : 'Reservado'}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-gray-700">Última atualização (de)</p>
                            <Input
                              type="date"
                              value={filters.proposalUpdatedFrom ?? ''}
                              onChange={event => setFilters(prev => ({ ...prev, proposalUpdatedFrom: event.target.value || undefined }))}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-gray-700">Última atualização (até)</p>
                            <Input
                              type="date"
                              value={filters.proposalUpdatedTo ?? ''}
                              onChange={event => setFilters(prev => ({ ...prev, proposalUpdatedTo: event.target.value || undefined }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-gray-700">Valor mínimo</p>
                            <Input
                              type="number"
                              inputMode="numeric"
                              value={filters.proposalValueMin ?? ''}
                              onChange={event => setFilters(prev => ({
                                ...prev,
                                proposalValueMin: event.target.value ? Number(event.target.value) : undefined
                              }))}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-gray-700">Valor máximo</p>
                            <Input
                              type="number"
                              inputMode="numeric"
                              value={filters.proposalValueMax ?? ''}
                              onChange={event => setFilters(prev => ({
                                ...prev,
                                proposalValueMax: event.target.value ? Number(event.target.value) : undefined
                              }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-gray-700">Responsável</p>
                          <Select
                            value={filters.proposalResponsible ?? ''}
                            onValueChange={value => setFilters(prev => ({ ...prev, proposalResponsible: value || undefined }))}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Selecionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Todos</SelectItem>
                              {availableResponsaveis.map(item => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-gray-700">Buscar por cliente, código ou observação</p>
                          <Input
                            value={filters.proposalSearch ?? ''}
                            onChange={event => setFilters(prev => ({ ...prev, proposalSearch: event.target.value }))}
                            placeholder="Digite para filtrar propostas"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <Select
                  value={statusSelectValue}
                  onValueChange={value => {
                    if (value === 'todas') {
                      setFilters(prev => ({ ...prev, situacoes: [] }));
                      return;
                    }
                    setFilters(prev => ({ ...prev, situacoes: [value] }));
                  }}
                >
                  <SelectTrigger className="h-12 w-64 rounded-xl border-gray-200 bg-gray-50 pr-3 text-left text-sm font-medium text-gray-800">
                    <SelectValue placeholder="Imóveis apenas no status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Imóveis apenas no status</SelectItem>
                    {GESTAO_SITUACAO_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {propertiesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-72 rounded-2xl bg-white shadow animate-pulse" />
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Nenhum imóvel encontrado</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ajuste a busca por código ou refine os filtros para localizar os imóveis desejados.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFilters(defaultFilters);
                        setSearchTerm('');
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map((imovel, index) => {
                    const cardProps = mapToCardProps(imovel, index);
                    return (
                      <div
                        key={imovel.id}
                        className="relative rounded-3xl border border-gray-100 bg-white p-1 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <PropertyCard {...cardProps} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedCount > 0 && (
              <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
                <div className="flex w-full max-w-4xl items-center justify-between rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-800">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">{selectedCount}</span>
                    <span>imóvel(is) selecionado(s)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
                      Limpar seleção
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={selectAllOnPage}>
                      Selecionar todos da página
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-orange-500 text-white hover:bg-orange-400"
                      onClick={() => toast({
                        title: 'Automação em massa',
                        description: `${selectedCount} imóvel(is) pronto(s) para automação.`,
                      })}
                    >
                      Aplicar automação
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="relatorios" className="space-y-6">
            <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Relatório por imóvel</h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Selecione o imóvel, informe o código ou navegue pelos resultados para visualizar KPIs dedicados.
                  </p>
                </div>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                  Dados mockados e prontos para navegação
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Imóvel</p>
                      <Select value={reportSelectedCode ?? undefined} onValueChange={value => setReportSelectedCode(value)}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                          <SelectValue placeholder="Escolha um imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredReportOptions.length ? (
                            filteredReportOptions.map(item => (
                              <SelectItem key={item.id} value={item.codigo}>
                                {item.codigo} · {item.titulo}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__empty" disabled>
                              Nenhum imóvel encontrado
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Código do imóvel</p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          value={reportSearch}
                          onChange={event => setReportSearch(event.target.value)}
                          placeholder="Ex: IMV-1000"
                          className="h-12 rounded-xl border-gray-200 bg-gray-50"
                        />
                        <Button
                          type="button"
                          className="h-12 gap-2 rounded-xl bg-orange-500 text-white shadow-sm hover:bg-orange-400"
                          onClick={handleApplyReportFilter}
                        >
                          <Search className="h-4 w-4" />
                          Buscar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleClearReportFilters}>
                      Limpar filtro
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-dashed"
                      onClick={() => reportProperty && setReportSearch(reportProperty.codigo)}
                    >
                      Preencher com código selecionado
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase text-orange-700">Resumo rápido</p>
                      <p className="text-base font-semibold text-gray-900">
                        {reportProperty ? `${reportProperty.codigo} · ${reportProperty.titulo}` : 'Selecione um imóvel'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reportProperty
                          ? `${reportProperty.bairro ?? 'Bairro não informado'}, ${reportProperty.cidade ?? 'Cidade não informada'} / ${reportProperty.estado ?? '--'}`
                          : 'Nenhum filtro aplicado'}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-orange-200 bg-white text-orange-700">
                      {propertyReport
                        ? `Atualizado há ${differenceInCalendarDays(new Date(), propertyReport.lastUpdated)} dia(s)`
                        : 'Aguardando seleção'}
                    </Badge>
                  </div>
                  {propertyReport && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">Score de interesse</p>
                        <p className="text-lg font-semibold text-gray-900">{propertyReport.hotScore}/100</p>
                        <p className="text-xs text-emerald-600">Engajamento saudável</p>
                      </div>
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">Conversão visitas/leads</p>
                        <p className="text-lg font-semibold text-gray-900">{propertyReport.conversionRate}%</p>
                        <p className="text-xs text-orange-600">{propertyReport.visitsDone} visitas realizadas</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {propertiesLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : reportProperty && propertyReport ? (
                <>
                  <div className="grid gap-4 md:grid-cols-4">
                    {[
                      {
                        label: 'Leads totais',
                        value: propertyReport.leadsTotal,
                        detail: `${propertyReport.newLeads} novos nesta janela`,
                        accent: 'bg-orange-50 text-orange-700'
                      },
                      {
                        label: 'Visitas',
                        value: propertyReport.visitsScheduled,
                        detail: `${propertyReport.visitsDone} realizadas`,
                        accent: 'bg-emerald-50 text-emerald-700'
                      },
                      {
                        label: 'Propostas',
                        value: propertyReport.proposals,
                        detail: `${propertyReport.proposalsApproved} aprovadas`,
                        accent: 'bg-sky-50 text-sky-700'
                      },
                      {
                        label: 'Arquivados',
                        value: propertyReport.archivedLeads,
                        detail: 'Leads sem avanço',
                        accent: 'bg-slate-50 text-slate-700'
                      }
                    ].map(card => (
                      <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-800">{card.label}</p>
                          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${card.accent}`}>Live</span>
                        </div>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">{numberFormatter.format(card.value)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <FunnelAmpulheta
                      data={propertyFunnelData}
                      showHeader={false}
                      className="w-full max-w-[520px]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-gray-100 shadow-sm">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Leads por portal</p>
                            <p className="text-xs text-muted-foreground">Distribuição dos principais canais</p>
                          </div>
                          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                            Leads e novos
                          </Badge>
                        </div>
                        <div className="space-y-4">
                          {propertyReport.leadsByPortal.map(item => {
                            const maxTotal = Math.max(...propertyReport.leadsByPortal.map(portal => portal.total), 1);
                            const width = Math.max(6, (item.total / maxTotal) * 100);
                            return (
                              <div key={item.portal} className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                  <span>{item.portal}</span>
                                  <span>{numberFormatter.format(item.total)}</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100">
                                  <div
                                    className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                                    style={{ width: `${width}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">{item.novos} novos leads nesta janela</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="rounded-xl bg-orange-50 p-3 text-xs text-orange-800">
                          Dica: mantenha campanhas em Social Ads e Portal imobiliário, que concentram maior volume.
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Visitas e jornada</p>
                            <p className="text-xs text-muted-foreground">Acompanhamento rápido do funil</p>
                          </div>
                          <Badge variant="secondary">Conversão</Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-gray-100 bg-orange-50 p-3 text-center">
                            <p className="text-[11px] font-semibold text-orange-700 uppercase">Agendadas</p>
                            <p className="text-2xl font-bold text-gray-900">{propertyReport.visitsScheduled}</p>
                          </div>
                          <div className="rounded-xl border border-gray-100 bg-emerald-50 p-3 text-center">
                            <p className="text-[11px] font-semibold text-emerald-700 uppercase">Realizadas</p>
                            <p className="text-2xl font-bold text-gray-900">{propertyReport.visitsDone}</p>
                          </div>
                          <div className="rounded-xl border border-gray-100 bg-sky-50 p-3 text-center">
                            <p className="text-[11px] font-semibold text-sky-700 uppercase">Conversão</p>
                            <p className="text-2xl font-bold text-gray-900">{propertyReport.conversionRate}%</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-700">Sugestões rápidas</p>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            <li>• Confirme visitas com 24h de antecedência.</li>
                            <li>• Envie tour virtual para leads mais frios.</li>
                            <li>• Priorize follow-up em até 2h após o contato.</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-gray-100 shadow-sm">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Propostas recebidas</p>
                            <p className="text-xs text-muted-foreground">Acompanhe negociações em andamento</p>
                          </div>
                          <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                            {propertyReport.proposalsApproved} aprovadas
                          </Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl bg-orange-50 p-3">
                            <p className="text-xs font-semibold text-orange-700">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{propertyReport.proposals}</p>
                          </div>
                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-semibold text-emerald-700">Aprovadas</p>
                            <p className="text-2xl font-bold text-gray-900">{propertyReport.proposalsApproved}</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-700">Em análise</p>
                            <p className="text-2xl font-bold text-gray-900">{propertyReport.proposalsUnderReview}</p>
                          </div>
                        </div>
                        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-3">
                          <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                            <span>Ticket médio</span>
                            <span>{currencyFormatter.format(propertyReport.averageTicket)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Receita projetada</span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-600">
                              <ArrowUpRight className="h-3 w-3" />
                              {currencyFormatter.format(propertyReport.projectedRevenue || propertyReport.averageTicket)}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-sky-50 p-3 text-xs text-sky-800">
                          Dica: mantenha atualizadas as condições comerciais para acelerar aprovações.
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Leads arquivados</p>
                            <p className="text-xs text-muted-foreground">Recupere oportunidades com novos gatilhos</p>
                          </div>
                          <Badge variant="secondary">Reengajar</Badge>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs text-muted-foreground">Total arquivado</p>
                          <p className="text-3xl font-semibold text-gray-900">{propertyReport.archivedLeads}</p>
                          <p className="text-xs text-orange-600">Reative com disparos segmentados</p>
                        </div>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          {propertyReport.nextSteps.map(step => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                        <div className="rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-700">
                          Última atualização: {propertyReport.lastUpdated.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Detalhamento do imóvel</p>
                          <p className="text-xs text-muted-foreground">Dados atuais usados para simular o relatório</p>
                        </div>
                        <Badge variant="outline" className="border-gray-200 bg-white text-gray-700">
                          {reportProperty.codigo}
                        </Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs text-muted-foreground">Origem</p>
                          <p className="text-sm font-semibold text-gray-900">{reportProperty.origem ?? 'Não informado'}</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs text-muted-foreground">Equipe</p>
                          <p className="text-sm font-semibold text-gray-900">{reportProperty.equipe ?? 'Não informado'}</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs text-muted-foreground">Captador</p>
                          <p className="text-sm font-semibold text-gray-900">{reportProperty.captador ?? 'Não informado'}</p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {propertyReport.insights.map(insight => (
                          <div key={insight} className="rounded-xl border border-dashed border-gray-200 bg-white p-3 text-sm text-gray-800">
                            {insight}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-muted-foreground">
                  Informe o código do imóvel ou selecione um item para visualizar os relatórios mockados.
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="condominios" className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={condominioSearch}
                    onChange={event => setCondominioSearch(event.target.value)}
                    placeholder="Buscar por nome ou cidade"
                    className="pl-9"
                  />
                </div>
                <Button type="button" onClick={() => navigate(ROUTES.CONDO_NEW)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo condomínio
                </Button>
              </div>

              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Condomínio</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Unidades</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {condominiosLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center">
                              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                            </TableCell>
                          </TableRow>
                        ) : filteredCondominios.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                              Nenhum condomínio encontrado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCondominios.map(condo => (
                            <TableRow key={condo.id} className="hover:bg-orange-50/40">
                              <TableCell className="font-medium">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-orange-500" />
                                    <span>{condo.nome}</span>
                                  </div>
                                  {condo.observacoes && (
                                    <p className="text-xs text-muted-foreground">{condo.observacoes}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-gray-700">
                                  {condo.cidade} / {condo.estado}
                                </p>
                                <p className="text-xs text-muted-foreground">{condo.endereco}</p>
                              </TableCell>
                              <TableCell>{condo.unidades}</TableCell>
                              <TableCell>
                                <Badge variant={condo.status === 'ativo' ? 'default' : 'secondary'}>
                                  {condo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm font-medium text-gray-900">{condo.responsavel}</p>
                                <p className="text-xs text-muted-foreground">{condo.contato}</p>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="ghost" size="sm" className="gap-1">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem
                                      onSelect={event => {
                                        event.preventDefault();
                                        if (!condo.id) {
                                          navigate(ROUTES.CONDOS_LIST);
                                          return;
                                        }
                                        navigate(ROUTES.CONDO_EDIT(condo.id));
                                      }}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" /> Editar dados
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={event => {
                                        event.preventDefault();
                                        if (!condo.id) {
                                          navigate(ROUTES.CONDOS_LIST);
                                          return;
                                        }
                                        const params = new URLSearchParams();
                                        params.set('tab', 'lazer');
                                        navigate({
                                          pathname: ROUTES.CONDO_EDIT(condo.id),
                                          search: params.toString()
                                        });
                                      }}
                                    >
                                      <ImageIcon className="mr-2 h-4 w-4" /> Gerenciar fotos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={event => {
                                        event.preventDefault();
                                        setCondoModal({ type: 'linked', condo });
                                      }}
                                    >
                                      <Link2 className="mr-2 h-4 w-4" /> Imóveis vinculados
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="equipe" className="space-y-6">
              <EquipeTabContent
                teamRoute={teamRoute}
                onRequestCloseTeamRoute={handleCloseTeamRoute}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <PropertyFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={{ ...filters, codigo: searchTerm }}
        onApplyFilters={handleApplyFilters}
        availableEquipes={availableEquipes}
        availableOrigens={availableOrigens}
        resultsCount={filteredProperties.length}
      />

      <Dialog open={Boolean(selectedProposal)} onOpenChange={open => !open && setSelectedProposal(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Proposta · {selectedProposal?.codigo}
            </DialogTitle>
            <DialogDescription>
              Detalhes da negociação vinculada ao imóvel selecionado.
            </DialogDescription>
          </DialogHeader>

          {selectedProposal && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{selectedProposal.titulo}</p>
                <Badge>{formatSituacaoLabel(selectedProposal.situacao)}</Badge>
              </div>
              <div className="grid gap-2 rounded-xl border border-gray-200 bg-orange-50/70 px-4 py-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Valor da proposta</p>
                  <p className="text-sm font-semibold text-gray-900">{currencyFormatter.format(selectedProposal.valor)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Disponibilidade</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDisponibilidadeLabel(selectedProposal.disponibilidade)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Equipe responsável</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedProposal.equipe}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedProposal.origem}</p>
                </div>
              </div>
              <div className="space-y-1 rounded-xl border border-dashed border-orange-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold text-orange-700">Descrição</p>
                <p className="text-sm text-gray-800">{formatProposalDescription(selectedProposal)}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSelectedProposal(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={condoModal.type === 'linked'} onOpenChange={open => !open && closeCondoModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Imóveis vinculados</DialogTitle>
            <DialogDescription>
              Controle quais imóveis estão associados ao condomínio para ativar experiências integradas no funil de vendas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <Select value={linkSelection} onValueChange={value => setLinkSelection(value)}>
                <SelectTrigger className="md:w-72">
                  <SelectValue placeholder="Selecionar imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {availableLinkOptions.length ? (
                    availableLinkOptions.map(item => (
                      <SelectItem key={item.id} value={item.codigo}>
                        {item.codigo} · {item.titulo}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Todos os imóveis já estão vinculados
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleLinkProperty} disabled={!linkSelection || linkedLoading}>
                {linkedLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Vincular
              </Button>
            </div>
            <div className="space-y-3">
              {linkedLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : linkedProperties.length ? (
                linkedProperties.map(property => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {property.codigo} · {property.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.bairro}, {property.cidade} — {formatSituacaoLabel(property.situacao)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlinkProperty(property.codigo)}
                    >
                      <X className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum imóvel vinculado até o momento.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}
