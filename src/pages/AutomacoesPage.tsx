import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bot,
  Building,
  CheckCircle2,
  Clock3,
  Filter,
  Gauge,
  Home,
  PauseCircle,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import PageContainer from '@/components/ui/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AutomationShortcut {
  title: string;
  description: string;
  status: 'Ativo' | 'Inativo' | 'Agendado' | 'Revisão';
  icon: JSX.Element;
  actionLabel?: string;
}

const shortcuts: AutomationShortcut[] = [
  {
    title: 'Recebimento automático',
    description: 'Receber lead automaticamente da carteira ou distribuição.',
    status: 'Ativo',
    icon: <Sparkles className="h-4 w-4 text-orange-500" />,
  },
  {
    title: 'CheckPoints automáticos',
    description: 'Próximos checkpoints e automações de reativação.',
    status: 'Agendado',
    icon: <Clock3 className="h-4 w-4 text-blue-600" />,
  },
  {
    title: 'Desativar corretor',
    description: 'Fluxo para retirar corretores da carteira quando necessário.',
    status: 'Revisão',
    icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
    actionLabel: 'Abrir fluxo',
  },
];

const checkpoints = [
  {
    title: 'Próximo checkpoint agendado',
    description: 'sábado, 30 de agosto de 2025 às 10:00',
    status: 'Agendado',
  },
  {
    title: 'Próxima execução prevista',
    description: 'domingo, 31 de agosto de 2025 às 11:00',
    status: 'Ativo',
  },
];

type AutomationStatus = 'ativo' | 'agendado' | 'revisao' | 'pausado';

interface AutomationCatalogItem {
  title: string;
  status: AutomationStatus;
  description: string;
  accent: string;
  icon: JSX.Element;
  tags?: string[];
  path?: string;
  actionLabel?: string;
}

const statusLabels: Record<AutomationStatus, string> = {
  ativo: 'Ativo',
  agendado: 'Agendado',
  revisao: 'Revisão',
  pausado: 'Pausado',
};

const statusBadgeClasses: Record<AutomationStatus, string> = {
  ativo: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  agendado: 'bg-blue-50 text-blue-700 border-blue-100',
  revisao: 'bg-amber-50 text-amber-700 border-amber-100',
  pausado: 'bg-gray-100 text-gray-700 border-gray-200',
};

const automationsCatalog: AutomationCatalogItem[] = [
  {
    title: 'Automação de recebimento',
    status: 'ativo',
    description: 'Fluxo principal para distribuir leads de forma automática.',
    accent: 'text-orange-600',
    icon: <Sparkles className="h-4 w-4 text-orange-500" />,
    path: '/automacoes/recebimento',
    tags: ['Distribuição', 'Filas', 'Regras'],
  },
  {
    title: 'CheckPoints automáticos',
    status: 'agendado',
    description: 'Validações recorrentes e ações programadas.',
    accent: 'text-blue-600',
    icon: <Clock3 className="h-4 w-4 text-blue-600" />,
    tags: ['Agendamentos', 'Revisões'],
  },
  {
    title: 'Desativar leads',
    status: 'revisao',
    description: 'Fluxo para pausar leads inativos ou duplicados.',
    accent: 'text-amber-600',
    icon: <PauseCircle className="h-4 w-4 text-amber-600" />,
    tags: ['Higienização'],
  },
  {
    title: 'Automação de corretores',
    status: 'ativo',
    description: 'Regras de desativação e reativação de corretores.',
    accent: 'text-emerald-600',
    icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
    tags: ['Carteira', 'Regras'],
  },
  {
    title: 'Reativar leads frios',
    status: 'pausado',
    description: 'Campanhas de retomada para leads antigos.',
    accent: 'text-purple-600',
    icon: <Repeat className="h-4 w-4 text-purple-600" />,
    tags: ['Campanhas'],
    actionLabel: 'Rever campanha',
  },
  {
    title: 'Notificações inteligentes',
    status: 'ativo',
    description: 'Alertas e lembretes automáticos em tempo real.',
    accent: 'text-rose-600',
    icon: <Activity className="h-4 w-4 text-rose-600" />,
    tags: ['Alertas'],
  },
];

