import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AlugueisLayout } from '@/layouts/AlugueisLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  PhoneCall,
  Plus,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BillingContext, BillingRule, BillingRuleStage } from '@/services/billingAgenda';
import {
  getBillingTimeline,
  syncBillingTimeline,
} from '@/services/billingAgenda';
import { navigateAgendaToDate } from '@/services/agendaNavigation';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { KpiCardClickable } from '@/components/gestao-locacao/interactive/KpiCardClickable';
import { DetailsDrawer } from '@/components/gestao-locacao/interactive/DetailsDrawer';
import { DataTable, type DataTableColumn } from '@/components/gestao-locacao/interactive/DataTable';
import { useModuleFilters } from '@/hooks/gestao-locacao/useModuleFilters';
import { useDetailsDrawer } from '@/hooks/gestao-locacao/useDetailsDrawer';
import {
  copyRowsToClipboard,
  exportGestaoLocacaoData,
} from '@/utils/gestaoLocacaoExport';
import {
  listLinkedContracts,
  listRules,
  listScheduledEvents,
  summaryAgendaCobranca,
  type AgendaCobrancaFilters,
} from '@/services/gestao-locacao/agendaCobrancaService';

const STORAGE_KEY = 'hunter.billing-rule.timeline';

type Channel = 'Email' | 'WhatsApp' | 'SMS' | 'Ligação' | 'Tarefa interna';
type Action =
  | 'Enviar mensagem'
  | 'Criar tarefa'
  | 'Notificar responsável'
  | 'Gerar boleto'
  | 'Enviar segunda via'
  | 'Registrar tentativa';
type Responsible = 'Sistema' | 'Corretor responsável' | 'Financeiro' | 'Gestor';

type BillingRuleStep = BillingRuleStage & {
  template?: string;
  requiredVariables: string[];
  ruleCondition: string;
  preferredWindow: string;
  escalation: string;
  logs: string;
};

const timelineSteps: BillingRuleStep[] = [
  {
    id: 'step-7',
    label: '7 dias antes',
    offsetDays: -7,
    type: 'before',
    active: true,
    channel: 'Email',
    action: 'Enviar mensagem',
    responsible: 'Sistema',
    template: 'Lembrete gentil',
    requiredVariables: ['Nome do locatário', 'Vencimento', 'Link do boleto'],
    ruleCondition: 'Somente se status estiver em aberto',
    preferredWindow: 'Dias úteis às 09:00',
    escalation: 'Repetir em 6 horas se não houver leitura',
    logs: 'Registrar enviado, entregue e lido',
  },
  {
    id: 'step-3',
    label: '3 dias antes',
    offsetDays: -3,
    type: 'before',
    active: true,
    channel: 'WhatsApp',
    action: 'Enviar mensagem',
    responsible: 'Sistema',
    template: 'Pré-vencimento',
    requiredVariables: ['Nome do locatário', 'Imóvel', 'Valor', 'Vencimento'],
    ruleCondition: 'Somente se status estiver em aberto',
    preferredWindow: 'Dias úteis às 10:00',
    escalation: 'Criar tarefa no dia seguinte se não houver leitura',
    logs: 'Registrar enviado, entregue e lido',
  },
  {
    id: 'step-0',
    label: 'No dia do vencimento',
    offsetDays: 0,
    type: 'due',
    active: true,
    channel: 'SMS',
    action: 'Enviar mensagem',
    responsible: 'Financeiro',
    template: 'Aviso de vencimento',
    requiredVariables: ['Nome do locatário', 'Valor', 'Código de barras', 'Pix'],
    ruleCondition: 'Somente se status estiver em aberto',
    preferredWindow: 'Qualquer horário',
    escalation: 'Registrar tentativa',
    logs: 'Registrar enviado e falhou',
  },
  {
    id: 'step-1',
    label: '1 dia após',
    offsetDays: 1,
    type: 'after',
    active: true,
    channel: 'Ligação',
    action: 'Notificar responsável',
    responsible: 'Corretor responsável',
    template: 'Script de cobrança',
    requiredVariables: ['Nome do locatário', 'Contrato', 'Valor'],
    ruleCondition: 'Somente se status estiver em atraso',
    preferredWindow: 'Dias úteis às 14:00',
    escalation: 'Criar tarefa no dia seguinte',
    logs: 'Registrar tentativa e status',
  },
  {
    id: 'step-5',
    label: '5 dias após',
    offsetDays: 5,
    type: 'after',
    active: false,
    channel: 'Tarefa interna',
    action: 'Criar tarefa',
    responsible: 'Gestor',
    template: 'Cobrança avançada',
    requiredVariables: ['Nome do locatário', 'Imóvel', 'Contrato', 'Valor'],
    ruleCondition: 'Somente se status estiver em atraso',
    preferredWindow: 'Dias úteis às 16:00',
    escalation: 'Criar tarefa para jurídico em 24 horas',
    logs: 'Registrar tentativa e falhou',
  },
];

