import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plug as Plugs } from 'lucide-react';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import PageContainer from '@/components/ui/page-container';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ConnectorCard from '@/features/integracoes/ConnectorCard';
import { HunterApiExplorer } from '@/features/integracoes/HunterApiExplorer';
import { connectors as availableConnectors, type Connector } from '@/lib/mock/connectors';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import {
  fetchWebhookMetadata,
  getWebhookConfiguration,
  listWebhookLogs,
  rotateWebhookSecret,
  testWebhookDelivery,
  updateWebhookConfiguration,
} from '@/api/webhooks';
import { WebhookCard } from '@/features/integracoes/webhooks/WebhookCard';
import { WebhookWizard } from '@/features/integracoes/webhooks/WebhookWizard';
import { WebhookLogsDrawer } from '@/features/integracoes/webhooks/WebhookLogsDrawer';
import { hunterApiMeta } from '@/data/hunterApiDocs';
import type {
  WebhookConfig,
  WebhookDeliveryStatus,
  WebhookEvent,
  WebhookLogEntry,
  WebhookPreset,
} from '@/types/webhooks';
import { getCurrentUser, hasPermission } from '@/data/accessControl';

export default function GestaoApi() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'nome' | 'ativo' | 'atualizado'>('nome');
  const [connectors, setConnectors] = useState<Connector[]>(availableConnectors);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig | null>(null);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [webhookPresets, setWebhookPresets] = useState<WebhookPreset[]>([]);
  const [webhookSearch, setWebhookSearch] = useState('');
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsFilter, setLogsFilter] = useState<WebhookDeliveryStatus | 'all'>('all');
  const [rotatingSecret, setRotatingSecret] = useState(false);
  const [applyingPreset, setApplyingPreset] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'api-hunter' | 'integrations' | 'webhooks'>(
    'api-hunter',
  );

  const currentUser = getCurrentUser();
  const canViewWebhook = hasPermission(currentUser, 'integrations:view');
  const canManageWebhook = hasPermission(currentUser, 'integrations:manage');

  const loadWebhookData = useCallback(async () => {
    if (!canViewWebhook) {
      setWebhookConfig(null);
      return;
    }
    setWebhookLoading(true);
    try {
      const [metadata, configData] = await Promise.all([
        fetchWebhookMetadata(),
        getWebhookConfiguration(),
      ]);
      setWebhookEvents(metadata.events);
      setWebhookPresets(metadata.presets);
      setWebhookConfig(configData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar webhook',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as configurações do webhook.',
        variant: 'destructive',
      });
    } finally {
      setWebhookLoading(false);
    }
  }, [canViewWebhook]);

  useEffect(() => {
    loadWebhookData();
  }, [loadWebhookData]);

  const refreshWebhookLogs = useCallback(async () => {
    if (!canViewWebhook) return;
    setLogsLoading(true);
    try {
      const data = await listWebhookLogs({
        status: logsFilter === 'all' ? undefined : logsFilter,
      });
      setWebhookLogs(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar logs',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível obter os logs de entrega.',
        variant: 'destructive',
      });
    } finally {
      setLogsLoading(false);
    }
  }, [canViewWebhook, logsFilter]);

  useEffect(() => {
    if (logsOpen) {
      refreshWebhookLogs();
    }
  }, [logsOpen, refreshWebhookLogs]);

  const handleToggleWebhook = useCallback(
    async (enabled: boolean) => {
      if (!canManageWebhook) return;
      const previous = webhookConfig ? { ...webhookConfig } : null;
      setWebhookConfig(prev => (prev ? { ...prev, enabled } : prev));
      try {
        const updated = await updateWebhookConfiguration({ enabled });
        setWebhookConfig(updated);
        toast({
          title: enabled ? 'Webhook ativado' : 'Webhook desativado',
          description: enabled
            ? 'Novos eventos serão enviados para o endpoint configurado.'
            : 'O envio de eventos foi pausado.',
        });
      } catch (error) {
        if (previous) {
          setWebhookConfig(previous);
        }
        toast({
          title: 'Falha ao atualizar status',
          description:
            error instanceof Error
              ? error.message
              : 'Não foi possível alterar o status do webhook.',
          variant: 'destructive',
        });
      }
    },
    [canManageWebhook, webhookConfig],
  );

  const handleWizardSubmit = useCallback(
    async (payload: WebhookConfig) => {
      const updated = await updateWebhookConfiguration(payload);
      setWebhookConfig(updated);
    },
    [],
  );

  const handleTestWebhook = useCallback(async () => {
    const result = await testWebhookDelivery();
    setWebhookConfig(prev =>
      prev ? { ...prev, lastDelivery: new Date().toISOString() } : prev,
    );
    return result;
  }, []);

  const handleRotateSecret = useCallback(async () => {
    if (!canManageWebhook) return;
    setRotatingSecret(true);
    try {
      const updated = await rotateWebhookSecret();
      setWebhookConfig(updated);
      toast({
        title: 'Secret rotacionado',
        description: 'Um novo secret foi gerado e ativado imediatamente.',
      });
    } catch (error) {
      toast({
        title: 'Falha ao rotacionar secret',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível gerar um novo secret.',
        variant: 'destructive',
      });
    } finally {
      setRotatingSecret(false);
    }
  }, [canManageWebhook]);

  const handleViewLogs = useCallback(() => {
    setLogsOpen(true);
  }, []);

  const handlePresetApply = useCallback(
    async (preset: WebhookPreset) => {
      if (!canManageWebhook) {
        toast({
          title: 'Permissão insuficiente',
          description: 'Você precisa ter permissão para gerenciar webhooks.',
          variant: 'destructive',
        });
        return;
      }
      setApplyingPreset(preset.id);
      const previous = webhookConfig;
      setWebhookConfig(prev =>
        prev
          ? { ...prev, events: preset.eventIds, presetId: preset.id, enabled: true }
          : prev,
      );
      try {
        const updated = await updateWebhookConfiguration({
          events: preset.eventIds,
          presetId: preset.id,
          enabled: true,
        });
        setWebhookConfig(updated);
        toast({
          title: 'Coleção aplicada',
          description: `${preset.name} habilitada com ${preset.eventIds.length} eventos.`,
        });
      } catch (error) {
        if (previous) {
          setWebhookConfig(previous);
        }
        toast({
          title: 'Falha ao aplicar coleção',
          description:
            error instanceof Error
              ? error.message
              : 'Não foi possível salvar os eventos selecionados.',
          variant: 'destructive',
        });
      } finally {
        setApplyingPreset(null);
      }
    },
    [canManageWebhook, webhookConfig],
  );

  const handleToggleEvent = useCallback(
    async (eventId: string) => {
      if (!canManageWebhook || !webhookConfig) {
        setWizardOpen(true);
        return;
      }
      const hasEvent = webhookConfig.events.includes(eventId);
      const updatedEvents = hasEvent
        ? webhookConfig.events.filter(id => id !== eventId)
        : [...webhookConfig.events, eventId];

      const previous = webhookConfig;
      setWebhookConfig({ ...webhookConfig, events: updatedEvents, presetId: null });
      try {
        const updated = await updateWebhookConfiguration({
          events: updatedEvents,
          presetId: null,
        });
        setWebhookConfig(updated);
      } catch (error) {
        setWebhookConfig(previous);
        toast({
          title: 'Não foi possível atualizar eventos',
          description:
            error instanceof Error ? error.message : 'Verifique a conexão e tente novamente.',
          variant: 'destructive',
        });
      }
    },
    [canManageWebhook, webhookConfig],
  );

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
      default:
        break;
    }
  };

  const filtered = connectors
    .filter(c => c.nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'ativo') {
        return Number(b.ativo) - Number(a.ativo);
      }

      if (sort === 'atualizado') {
        const getTimestamp = (connector: Connector) => {
          const dateValue = connector.updatedAt ?? connector.updated_at;
          return dateValue ? new Date(dateValue).getTime() : 0;
        };

        return getTimestamp(b) - getTimestamp(a);
      }

      return a.nome.localeCompare(b.nome);
    });

  const handleConnectorChange = (updated: Connector) => {
    setConnectors(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const swaggerUrl = useMemo(
    () => `${hunterApiMeta.servers[0].url}${hunterApiMeta.swaggerPath}`,
    [],
  );

  const filteredWebhookPresets = useMemo(() => {
    if (!webhookSearch) return webhookPresets;
    const term = webhookSearch.toLowerCase();
    return webhookPresets.filter(
      preset =>
        preset.name.toLowerCase().includes(term) ||
        preset.description.toLowerCase().includes(term),
    );
  }, [webhookPresets, webhookSearch]);

  const filteredWebhookEvents = useMemo(() => {
    if (!webhookSearch) return webhookEvents;
    const term = webhookSearch.toLowerCase();
    return webhookEvents.filter(
      event =>
        event.name.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term),
    );
  }, [webhookEvents, webhookSearch]);

  const webhookEventsByCategory = useMemo(() => {
    return filteredWebhookEvents.reduce<Record<string, WebhookEvent[]>>((acc, event) => {
      acc[event.category] = acc[event.category] ?? [];
      acc[event.category].push(event);
      return acc;
    }, {});
  }, [filteredWebhookEvents]);

  return (
    <ResponsiveLayout activeTab="gestao-api" setActiveTab={handleMainTabChange}>
      <PageContainer className="py-6">
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              API · Gestão de API · API Hunter
            </p>
            <h1 className="text-3xl font-bold">Gestão API</h1>
            <p className="text-sm text-muted-foreground">
              Escolha entre a nova aba API Hunter ou mantenha a visão de conectores e webhooks.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            Catálogo completo de GET e POST
          </Badge>
        </header>

        <Tabs
          value={activeView}
          onValueChange={value => setActiveView(value as typeof activeView)}
          className="space-y-6"
        >
          <TabsList className="w-full justify-start bg-muted p-1">
            <TabsTrigger
              value="api-hunter"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              API Hunter
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              Gestão de API
            </TabsTrigger>
            <TabsTrigger
              value="webhooks"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-hunter" className="m-0">
            <HunterApiExplorer />
          </TabsContent>

          <TabsContent value="integrations" className="m-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                placeholder="Buscar conector..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select
                value={sort}
                onValueChange={value => setSort(value as 'nome' | 'ativo' | 'atualizado')}
              >
                <SelectTrigger className="sm:w-[180px]">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="atualizado">Atualizado em</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(connector => {
                const isPublicApi = connector.slug === 'api-publica';
                return (
                  <div
                    key={connector.id}
                    className={cn(isPublicApi && 'sm:col-span-2 lg:col-span-3')}
                  >
                    {isPublicApi ? (
                      <Link to={connector.docUrl ?? '#'} className="block">
                        <Card className="flex flex-col items-center justify-center p-6 text-center transition-colors hover:bg-muted">
                          <Plugs className="mb-2 h-8 w-8" />
                          <CardTitle className="text-base">{connector.nome}</CardTitle>
                        </Card>
                      </Link>
                    ) : (
                      <ConnectorCard connector={connector} onChange={handleConnectorChange} />
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="m-0 space-y-6">
            <Card className="border-orange-200 bg-orange-50/40">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">
                    Coleções de eventos
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">Webhooks em tempo real</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie coleções de webhooks, teste entregas e mantenha o Swagger sempre pronto
                    para consulta.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => window.open(swaggerUrl, '_blank')}>
                    Abrir Swagger
                  </Button>
                  <Button onClick={() => setWizardOpen(true)}>Configurar webhook</Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[2fr,1fr]">
                <div className="space-y-4">
                  {canViewWebhook && (
                    <WebhookCard
                      config={webhookConfig}
                      loading={webhookLoading}
                      canManage={canManageWebhook}
                      onConfigure={() => setWizardOpen(true)}
                      onToggle={handleToggleWebhook}
                      onViewLogs={handleViewLogs}
                      onRotateSecret={handleRotateSecret}
                      rotatingSecret={rotatingSecret}
                    />
                  )}
                </div>
                <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                    Logs e entregas
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Verifique tentativas recentes, latência e respostas do destino.
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button variant="outline" onClick={handleViewLogs}>
                      Ver logs
                    </Button>
                    <Button variant="ghost" onClick={handleTestWebhook}>
                      Enviar teste agora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                  Catálogo de eventos
                </p>
                <h4 className="text-lg font-semibold text-slate-900">Coleções e filtros rápidos</h4>
              </div>
              <Input
                placeholder="Filtrar por evento, categoria ou preset..."
                value={webhookSearch}
                onChange={event => setWebhookSearch(event.target.value)}
                className="sm:max-w-md"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.25fr,1fr]">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Coleções prontas</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Aplique rapidamente um conjunto de eventos para sincronizar com CRMs, anúncios ou
                    fluxos internos.
                  </p>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {filteredWebhookPresets.map(preset => {
                    const isActive = webhookConfig?.presetId === preset.id;
                    const isLoading = applyingPreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        className={cn(
                          'flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between',
                          isActive ? 'border-orange-300 bg-orange-50/60' : 'border-border bg-white',
                        )}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{preset.name}</p>
                            {preset.recommended && (
                              <Badge variant="outline" className="border-orange-300 text-orange-700">
                                Recomendado
                              </Badge>
                            )}
                            {isActive && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                Ativo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{preset.description}</p>
                          <p className="text-xs font-medium text-muted-foreground">
                            {preset.eventIds.length} eventos selecionados
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={isActive ? 'outline' : 'default'}
                            onClick={() => handlePresetApply(preset)}
                            disabled={isLoading}
                          >
                            {isActive ? 'Reaplicar' : 'Usar coleção'}
                          </Button>
                          <Button variant="ghost" onClick={() => setWizardOpen(true)}>
                            Ajustar no wizard
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {!filteredWebhookPresets.length && (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma coleção encontrada para o termo buscado.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Eventos disponíveis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Selecione rapidamente quais eventos este webhook deve ouvir, sem sair do painel.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(webhookEventsByCategory).map(([category, events]) => (
                    <div key={category} className="space-y-2 rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{category}</p>
                        <Badge variant="outline" className="text-xs">
                          {events.length} eventos
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {events.map(event => (
                          <label
                            key={event.id}
                            className="flex items-start gap-3 rounded-lg border border-transparent p-2 hover:border-orange-200 hover:bg-orange-50/40"
                          >
                            <Checkbox
                              checked={webhookConfig?.events?.includes(event.id) ?? false}
                              onCheckedChange={() => void handleToggleEvent(event.id)}
                              disabled={!canManageWebhook}
                            />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">{event.name}</p>
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!filteredWebhookEvents.length && (
                    <p className="text-sm text-muted-foreground">
                      Nenhum evento corresponde ao filtro aplicado.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <WebhookWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          config={webhookConfig}
          events={webhookEvents}
          presets={webhookPresets}
          canManage={canManageWebhook}
          onSubmit={handleWizardSubmit}
          onTest={handleTestWebhook}
        />
        <WebhookLogsDrawer
          open={logsOpen}
          onOpenChange={setLogsOpen}
          logs={webhookLogs}
          events={webhookEvents}
          isLoading={logsLoading}
          statusFilter={logsFilter}
          onStatusFilterChange={setLogsFilter}
          onRefresh={refreshWebhookLogs}
        />
      </PageContainer>
    </ResponsiveLayout>
  );
}