const highlightCards = [
  {
    title: 'Gestão de Clientes',
    description: 'Visão rápida do funil de clientes e corretores.',
    status: 'Em dia',
    color: 'text-emerald-600',
    accent: 'bg-emerald-50',
    icon: <Home className="h-5 w-5 text-emerald-600" />,
    action: 'Abrir configurações',
  },
  {
    title: 'Gestão de Imóveis',
    description: 'Portfólio de imóveis e ajustes pendentes.',
    status: 'Atenção',
    color: 'text-amber-600',
    accent: 'bg-amber-50',
    icon: <Building className="h-5 w-5 text-amber-600" />,
    action: 'Ver painel',
  },
  {
    title: 'Roletão',
    description: 'Saúde do funil de distribuição automática.',
    status: 'Distribuição ativa',
    color: 'text-orange-600',
    accent: 'bg-orange-50',
    icon: <Gauge className="h-5 w-5 text-orange-600" />,
    action: 'Abrir roletão',
  },
  {
    title: 'CheckPoints automáticos',
    description: 'Recalcule recomendações e alertas com segurança.',
    status: 'Próxima execução em 30/08/2025 10:00',
    color: 'text-blue-600',
    accent: 'bg-blue-50',
    icon: <Clock3 className="h-5 w-5 text-blue-600" />,
    action: 'Editar checkpoint',
  },
];

