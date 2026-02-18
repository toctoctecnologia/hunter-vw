import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardContext, DashboardWidgetDefinition } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getAlugueisWidgetMetrics } from '@/services/alugueisDashboardService';
import type { AlugueisWidgetMetric } from '@/types/dashboard';
import FunnelWidget from '@/components/funnel/FunnelWidget';
import { ArrowUpRight, BarChart3, Calendar, ClipboardList, FileText, ListChecks, Megaphone, Star, Users, Wallet, Wrench } from 'lucide-react';
import NovidadesSection from '@/components/home/NovidadesSection';
import { TaskCard } from '@/components/agenda/Task';
import type { Task } from '@/types/task';
import { QualificationManagementWidget } from '@/components/dashboard-modular/QualificationManagementWidget';

export interface DashboardWidgetDefinitionWithComponent extends DashboardWidgetDefinition {
  Component: React.ComponentType<{ context: DashboardContext; widgetId: string }>;
}

interface PlaceholderWidgetProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  ctaLabel?: string;
}

const PlaceholderWidget = ({ title, description, icon: Icon, onClick, ctaLabel = 'Ver detalhes' }: PlaceholderWidgetProps) => (
  <Card className="h-full border-border bg-[var(--ui-card)] shadow-sm transition hover:border-orange-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-base text-foreground flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-[hsl(var(--icon))]" />}
        {title}
      </CardTitle>
      <Badge variant="secondary" className="rounded-full text-xs">Atual</Badge>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        {description ?? 'Conteúdo em tempo real será exibido aqui quando conectado ao backend.'}
      </p>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--accent))] hover:underline"
        >
          {ctaLabel}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      ) : null}
    </CardContent>
  </Card>
);

interface DrilldownField {
  label: string;
  value: string;
}

interface DrilldownItem {
  id: string;
  title: string;
  subtitle?: string;
  fields: DrilldownField[];
}

interface DrilldownConfig {
  title: string;
  description: string;
  items: DrilldownItem[];
  ctaLabel?: string;
  ctaAction?: () => void;
}