const iconMap = {
  Email: Mail,
  WhatsApp: MessageSquare,
  SMS: MessageSquare,
  Ligação: PhoneCall,
  'Tarefa interna': CalendarClock,
};

const channelOptions: Channel[] = ['Email', 'WhatsApp', 'SMS', 'Ligação', 'Tarefa interna'];
const actionOptions: Action[] = [
  'Enviar mensagem',
  'Criar tarefa',
  'Notificar responsável',
  'Gerar boleto',
  'Enviar segunda via',
  'Registrar tentativa',
];
const responsibleOptions: Responsible[] = [
  'Sistema',
  'Corretor responsável',
  'Financeiro',
  'Gestor',
];

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatDateTime = (date: Date) =>
  `${formatDate(date)} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

const defaultFilters: AgendaCobrancaFilters = {
  periodo: '',
  regra: '',
  status: '',
  responsavel: '',
};

type DrawerRow = Record<string, string> & { id: string };

export const ReguaCobrancaPage = () => {
  const navigate = useNavigate();
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'periodo', label: 'Período' },
    { key: 'regra', label: 'Regra' },
    { key: 'status', label: 'Status' },
    { key: 'responsavel', label: 'Responsável' },
  ]);
  const detailsDrawer = useDetailsDrawer<DrawerRow>();
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DrawerRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);
  const [drawerSourceRows, setDrawerSourceRows] = useState<DrawerRow[]>([]);
  const [drawerExtraFilters, setDrawerExtraFilters] = useState<Record<string, string>>({});
  const { summary } = useMemo(() => summaryAgendaCobranca(filters), [filters]);
  const { items: rules } = useMemo(() => listRules(filters), [filters]);
  const { items: linkedContracts } = useMemo(() => listLinkedContracts(filters), [filters]);
  const { items: scheduledEvents } = useMemo(() => listScheduledEvents(filters), [filters]);
  const [rule, setRule] = useState<BillingRule>({
    id: 'regra-001',
    nome: 'Agenda padrão da carteira',
    ativo: true,
    escopo: 'carteira',
  });
  const [steps, setSteps] = useState<BillingRuleStep[]>(timelineSteps);
  const [selectedStepId, setSelectedStepId] = useState(timelineSteps[0]?.id ?? '');
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10);
  });
  const [paid, setPaid] = useState(false);
  const [agendaTimeline, setAgendaTimeline] = useState(() =>
    getBillingTimeline({ contractId: '8421', invoiceId: '2024-884' })
  );
  const billingContext = useMemo<BillingContext>(
    () => ({
      contractId: '8421',
      invoiceId: '2024-884',
      contractLabel: 'Contrato #8421',
      invoiceLabel: 'Boleto #2024-884',
    }),
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as {
        rule: BillingRule;
        steps: BillingRuleStep[];
        selectedStepId?: string;
      };
      setRule(parsed.rule ?? rule);
      setSteps(parsed.steps ?? timelineSteps);
      if (parsed.selectedStepId) {
        setSelectedStepId(parsed.selectedStepId);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rule,
        steps,
        selectedStepId,
      })
    );
  }, [rule, steps, selectedStepId]);

  const selectedStep = steps.find(step => step.id === selectedStepId) ?? steps[0];

  useEffect(() => {
    const timeline = syncBillingTimeline({
      rule,
      stages: steps,
      dueDate: new Date(`${dueDate}T09:00:00`),
      paid,
      context: billingContext,
    });
    setAgendaTimeline(timeline);
  }, [rule, steps, dueDate, paid, billingContext]);

  useEffect(() => {
    const handler = () => {
      setAgendaTimeline(getBillingTimeline(billingContext));
    };
    window.addEventListener('billing:timeline-updated', handler);
    return () => window.removeEventListener('billing:timeline-updated', handler);
  }, [billingContext]);

  const metrics = useMemo(
    () => [
      { id: 'regras', label: 'Regras ativas', value: summary.regrasAtivas, sublabel: 'Agenda padrão aplicada' },
      { id: 'contratos', label: 'Contratos de locação vinculados', value: summary.contratosVinculados, sublabel: 'Carteira de locação' },
      { id: 'agendamentos', label: 'Agendamentos previstos', value: summary.agendamentosPrevistos, sublabel: 'Próximos 30 dias' },
    ],
    [summary]
  );

  const agendaEvents = useMemo(() => {
    return agendaTimeline
      .map(item => ({
        id: item.id,
        stepLabel: item.label,
        scheduledAt: new Date(item.scheduledAt),
        status: item.status,
        channel: item.channel ?? '---',
        action: item.action ?? '---',
        logs: item.logs
      }))
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  }, [agendaTimeline]);

  const handleStepChange = (id: string, updates: Partial<BillingRuleStep>) => {
    setSteps(prev => prev.map(step => (step.id === id ? { ...step, ...updates } : step)));
  };

  const isStepComplete = (step: BillingRuleStep) =>
    Boolean(step.channel && step.action && step.responsible && step.template);

  const drawerRows = useMemo(
    () =>
      drawerSourceRows.filter((row) =>
        Object.entries(drawerExtraFilters).every(([key, value]) => !value || row[key] === value)
      ),
    [drawerExtraFilters, drawerSourceRows]
  );

  const openKpiDetails = (id: string) => {
    if (id === 'regras') {
      const rows = rules.map((item) => ({
        id: item.id,
        nome: item.nome,
        status: item.status,
        etapas: `${item.etapas} etapas`,
        canais: item.canais,
        atualizacao: item.atualizacao,
      }));
      setDrawerColumns([
        { key: 'nome', label: 'Nome regra' },
        { key: 'status', label: 'Status' },
        { key: 'etapas', label: 'Etapas' },
        { key: 'canais', label: 'Canais' },
        { key: 'atualizacao', label: 'Última atualização' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({});
      setDrawerFilterContent(null);
      detailsDrawer.openDrawer({
        title: 'Regras ativas',
        description: 'Regras de agenda ativas no módulo.',
        filters: activeFilters,
        rows,
      });
      return;
    }

    if (id === 'contratos') {
      const rows = linkedContracts.map((item) => ({
        id: item.id,
        contrato: item.contrato,
        imovel: item.imovel,
        locador: item.locador,
        locatario: item.locatario,
        regra: item.regra,
        status: item.status,
      }));
      setDrawerColumns([
        { key: 'contrato', label: 'Contrato' },
        { key: 'imovel', label: 'Imóvel' },
        { key: 'locador', label: 'Locador' },
        { key: 'locatario', label: 'Locatário' },
        { key: 'regra', label: 'Regra aplicada' },
        { key: 'status', label: 'Status' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({});
      setDrawerFilterContent(null);
      detailsDrawer.openDrawer({
        title: 'Contratos vinculados',
        description: 'Contratos com agenda de cobrança aplicada.',
        filters: activeFilters,
        rows,
      });
      return;
    }

    const rows = scheduledEvents.map((item) => ({
      id: item.id,
      data: item.data,
      tipo: item.tipo,
      canal: item.canal,
      acao: item.acao,
      contrato: item.contrato,
      boleto: item.boleto,
      status: item.status,
    }));
    setDrawerColumns([
      { key: 'data', label: 'Data e hora' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'canal', label: 'Canal' },
      { key: 'acao', label: 'Ação' },
      { key: 'contrato', label: 'Contrato' },
      { key: 'boleto', label: 'Boleto' },
      { key: 'status', label: 'Status' },
    ]);
    setDrawerSourceRows(rows);
    setDrawerExtraFilters({});
    setDrawerFilterContent(null);
    detailsDrawer.openDrawer({
      title: 'Agendamentos previstos',
      description: 'Eventos agendados para os próximos dias.',
      filters: activeFilters,
      rows,
    });
  };

  const openEventDetails = (event: (typeof agendaEvents)[number]) => {
    const rows = [
      {
        id: event.id,
        etapa: event.stepLabel,
        data: formatDateTime(event.scheduledAt),
        canal: event.channel,
        acao: event.action,
        status: event.status,
      },
    ];
    setDrawerColumns([
      { key: 'etapa', label: 'Etapa' },
      { key: 'data', label: 'Data' },
      { key: 'canal', label: 'Canal' },
      { key: 'acao', label: 'Ação' },
      { key: 'status', label: 'Status' },
    ]);
    setDrawerSourceRows(rows);
    setDrawerExtraFilters({});
    setDrawerFilterContent(
      <Button
        variant="outline"
        className="rounded-xl border-[var(--ui-stroke)]"
        onClick={() =>
          navigateAgendaToDate(navigate, {
            date: event.scheduledAt,
            sourceType: 'BillingRule',
            contractId: billingContext.contractId,
            invoiceId: billingContext.invoiceId,
            eventId: event.id,
            startAt: event.scheduledAt.toISOString(),
            tab: 'agenda',
          })
        }
      >
        Abrir na Agenda
      </Button>
    );
    detailsDrawer.openDrawer({
      title: 'Detalhes do agendamento',
      description: 'Resumo completo do evento da agenda de cobrança.',
      filters: activeFilters,
      rows,
    });
  };

  return (
    <AlugueisLayout
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
      filtersTitle="Filtros da agenda de cobrança"
      filtersDescription="Ajuste visão por período e responsável."
    >
      <div className="space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Agenda de cobrança</h1>
            <p className="text-sm text-muted-foreground">
              Configure etapas, mensagens e agendamentos automáticos vinculados à Agenda.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova agenda
          </Button>
        </header>

        <FilterBar
          title="Filtros da agenda"
          actions={(
            <Button
              variant="ghost"
              className="rounded-xl text-[hsl(var(--link))] hover:bg-[var(--ui-stroke)]/50"
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          )}
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--ui-text-subtle)]">Período</span>
            <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
              <SelectTrigger className="h-10 w-36 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="semana">Próxima semana</SelectItem>
                <SelectItem value="mes">Próximos 30 dias</SelectItem>
                <SelectItem value="trimestre">Próximo trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--ui-text-subtle)]">Regra</span>
            <Select value={filters.regra} onValueChange={(value) => updateFilter('regra', value)}>
              <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {rules.map((ruleItem) => (
                  <SelectItem key={ruleItem.id} value={ruleItem.nome}>{ruleItem.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--ui-text-subtle)]">Status</span>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="h-10 w-36 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Pausada">Pausada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--ui-text-subtle)]">Responsável</span>
            <Select value={filters.responsavel} onValueChange={(value) => updateFilter('responsavel', value)}>
              <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Sistema">Sistema</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Gestor">Gestor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterBar>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {metrics.map(metric => (
            <KpiCardClickable
              key={metric.label}
              title={metric.label}
              value={metric.value}
              description={metric.sublabel}
              icon={CheckCircle2}
              tone="text-[hsl(var(--accent))]"
              iconBg="bg-[hsl(var(--accent)/0.12)]"
              onClick={() => openKpiDetails(metric.id)}
            />
          ))}
        </div>

        <Card className="border border-border">
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Linha do Tempo de Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Agenda: {rule.nome}</Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Aplicada automaticamente na carteira</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Boleto de referência</span>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={event => setDueDate(event.target.value)}
                    className="h-8 w-40"
                  />
                  <div className="flex items-center gap-2">
                    <span>Boleto pago</span>
                    <Switch checked={paid} onCheckedChange={setPaid} />
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-0 right-0 top-7 h-px bg-border" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                  {steps.map(step => {
                    const Icon = iconMap[step.channel ?? 'Email'];
                    const selected = step.id === selectedStepId;
                    const complete = isStepComplete(step);
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setSelectedStepId(step.id)}
                        className={`group flex flex-col items-center gap-3 rounded-xl border px-3 py-4 text-center transition ${
                          selected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-card hover:border-primary/60'
                        } ${!complete ? 'ring-1 ring-destructive/30' : ''}`}
                      >
                        <div className="relative">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                              selected
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-muted/40'
                            }`}
                          >
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          {!step.active && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{step.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.channel ?? 'Sem canal'} · {step.action ?? 'Sem ação'}
                          </p>
                          {!complete && (
                            <p className="text-[11px] text-destructive">Configuração pendente</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base">Configuração do marco</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ajuste canal, ação e regras para a etapa selecionada.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedStep.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Disparo em {selectedStep.offsetDays === 0 ? 'D+0' : `D${selectedStep.offsetDays > 0 ? '+' : ''}${selectedStep.offsetDays}`} com base no vencimento.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Ativo</span>
                  <Switch
                    checked={selectedStep.active}
                    onCheckedChange={checked =>
                      handleStepChange(selectedStep.id, { active: checked })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Canal</label>
                  <Select
                    value={selectedStep.channel}
                    onValueChange={value =>
                      handleStepChange(selectedStep.id, { channel: value as Channel })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {channelOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Ação</label>
                  <Select
                    value={selectedStep.action}
                    onValueChange={value =>
                      handleStepChange(selectedStep.id, { action: value as Action })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ação" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Responsável</label>
                  <Select
                    value={selectedStep.responsible}
                    onValueChange={value =>
                      handleStepChange(selectedStep.id, { responsible: value as Responsible })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsibleOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Modelo de mensagem</label>
                  <Input
                    value={selectedStep.template ?? ''}
                    onChange={event =>
                      handleStepChange(selectedStep.id, { template: event.target.value })
                    }
                    placeholder="Selecione o template"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Variáveis obrigatórias</label>
                  <Textarea
                    value={selectedStep.requiredVariables.join(', ')}
                    onChange={event =>
                      handleStepChange(selectedStep.id, {
                        requiredVariables: event.target.value
                          .split(',')
                          .map(item => item.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Nome do locatário, imóvel, contrato, valor..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Regras</label>
                  <Textarea
                    value={selectedStep.ruleCondition}
                    onChange={event =>
                      handleStepChange(selectedStep.id, { ruleCondition: event.target.value })
                    }
                    placeholder="Executar somente se status estiver em aberto"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Janela de disparo</label>
                  <Textarea
                    value={selectedStep.preferredWindow}
                    onChange={event =>
                      handleStepChange(selectedStep.id, { preferredWindow: event.target.value })
                    }
                    placeholder="Dias úteis às 09:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Escalonamento</label>
                  <Textarea
                    value={selectedStep.escalation}
                    onChange={event =>
                      handleStepChange(selectedStep.id, { escalation: event.target.value })
                    }
                    placeholder="Se não houver leitura, repetir em X horas"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Logs</label>
                  <Textarea
                    value={selectedStep.logs}
                    onChange={event =>
                      handleStepChange(selectedStep.id, { logs: event.target.value })
                    }
                    placeholder="Registrar tentativas e status"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Resumo do marco:</span>
                <Badge variant="outline">{selectedStep.channel ?? 'Canal pendente'}</Badge>
                <Badge variant="outline">{selectedStep.action ?? 'Ação pendente'}</Badge>
                <Badge variant="outline">{selectedStep.responsible ?? 'Responsável pendente'}</Badge>
                <Badge variant={selectedStep.active ? 'default' : 'secondary'}>
                  {selectedStep.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
          <CardHeader>
              <CardTitle className="text-base">Agenda de cobrança</CardTitle>
              <p className="text-sm text-muted-foreground">
                Eventos gerados automaticamente pela agenda aplicada.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Vinculação com Agenda:</strong> eventos são criados
                  com o tipo “Cobrança automática” e referência ao boleto e contrato.
                </p>
                <p className="mt-2">
                  Clique em um evento na Agenda para abrir o detalhe do boleto e o histórico da agenda.
                </p>
              </div>

              <div className="space-y-3">
                {agendaEvents.map(event => (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEventDetails(event)}
                    onKeyDown={(eventKey) => {
                      if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                        eventKey.preventDefault();
                        openEventDetails(event);
                      }
                    }}
                    className="rounded-lg border border-border bg-card p-3 text-xs transition hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{event.stepLabel}</p>
                      <Badge variant={event.status === 'cancelado' ? 'secondary' : 'outline'}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {formatDateTime(event.scheduledAt)} · {event.channel} · {event.action}
                    </p>
                    <p className="text-muted-foreground">
                      Tipo: Cobrança automática · Contrato #8421 · Boleto #2024-884
                    </p>
                    {event.logs?.length ? (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Último log: {event.logs[event.logs.length - 1]}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base">Fluxo ponta a ponta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Visão rápida de como a agenda é aplicada e executada do contrato ao pagamento.
            </p>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <li className="rounded-lg border border-border bg-muted/30 p-3">
                1. Agenda criada e definida como padrão da carteira ou aplicada por contrato.
              </li>
              <li className="rounded-lg border border-border bg-muted/30 p-3">
                2. Contratos de locação podem sobrescrever a regra padrão para exceções específicas.
              </li>
              <li className="rounded-lg border border-border bg-muted/30 p-3">
                3. Ao gerar um boleto, as datas dos marcos são calculadas com base no vencimento.
              </li>
              <li className="rounded-lg border border-border bg-muted/30 p-3">
                4. Eventos são agendados na Agenda e ficam disponíveis para filtros de cobrança.
              </li>
              <li className="rounded-lg border border-border bg-muted/30 p-3">
                5. Se o vencimento mudar, os eventos são recalculados e reagendados.
              </li>
              <li className="rounded-lg border border-border bg-muted/30 p-3">
                6. Após o pagamento, eventos futuros são cancelados e o histórico é registrado.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {detailsDrawer.context && (
        <DetailsDrawer
          open={detailsDrawer.open}
          onOpenChange={detailsDrawer.setOpen}
          title={detailsDrawer.context.title}
          description={detailsDrawer.context.description}
          filters={detailsDrawer.context.filters}
          onClearFilters={() => setDrawerExtraFilters({})}
          onExportCsv={() =>
            exportGestaoLocacaoData({
              format: 'csv',
              section: 'agenda_cobranca',
              data: drawerRows,
              columns: drawerColumns.map((column) => ({
                key: String(column.key),
                label: column.label,
              })),
            })
          }
          onExportPdf={() =>
            exportGestaoLocacaoData({
              format: 'pdf',
              section: 'agenda_cobranca',
              data: drawerRows,
              columns: drawerColumns.map((column) => ({
                key: String(column.key),
                label: column.label,
              })),
            })
          }
          onCopyList={() =>
            copyRowsToClipboard(
              drawerRows,
              drawerColumns.map((column) => ({
                key: String(column.key),
                label: column.label,
              }))
            )
          }
          filterContent={drawerFilterContent}
        >
          <DataTable
            columns={drawerColumns}
            rows={drawerRows}
            searchPlaceholder="Buscar registros"
            emptyMessage="Nenhum registro encontrado."
          />
        </DetailsDrawer>
      )}
    </AlugueisLayout>
  );
};

export default ReguaCobrancaPage;