const statusChips: { label: string; value: AutomationStatus | 'todos'; tone: string }[] = [
  { label: 'Todos', value: 'todos', tone: 'bg-gray-100 text-gray-700' },
  { label: 'Ativos', value: 'ativo', tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Agendados', value: 'agendado', tone: 'bg-blue-50 text-blue-700' },
  { label: 'Revisão', value: 'revisao', tone: 'bg-amber-50 text-amber-700' },
  { label: 'Pausados', value: 'pausado', tone: 'bg-gray-100 text-gray-700' },
];

function AutomacoesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'agendado' | 'revisao' | 'pausado'>('todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatusFilter, setPendingStatusFilter] = useState(statusFilter);
  const [checkpointAutomatico, setCheckpointAutomatico] = useState(true);
  const filtersCount = statusFilter !== 'todos' ? 1 : 0;

  useEffect(() => {
    setPendingStatusFilter(statusFilter);
  }, [statusFilter]);

  const filteredAutomations = automationsCatalog.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      case 'gestao-relatorios':
        navigate('/gestao-relatorios');
        break;
      case 'automacoes':
        navigate('/automacoes');
        break;
      case 'gestao-acessos':
        navigate('/gestao-acessos');
        break;
      default:
        break;
    }
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatusFilter);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setPendingStatusFilter('todos');
    setStatusFilter('todos');
    setIsFilterOpen(false);
  };

  return (
    <ResponsiveLayout activeTab="automacoes" setActiveTab={handleMainTabChange}>
      <PageContainer className="py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-5 w-5 text-orange-500" />
            <span className="font-medium text-foreground">Painel de automações</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Automações</h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Centralize as automações de recebimento, checkpoints e fluxos de corretores para manter o funil funcionando automaticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Buscar automações por nome, status, imóveis ou responsáveis"
                className="w-full rounded-full border border-border bg-muted/30 px-4 py-3 pl-12 text-base text-foreground placeholder:text-muted-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                aria-label="Buscar automações"
              />
            </div>

            <div className="flex items-center gap-3">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Abrir filtros de automações"
                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition hover:bg-muted ${
                      filtersCount > 0
                        ? 'border-orange-500/60 bg-orange-50 text-orange-600'
                        : 'border-border bg-muted/60 text-muted-foreground'
                    }`}
                  >
                    <Filter className="h-5 w-5" />
                    {filtersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                        {filtersCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Filtros de automações</SheetTitle>
                    <SheetDescription>
                      Ajuste os status e demais recortes para refinar os resultados mostrados na lista.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Status da automação</p>
                      <Select
                        value={pendingStatusFilter}
                        onValueChange={value => setPendingStatusFilter(value as typeof pendingStatusFilter)}
                      >
                        <SelectTrigger className="h-11 rounded-xl border border-border text-sm">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os status</SelectItem>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="agendado">Agendado</SelectItem>
                          <SelectItem value="revisao">Revisão</SelectItem>
                          <SelectItem value="pausado">Pausado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                      Use os filtros para recortar automações por status, tipo, vínculo com imóveis ou responsáveis. Novos filtros podem ser adicionados sem alterar as regras já existentes.
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
                        Limpar
                      </Button>
                      <Button className="flex-1" onClick={handleApplyFilters}>
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={statusFilter} onValueChange={value => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger className="h-12 min-w-[220px] rounded-xl border border-border bg-white text-sm">
                  <SelectValue placeholder="Imóveis e status" aria-label="Filtrar automações por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Imóveis e status</SelectItem>
                  <SelectItem value="ativo">Automações ativas</SelectItem>
                  <SelectItem value="agendado">Checkpoints agendados</SelectItem>
                  <SelectItem value="revisao">Itens em revisão</SelectItem>
                  <SelectItem value="pausado">Fluxos pausados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusChips.map(chip => (
              <button
                key={chip.value}
                type="button"
                onClick={() => setStatusFilter(chip.value as typeof statusFilter)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === chip.value ? `${chip.tone} ring-1 ring-offset-1 ring-orange-200` : 'bg-white text-gray-600 border border-border'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Buscar em automações por nome, status, imóveis ou responsáveis. Clique em qualquer card para abrir a configuração correspondente.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {highlightCards.map(card => (
            <div key={card.title} className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>{card.icon}</span>
                  <span>{card.title}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${card.accent} ${card.color.replace('text', 'bg').replace('-600', '-100')} ${card.color}`}>
                  {card.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              <button className="mt-3 self-start text-sm font-semibold text-orange-600 hover:text-orange-700">
                {card.action} →
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredAutomations.map(item => (
            <button
              key={item.title}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              className={`group flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition ${
                item.path ? 'hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md' : 'cursor-default'
              }`}
              aria-label={`Abrir configurações de ${item.title}`}
            >
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">{item.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold text-gray-900 ${item.accent}`}>{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-semibold uppercase tracking-tight ${statusBadgeClasses[item.status]}`}
                >
                  {statusLabels[item.status]}
                </Badge>
              </div>
              <div className="flex w-full flex-wrap gap-2">
                {item.tags?.map(tag => (
                  <span key={tag} className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex w-full items-center justify-between text-xs font-semibold text-orange-600 transition group-hover:translate-x-1">
                <span>{item.actionLabel || 'Abrir configurações'}</span>
                <span aria-hidden>→</span>
              </div>
            </button>
          ))}
          {filteredAutomations.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-orange-800">
              Nenhuma automação encontrada com esses filtros. Ajuste a busca ou selecione outro status.
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-orange-500" />
                Automação de recebimento
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure quem recebe leads automaticamente e abra a tela dedicada para editar regras, filas e condições de distribuição.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Roletão sincronizado</Badge>
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Distribuição ativa</Badge>
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Fila priorizada</Badge>
              </div>

              <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/80 p-4">
                <p className="text-sm font-semibold text-orange-800">Resumo rápido</p>
                <p className="text-sm text-orange-800">
                  Clique abaixo para ajustar quem recebe leads, alternar o roletão e revisar checkpoints antes de ativar qualquer fluxo.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Fluxo ativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Validado pelos filtros atuais</span>
                  </div>
                </div>
                <Button
                  className="bg-orange-600 text-white hover:bg-orange-700"
                  onClick={() => navigate('/automacoes/recebimento')}
                >
                  Abrir configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-orange-500" />
                Automações rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shortcuts.map(item => (
                <div
                  key={item.title}
                  className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'Inativo' ? 'secondary' : 'default'}>{item.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Abrir painel de configuração</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                      onClick={() => navigate('/automacoes/recebimento')}
                    >
                      {item.actionLabel || 'Configurar'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PauseCircle className="h-5 w-5 text-amber-500" />
                Desativar corretor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Execute a automação de desativação avaliando carteira, checkpoints e filtros antes de pausar os usuários.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <Badge variant="secondary">Impacto na carteira</Badge>
                <Badge variant="secondary">Checkpoints recentes</Badge>
                <Badge variant="secondary">Estratégia proporcional</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {[{ label: 'Total na carteira', value: 74 }, { label: 'Leads quentes', value: 16 }, { label: 'Leads mornos', value: 28 }, { label: 'Leads frios', value: 30 }].map(item => (
                  <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-xl font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Estratégia para a carteira</p>
                    <p className="text-sm text-gray-600">Escolha como redistribuir os leads após a desativação.</p>
                  </div>
                  <Button variant="outline">Editar estratégia</Button>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Próximo checkpoint agendado para validar a carteira.
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">Continuar fluxo</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock3 className="h-5 w-5 text-blue-600" />
                CheckPoints automáticos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Acompanhe checkpoints agendados e edite as condições de reativação ou desativação.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkpoints.map(item => (
                <div key={item.title} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <Badge variant={item.status === 'Agendado' ? 'outline' : 'default'}>{item.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span>Editar checkpoint</span>
                    <span>•</span>
                    <span>Executar agora</span>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                Ative o checkpoint automático para desativar corretores que não cumprem os critérios ou para reativar usuários após o período configurado.
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Switch checked={checkpointAutomatico} onCheckedChange={setCheckpointAutomatico} aria-label="Alternar checkpoints automáticos" />
                    <span>{checkpointAutomatico ? 'Checkpoint automático ativo' : 'Checkpoint automático inativo'}</span>
                  </div>
                  <Button size="sm" variant="outline">Editar regras</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ResponsiveLayout>
  );
}

export default AutomacoesPage;