const ALUGUEIS_DRILLDOWNS: Record<string, Omit<DrilldownConfig, 'ctaAction'>> = {
  'imoveis-gestao': {
    title: 'Imóveis em gestão',
    description: 'Todos os imóveis em gestão com proprietário e captador responsável.',
    items: [
      { id: 'img-001', title: 'Apartamento Bela Vista', subtitle: 'Ativo • LOC-1203', fields: [{ label: 'Proprietário', value: 'Carla Nogueira' }, { label: 'Captador', value: 'Brayan Germano' }, { label: 'Situação', value: 'Publicado em 4 portais' }] },
      { id: 'img-002', title: 'Casa Jardim Europa', subtitle: 'Ativo • LOC-1188', fields: [{ label: 'Proprietário', value: 'Ricardo Ferreira' }, { label: 'Captador', value: 'Ana Zauer' }, { label: 'Situação', value: 'Aguardando fotos' }] },
      { id: 'img-003', title: 'Sala Comercial Centro', subtitle: 'Ativo • LOC-1161', fields: [{ label: 'Proprietário', value: 'Jorge Teles' }, { label: 'Captador', value: 'Aline de Fátima' }, { label: 'Situação', value: 'Em visitação' }] },
    ],
  },
  'portais-atencao': {
    title: 'Portais que requerem atenção',
    description: 'Anúncios com alerta por portal (LX, Zap e Chaves na Mão).',
    items: [
      { id: 'por-001', title: 'LX Imóveis', subtitle: '12 anúncios com qualidade baixa', fields: [{ label: 'Pendência', value: 'Fotos com baixa resolução' }, { label: 'Última atualização', value: 'há 6 dias' }] },
      { id: 'por-002', title: 'Zap Imóveis', subtitle: '7 anúncios reprovados', fields: [{ label: 'Pendência', value: 'Descrição incompleta' }, { label: 'Última atualização', value: 'há 2 dias' }] },
      { id: 'por-003', title: 'Chaves na Mão', subtitle: '9 anúncios sem lead há 15 dias', fields: [{ label: 'Pendência', value: 'Ajustar faixa de preço' }, { label: 'Última atualização', value: 'há 1 dia' }] },
    ],
  },
  'propostas-abertas': {
    title: 'Propostas em aberto',
    description: 'Propostas abertas com código, cliente e etapa atual.',
    items: [
      { id: 'pro-0098', title: 'Proposta #PRO-0098', subtitle: 'Apartamento Bela Vista', fields: [{ label: 'Cliente', value: 'Cleide Claudio' }, { label: 'Valor', value: 'R$ 3.200/mês' }, { label: 'Status', value: 'Aguardando assinatura' }] },
      { id: 'pro-0104', title: 'Proposta #PRO-0104', subtitle: 'Casa Jardim Europa', fields: [{ label: 'Cliente', value: 'Vanessa Pires' }, { label: 'Valor', value: 'R$ 4.800/mês' }, { label: 'Status', value: 'Em análise de crédito' }] },
      { id: 'pro-0109', title: 'Proposta #PRO-0109', subtitle: 'Sala Comercial Centro', fields: [{ label: 'Cliente', value: 'Studio Hub LTDA' }, { label: 'Valor', value: 'R$ 6.000/mês' }, { label: 'Status', value: 'Contraproposta enviada' }] },
    ],
  },
  'contratos-locacao': {
    title: 'Contratos de aluguel',
    description: 'Contratos com principais dados de vencimento e garantia.',
    items: [
      { id: 'con-221', title: 'Contrato LOC-221', subtitle: 'Apto Bela Vista • vigência até 12/2026', fields: [{ label: 'Inquilino', value: 'Erileny Gomes' }, { label: 'Garantia', value: 'Seguro fiança' }, { label: 'Reajuste', value: 'IGP-M em 03/2026' }] },
      { id: 'con-224', title: 'Contrato LOC-224', subtitle: 'Casa Jardim Europa • vigência até 08/2027', fields: [{ label: 'Inquilino', value: 'Leonardo Pimentel' }, { label: 'Garantia', value: 'Caução (3 alugueis)' }, { label: 'Reajuste', value: 'IPCA em 08/2026' }] },
      { id: 'con-230', title: 'Contrato LOC-230', subtitle: 'Sala Comercial Centro • vigência até 05/2028', fields: [{ label: 'Inquilino', value: 'Market Works LTDA' }, { label: 'Garantia', value: 'Fiador' }, { label: 'Reajuste', value: 'IPCA em 05/2026' }] },
    ],
  },
  inadimplencia: {
    title: 'Inadimplência e cobrança',
    description: 'Unidades inadimplentes com régua de cobrança e responsável.',
    items: [
      { id: 'ina-001', title: 'LOC-203 • Apartamento Centro', subtitle: '15 dias em atraso', fields: [{ label: 'Locatário', value: 'Paulo Vieira' }, { label: 'Valor em aberto', value: 'R$ 3.890,00' }, { label: 'Etapa de cobrança', value: '2ª notificação' }] },
      { id: 'ina-002', title: 'LOC-198 • Casa Nova', subtitle: '34 dias em atraso', fields: [{ label: 'Locatário', value: 'Fernanda Luz' }, { label: 'Valor em aberto', value: 'R$ 8.220,00' }, { label: 'Etapa de cobrança', value: 'Jurídico' }] },
    ],
  },
  'ocupacao-vacancia': {
    title: 'Ocupação e vacância',
    description: 'Visão da carteira ocupada, vaga e previsão de nova ocupação.',
    items: [
      { id: 'ocu-001', title: 'Ocupados', subtitle: '367 imóveis (89%)', fields: [{ label: 'Ticket médio', value: 'R$ 2.950' }, { label: 'Giro mensal', value: '2,1%' }] },
      { id: 'ocu-002', title: 'Vagos', subtitle: '45 imóveis (11%)', fields: [{ label: 'Vacância média', value: '38 dias' }, { label: 'Maior concentração', value: 'Zona Sul' }] },
      { id: 'ocu-003', title: 'Pré-locação', subtitle: '14 imóveis com proposta', fields: [{ label: 'Fechamento previsto', value: 'próx. 15 dias' }, { label: 'Potencial', value: 'R$ 42 mil/mês' }] },
    ],
  },
  'chamados-manutencao': {
    title: 'Chamados de reparo',
    description: 'Todos os chamados de reparo abertos, em andamento e resolvidos.',
    items: [
      { id: 'rep-001', title: 'RPR-001 • Vazamento na cozinha', subtitle: 'Apartamento Bela Vista', fields: [{ label: 'Status', value: 'Em andamento' }, { label: 'Responsável', value: 'Equipe Hidráulica' }, { label: 'Previsão', value: '16/12/2025' }] },
      { id: 'rep-002', title: 'RPR-002 • Pintura sala', subtitle: 'Casa Jardim Europa', fields: [{ label: 'Status', value: 'Aguardando orçamento' }, { label: 'Responsável', value: 'Suprimentos' }, { label: 'Previsão', value: '18/12/2025' }] },
      { id: 'rep-003', title: 'RPR-003 • Troca de fechadura', subtitle: 'Sala Comercial Centro', fields: [{ label: 'Status', value: 'Resolvido' }, { label: 'Responsável', value: 'Equipe manutenção' }, { label: 'Previsão', value: 'Concluído em 09/12/2025' }] },
    ],
  },
  'repasses-proprietario': {
    title: 'Repasse ao proprietário',
    description: 'Repasse de locação e vendas com conciliação e previsão de pagamento.',
    items: [
      { id: 'repasse-01', title: 'RPP-1201 • Carla Nogueira', subtitle: 'Locação • previsão 20/12/2025', fields: [{ label: 'Valor líquido', value: 'R$ 2.740,00' }, { label: 'Taxas', value: 'R$ 460,00' }, { label: 'Status', value: 'Pronto para pagamento' }] },
      { id: 'repasse-02', title: 'RPP-1202 • Ricardo Ferreira', subtitle: 'Venda • previsão 22/12/2025', fields: [{ label: 'Valor líquido', value: 'R$ 38.400,00' }, { label: 'Comissão', value: 'R$ 11.600,00' }, { label: 'Status', value: 'Em conciliação' }] },
    ],
  },
};

