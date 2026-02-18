import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { IS_MOCK } from '@/utils/env';
import {
  BadgeCheck,
  Coins,
  Facebook,
  Filter,
  Globe,
  Info,
  Instagram,
  Mail,
  MessageCircle,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';

interface CampaignKpi {
  id: string;
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: keyof typeof KPI_ICONS;
}

export interface CampaignTableRow {
  id: string;
  name: string;
  channelId: string;
  channelName: string;
  status: 'ativo' | 'pausado';
  leads: number;
  opportunities: number;
  conversions: number;
  spend: number;
  revenue: number;
  conversionRate: number;
  costPerLead: number;
  roi: number;
}

interface CampaignFunnelStage {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  tooltip: string;
}

interface CampaignsAnalyticsResponse {
  kpis: CampaignKpi[];
  campaigns: CampaignTableRow[];
  funnel: CampaignFunnelStage[];
}

interface CampaignChannelOption {
  id: string;
  name: string;
  icon: keyof typeof CHANNEL_ICONS;
}

interface CampaignOption {
  id: string;
  name: string;
  channelId: string;
}

interface CampaignIntegrationsResponse {
  channels: CampaignChannelOption[];
  campaigns: CampaignOption[];
}

export interface CampaignFilters {
  period: '7d' | '14d' | '30d' | '90d';
  channels: string[];
  campaigns: string[];
}

interface CampaignsTabProps {
  search: string;
  filters: CampaignFilters;
  onFiltersChange: (filters: CampaignFilters) => void;
  onOpenDetails: (campaign: CampaignTableRow) => void;
  onLoadingChange?: (loading: boolean) => void;
}

type SortField = 'leads' | 'conversionRate' | 'costPerLead' | 'roi';
type SortDirection = 'asc' | 'desc';

const KPI_ICONS = {
  Users,
  BadgeCheck,
  Coins,
  TrendingUp,
};

const CHANNEL_ICONS = {
  Search,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Facebook,
};

const CHANNEL_COLORS: Record<string, string> = {
  google_ads: 'hsl(var(--accentSoft))',
  facebook_ads: '#2563eb',
  instagram_ads: '#db2777',
  portals: '#0f172a',
  email: '#16a34a',
  whatsapp: '#16a34a',
};

const DEFAULT_PAGE_SIZE = 5;

const formatCurrencyBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatNumberBR = (
  value: number,
  options?: Intl.NumberFormatOptions
) => value.toLocaleString('pt-BR', { maximumFractionDigits: 0, ...options });

function buildQueryString(filters: CampaignFilters, search: string) {
  const params = new URLSearchParams();
  params.set('period', filters.period);
  if (filters.channels.length) {
    params.set('channels', filters.channels.join(','));
  }
  if (filters.campaigns.length) {
    params.set('campaigns', filters.campaigns.join(','));
  }
  if (search) {
    params.set('search', search);
  }
  return params.toString();
}

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function CampaignsTab({
  search,
  filters,
  onFiltersChange,
  onOpenDetails,
  onLoadingChange,
}: CampaignsTabProps) {
  const [sortField, setSortField] = useState<SortField>('leads');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);

  const analyticsQuery = useQuery<CampaignsAnalyticsResponse, HttpError>({
    queryKey: ['campaigns-analytics', filters, search],
    queryFn: async () => {
      const query = buildQueryString(filters, search);
      const response = await apiFetch(`/analytics/campaigns?${query}`);
      if (response.status === 403) {
        throw new HttpError('Acesso negado às métricas de campanhas', 403);
      }
      if (!response.ok) {
        throw new HttpError('Não foi possível carregar as métricas de campanhas.', response.status);
      }
      return (await response.json()) as CampaignsAnalyticsResponse;
    },
  });

  const integrationsQuery = useQuery<CampaignIntegrationsResponse, HttpError>({
    queryKey: ['campaigns-integrations'],
    queryFn: async () => {
      const response = await apiFetch('/integrations/campaigns');
      if (response.status === 403) {
        throw new HttpError('Acesso negado às integrações de campanhas', 403);
      }
      if (!response.ok) {
        throw new HttpError('Não foi possível carregar as integrações de campanhas.', response.status);
      }
      return (await response.json()) as CampaignIntegrationsResponse;
    },
  });

  const isLoading = analyticsQuery.isLoading || integrationsQuery.isLoading;

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  const channelsById = useMemo(() => {
    const map = new Map<string, CampaignChannelOption>();
    integrationsQuery.data?.channels.forEach(channel => {
      map.set(channel.id, channel);
    });
    return map;
  }, [integrationsQuery.data]);

  const filteredCampaigns = useMemo(() => {
    if (!analyticsQuery.data?.campaigns) return [];
    return analyticsQuery.data.campaigns
      .filter(campaign => {
        if (filters.channels.length && !filters.channels.includes(campaign.channelId)) {
          return false;
        }
        if (filters.campaigns.length && !filters.campaigns.includes(campaign.id)) {
          return false;
        }
        if (search && !campaign.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [analyticsQuery.data?.campaigns, filters, search]);

  const sortedCampaigns = useMemo(() => {
    const campaigns = [...filteredCampaigns];
    campaigns.sort((a, b) => {
      const first = a[sortField];
      const second = b[sortField];
      if (typeof first === 'number' && typeof second === 'number') {
        return sortDirection === 'asc' ? first - second : second - first;
      }
      return 0;
    });
    return campaigns;
  }, [filteredCampaigns, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedCampaigns.length / DEFAULT_PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return sortedCampaigns.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [sortedCampaigns, page]);

  const hasAnalyticsPermission = analyticsQuery.error?.status !== 403;
  const hasIntegrationsPermission = integrationsQuery.error?.status !== 403;

  const handleToggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortDirection(field === 'costPerLead' ? 'asc' : 'desc');
  };

  const handleChannelChange = (channelId: string, checked: boolean) => {
    const nextChannels = checked
      ? [...new Set([...filters.channels, channelId])]
      : filters.channels.filter(id => id !== channelId);
    onFiltersChange({ ...filters, channels: nextChannels });
  };

  const handleCampaignChange = (campaignId: string, checked: boolean) => {
    const nextCampaigns = checked
      ? [...new Set([...filters.campaigns, campaignId])]
      : filters.campaigns.filter(id => id !== campaignId);
    onFiltersChange({ ...filters, campaigns: nextCampaigns });
  };

  if (!hasAnalyticsPermission) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Sem permissão</AlertTitle>
        <AlertDescription>
          Você não possui permissão para visualizar os dados analíticos das campanhas.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasIntegrationsPermission) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Integrações indisponíveis</AlertTitle>
        <AlertDescription>
          Conecte suas integrações para visualizar os dados das campanhas.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {IS_MOCK && (
        <Alert className="border-dashed border-orange-200 bg-orange-50 text-orange-700">
          <AlertTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Dados mockados para demonstração
          </AlertTitle>
          <AlertDescription>
            Os indicadores exibidos simulam uma conta conectada às integrações de campanhas.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold">Visão de campanhas</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Período
                  <Badge variant="secondary" className="ml-1">
                    {filters.period.replace('d', ' dias')}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-2">
                  {(
                    [
                      { label: 'Últimos 7 dias', value: '7d' },
                      { label: 'Últimos 14 dias', value: '14d' },
                      { label: 'Últimos 30 dias', value: '30d' },
                      { label: 'Últimos 90 dias', value: '90d' },
                    ] as const
                  ).map(option => (
                    <Button
                      key={option.value}
                      variant={option.value === filters.period ? 'default' : 'ghost'}
                      size="sm"
                      className="justify-start"
                      onClick={() => onFiltersChange({ ...filters, period: option.value })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Canais
                  {filters.channels.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.channels.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Selecione os canais</div>
                  {integrationsQuery.data?.channels.map(channel => {
                    const Icon = CHANNEL_ICONS[channel.icon] ?? Globe;
                    return (
                      <label
                        key={channel.id}
                        className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                      >
                        <Checkbox
                          checked={filters.channels.includes(channel.id)}
                          onCheckedChange={checked =>
                            handleChannelChange(channel.id, checked === true)
                          }
                        />
                        <Icon className="h-4 w-4" style={{ color: CHANNEL_COLORS[channel.id] }} />
                        <span className="text-sm text-gray-700">{channel.name}</span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  Campanhas
                  {filters.campaigns.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.campaigns.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Selecione as campanhas</div>
                  {integrationsQuery.data?.campaigns.map(campaign => (
                    <label
                      key={campaign.id}
                      className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <Checkbox
                        checked={filters.campaigns.includes(campaign.id)}
                        onCheckedChange={checked =>
                          handleCampaignChange(campaign.id, checked === true)
                        }
                      />
                      <span className="text-sm text-gray-700">{campaign.name}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="border border-dashed border-muted-foreground/20">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="mt-4 h-8 w-32" />
                      <Skeleton className="mt-2 h-4 w-24" />
                    </CardContent>
                  </Card>
                ))
              : analyticsQuery.data?.kpis.map(kpi => {
                  const Icon = KPI_ICONS[kpi.icon] ?? Users;
                  return (
                    <Card key={kpi.id}>
                      <CardContent className="flex flex-col gap-3 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                            <Icon className="h-4 w-4 text-orange-500" />
                            {kpi.label}
                          </div>
                          {typeof kpi.change === 'number' && (
                            <Badge
                              variant={kpi.change >= 0 ? 'success' : 'destructive'}
                              className="capitalize"
                            >
                              {kpi.change >= 0 ? '+' : ''}
                              {kpi.change}%
                            </Badge>
                          )}
                        </div>
                        <div className="text-3xl font-semibold text-gray-900">
                          {(() => {
                            if (kpi.id === 'investment') {
                              return formatCurrencyBRL(kpi.value);
                            }
                            if (kpi.id === 'roi') {
                              return `${kpi.value.toFixed(1)}x`;
                            }
                            return formatNumberBR(kpi.value);
                          })()}
                        </div>
                        {kpi.changeLabel && (
                          <span className="text-xs text-gray-500">{kpi.changeLabel}</span>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Campanhas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Leads, conversões e desempenho financeiro por campanha
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Ordenado por {sortField === 'costPerLead' ? 'CPL' : sortField} ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <Alert>
              <AlertTitle>Nenhum resultado encontrado</AlertTitle>
              <AlertDescription>
                Ajuste os filtros ou refine a busca para visualizar campanhas.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleToggleSort('leads')}>
                      Leads
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleToggleSort('conversionRate')}>
                      Conversão
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleToggleSort('costPerLead')}>
                      CPL
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleToggleSort('roi')}>
                      ROI
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map(campaign => {
                    const channel = channelsById.get(campaign.channelId);
                    const ChannelIcon = channel ? CHANNEL_ICONS[channel.icon] ?? Globe : Globe;
                    return (
                      <TableRow key={campaign.id} className="odd:bg-muted/40">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{campaign.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {campaign.opportunities} oportunidades · {campaign.conversions} vendas
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                              style={{ backgroundColor: CHANNEL_COLORS[campaign.channelId] ?? '#0f172a' }}
                            >
                              <ChannelIcon className="h-4 w-4" />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-800">
                                {campaign.channelName}
                              </span>
                              <Badge variant={campaign.status === 'ativo' ? 'success' : 'secondary'}>
                                {campaign.status === 'ativo' ? 'Ativa' : 'Pausada'}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatNumberBR(campaign.leads)}</TableCell>
                        <TableCell>{campaign.conversionRate.toFixed(1)}%</TableCell>
                        <TableCell>{formatCurrencyBRL(campaign.costPerLead)}</TableCell>
                        <TableCell>{campaign.roi.toFixed(1)}x</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="link"
                            className="px-0 text-orange-600"
                            onClick={() => onOpenDetails(campaign)}
                          >
                            Ver detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        setPage(current => Math.max(1, current - 1));
                      }}
                      className={cn({ 'pointer-events-none opacity-50': page === 1 })}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={page === index + 1}
                        onClick={event => {
                          event.preventDefault();
                          setPage(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        setPage(current => Math.min(totalPages, current + 1));
                      }}
                      className={cn({ 'pointer-events-none opacity-50': page === totalPages })}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Funil de desempenho</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsQuery.data?.funnel.map(stage => (
                <TooltipProvider key={stage.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium text-gray-600">{stage.label}</div>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.max(stage.percentage, 2)}%`,
                              backgroundColor: stage.color,
                            }}
                          />
                        </div>
                        <div className="w-24 text-right text-sm font-semibold text-gray-900">
                          {formatNumberBR(stage.value)}
                        </div>
                        <div className="w-16 text-right text-xs text-muted-foreground">
                          {stage.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{stage.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CampaignsTab;
