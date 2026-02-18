import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLeadsStore, useUpdateLead, type Lead as Client } from '@/hooks/vendas';
import type { LeadStage } from '@/types/lead';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, Plus, MoreVertical, Search, User, Building, MapPin, Filter, BarChart3, List, Grid3X3, Star, Phone, MessageCircle, RefreshCw, Users, Calendar, Clock, Thermometer, TrendingUp, Target, Globe, Brush } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getLeadDetailPath } from '@/lib/routes/leads';
import { RoletaTab } from './RoletaTab';
import LeadCard from './LeadCard';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { STAGE_LABEL_TO_SLUG, STAGE_SLUG_TO_LABEL } from '@/data/stageMapping';
import { FunnelAmpulheta, type FunnelStep } from '@/components/sales/FunnelAmpulheta';
import { scrollToHash } from '@/lib/scroll-to-hash';
import { DownloadReportButton } from '@/components/reports/DownloadReportButton';
import { Button } from '@/components/ui/button';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { type SLAThresholds } from '@/features/settings/thresholds';
import { useThresholds } from '@/features/settings/use-thresholds';
import { ThresholdsDialog } from './ThresholdsDialog';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
interface VendasTabProps {
  filter?: any;
  onNavigateToTab?: (tab: string) => void;
  initialView?: 'roletao' | 'funil' | 'kanban' | 'lista' | 'gestao';
}
interface FilterState {
  month: string;
  year: string;
  status: string;
  source: string;
  clientUpdate?: string;
  state: string;
  unit: string;
  purpose: string;
  unitGoal: string;
  unitOwner: string;
  transactionType: string;
  serviceCode: string;
  campaign: string;
  leadName: string;
  thermometer: string;
  serviceStage: string;
  lastInteractionFrom: string;
  lastInteractionTo: string;
  team: string;
  funnel: string;
  inboundType: string;
  dateFrom: string;
  dateTo: string;
  user: string;
  broker: string;
  utm: string;
}
const TABS = ['Roletão', 'Kanban', 'Lista', 'Gestão', 'Funil'] as const;
const TAB_VIEW_MAP: Record<(typeof TABS)[number], 'roletao' | 'kanban' | 'lista' | 'gestao' | 'funil'> = {
  Roletão: 'roletao',
  Kanban: 'kanban',
  Lista: 'lista',
  Gestão: 'gestao',
  Funil: 'funil'
};
const VALID_TABS = Object.values(TAB_VIEW_MAP);

interface ClientPage {
  data: Client[];
  nextPage?: number;
}

type Bucket = 'green' | 'yellow' | 'red';