const DrilldownDialog = ({ open, onOpenChange, config }: { open: boolean; onOpenChange: (open: boolean) => void; config: DrilldownConfig }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[85vh] max-w-4xl">
      <DialogHeader>
        <DialogTitle>{config.title}</DialogTitle>
        <DialogDescription>{config.description}</DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[56vh] pr-3">
        <div className="space-y-3">
          {config.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              {item.subtitle ? <p className="text-xs text-muted-foreground">{item.subtitle}</p> : null}
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {item.fields.map((field) => (
                  <div key={`${item.id}-${field.label}`} className="rounded-lg bg-muted/40 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium text-foreground">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {config.ctaAction ? (
        <div className="flex justify-end">
          <Button onClick={config.ctaAction}>
            {config.ctaLabel ?? 'Abrir módulo'}
          </Button>
        </div>
      ) : null}
    </DialogContent>
  </Dialog>
);

const KpiWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">KPIs rápidos</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-4">
      {[
        { label: 'Leads do dia', value: '24' },
        { label: 'Visitas', value: '8' },
        { label: 'Propostas', value: '5' },
        { label: 'Negócios', value: '2' },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-border p-3 bg-background">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-xl font-semibold text-foreground">{item.value}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const MediaPerformanceWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">Desempenho por mídia de origem</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {[
        { label: 'Instagram Ads', value: '38%' },
        { label: 'Google Ads', value: '26%' },
        { label: 'Indicação', value: '18%' },
        { label: 'Orgânico', value: '12%' },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{item.label}</span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AlugueisMetricsWidget = ({ widgetId, context }: { widgetId: string; context: DashboardContext }) => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AlugueisWidgetMetric[]>([]);
  const [openDrilldown, setOpenDrilldown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (context !== 'alugueis') return;
    getAlugueisWidgetMetrics(widgetId).then((response) => {
      if (isMounted) setMetrics(response.metrics);
    });
    return () => {
      isMounted = false;
    };
  }, [context, widgetId]);

  const titleMap: Record<string, string> = useMemo(() => ({
    'imoveis-gestao': 'Imóveis em gestão',
    chaves: 'Chaves',
    'exclusividades-disponiveis': 'Exclusividades disponíveis',
    'portais-atencao': 'Portais que requerem atenção',
    'propostas-abertas': 'Propostas em aberto',
    'contratos-locacao': 'Contratos de aluguel',
    inadimplencia: 'Inadimplência e cobranças',
    'ocupacao-vacancia': 'Ocupação e vacância',
    'chamados-manutencao': 'Chamados de reparos',
    'repasses-proprietario': 'Repasses ao proprietário',
  }), []);

  const metricClickMap: Record<string, (metric: AlugueisWidgetMetric) => void> = {
    'imoveis-gestao': () => setOpenDrilldown(true),
    chaves: () => navigate('/imoveis', { state: { origem: 'dashboard-chaves', foco: 'gestao-chaves' } }),
    'contratos-locacao': () => setOpenDrilldown(true),
  };

  const drilldownConfig = ALUGUEIS_DRILLDOWNS[widgetId];

  const dialogConfig: DrilldownConfig | null = drilldownConfig
    ? {
      ...drilldownConfig,
      ctaLabel: widgetId === 'imoveis-gestao' ? 'Ir para imóveis' : 'Ir para contratos de locação',
      ctaAction: () => {
        if (widgetId === 'imoveis-gestao') {
          navigate('/imoveis', { state: { origem: 'dashboard-imoveis' } });
          return;
        }
        navigate('/gestao-locacao/contratos', { state: { origem: 'dashboard-contratos' } });
      },
    }
    : null;

  return (
    <>
      <Card className="h-full border-border bg-[var(--ui-card)] shadow-sm transition hover:border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-foreground">{titleMap[widgetId] ?? 'Widget'}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {(metrics.length ? metrics : [{ id: 'empty', label: 'Sem dados', value: '--' }]).map((metric) => {
          const handleClick = metricClickMap[widgetId];

          return (
            <button
              key={metric.id}
              type="button"
              onClick={() => handleClick?.(metric)}
              disabled={!handleClick}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-left transition enabled:hover:border-[hsl(var(--accent))] enabled:hover:bg-orange-50/40 disabled:cursor-default"
            >
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className="flex items-center gap-1 text-base font-semibold text-foreground">
                {metric.value}
                {handleClick ? <ArrowUpRight className="h-3 w-3 text-muted-foreground" /> : null}
              </span>
            </button>
          );
        })}
      </CardContent>
      </Card>

      {dialogConfig ? (
        <DrilldownDialog open={openDrilldown} onOpenChange={setOpenDrilldown} config={dialogConfig} />
      ) : null}
    </>
  );
};

const FunnelWidgetWrapper = ({ context }: { context: DashboardContext }) => (
  <FunnelWidget context={context} />
);

const HomePlaceholder = ({ widgetId }: { widgetId: string }) => {
  const map: Record<string, PlaceholderWidgetProps> = {
    lembretes: {
      title: 'Lembretes e notificações',
      description: 'Resumo rápido com lembretes do dia e notificações prioritárias.',
      icon: ClipboardList,
    },
    pendencias: {
      title: 'Pendências e alertas',
      description: 'Acompanhe alertas críticos e lembretes de prioridade.',
      icon: ClipboardList,
    },
    atividades: {
      title: 'Atividades recentes',
      description: 'Resumo das últimas interações e registros da equipe.',
      icon: ListChecks,
    },
    tarefas: {
      title: 'Tarefas',
      description: 'Lista das tarefas em aberto com prazos e responsáveis.',
      icon: FileText,
    },
    agenda: {
      title: 'Agenda',
      description: 'Compromissos, visitas e reuniões do dia.',
      icon: Calendar,
    },
    ranking: {
      title: 'Ranking de corretores',
      description: 'Performance de conversão e volume por corretor.',
      icon: Users,
    },
  };

  const data = map[widgetId] ?? {
    title: 'Widget',
  };

  return <PlaceholderWidget {...data} />;
};

const AlugueisPlaceholder = ({ widgetId }: { widgetId: string }) => {
  const navigate = useNavigate();
  const [openDrilldown, setOpenDrilldown] = useState(false);

  const map: Record<string, PlaceholderWidgetProps> = {
    'exclusividades-disponiveis': {
      title: 'Exclusividades disponíveis',
      description: 'Resumo das exclusividades atuais e oportunidades em aberto.',
      icon: Star,
      onClick: () => navigate('/imoveis', { state: { origem: 'dashboard-exclusividades', filtro: 'exclusivos-disponiveis' } }),
      ctaLabel: 'Ver imóveis',
    },
    'portais-atencao': {
      title: 'Portais que requerem atenção',
      description: 'Alertas sobre anúncios que precisam de ação imediata.',
      icon: Megaphone,
      onClick: () => setOpenDrilldown(true),
    },
    'propostas-abertas': {
      title: 'Propostas em aberto',
      description: 'Propostas ativas e prazos de vencimento.',
      icon: FileText,
      onClick: () => setOpenDrilldown(true),
    },
    inadimplencia: {
      title: 'Inadimplência e cobranças',
      description: 'Situação atual das cobranças e faturas em atraso.',
      icon: Wallet,
      onClick: () => setOpenDrilldown(true),
    },
    'ocupacao-vacancia': {
      title: 'Ocupação e vacância',
      description: 'Taxas de ocupação e imóveis disponíveis.',
      icon: BarChart3,
      onClick: () => setOpenDrilldown(true),
    },
    'chamados-manutencao': {
      title: 'Chamados de reparos',
      description: 'Reparos abertos, em andamento e resolvidos.',
      icon: Wrench,
      onClick: () => setOpenDrilldown(true),
      ctaLabel: 'Ver chamados',
    },
    'repasses-proprietario': {
      title: 'Repasses ao proprietário',
      description: 'Repasses de locação e venda com previsão de pagamento.',
      icon: Wallet,
      onClick: () => setOpenDrilldown(true),
    },
  };

  const data = map[widgetId] ?? { title: 'Widget' };
  const baseDrilldown = ALUGUEIS_DRILLDOWNS[widgetId];

  const ctaActionMap: Record<string, (() => void) | undefined> = {
    'portais-atencao': () => navigate('/imoveis', { state: { origem: 'dashboard-portais' } }),
    'propostas-abertas': () => navigate('/gestao-locacao/contratos', { state: { origem: 'dashboard-propostas' } }),
    inadimplencia: () => navigate('/gestao-locacao/analises', { state: { origem: 'dashboard-locacao', secao: 'inadimplencia' } }),
    'ocupacao-vacancia': () => navigate('/gestao-locacao/analises', { state: { origem: 'dashboard-locacao', secao: 'vacancia' } }),
    'chamados-manutencao': () => navigate('/gestao-locacao/contratos', { state: { origem: 'dashboard-reparos', acao: 'novo-reparo' } }),
    'repasses-proprietario': () => navigate('/gestao-locacao/repasses', { state: { origem: 'dashboard-locacao', secao: 'repasses-proprietario' } }),
  };

  const ctaLabelMap: Record<string, string> = {
    'portais-atencao': 'Abrir gestão de portais',
    'propostas-abertas': 'Abrir propostas',
    inadimplencia: 'Abrir inadimplência',
    'ocupacao-vacancia': 'Abrir análises de ocupação',
    'chamados-manutencao': 'Novo chamado de reparo',
    'repasses-proprietario': 'Abrir repasses',
  };

  return (
    <>
      <PlaceholderWidget {...data} />
      {baseDrilldown ? (
        <DrilldownDialog
          open={openDrilldown}
          onOpenChange={setOpenDrilldown}
          config={{
            ...baseDrilldown,
            ctaAction: ctaActionMap[widgetId],
            ctaLabel: ctaLabelMap[widgetId],
          }}
        />
      ) : null}
    </>
  );
};

const MOCK_ALUGUEIS_CLIENTES = [
  { id: 'cli-1', name: 'Ana Paula', daysWithoutUpdate: 8 },
  { id: 'cli-2', name: 'Carlos Nunes', daysWithoutUpdate: 18 },
  { id: 'cli-3', name: 'Mariana Costa', daysWithoutUpdate: 27 },
  { id: 'cli-4', name: 'João Moura', daysWithoutUpdate: 29 },
  { id: 'cli-5', name: 'Fernanda Luz', daysWithoutUpdate: 34 },
  { id: 'cli-6', name: 'Roberto Matos', daysWithoutUpdate: 45 },
  { id: 'cli-7', name: 'Bianca Prado', daysWithoutUpdate: 16 },
];

const MOCK_ALUGUEIS_IMOVEIS = [
  { id: 'imo-1', name: 'Apartamento Centro', daysWithoutUpdate: 5 },
  { id: 'imo-2', name: 'Casa Jardim Europa', daysWithoutUpdate: 12 },
  { id: 'imo-3', name: 'Loja Av. Paulista', daysWithoutUpdate: 24 },
  { id: 'imo-4', name: 'Studio Bela Vista', daysWithoutUpdate: 28 },
  { id: 'imo-5', name: 'Cobertura Trindade', daysWithoutUpdate: 31 },
  { id: 'imo-6', name: 'Sala Comercial Norte', daysWithoutUpdate: 41 },
  { id: 'imo-7', name: 'Apartamento Mar', daysWithoutUpdate: 22 },
  { id: 'imo-8', name: 'Casa com piscina', daysWithoutUpdate: 14 },
];

const MOCK_VENDAS_CLIENTES = [
  { id: 'vcli-1', name: 'Larissa Prado', daysWithoutUpdate: 6 },
  { id: 'vcli-2', name: 'Eduardo Nunes', daysWithoutUpdate: 11 },
  { id: 'vcli-3', name: 'Fernanda Paes', daysWithoutUpdate: 18 },
  { id: 'vcli-4', name: 'Murilo Andrade', daysWithoutUpdate: 23 },
  { id: 'vcli-5', name: 'Sandra Luz', daysWithoutUpdate: 29 },
  { id: 'vcli-6', name: 'José Augusto', daysWithoutUpdate: 34 },
  { id: 'vcli-7', name: 'Bianca Silveira', daysWithoutUpdate: 42 },
];

const MOCK_VENDAS_IMOVEIS = [
  { id: 'vimo-1', name: 'Cobertura Atlântica', daysWithoutUpdate: 4 },
  { id: 'vimo-2', name: 'Casa Alphaville', daysWithoutUpdate: 13 },
  { id: 'vimo-3', name: 'Apartamento Downtown', daysWithoutUpdate: 19 },
  { id: 'vimo-4', name: 'Terreno Lagoa', daysWithoutUpdate: 27 },
  { id: 'vimo-5', name: 'Sala Comercial Central', daysWithoutUpdate: 31 },
  { id: 'vimo-6', name: 'Apartamento Vista Mar', daysWithoutUpdate: 38 },
  { id: 'vimo-7', name: 'Casa Jardim Europa', daysWithoutUpdate: 45 },
];

const HOME_TASKS: Task[] = [
  {
    id: 'home-task-1',
    title: 'Mandar mensagem para Artur',
    type: 'message',
    dueAt: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    status: 'todo',
    reminders: [],
    notes: 'Follow-up sobre proposta de imóvel',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'home-task-2',
    title: 'Ligação para João Silva',
    type: 'call',
    dueAt: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    status: 'todo',
    reminders: [],
    notes: 'Retornar ligação sobre apartamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'home-task-3',
    title: 'Visita técnica - Maria Santos',
    type: 'visit',
    dueAt: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    status: 'todo',
    reminders: [],
    notes: 'Casa na Rua das Flores, 123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const HomeNovidadesWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">Novidades</CardTitle>
    </CardHeader>
    <CardContent>
      <NovidadesSection defaultNegocio="todos" />
    </CardContent>
  </Card>
);

const HomeTasksWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">Suas Tarefas de Hoje</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {HOME_TASKS.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </CardContent>
  </Card>
);

const AlugueisNovidadesWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">Novidades</CardTitle>
      <p className="text-sm text-muted-foreground">Escolha se deseja visualizar imóveis de locação, venda ou ambos.</p>
    </CardHeader>
    <CardContent>
      <NovidadesSection defaultNegocio="locacao" />
    </CardContent>
  </Card>
);

const AlugueisEvolucaoCaptacoesWidget = () => {
  const navigate = useNavigate();
  const chartData = [
    { mes: 'Jan', captados: 15, locados: 3 },
    { mes: 'Fev', captados: 54, locados: 11 },
    { mes: 'Mar', captados: 38, locados: 9 },
    { mes: 'Abr', captados: 44, locados: 13 },
  ];

  return (
    <Card className="h-full border-border bg-[var(--ui-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-foreground">Evolução das captações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barGap={10}
              onClick={(state) => {
                if (!state?.activeLabel) return;
                navigate('/imoveis', { state: { origem: 'dashboard-captacoes', mes: state.activeLabel } });
              }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#d4d4d8" />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={25} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="captados" fill="#f97316" radius={[8, 8, 0, 0]} />
              <Bar dataKey="locados" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground"><strong className="text-foreground">Captados</strong><br />Total de imóveis captados no mês.</div>
          <div className="rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground"><strong className="text-foreground">Locados</strong><br />Quantidade de imóveis locados no período.</div>
        </div>
      </CardContent>
    </Card>
  );
};

const SalesKpiWidget = () => {
  const navigate = useNavigate();
  const cards = [
    { label: 'Vendas no mês', value: '18', status: 'Ativo' },
    { label: 'Vendas em andamento', value: '24', status: 'Em assinatura' },
    { label: 'Vendas concluídas', value: '12', status: 'Concluído' },
    { label: 'Vendas travadas por pendência', value: '5', status: 'Pendente' },
    { label: 'Valor geral de vendas', value: 'R$ 9,2 mi', status: 'Ativo' },
    { label: 'Comissão prevista', value: 'R$ 420 mil', status: 'Em financiamento' },
    { label: 'Comissão recebida', value: 'R$ 286 mil', status: 'Concluído' },
    { label: 'Prazos vencendo em 7 dias', value: '6', status: 'Em pós-venda' },
  ];

  return (
    <Card className="h-full border-border bg-[var(--ui-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-foreground">Indicadores principais</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {cards.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate('/gestao-vendas/contratos', { state: { status: item.status } })}
            className="rounded-xl border border-border p-3 bg-background text-left hover:border-[hsl(var(--accent))] transition"
          >
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              {item.label}
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
            </p>
            <p className="text-xl font-semibold text-foreground">{item.value}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

const SalesOpportunitiesWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">Oportunidades recentes</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      {[
        { lead: 'Residencial Aurora', stage: 'Proposta enviada', value: 'R$ 640 mil' },
        { lead: 'Jardins do Vale', stage: 'Crédito aprovado', value: 'R$ 720 mil' },
        { lead: 'Vista da Serra', stage: 'Assinatura', value: 'R$ 520 mil' },
      ].map((row) => (
        <div key={row.lead} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
          <div>
            <p className="font-medium text-foreground">{row.lead}</p>
            <p className="text-xs text-muted-foreground">{row.stage}</p>
          </div>
          <span className="font-semibold text-foreground">{row.value}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const SalesAlertsWidget = () => (
  <Card className="h-full border-border bg-[var(--ui-card)]">
    <CardHeader className="pb-2">
      <CardTitle className="text-base text-foreground">Alertas e pendências críticas</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      {[
        'Certidões negativas pendentes - Contrato VEN-1204',
        'Prazo de ITBI vencendo em 5 dias - Contrato VEN-1202',
        'Registro em cartório pendente - Contrato VEN-1201',
      ].map((alert) => (
        <div key={alert} className="flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2">
          <span className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--warning))]" />
          <p className="text-muted-foreground">{alert}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const LEADS_INDICADORES = [
  { label: 'Taxa de conversão', value: '18,4%' },
  { label: 'Tempo médio de conversão', value: '6,2 dias' },
  { label: 'Tempo de primeira interação', value: '14 min' },
  { label: 'Leads recebidos', value: '214' },
  { label: 'Leads arquivados por canal', value: '67' },
  { label: 'Interações', value: '1.482' },
  { label: 'Motivos de descarte', value: '33' },
  { label: 'Imóveis com mais leads', value: '12' },
];

const LeadsInsightsWidget = () => {
  const [open, setOpen] = useState(false);

  const details: DrilldownConfig = {
    title: 'Indicadores de leads e funil de vendas',
    description: 'Visão consolidada entre Home, Locação e Vendas (funil de 6 semanas e performance comercial).',
    items: [
      {
        id: 'funil',
        title: 'Funil de vendas (6 semanas)',
        subtitle: 'Atendimentos 112 • Visitas 76 • Propostas 31 • Negócios 18',
        fields: [
          { label: 'Semanas analisadas', value: '6' },
          { label: 'Conversão total', value: '18,4%' },
          { label: 'Ticket médio', value: 'R$ 4.280' },
        ],
      },
      {
        id: 'atendimento',
        title: 'Tipo de atendimento e termômetro',
        subtitle: 'WhatsApp (45%), Ligação (28%), Portal (27%)',
        fields: [
          { label: 'Hot', value: '26 leads' },
          { label: 'Warm', value: '58 leads' },
          { label: 'Cold', value: '130 leads' },
        ],
      },
      {
        id: 'ranking',
        title: 'Leads por canal e imóveis com mais demanda',
        subtitle: 'Instagram, Zap e Chaves na Mão lideram origem de leads.',
        fields: [
          { label: 'Canal líder', value: 'Instagram Ads (31%)' },
          { label: 'Top imóvel', value: 'Apto Bela Vista (24 leads)' },
          { label: 'Descarte líder', value: 'Sem retorno (38%)' },
        ],
      },
    ],
  };

  return (
    <>
      <Card className="h-full border-border bg-[var(--ui-card)] shadow-sm transition hover:border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-foreground">Indicadores de leads e funil</CardTitle>
          <p className="text-sm text-muted-foreground">
            Widget editável e compartilhado entre Home, dashboard de locação e dashboard de vendas.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {LEADS_INDICADORES.map((indicator) => (
              <button
                key={indicator.label}
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-left hover:border-[hsl(var(--accent))]"
              >
                <span className="text-xs text-muted-foreground">{indicator.label}</span>
                <span className="text-sm font-semibold text-foreground">{indicator.value}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Explorar funil e indicadores
          </Button>
        </CardContent>
      </Card>

      <DrilldownDialog open={open} onOpenChange={setOpen} config={details} />
    </>
  );
};


export const HOME_WIDGETS: DashboardWidgetDefinitionWithComponent[] = [
  {
    id: 'lembretes',
    title: 'Lembretes e notificações',
    minCols: 4,
    maxCols: 12,
    defaultCols: 12,
    minHeight: 180,
    defaultHeight: 220,
    allowResize: true,
    Component: ({ widgetId }) => <HomePlaceholder widgetId={widgetId} />,
  },
  {
    id: 'indicadores-leads',
    title: 'Indicadores de leads e funil',
    minCols: 4,
    maxCols: 12,
    defaultCols: 8,
    minHeight: 280,
    defaultHeight: 340,
    allowResize: true,
    Component: () => <LeadsInsightsWidget />,
  },
  {
    id: 'novidades-home',
    title: 'Novidades',
    minCols: 6,
    maxCols: 12,
    defaultCols: 12,
    minHeight: 360,
    defaultHeight: 420,
    allowResize: true,
    Component: () => <HomeNovidadesWidget />,
  },
  {
    id: 'tarefas-home',
    title: 'Suas tarefas de hoje',
    minCols: 4,
    maxCols: 12,
    defaultCols: 6,
    minHeight: 300,
    defaultHeight: 340,
    allowResize: true,
    Component: () => <HomeTasksWidget />,
  },
  {
    id: 'gestao-imoveis-venda',
    title: 'Gestão de Imóveis de Venda',
    minCols: 4,
    maxCols: 12,
    defaultCols: 6,
    minHeight: 420,
    defaultHeight: 540,
    allowResize: true,
    Component: () => (
      <QualificationManagementWidget
        title="Gestão de Imóveis de Venda"
        entityLabel="Imóveis"
        itemLabel="imóveis"
        storageKey="hunter:dashboard:qualificacao:imoveis-venda"
        data={MOCK_VENDAS_IMOVEIS}
      />
    ),
  },
  {
    id: 'gestao-clientes-venda',
    title: 'Gestão de Clientes de Venda',
    minCols: 4,
    maxCols: 12,
    defaultCols: 6,
    minHeight: 420,
    defaultHeight: 540,
    allowResize: true,
    Component: () => (
      <QualificationManagementWidget
        title="Gestão de Clientes de Venda"
        entityLabel="Clientes"
        itemLabel="clientes"
        storageKey="hunter:dashboard:qualificacao:clientes-venda"
        data={MOCK_VENDAS_CLIENTES}
      />
    ),
  },
  {
    id: 'funnel',
    title: 'Funil Ampulheta',
    minCols: 8,
    maxCols: 12,
    defaultCols: 12,
    minHeight: 520,
    defaultHeight: 520,
    allowResize: false,
    Component: ({ context }) => <FunnelWidgetWrapper context={context} />,
  },
];

export const ALUGUEIS_WIDGETS: DashboardWidgetDefinitionWithComponent[] = [
  {
    id: 'funnel',
    title: 'Funil',
    minCols: 8,
    maxCols: 12,
    defaultCols: 12,
    minHeight: 520,
    defaultHeight: 520,
    allowResize: false,
    Component: ({ context }) => <FunnelWidgetWrapper context={context} />,
  },
  {
    id: 'gestao-clientes-locacao',
    title: 'Gestão de Clientes de Aluguéis',
    minCols: 4,
    maxCols: 12,
    defaultCols: 6,
    minHeight: 420,
    defaultHeight: 540,
    allowResize: true,
    Component: () => (
      <QualificationManagementWidget
        title="Gestão de Clientes de Aluguéis"
        entityLabel="Clientes"
        itemLabel="clientes"
        storageKey="hunter:dashboard:qualificacao:clientes-locacao"
        data={MOCK_ALUGUEIS_CLIENTES}
      />
    ),
  },
  {
    id: 'gestao-imoveis-locacao',
    title: 'Gestão de Imóveis de Aluguéis',
    minCols: 4,
    maxCols: 12,
    defaultCols: 6,
    minHeight: 420,
    defaultHeight: 540,
    allowResize: true,
    Component: () => (
      <QualificationManagementWidget
        title="Gestão de Imóveis de Aluguéis"
        entityLabel="Imóveis"
        itemLabel="imóveis"
        storageKey="hunter:dashboard:qualificacao:imoveis-locacao"
        data={MOCK_ALUGUEIS_IMOVEIS}
      />
    ),
  },
  {
    id: 'imoveis-gestao',
    title: 'Imóveis em gestão',
    minCols: 3,
    maxCols: 6,
    defaultCols: 4,
    minHeight: 220,
    defaultHeight: 240,
    allowResize: true,
    Component: ({ widgetId, context }) => <AlugueisMetricsWidget widgetId={widgetId} context={context} />,
  },
  {
    id: 'novidades-imoveis-locacao',
    title: 'Novidades',
    minCols: 6,
    maxCols: 12,
    defaultCols: 8,
    minHeight: 320,
    defaultHeight: 420,
    allowResize: true,
    Component: () => <AlugueisNovidadesWidget />,
  },
  {
    id: 'evolucao-captacoes-locacao',
    title: 'Evolução das captações',
    minCols: 4,
    maxCols: 8,
    defaultCols: 4,
    minHeight: 320,
    defaultHeight: 420,
    allowResize: true,
    Component: () => <AlugueisEvolucaoCaptacoesWidget />,
  },
  {
    id: 'chaves',
    title: 'Chaves',
    minCols: 3,
    maxCols: 4,
    defaultCols: 3,
    minHeight: 180,
    defaultHeight: 200,
    allowResize: true,
    Component: ({ widgetId, context }) => <AlugueisMetricsWidget widgetId={widgetId} context={context} />,
  },
  {
    id: 'exclusividades-disponiveis',
    title: 'Exclusividades disponíveis',
    minCols: 3,
    maxCols: 4,
    defaultCols: 3,
    minHeight: 180,
    defaultHeight: 200,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
  {
    id: 'portais-atencao',
    title: 'Portais que requerem atenção',
    minCols: 3,
    maxCols: 4,
    defaultCols: 3,
    minHeight: 180,
    defaultHeight: 200,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
  {
    id: 'propostas-abertas',
    title: 'Propostas em aberto',
    minCols: 3,
    maxCols: 4,
    defaultCols: 3,
    minHeight: 180,
    defaultHeight: 200,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
  {
    id: 'contratos-locacao',
    title: 'Contratos de aluguel',
    minCols: 4,
    maxCols: 6,
    defaultCols: 4,
    minHeight: 220,
    defaultHeight: 240,
    allowResize: true,
    Component: ({ widgetId, context }) => <AlugueisMetricsWidget widgetId={widgetId} context={context} />,
  },
  {
    id: 'inadimplencia',
    title: 'Inadimplência e cobranças',
    minCols: 3,
    maxCols: 6,
    defaultCols: 4,
    minHeight: 220,
    defaultHeight: 240,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
  {
    id: 'ocupacao-vacancia',
    title: 'Ocupação e vacância',
    minCols: 3,
    maxCols: 6,
    defaultCols: 4,
    minHeight: 220,
    defaultHeight: 240,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
  {
    id: 'chamados-manutencao',
    title: 'Chamados de reparos',
    minCols: 3,
    maxCols: 4,
    defaultCols: 3,
    minHeight: 180,
    defaultHeight: 200,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
  {
    id: 'repasses-proprietario',
    title: 'Repasses ao proprietário',
    minCols: 3,
    maxCols: 4,
    defaultCols: 3,
    minHeight: 180,
    defaultHeight: 200,
    allowResize: true,
    Component: ({ widgetId }) => <AlugueisPlaceholder widgetId={widgetId} />,
  },
];


const mergeWidgets = (
  ...collections: DashboardWidgetDefinitionWithComponent[][]
): DashboardWidgetDefinitionWithComponent[] => {
  const seen = new Set<string>();
  return collections.flat().filter((widget) => {
    if (seen.has(widget.id)) return false;
    seen.add(widget.id);
    return true;
  });
};

export const HOME_ALUGUEIS_UNIFIED_WIDGETS = mergeWidgets(HOME_WIDGETS, ALUGUEIS_WIDGETS);

export const VENDAS_WIDGETS: DashboardWidgetDefinitionWithComponent[] = [
  {
    id: 'funnel',
    title: 'Funil',
    minCols: 8,
    maxCols: 12,
    defaultCols: 12,
    minHeight: 520,
    defaultHeight: 520,
    allowResize: false,
    Component: ({ context }) => <FunnelWidgetWrapper context={context} />,
  },
  {
    id: 'kpis-vendas',
    title: 'Indicadores principais',
    minCols: 4,
    maxCols: 6,
    defaultCols: 6,
    minHeight: 320,
    defaultHeight: 340,
    allowResize: true,
    Component: () => <SalesKpiWidget />,
  },
  {
    id: 'indicadores-leads',
    title: 'Indicadores de leads e funil',
    minCols: 4,
    maxCols: 12,
    defaultCols: 8,
    minHeight: 280,
    defaultHeight: 340,
    allowResize: true,
    Component: () => <LeadsInsightsWidget />,
  },
  {
    id: 'oportunidades',
    title: 'Oportunidades recentes',
    minCols: 4,
    maxCols: 6,
    defaultCols: 4,
    minHeight: 220,
    defaultHeight: 240,
    allowResize: true,
    Component: () => <SalesOpportunitiesWidget />,
  },
  {
    id: 'alertas',
    title: 'Alertas e pendências críticas',
    minCols: 4,
    maxCols: 6,
    defaultCols: 4,
    minHeight: 220,
    defaultHeight: 240,
    allowResize: true,
    Component: () => <SalesAlertsWidget />,
  },
];

export const widgetRegistryByContext: Record<DashboardContext, DashboardWidgetDefinitionWithComponent[]> = {
  home: HOME_ALUGUEIS_UNIFIED_WIDGETS,
  alugueis: HOME_ALUGUEIS_UNIFIED_WIDGETS,
  vendas: VENDAS_WIDGETS,
};
