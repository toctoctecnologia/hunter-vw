import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Filter,
  Info,
  LineChart,
  MapPin,
  MoreHorizontal,
  Pencil,
  Search,
  UserPlus,
  Users2
} from 'lucide-react';
import { ROUTES } from '@/routes/appRoutes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { listTeams } from '@/services/teams';
import type { Team, TeamStatus, TeamType } from '@/types/teams';
import { TeamFormDrawer } from './TeamFormDrawer';
import { TeamMembersDrawer } from './TeamMembersDrawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const TEAM_SECTIONS = ['overview', 'performance', 'pipeline'] as const;
export type TeamSection = (typeof TEAM_SECTIONS)[number];

export type TeamRoute =
  | { type: 'create' }
  | { type: 'detail'; teamId: string; section?: TeamSection };
type TeamFormState = { mode: 'create' | 'edit'; team: Team | null; origin: 'route' | 'local' };

const STATUS_FILTERS: Array<{ value: TeamStatus; label: string }> = [
  { value: 'active', label: 'Ativas' },
  { value: 'expansion', label: 'Em expansão' },
  { value: 'inactive', label: 'Inativas' }
];

type StatusChip = { value: TeamStatus; label: string; count: number };
type CityChip = { value: string; label: string; count: number };

const DEFAULT_PER_PAGE = 9;

const teamStatusLabels: Record<TeamStatus, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
  expansion: 'Em expansão'
};

const teamTypeLabels: Record<TeamType, string> = {
  regional: 'Regional',
  especializada: 'Especializada',
  parceria: 'Parceria estratégica',
  apoio: 'Time de apoio'
};

const isTeamStatusValue = (value: string): value is TeamStatus =>
  STATUS_FILTERS.some(filter => filter.value === value);

const legacyStatusMap: Record<string, TeamStatus> = {
  ativa: 'active',
  expansao: 'expansion',
  inativa: 'inactive'
};

const normalizeTeamStatus = (value: string): TeamStatus | null => {
  if (isTeamStatusValue(value)) return value;
  return legacyStatusMap[value] ?? null;
};

const teamSectionLabels: Record<TeamSection, string> = {
  overview: 'Visão geral',
  performance: 'Performance',
  pipeline: 'Pipeline'
};

const numberFormatter = new Intl.NumberFormat('pt-BR');

function resolveTeamSection(value: string | null): TeamSection {
  if (value && TEAM_SECTIONS.includes(value as TeamSection)) {
    return value as TeamSection;
  }
  return 'overview';
}