const fetchClients = async ({
  pageParam = 1,
  bucket,
  thresholds
}: {
  pageParam: number;
  bucket: Bucket;
  thresholds: SLAThresholds;
}): Promise<ClientPage> => {
  const isDev = import.meta.env.MODE === 'development';
  if (isDev && USE_MOCKS) {
    return { data: [], nextPage: undefined };
  }
  const params = new URLSearchParams({
    page: pageParam.toString(),
    order: 'lastContactAt:desc'
  });
  if (bucket === 'green') {
    params.set('min', '0');
    params.set('max', String(thresholds.greenMax));
  } else if (bucket === 'yellow') {
    params.set('min', String(thresholds.greenMax + 1));
    params.set('max', String(thresholds.yellowMax));
  } else {
    params.set('min', String(thresholds.yellowMax + 1));
  }

  try {
    const res = await fetch(`/api/clients?${params.toString()}`);
    if (!res.ok) {
      throw new Error('API endpoint /api/clients not available');
    }
    return (await res.json()) as ClientPage;
  } catch (error) {
    console.warn('Failed to fetch clients:', error);
    toast('Erro ao carregar clientes');
    return { data: [], nextPage: undefined };
  }
};
const VendasTab = ({
  filter,
  onNavigateToTab,
  initialView = 'roletao'
}: VendasTabProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeView, setActiveView] = useState<'roletao' | 'funil' | 'kanban' | 'lista' | 'gestao'>(initialView);
  const [funnelViewType, setFunnelViewType] = useState<'lista' | 'funil'>('lista');
  const [showClientColors, setShowClientColors] = useState([true, true, true]);
  const [showPropertyColors, setShowPropertyColors] = useState([true, true, true]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [kanbanFilter, setKanbanFilter] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    month: '',
    year: '',
    status: '',
    source: '',
    state: '',
    unit: '',
    purpose: '',
    unitGoal: '',
    unitOwner: '',
    transactionType: '',
    serviceCode: '',
    campaign: '',
    leadName: '',
    thermometer: '',
    serviceStage: '',
    lastInteractionFrom: '',
    lastInteractionTo: '',
    team: '',
    funnel: '',
    inboundType: '',
    dateFrom: '',
    dateTo: '',
    user: '',
    broker: '',
    utm: '',
    clientUpdate: ''
  });

  const filterCardClass =
    'flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/60 p-3 shadow-inner shadow-gray-100';
  const filterLabelClass = 'text-sm font-semibold text-gray-800';
  const filterInputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/60';

  const [thresholds, setThresholds] = useThresholds();
  const [isThresholdsDialogOpen, setThresholdsDialogOpen] = useState(false);

  const { greenMax, yellowMax } = thresholds;

  const [activeBucket, setActiveBucket] = useState<Bucket | null>('green');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && VALID_TABS.includes(tabParam as any)) {
      setActiveView(tabParam as (typeof VALID_TABS)[number]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => scrollToHash(location.hash));
    }
  }, [activeView, location.hash]);

  const {
      data: clientPages,
      fetchNextPage: fetchNextClients,
      hasNextPage: clientsHasNext,
      isLoading: clientsLoading,
      isFetchingNextPage: clientsFetchingNext
  } = useInfiniteQuery<ClientPage>({
      queryKey: ['clients', activeBucket, greenMax, yellowMax],
      queryFn: ({ pageParam = 1 }) =>
      fetchClients({
        pageParam: pageParam as number,
        bucket: activeBucket!,
        thresholds
      }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
      lastPage.nextPage !== undefined ? Number(lastPage.nextPage) : undefined,
      enabled: activeBucket !== null
  });

  const clientsList = clientPages?.pages.flatMap((p) => p.data) ?? [];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && clientsHasNext && !clientsFetchingNext) {
        fetchNextClients();
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextClients, clientsHasNext, clientsFetchingNext]);



  // New state for conversion period filter
  const [conversionPeriod, setConversionPeriod] = useState({
    month: '7',
    // July
    year: '2025'
  });

  // State for first interaction period
  const [firstInteractionPeriod, setFirstInteractionPeriod] = useState('7');
  const { leads, error, load, move } = useLeadsStore();

  useEffect(() => {
    if (activeView === 'kanban' || activeView === 'lista' || activeView === 'gestao') {
      load();
    }
  }, [activeView, load]);

  const bucketLabels = useMemo<Record<Bucket, string>>(
    () => ({
      green: `0–${greenMax}`,
      yellow: `${greenMax + 1}–${yellowMax}`,
      red: `${yellowMax + 1}+`
    }),
    [greenMax, yellowMax]
  );

  const bucketTitles = useMemo<Record<Bucket, string>>(
    () => ({
      green: `Clientes - até ${greenMax} dias`,
      yellow: `Clientes - de ${greenMax + 1} até ${yellowMax} dias`,
      red: `Clientes - acima de ${yellowMax} dias`
    }),
    [greenMax, yellowMax]
  );

  const clientContactCounts = useMemo(() => {
    const counts: Record<Bucket, number> = {
      green: 0,
      yellow: 0,
      red: 0
    };
    const now = Date.now();

    leads.forEach((lead) => {
      const lastContact = lead.lastContactAt;
      if (!lastContact) {
        counts.red += 1;
        return;
      }

      const contactDate = new Date(lastContact);
      if (Number.isNaN(contactDate.getTime())) {
        counts.red += 1;
        return;
      }

      const diffInDays = Math.max(
        0,
        Math.floor((now - contactDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      if (diffInDays <= greenMax) {
        counts.green += 1;
      } else if (diffInDays <= yellowMax) {
        counts.yellow += 1;
      } else {
        counts.red += 1;
      }
    });

    return counts;
  }, [leads, greenMax, yellowMax]);

  const clientContactData = useMemo(
    () => [
      {
        name: bucketLabels.green,
        value: clientContactCounts.green,
        color: '#4CAF50',
        count: clientContactCounts.green,
        bucket: 'green' as const
      },
      {
        name: bucketLabels.yellow,
        value: clientContactCounts.yellow,
        color: '#FFC107',
        count: clientContactCounts.yellow,
        bucket: 'yellow' as const
      },
      {
        name: bucketLabels.red,
        value: clientContactCounts.red,
        color: '#F44336',
        count: clientContactCounts.red,
        bucket: 'red' as const
      }
    ],
    [bucketLabels, clientContactCounts]
  );

if (error) {
  return (
    <div className="p-4 text-center text-red-500">
      Erro ao carregar leads: {error}
    </div>
  );
}
const { mutateAsync: updateLead } = useUpdateLead();
const publishToRoleta = async (leadId: number) => {
  try {
    if (!USE_MOCKS) {
      await updateLead({ id: leadId, publishedToRoleta: true });
    }
    await load();
  } catch (err) {
    toast('Erro ao publicar lead na roleta');
  }
};
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const SortableLeadCard = ({
    lead
  }: {
    lead: any;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({
      id: lead.id
    });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };
    return <div ref={setNodeRef} style={style} {...attributes} {...listeners} id={`lead-${lead.id}`} aria-roledescription="draggable" tabIndex={0}>
        <LeadCard lead={lead} />
      </div>;
  };
  const propertyManagementData = [{
    name: '0-25 dias',
    value: 45,
    color: '#4CAF50'
  }, {
    name: '26-30 dias',
    value: 25,
    color: '#FFC107'
  }, {
    name: '31+ dias',
    value: 12,
    color: '#F44336'
  }];
  const clientManagementData = [{
    name: 'Ativos',
    value: 120,
    color: '#4CAF50'
  }, {
    name: 'Em negociação',
    value: 35,
    color: '#FFC107'
  }, {
    name: 'Inativos',
    value: 15,
    color: '#F44336'
  }];
  const leadSources = [{
    name: 'Site',
    value: 120,
    color: 'hsl(var(--accentSoft))',
    icon: Globe,
    type: 'Inbound'
  }, {
    name: 'Indicação',
    value: 80,
    color: 'hsl(var(--accentSoft))',
    icon: Users,
    type: 'Outbound'
  }, {
    name: 'Redes Sociais',
    value: 45,
    color: 'hsl(var(--accentSoft))',
    icon: MessageCircle,
    type: 'Inbound'
  }, {
    name: 'Campanhas Ads',
    value: 60,
    color: 'hsl(var(--accentSoft))',
    icon: Search,
    type: 'Inbound'
  }, {
    name: 'Eventos/Offline',
    value: 20,
    color: 'hsl(var(--accentSoft))',
    icon: Calendar,
    type: 'Outbound'
  }];
  const conversionData = [{
    name: '0-25 dias',
    value: 75,
    color: '#10b981'
  }, {
    name: '26-30 dias',
    value: 15,
    color: '#f59e0b'
  }, {
    name: '31+ dias',
    value: 10,
    color: '#ef4444'
  }];
  const funnelStages = [
    {
      slug: STAGE_LABEL_TO_SLUG['Pré-Atendimento'],
      count: 10,
      color: 'bg-orange-500',
      icon: RefreshCw,
      description: 'Novos leads aguardando contato inicial.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Em Atendimento'],
      count: 10,
      color: 'bg-orange-500',
      icon: User,
      description: 'Leads em contato ativo.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Agendamento'],
      count: 10,
      color: 'bg-orange-500',
      icon: Calendar,
      description: 'Visita ou call agendados.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Visita'],
      count: 10,
      color: 'bg-orange-500',
      icon: MapPin,
      description: 'Imóvel apresentado ao lead.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Proposta Enviada'],
      count: 10,
      color: 'bg-orange-500',
      icon: MessageCircle,
      description: 'Proposta enviada para avaliação do cliente.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Em Negociação'],
      count: 10,
      color: 'bg-orange-500',
      icon: Users,
      description: 'Condições comerciais em negociação.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Negócio Fechado'],
      count: 10,
      color: 'bg-orange-500',
      icon: Star,
      description: 'Venda concluída e contrato assinado.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Indicação'],
      count: 10,
      color: 'bg-orange-500',
      icon: User,
      description: 'Clientes convertidos indicando novos contatos.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Receita Gerada'],
      count: 10,
      color: 'bg-orange-500',
      icon: Building,
      description: 'Receitas registradas após o fechamento.'
    },
    {
      slug: STAGE_LABEL_TO_SLUG['Pós-venda'],
      count: 10,
      color: 'bg-orange-500',
      icon: MessageCircle,
      description: 'Acompanhamento e fidelização no pós-venda.'
    }
  ];
  const totalFunnelCount = funnelStages.reduce((sum, stage) => sum + stage.count, 0);
  const funnelAmpulhetaData: FunnelStep[] = funnelStages.map((stage) => ({
    id: stage.slug,
    label: STAGE_SLUG_TO_LABEL[stage.slug],
    percent: totalFunnelCount > 0 ? (stage.count / totalFunnelCount) * 100 : 0,
    value: stage.count,
    description: stage.description
  }));
  const stages = Object.values(STAGE_LABEL_TO_SLUG);
  const applyFilters = (leads: any[]) => {
    const parseStateFromLocation = (location?: string) => {
      if (!location || !location.includes(',')) return '';
      const parts = location.split(',');
      return parts[parts.length - 1]?.trim().toLowerCase();
    };

    return leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      const leadMonth = leadDate.getMonth() + 1;
      const leadYear = leadDate.getFullYear();
      const leadLocationState = parseStateFromLocation(lead.propertyCharacteristics?.location);
      const leadCampaign = lead.origin?.campaign;
      const leadThermometer = lead.leadIntensity;
      const leadStageLabel = lead.stage;
      const leadLastInteraction = lead.lastContactAt ? new Date(lead.lastContactAt) : null;
      const leadCreatedAtDate = lead.createdAt ? new Date(lead.createdAt) : null;
      const leadUser = lead.ownerId;
      const leadBroker = (lead as any)?.broker || lead.capturedBy;

      if (filters.month && leadMonth !== parseInt(filters.month)) return false;
      if (filters.year && leadYear !== parseInt(filters.year)) return false;
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.utm && lead.origin?.firstContact !== filters.utm) return false;
      if (filters.serviceStage && leadStageLabel !== filters.serviceStage) return false;
      if (filters.funnel && leadStageLabel !== filters.funnel) return false;
      if (filters.state && leadLocationState !== filters.state.toLowerCase()) return false;
      if (filters.unit && (lead as any)?.unit !== filters.unit) return false;
      if (filters.purpose && (lead as any)?.purpose !== filters.purpose) return false;
      if (filters.unitGoal && (lead as any)?.unitGoal !== filters.unitGoal) return false;
      if (filters.unitOwner && (lead as any)?.unitOwner !== filters.unitOwner) return false;
      if (filters.transactionType && (lead as any)?.transactionType !== filters.transactionType) return false;
      if (filters.serviceCode && (lead as any)?.serviceCode !== filters.serviceCode) return false;
      if (filters.campaign && leadCampaign !== filters.campaign) return false;
      if (filters.leadName && !lead.name?.toLowerCase().includes(filters.leadName.toLowerCase())) return false;
      if (filters.thermometer && leadThermometer !== filters.thermometer) return false;
      if (filters.team && (lead as any)?.team !== filters.team) return false;
      if (filters.inboundType && (lead as any)?.inboundType !== filters.inboundType) return false;
      if (filters.user && leadUser !== filters.user) return false;
      if (filters.broker && leadBroker !== filters.broker) return false;

      if (filters.clientUpdate) {
        const lastContactDate = lead.lastContactAt ? new Date(lead.lastContactAt) : null;
        if (!lastContactDate) return false;
        const diffDays = Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
        if (filters.clientUpdate === 'atualizado' && diffDays > 25) return false;
        if (filters.clientUpdate === 'atencao' && (diffDays < 26 || diffDays > 30)) return false;
        if (filters.clientUpdate === 'desatualizado' && diffDays <= 30) return false;
      }

      if (filters.lastInteractionFrom && leadLastInteraction) {
        const fromDate = new Date(filters.lastInteractionFrom);
        if (leadLastInteraction < fromDate) return false;
      }

      if (filters.lastInteractionTo && leadLastInteraction) {
        const toDate = new Date(filters.lastInteractionTo);
        if (leadLastInteraction > toDate) return false;
      }

      if (filters.dateFrom && leadCreatedAtDate) {
        const fromDate = new Date(filters.dateFrom);
        if (leadCreatedAtDate < fromDate) return false;
      }

      if (filters.dateTo && leadCreatedAtDate) {
        const toDate = new Date(filters.dateTo);
        if (leadCreatedAtDate > toDate) return false;
      }

      return true;
    });
  };
  const filteredLeads = applyFilters(leads);
  const getFunnelColumns = () => {
    const stagesToShow = kanbanFilter ? [kanbanFilter] : stages;
    return stagesToShow.map(stage => ({
      key: stage,
      title: STAGE_SLUG_TO_LABEL[stage],
      leads: filteredLeads.filter(lead => lead.stage === stage)
    }));
  };
  const funnelColumns = getFunnelColumns();
  const tabDataGetters: Record<typeof VALID_TABS[number], () => Promise<any[]>> = {
    roletao: async () => applyFilters(leads),
    kanban: async () => filteredLeads,
    lista: async () => filteredLeads,
    gestao: async () => clientsList,
    funil: async () => funnelStages
  };
  const getLeadIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'text-gray-400';
      case 'medium':
        return 'text-blue-500';
      case 'high':
        return 'text-yellow-500';
      case 'very-high':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as number;
    const sourceStage = active.data.current?.sortable.containerId as LeadStage;
    const targetStage = (over.data.current?.sortable.containerId || over.id) as LeadStage;
    if (!sourceStage || !targetStage || sourceStage === targetStage) return;
    move(activeId, targetStage);
    if (!USE_MOCKS) {
      try {
        await updateLead({ id: activeId, stage: targetStage });
      } catch (e) {
        move(activeId, sourceStage);
        toast('Não foi possível mover o lead');
      }
    }
    requestAnimationFrame(() => {
      document.getElementById(`lead-${activeId}`)?.focus();
    });
  };
  const handleFilterApply = () => {
    setShowFilterModal(false);
  };
  const handleFilterClear = () => {
    setFilters({
      month: '',
      year: '',
      status: '',
      source: '',
      clientUpdate: '',
      state: '',
      unit: '',
      purpose: '',
      unitGoal: '',
      unitOwner: '',
      transactionType: '',
      serviceCode: '',
      campaign: '',
      leadName: '',
      thermometer: '',
      serviceStage: '',
      lastInteractionFrom: '',
      lastInteractionTo: '',
      team: '',
      funnel: '',
      inboundType: '',
      dateFrom: '',
      dateTo: '',
      user: '',
      broker: '',
      utm: ''
    });
  };
  const handleClientContactClick = (
    bucket: Bucket
  ) => {
    setActiveBucket(prev => (prev === bucket ? null : bucket));
  };
  const handleLeadOriginClick = (origin: string) => {
    navigate(`/leads?origin=${encodeURIComponent(origin)}`);
  };
  const handlePropertyManagementClick = () => {
    navigate('/imoveis');
  };
  const handleClientManagementClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('gestao');
    }
  };

  const handleThresholdsSave = (updatedThresholds: SLAThresholds) => {
    setThresholds(updatedThresholds);
  };

  // Function to get first interaction time based on period
  const getFirstInteractionTime = (period: string) => {
    switch (period) {
      case '7':
        return '1 minuto';
      case '15':
        return '5 minutos';
      case '30':
        return '12 minutos';
      default:
        return '1 minuto';
    }
  };

  // New conversion metrics data
  const conversionMetrics = {
    totalLeads: 325,
    convertedClients: 78,
    conversionRate: 24,
    averageConversionTime: '12 dias',
    averageFirstInteractionTime: getFirstInteractionTime(firstInteractionPeriod),
    topConvertingChannels: [{
      name: 'Site',
      leads: 120,
      conversions: 35,
      rate: 29.2
    }, {
      name: 'Indicação',
      leads: 80,
      conversions: 28,
      rate: 35.0
    }, {
      name: 'Facebook Ads',
      leads: 60,
      conversions: 10,
      rate: 16.7
    }, {
      name: 'Google Ads',
      leads: 45,
      conversions: 5,
      rate: 11.1
    }, {
      name: 'WhatsApp',
      leads: 20,
      conversions: 0,
      rate: 0
    }]
  };

  // Conversion funnel data for chart
  const conversionFunnelData = [
    {
      stage: STAGE_LABEL_TO_SLUG['Pré-Atendimento'],
      value: 325,
      color: 'hsl(var(--accent))'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Em Atendimento'],
      value: 280,
      color: '#FF7733'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Agendamento'],
      value: 220,
      color: '#FF8833'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Visita'],
      value: 180,
      color: '#FF9933'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Proposta Enviada'],
      value: 150,
      color: '#FFAA33'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Em Negociação'],
      value: 120,
      color: '#FFBB33'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Negócio Fechado'],
      value: 95,
      color: '#FFCC33'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Indicação'],
      value: 78,
      color: '#FFDD33'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Receita Gerada'],
      value: 78,
      color: '#FFEE33'
    },
    {
      stage: STAGE_LABEL_TO_SLUG['Pós-venda'],
      value: 78,
      color: '#4CAF50'
    }
  ];

  // Funnel stage item component with link navigation
  const FunnelStageItem = ({
    stage,
    lead
  }: {
    stage: any;
    lead: any;
  }) => (
    <Link to={getLeadDetailPath(lead.id)} className="lead-card block w-full h-full cursor-pointer touch-manipulation pointer-events-auto">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <h4 className="font-semibold text-gray-900 text-lg mb-1">{lead.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{lead.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{lead.source}</span>
          <span className="text-sm font-medium text-orange-600">{lead.value}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Negociações</h1>
          <button onClick={() => setShowFilterModal(true)} className="p-2 hover:bg-gray-100 rounded-xl">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input type="text" placeholder="Buscar oportunidades" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-full overflow-x-auto">
            {TABS.map(tab => {
              const view = TAB_VIEW_MAP[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeView === view
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className="ml-2 hidden md:inline-flex">
            <DownloadReportButton getData={tabDataGetters[activeView]} context={activeView} />
          </div>
        </div>
        <div className="mt-2 md:hidden flex justify-end">
          <DownloadReportButton getData={tabDataGetters[activeView]} context={activeView} />
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
                  <p className="text-sm text-gray-500">Refine as negociações com os filtros abaixo</p>
                </div>
              </div>
              <button onClick={() => setShowFilterModal(false)} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Mês</label>
                  <select
                    value={filters.month}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      month: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos os meses</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Ano</label>
                  <select
                    value={filters.year}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      year: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos os anos</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      status: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos os status</option>
                    <option value="Em espera">Em espera</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Visita Agendada">Visita Agendada</option>
                    <option value="Arquivado">Arquivado</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Estado</label>
                  <select
                    value={filters.state}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      state: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos os estados</option>
                    <option value="sp">São Paulo (SP)</option>
                    <option value="rj">Rio de Janeiro (RJ)</option>
                    <option value="mg">Minas Gerais (MG)</option>
                    <option value="rs">Rio Grande do Sul (RS)</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Origem</label>
                  <select
                    value={filters.source}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      source: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todas as origens</option>
                    <option value="Site">Site</option>
                    <option value="Facebook Leads">Facebook Leads</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Google Ads">Google Ads</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Atualização de clientes</label>
                  <select
                    value={filters.clientUpdate || ''}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      clientUpdate: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos</option>
                    <option value="atualizado">Atualizado (até 25 dias)</option>
                    <option value="atencao">Atenção (26-30 dias)</option>
                    <option value="desatualizado">Desatualizado (31+ dias)</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Unidade</label>
                  <input
                    value={filters.unit}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      unit: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite o nome da unidade"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Finalidade</label>
                  <select
                    value={filters.purpose}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      purpose: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todas as finalidades</option>
                    <option value="lead">Lead</option>
                    <option value="oportunidade">Oportunidade</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Meta unidade</label>
                  <input
                    value={filters.unitGoal}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      unitGoal: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite a meta da unidade"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Qual unidade colocou</label>
                  <input
                    value={filters.unitOwner}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      unitOwner: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite o nome"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Venda/Aluguel</label>
                  <select
                    value={filters.transactionType}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      transactionType: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Código de atendimento</label>
                  <input
                    value={filters.serviceCode}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      serviceCode: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite os códigos"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Campanha</label>
                  <input
                    value={filters.campaign}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      campaign: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite o nome da campanha"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Lead</label>
                  <input
                    value={filters.leadName}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      leadName: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite o nome do lead"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Termômetro</label>
                  <select
                    value={filters.thermometer}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      thermometer: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos</option>
                    <option value="quente">Quente</option>
                    <option value="morno">Morno</option>
                    <option value="frio">Frio</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Etapa do atendimento</label>
                  <select
                    value={filters.serviceStage}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      serviceStage: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todas</option>
                    <option value="pre_atendimento">Pré atendimento</option>
                    <option value="em_atendimento">Em atendimento</option>
                    <option value="visita">Visita</option>
                    <option value="proposta">Proposta</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Última interação (de)</label>
                  <input
                    type="date"
                    value={filters.lastInteractionFrom}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      lastInteractionFrom: e.target.value
                    }))}
                    className={filterInputClass}
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Última interação (até)</label>
                  <input
                    type="date"
                    value={filters.lastInteractionTo}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      lastInteractionTo: e.target.value
                    }))}
                    className={filterInputClass}
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Equipe</label>
                  <input
                    value={filters.team}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      team: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite a equipe"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Funil</label>
                  <select
                    value={filters.funnel}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      funnel: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos os funis</option>
                    {stages.map(stage => (
                      <option key={stage} value={stage}>
                        {STAGE_SLUG_TO_LABEL[stage]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Inbound/Outbound</label>
                  <select
                    value={filters.inboundType}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      inboundType: e.target.value
                    }))}
                    className={filterInputClass}
                  >
                    <option value="">Todos</option>
                    <option value="inbound">Inbound</option>
                    <option value="outbound">Outbound</option>
                  </select>
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Data (de)</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      dateFrom: e.target.value
                    }))}
                    className={filterInputClass}
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Data (até)</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      dateTo: e.target.value
                    }))}
                    className={filterInputClass}
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Usuário</label>
                  <input
                    value={filters.user}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      user: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Selecione um usuário"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>Corretor</label>
                  <input
                    value={filters.broker}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      broker: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Selecione o corretor"
                  />
                </div>

                <div className={filterCardClass}>
                  <label className={filterLabelClass}>UTM</label>
                  <input
                    value={filters.utm}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      utm: e.target.value
                    }))}
                    className={filterInputClass}
                    placeholder="Digite a UTM"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4 sm:flex-row sm:items-center">
              <button
                onClick={handleFilterClear}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Limpar
              </button>
              <button
                onClick={handleFilterApply}
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Content with proper scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeView === 'roletao' && <RoletaTab leads={leads} publishToRoleta={publishToRoleta} />}
          
          {activeView === 'funil' && (
            <div className="max-w-4xl mx-auto">
              {/* Sub-botões do Funil */}
              <div className="mb-6">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl w-fit mx-auto">
                   <button
                     onClick={() => setFunnelViewType('lista')}
                     className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
                       funnelViewType === 'lista'
                         ? 'bg-white text-gray-900 shadow-sm'
                         : 'text-gray-600 hover:text-gray-900'
                     }`}
                   >
                     <div className="flex items-center gap-2">
                       <List className="w-4 h-4" />
                       Funil Lista
                     </div>
                   </button>
                   <button
                     onClick={() => setFunnelViewType('funil')}
                     className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
                       funnelViewType === 'funil'
                         ? 'bg-white text-gray-900 shadow-sm'
                         : 'text-gray-600 hover:text-gray-900'
                     }`}
                   >
                     <div className="flex items-center gap-2">
                       <TrendingUp className="w-4 h-4" />
                       Funil Ampulheta
                     </div>
                   </button>
                </div>
              </div>

              {funnelViewType === 'lista' ? (
                <div className="max-w-md mx-auto">
                  {funnelStages.map((stage, index) => {
                    const totalLeads = 100; // Total de leads do mês
                    const stagePercentage = Math.round((stage.count / totalLeads) * 100);
                    const label = STAGE_SLUG_TO_LABEL[stage.slug];

                    const handleStageClick = () => {
                      setActiveView('kanban');
                      setKanbanFilter(stage.slug);
                    };

                    return (
                      <div key={stage.slug} className="flex items-center mb-6">
                        <div className="flex flex-col items-center mr-4">
                          <button
                            onClick={handleStageClick}
                            className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-2 hover:bg-orange-600 transition-colors"
                          >
                            <span className="text-white font-bold text-lg">{stage.count}</span>
                          </button>
                          {index < funnelStages.length - 1 && <div className="w-1 h-8 bg-orange-500 rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <button
                            onClick={handleStageClick}
                            className="w-full text-left"
                          >
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">{label}</h3>
                                  {stage.description && <p className="text-sm text-gray-600 mt-1">{stage.description}</p>}
                                </div>
                                <div className="text-right">
                                  <div className="bg-orange-100 px-3 py-1 rounded-xl">
                                    <span className="text-orange-700 font-semibold text-sm">{stagePercentage}%</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">Taxa de avanço</p>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border-0 bg-transparent p-0 shadow-none">
                  <h2 className="sr-only">Funil de Negociações</h2>
                  <FunnelAmpulheta
                    data={funnelAmpulhetaData}
                    showHeader={false}
                    onStepSelect={(step) => {
                      if (!step.id) return;
                      setActiveView('kanban');
                      setKanbanFilter(step.id);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeView === 'kanban' && <div className="space-y-6">
              {/* Pipeline Header */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Pipeline de Negociações</h2>
                  <span className="text-sm text-gray-500">↔ Arraste para mover</span>
                </div>
              </div>

              {/* Enhanced Kanban Board with better drag and drop */}
              <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max">
                    {funnelColumns.map(column => (
                      <div key={column.key} className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex-shrink-0 transition-colors">
                        <div className="bg-orange-500 text-white p-4 rounded-t-2xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-5 h-5" />
                              <h3 className="font-medium">{column.title}</h3>
                            </div>
                            <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                              {column.leads.length}
                            </span>
                          </div>
                        </div>
                        <SortableContext id={column.key} items={column.leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                          <div
                            className="p-4 space-y-3 min-h-[200px] max-h-[600px] overflow-y-auto"
                            aria-roledescription="droppable"
                            tabIndex={0}
                          >
                            {column.leads.map(lead => (
                              <SortableLeadCard key={lead.id} lead={lead} />
                            ))}
                            {column.leads.length === 0 && (
                              <div className="text-center text-gray-400 py-8">
                                <p className="text-sm">Arraste leads para cá</p>
                              </div>
                            )}
                          </div>
                        </SortableContext>
                      </div>
                    ))}
                  </div>
                </div>
              </DndContext>
            </div>}

          {activeView === 'lista' && (
            <div className="space-y-4">
              {filteredLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
            </div>
          )}

          {activeView === 'gestao' && (
            <section
              id="contato-de-clientes"
              className="space-y-6 scroll-mt-28"
              aria-labelledby="titulo-contato-de-clientes"
            >
              <h2 id="titulo-contato-de-clientes" className="sr-only">
                Contato de Clientes
              </h2>
              {/* Period Filter for Gestão */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Período de Análise</h3>
                  <p className="text-sm text-gray-500 mt-1">Selecione o período para visualizar as métricas</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                      <select value={conversionPeriod.month} onChange={e => setConversionPeriod(prev => ({
                    ...prev,
                    month: e.target.value
                  }))} className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                      <select value={conversionPeriod.year} onChange={e => setConversionPeriod(prev => ({
                    ...prev,
                    year: e.target.value
                  }))} className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Metrics Overview */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Métricas </h2>
                  <p className="text-sm text-gray-500 mt-1">Resumo das taxas de conversão e primeira interação. </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-100 rounded-xl">
                          <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-orange-700">Taxa de Conversão</p>
                        <p className="text-3xl font-bold text-orange-600">{conversionMetrics.conversionRate}%</p>
                        <p className="text-sm text-orange-600">{conversionMetrics.convertedClients} de {conversionMetrics.totalLeads} leads</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-700">Tempo Médio</p>
                        <p className="text-3xl font-bold text-blue-600">{conversionMetrics.averageConversionTime}</p>
                        <p className="text-sm text-blue-600">para conversão</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                      <div className="flex items-center justify-between mb-4">
                        
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-orange-700">Tempo Médio de Primeira Interação</p>
                        <p className="text-3xl font-bold text-orange-600">{conversionMetrics.averageFirstInteractionTime}</p>
                        
                      </div>
                      
                      {/* Period Selection Buttons */}
                      <div className="flex gap-2 mt-4">
                        {['7', '15', '30'].map(period => <button key={period} onClick={() => setFirstInteractionPeriod(period)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${firstInteractionPeriod === period ? 'bg-orange-500 text-white shadow-sm' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
                            {period} dias
                          </button>)}
                      </div>
                    </div>
                  </div>

                  {/* Conversion Funnel Chart */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Funil de Conversão</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-3 h-3 bg-orange-500 rounded-lg"></div>
                        <span>Leads no funil</span>
                      </div>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-2xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conversionFunnelData} layout="horizontal" margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" stroke="#6b7280" fontSize={12} />
                          <YAxis dataKey="stage" type="category" width={80} stroke="#6b7280" fontSize={12} tickFormatter={value => STAGE_SLUG_TO_LABEL[value]} />
                          <Tooltip contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} formatter={(value, name, props) => [value, STAGE_SLUG_TO_LABEL[props.payload.stage]]} />
                          <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Converting Channels */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Canais que Mais Convertem</h2>
                  <p className="text-sm text-gray-500 mt-1">Ranking dos canais com melhor performance de conversão</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {conversionMetrics.topConvertingChannels.map((channel, index) => <div key={channel.name} className="group hover:bg-gray-50 rounded-2xl p-4 transition-colors border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-2xl border border-orange-100">
                            <span className="text-orange-600 font-bold text-lg">#{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 truncate">{channel.name}</h4>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">{channel.rate}%</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{channel.leads} leads gerados</span>
                              <span>{channel.conversions} conversões</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out" style={{
                      width: `${channel.rate}%`
                    }}></div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>

                {/* Existing Origem de Leads section with improved design */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Origem de Leads</h2>
                  <p className="text-sm text-gray-500 mt-1">Performance dos canais de aquisição de leads</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {leadSources.map((source, index) => <div key={source.name} className="group hover:bg-gray-50 rounded-2xl p-4 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm" onClick={() => handleLeadOriginClick(source.name)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
                              <source.icon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{source.name}</h4>
                              <p className="text-sm text-gray-500">Marketing {source.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-orange-600">{source.value}</span>
                            <p className="text-sm text-gray-500">leads</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{
                      width: `${source.value / Math.max(...leadSources.map(s => s.value)) * 100}%`
                    }}></div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Existing Contato com Clientes section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Contato de Clientes</h2>
                      <p className="text-sm text-gray-500 mt-1">Distribuição por tempo desde o último contato</p>
                    </div>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setThresholdsDialogOpen(true)}
                            aria-label="Editar limites (apenas admin)"
                            className="text-gray-500 hover:text-orange-600"
                          >
                            <Brush className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar limites (apenas admin)</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-48 h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={clientContactData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {clientContactData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                  className={`cursor-pointer hover:opacity-80 ${
                                    activeBucket && activeBucket !== entry.bucket
                                      ? 'opacity-40'
                                      : ''
                                  }`}
                                  onClick={() => handleClientContactClick(entry.bucket)}
                                  aria-label={`${entry.name} dias: ${entry.count}`}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {clientContactData.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleClientContactClick(item.bucket)}
                          aria-pressed={activeBucket === item.bucket}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${
                            activeBucket === item.bucket
                              ? 'bg-gray-100 border-2 border-gray-400'
                              : 'bg-gray-50 hover:bg-gray-100'
                          } ${
                            activeBucket && activeBucket !== item.bucket
                              ? 'opacity-40'
                              : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-gray-900 font-medium group-hover:text-orange-600 transition-colors">
                              {item.name} dias
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold">
                              {item.count}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>

                    <button onClick={handleClientManagementClick} className="w-full py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      Ver Detalhes Completos
                    </button>
                  </div>
                </div>
                </div>
              </section>
            )}

          {activeBucket && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#333333]">
                  {bucketTitles[activeBucket]}
                </h3>
                <button
                  onClick={() => setActiveBucket(null)}
                  className="text-sm text-[hsl(var(--accent))] font-medium"
                >
                  Limpar filtro
                </button>
              </div>
              {clientsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {clientsList.map((client: any) => (
                    <LeadCard key={client.id} lead={client} />
                  ))}
                  {clientsFetchingNext && (
                    <Skeleton className="h-24 w-full rounded-xl" />
                  )}
                  <div ref={loadMoreRef} />
                </div>
              )}
            </div>
          )}
        </div>
        <ThresholdsDialog
          open={isThresholdsDialogOpen}
          onOpenChange={setThresholdsDialogOpen}
          thresholds={thresholds}
          onSave={handleThresholdsSave}
        />
      </div>
    </div>
  );
};

export { VendasTab };