function parseQueryParam(value: string | null) {
  if (!value) return [] as string[];
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

interface EquipeTabContentProps {
  teamRoute: TeamRoute | null;
  onRequestCloseTeamRoute: () => void;
}

export function EquipeTabContent({ teamRoute, onRequestCloseTeamRoute }: EquipeTabContentProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [statusChips, setStatusChips] = useState<StatusChip[]>(() =>
    STATUS_FILTERS.map(filter => ({ ...filter, count: 0 }))
  );
  const [cityChips, setCityChips] = useState<CityChip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTeams, setTotalTeams] = useState(0);
  const [teamFormState, setTeamFormState] = useState<TeamFormState | null>(null);
  const [membersDrawerTeam, setMembersDrawerTeam] = useState<Team | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { toast } = useToast();

  const perPage = DEFAULT_PER_PAGE;

  const activeTeamId = teamRoute?.type === 'detail' ? teamRoute.teamId : null;
  const isDetailOpen = Boolean(activeTeamId);

  const statusParam = searchParams.get('teamStatus') ?? '';
  const cityParam = searchParams.get('teamCity') ?? '';
  const pageParam = searchParams.get('teamPage') ?? '1';
  const searchTerm = (searchParams.get('teamSearch') ?? '').trim();
  const selectedStatuses = useMemo(
    () =>
      parseQueryParam(statusParam)
        .map(normalizeTeamStatus)
        .filter((value): value is TeamStatus => Boolean(value)),
    [statusParam]
  );
  const selectedCities = useMemo(() => parseQueryParam(cityParam), [cityParam]);
  const currentPage = useMemo(() => {
    const parsed = Number.parseInt(pageParam, 10);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageParam]);
  const teamSection = resolveTeamSection(searchParams.get('teamSection'));

  useEffect(() => {
    if (teamRoute?.type === 'create') {
      setTeamFormState(current =>
        current?.mode === 'create'
          ? { ...current, origin: 'route' }
          : { mode: 'create', team: null, origin: 'route' },
      );
    } else if (!teamRoute) {
      setTeamFormState(current => (current?.origin === 'route' ? null : current));
    }
  }, [teamRoute]);

  useEffect(() => {
    if (teamRoute?.type !== 'detail' || !teamRoute.section) return;
    const currentSection = resolveTeamSection(searchParams.get('teamSection'));
    if (currentSection === teamRoute.section) return;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'equipe');
      if (teamRoute.section === 'overview') {
        next.delete('teamSection');
      } else {
        next.set('teamSection', teamRoute.section);
      }
      return next;
    });
  }, [searchParams, setSearchParams, teamRoute]);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listTeams({
        q: searchTerm || undefined,
        status: selectedStatuses.length ? selectedStatuses : undefined,
        city: selectedCities.length ? selectedCities : undefined,
        page: currentPage,
        perPage,
      });

      setTeams(response.items);
      setTotalTeams(response.total);
      setStatusChips(prev =>
        STATUS_FILTERS.map(filter => ({
          ...filter,
          count:
            response.meta?.statusCounts?.[filter.value] ??
            prev.find(chip => chip.value === filter.value)?.count ??
            0,
        }))
      );
      setCityChips(prev => {
        const baseCounts = response.meta?.cityCounts ?? {};
        const preserved = Object.fromEntries(
          prev
            .filter(chip => !baseCounts[chip.value] && selectedCities.includes(chip.value))
            .map(chip => [chip.value, chip.count] as const)
        );
        const counts = { ...preserved, ...baseCounts };
        return Object.entries(counts)
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((a, b) => b.count - a.count);
      });
    } catch (error) {
      console.error('Erro ao carregar equipes', error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível carregar as equipes',
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente em instantes.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, searchTerm, selectedCities, selectedStatuses, toast]);

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  const activeTeam = useMemo(() => {
    if (!activeTeamId) return null;
    return teams.find(team => team.id === activeTeamId) ?? null;
  }, [activeTeamId, teams]);

  const performanceMetrics = useMemo(() => {
    if (!activeTeam) return [] as Array<{ label: string; value: string; helper: string }>;
    const base = activeTeam.membersCount || 1;
    return [
      {
        label: 'Leads ativos',
        value: numberFormatter.format(base * 4),
        helper: '+12% vs. últimos 30 dias'
      },
      {
        label: 'Visitas agendadas',
        value: numberFormatter.format(Math.max(1, base * 2)),
        helper: `${numberFormatter.format(Math.max(1, Math.round(base * 0.6)))} visitas nesta semana`
      },
      {
        label: 'Conversão média',
        value: `${Math.min(65, 20 + base)}%`,
        helper: 'Janela dos últimos 90 dias'
      }
    ];
  }, [activeTeam]);

  const pipelineDistribution = useMemo(() => {
    if (!activeTeam) return [] as Array<{ label: string; value: string; accent: string }>;
    const base = activeTeam.membersCount || 1;
    return [
      {
        label: 'Novos leads',
        value: numberFormatter.format(base * 3),
        accent: 'bg-orange-500/10 text-orange-600'
      },
      {
        label: 'Em atendimento',
        value: numberFormatter.format(base * 2),
        accent: 'bg-blue-500/10 text-blue-600'
      },
      {
        label: 'Negociações',
        value: numberFormatter.format(Math.max(1, Math.round(base * 0.7))),
        accent: 'bg-emerald-500/10 text-emerald-600'
      },
      {
        label: 'Fechamentos',
        value: numberFormatter.format(Math.max(1, Math.round(base * 0.35))),
        accent: 'bg-purple-500/10 text-purple-600'
      }
    ];
  }, [activeTeam]);

  const filteredTeams = teams;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(Math.max(totalTeams, 0) / perPage)),
    [perPage, totalTeams]
  );

  const startIndex = totalTeams === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endIndex =
    totalTeams === 0 || filteredTeams.length === 0
      ? 0
      : startIndex + filteredTeams.length - 1;
  const totalLabel = totalTeams === 1 ? 'equipe' : 'equipes';

  const hasActiveFilters = Boolean(
    searchTerm || selectedStatuses.length > 0 || selectedCities.length > 0
  );

  const handleUpdateParam = (
    key: string,
    value?: string | string[],
    options?: { preservePage?: boolean }
  ) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'equipe');
      if (!value || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(','));
      } else {
        next.set(key, value);
      }
      if (key !== 'teamPage' && !options?.preservePage) {
        next.delete('teamPage');
      }
      return next;
    });
  };

  const toggleFilter = (key: 'teamStatus' | 'teamCity', value: string) => {
    const current = parseQueryParam(searchParams.get(key));
    const nextValues = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    handleUpdateParam(key, nextValues);
  };

  const handleClearFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'equipe');
      next.delete('teamSearch');
      next.delete('teamStatus');
      next.delete('teamCity');
      next.delete('teamPage');
      return next;
    });
  };

  const buildTeamSearchParams = (apply?: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams();
    params.set('tab', 'equipe');
    if (searchTerm) params.set('teamSearch', searchTerm);
    if (selectedStatuses.length) params.set('teamStatus', selectedStatuses.join(','));
    if (selectedCities.length) params.set('teamCity', selectedCities.join(','));
    if (currentPage > 1) params.set('teamPage', String(currentPage));
    if (apply) apply(params);
    return params;
  };

  const handleNavigateToCreate = () => {
    const params = buildTeamSearchParams();
    navigate({
      pathname: ROUTES.TEAM_NEW,
      search: params.toString()
    });
  };

  const handleNavigateToTeam = (teamId: string, section?: TeamSection) => {
    const params = buildTeamSearchParams(next => {
      if (section && section !== 'overview') {
        next.set('teamSection', section);
      } else {
        next.delete('teamSection');
      }
    });
    const pathname =
      section === 'performance' ? ROUTES.TEAM_PERF(teamId) : ROUTES.TEAM_VIEW(teamId);
    navigate({
      pathname,
      search: params.toString()
    });
  };

  const handleTeamSectionChange = (section: TeamSection) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'equipe');
      if (section === 'overview') {
        next.delete('teamSection');
      } else {
        next.set('teamSection', section);
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    const target = page <= 1 ? undefined : String(page);
    handleUpdateParam('teamPage', target, { preservePage: true });
  };

  const handleDetailOpenChange = (open: boolean) => {
    if (!open) {
      onRequestCloseTeamRoute();
    }
  };

  const handleTeamFormClose = () => {
    setTeamFormState(null);
    if (teamRoute?.type === 'create') {
      onRequestCloseTeamRoute();
    }
  };

  const handleTeamFormSuccess = (result: Team) => {
    setTeams(prev => {
      const exists = prev.some(team => team.id === result.id);
      if (exists) {
        return prev.map(team => (team.id === result.id ? { ...team, ...result } : team));
      }
      return [result, ...prev];
    });
    void fetchTeams();
  };

  const handleEditTeam = (target?: Team | null) => {
    const selectedTeam = target ?? activeTeam;
    if (!selectedTeam) {
      toast({
        variant: 'destructive',
        title: 'Equipe não encontrada',
        description: 'Selecione uma equipe válida para editar.',
      });
      return;
    }
    if (teamRoute?.type === 'detail') {
      onRequestCloseTeamRoute();
    }
    setTeamFormState({ mode: 'edit', team: selectedTeam, origin: 'local' });
  };

  const handleMembersDrawerOpen = (target: Team) => {
    if (teamRoute?.type === 'detail') {
      onRequestCloseTeamRoute();
    }
    setMembersDrawerTeam(target);
  };

  const handleMembersDrawerClose = () => {
    setMembersDrawerTeam(null);
  };

  const handleMembersUpdated = (updatedTeam: Team) => {
    setTeams(prev => prev.map(team => (team.id === updatedTeam.id ? { ...team, ...updatedTeam } : team)));
  };

  const handleMembersRefresh = () => {
    void fetchTeams();
  };

  const renderDetailOverlay = () => {
    const locationLine = activeTeam
      ? activeTeam.address?.street
        ? `${activeTeam.address.street}${activeTeam.address.number ? `, ${activeTeam.address.number}` : ''}`
        : activeTeam.city ?? 'Cidade não informada'
      : '';
    const locationMeta = activeTeam
      ? [activeTeam.address?.city ?? activeTeam.city, activeTeam.address?.state ?? activeTeam.state]
          .filter(Boolean)
          .join(' • ')
      : '';
    const typeLabel =
      activeTeam?.type ? teamTypeLabels[activeTeam.type] : (activeTeam?.tags ?? [])[0] ?? 'Operação híbrida';

    const body = (
      <div className="space-y-6 px-6 pb-6">
        {activeTeam ? (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{activeTeam.name}</h3>
                  <p className="text-sm text-muted-foreground">{activeTeam.branch ?? '—'}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'border-0 bg-gray-100 text-xs font-medium',
                    activeTeam.status === 'active' && 'bg-emerald-50 text-emerald-600',
                    activeTeam.status === 'expansion' && 'bg-orange-50 text-orange-600',
                    activeTeam.status === 'inactive' && 'bg-gray-200 text-gray-600'
                  )}
                >
                  {teamStatusLabels[activeTeam.status]}
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                  {activeTeam.membersCount} corretores ativos
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {activeTeam.manager?.name ?? 'Responsável não definido'}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {locationLine}
                    {locationMeta ? ` • ${locationMeta}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  {typeLabel}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                {activeTeam.tags && activeTeam.tags.length > 0 ? (
                  activeTeam.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Nenhuma tag associada</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleMembersDrawerOpen(activeTeam)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Gerenciar membros
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditTeam(activeTeam)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar equipe
                </Button>
              </div>
            </div>
            <Tabs value={teamSection} onValueChange={value => handleTeamSectionChange(value as TeamSection)}>
              <TabsList className="grid w-full grid-cols-3">
                {TEAM_SECTIONS.map(section => (
                  <TabsTrigger key={section} value={section}>
                    {teamSectionLabels[section]}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <Alert className="border-orange-200 bg-orange-50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Indicadores gerais</AlertTitle>
                  <AlertDescription>Acompanhe um resumo das principais métricas de performance.</AlertDescription>
                </Alert>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                          <LineChart className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">{numberFormatter.format(activeTeam.membersCount * 12)}</p>
                          <p className="text-sm text-muted-foreground">Negócios</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                          <Users2 className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">{numberFormatter.format(activeTeam.membersCount * 45)}</p>
                          <p className="text-sm text-muted-foreground">Leads captados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">{Math.min(95, 75 + activeTeam.membersCount)}%</p>
                          <p className="text-sm text-muted-foreground">Cobertura da região</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <LineChart className="h-4 w-4" />
                  <AlertTitle>Métricas de performance</AlertTitle>
                  <AlertDescription>Indicadores de produtividade e conversão da equipe.</AlertDescription>
                </Alert>
                <div className="grid gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                            <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{metric.helper}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="pipeline" className="space-y-4">
                <Alert className="border-purple-200 bg-purple-50">
                  <Filter className="h-4 w-4" />
                  <AlertTitle>Distribuição do pipeline</AlertTitle>
                  <AlertDescription>Veja como estão distribuídos os leads em cada etapa do funil.</AlertDescription>
                </Alert>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pipelineDistribution.map((item, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <Badge className={cn('mt-1', item.accent)}>{item.value}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Carregando informações da equipe...</p>
          </div>
        )}
      </div>
    );

    if (isDesktop) {
      return (
        <Dialog open={isDetailOpen} onOpenChange={handleDetailOpenChange}>
          <DialogContent className="h-[80vh] max-w-3xl overflow-hidden p-0">
            <DialogHeader className="border-b border-gray-200 px-6 py-4">
              <DialogTitle>Detalhes da equipe</DialogTitle>
              <DialogDescription>
                Acompanhe indicadores, performance e pipeline da equipe.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{body}</div>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={isDetailOpen} onOpenChange={handleDetailOpenChange}>
        <DrawerContent className="h-[85vh]">
          <DrawerHeader className="border-b border-gray-200">
            <DrawerTitle>Detalhes da equipe</DrawerTitle>
            <DrawerDescription>
              Acompanhe indicadores, performance e pipeline da equipe.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">{body}</div>
        </DrawerContent>
      </Drawer>
    );
  };

  const feedbackDescription = hasActiveFilters
    ? selectedStatuses.length || selectedCities.length
      ? `Mostrando ${filteredTeams.length} ${filteredTeams.length === 1 ? 'equipe' : 'equipes'} com os filtros aplicados.`
      : `Mostrando ${filteredTeams.length} resultados para "${searchTerm}".`
    : totalTeams === 0
      ? 'Cadastre uma equipe para começar a acompanhar resultados.'
      : `Acompanhe a performance de ${totalTeams} ${totalLabel} em tempo real.`;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">Equipes e Filiais</h2>
            <p className="text-sm text-muted-foreground">
              Monitore performance, cobertura de mercado e distribuição de leads por equipe.
            </p>
          </div>
          <Button onClick={handleNavigateToCreate} className="self-start md:self-auto">
            Adicionar equipe
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={event => handleUpdateParam('teamSearch', event.target.value || undefined)}
                  placeholder="Buscar por equipe, filial ou cidade"
                  className="pl-9"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="md:ml-2" onClick={handleClearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </div>
              {statusChips.map(chip => {
                const isActive = selectedStatuses.includes(chip.value);
                return (
                  <Button
                    key={chip.value}
                    type="button"
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'rounded-full border-muted-foreground/20',
                      isActive ? 'bg-gray-900 text-white hover:bg-gray-900/90' : 'bg-white'
                    )}
                    onClick={() => toggleFilter('teamStatus', chip.value)}
                  >
                    <span>{chip.label}</span>
                    <span
                      className={cn(
                        'ml-2 text-xs font-medium',
                        isActive ? 'text-white/80' : 'text-muted-foreground'
                      )}
                    >
                      {chip.count}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Regiões</span>
              </div>
              {cityChips.length === 0 ? (
                <span className="text-xs text-muted-foreground">Sem dados disponíveis</span>
              ) : (
                cityChips.map(chip => {
                  const isActive = selectedCities.includes(chip.value);
                  return (
                    <Button
                      key={chip.value}
                      type="button"
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'rounded-full border-muted-foreground/20',
                        isActive ? 'bg-orange-500 text-white hover:bg-orange-500/90' : 'bg-white'
                      )}
                      onClick={() => toggleFilter('teamCity', chip.value)}
                    >
                      <span>{chip.label}</span>
                      <span
                        className={cn(
                          'ml-2 text-xs font-medium',
                          isActive ? 'text-white/80' : 'text-muted-foreground'
                        )}
                      >
                        {chip.count}
                      </span>
                    </Button>
                  );
                })
              )}
            </div>
          </div>

          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertTitle>{hasActiveFilters ? 'Filtros aplicados' : 'Visão geral das equipes'}</AlertTitle>
            <AlertDescription>{feedbackDescription}</AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index.toString()} className="border border-gray-200">
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Users2 className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhuma equipe encontrada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajuste os filtros ou adicione uma nova equipe para começar a acompanhar seus resultados.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpar filtros
                </Button>
                <Button onClick={handleNavigateToCreate}>Adicionar equipe</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map(team => (
                <Card key={team.id} className="flex h-full flex-col border border-gray-200 shadow-sm">
                  <CardHeader className="space-y-1 border-b border-gray-100 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold text-gray-900">{team.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{team.branch ?? '—'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-0 bg-gray-100 text-xs font-medium',
                            team.status === 'active' && 'bg-emerald-50 text-emerald-600',
                            team.status === 'expansion' && 'bg-orange-50 text-orange-600',
                            team.status === 'inactive' && 'bg-gray-200 text-gray-600'
                          )}
                        >
                          {teamStatusLabels[team.status]}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Abrir ações da equipe ${team.name}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleMembersDrawerOpen(team)}>
                              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                              Gerenciar membros
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleEditTeam(team)}>
                              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                              Editar equipe
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleNavigateToTeam(team.id)}>
                              Ver painel completo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users2 className="h-4 w-4 text-muted-foreground" />
                      <span>{team.membersCount} corretores</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{team.manager?.name ?? 'Responsável não definido'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {team.city ?? 'Cidade não informada'}
                        {team.state ? ` • ${team.state}` : ''}
                      </span>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {(team.tags ?? []).map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 pt-2 sm:grid-cols-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="sm:col-span-2"
                        onClick={() => handleMembersDrawerOpen(team)}
                      >
                        Gerenciar membros
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleNavigateToTeam(team.id)}
                      >
                        Ver equipe
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleNavigateToTeam(team.id, 'performance')}
                      >
                        Painel de performance
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {filteredTeams.length > 0 && totalTeams > perPage && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-4 sm:flex-row">
              <span className="text-sm text-muted-foreground">
                Mostrando {startIndex}-{endIndex} de {totalTeams} {totalLabel}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
        <TeamFormDrawer
          key={teamFormState?.team?.id ?? teamFormState?.mode ?? 'create'}
          open={Boolean(teamFormState)}
          mode={teamFormState?.mode ?? 'create'}
          team={teamFormState?.team ?? null}
          onClose={handleTeamFormClose}
          onSuccess={handleTeamFormSuccess}
        />
        <TeamMembersDrawer
          key={membersDrawerTeam?.id ?? 'members-drawer'}
          open={Boolean(membersDrawerTeam)}
          team={membersDrawerTeam}
          onClose={handleMembersDrawerClose}
          onTeamUpdated={handleMembersUpdated}
          onRequestRefresh={handleMembersRefresh}
        />
        {renderDetailOverlay()}
      </div>
    </>
  );
}

export default EquipeTabContent;