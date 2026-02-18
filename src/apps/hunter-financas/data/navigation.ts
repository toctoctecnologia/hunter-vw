import {
  BarChart3,
  Banknote,
  Briefcase,
  ClipboardList,
  CreditCard,
  FilePieChart,
  FileStack,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Link as LinkIcon,
  Receipt,
  Settings,
  Users,
} from 'lucide-react';

export type FinanceNavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  description: string;
};

export const financeNavItems: FinanceNavItem[] = [
  {
    label: 'Dashboard Financeiro',
    to: '/apps/financas',
    icon: LayoutDashboard,
    description: 'Visão geral, alertas e indicadores críticos',
  },
  {
    label: 'Contas a Receber',
    to: '/apps/financas/contas-receber',
    icon: Receipt,
    description: 'Receitas, boletos, parcelas e inadimplência',
  },
  {
    label: 'Contas a Pagar',
    to: '/apps/financas/contas-pagar',
    icon: CreditCard,
    description: 'Despesas operacionais, impostos e comissões',
  },
  {
    label: 'Fluxo de Caixa',
    to: '/apps/financas/fluxo-caixa',
    icon: BarChart3,
    description: 'Real x previsto com filtros inteligentes',
  },
  {
    label: 'Boletos e Cobrança',
    to: '/apps/financas/boletos-cobranca',
    icon: Banknote,
    description: 'CNAB, PIX e régua automática de cobrança',
  },
  {
    label: 'Conciliação Bancária',
    to: '/apps/financas/conciliacao-bancaria',
    icon: Landmark,
    description: 'Importação automática e conciliação inteligente',
  },
  {
    label: 'Contratos Financeiros',
    to: '/apps/financas/contratos-financeiros',
    icon: FileStack,
    description: 'Reajustes automáticos e impacto financeiro',
  },
  {
    label: 'Repasses',
    to: '/apps/financas/repasses',
    icon: HandCoins,
    description: 'Split de pagamento e retenções',
  },
  {
    label: 'Comissões',
    to: '/apps/financas/comissoes',
    icon: Users,
    description: 'Cálculo automático por corretor',
  },
  {
    label: 'Impostos e Fiscal',
    to: '/apps/financas/impostos-fiscal',
    icon: Briefcase,
    description: 'DIMOB, DIRF e retenções',
  },
  {
    label: 'Relatórios',
    to: '/apps/financas/relatorios',
    icon: FilePieChart,
    description: 'DRE completo e exportações',
  },
  {
    label: 'Configurações Financeiras',
    to: '/apps/financas/configuracoes',
    icon: Settings,
    description: 'Planos de contas, centros de custo e bancos',
  },
  {
    label: 'Integrações',
    to: '/apps/financas/integracoes',
    icon: LinkIcon,
    description: 'Bancos, gateways, contabilidade e APIs',
  },
];

export const financeRouteMeta: Record<string, { title: string; description: string }> =
  financeNavItems.reduce((acc, item) => {
    acc[item.to] = { title: item.label, description: item.description };
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

export const financeQuickActions = [
  { label: 'Nova cobrança', tone: 'primary' },
  { label: 'Novo repasse', tone: 'secondary' },
  { label: 'Agendar imposto', tone: 'ghost' },
];

export const financeHighlights = [
  {
    title: 'LGPD e auditoria completa',
    description: 'Logs financeiros, rastreio por usuário e trilha de auditoria ativa.',
  },
  {
    title: 'Permissões finas por perfil',
    description: 'Administrador, gestor, financeiro e corretor com visibilidade segmentada.',
  },
  {
    title: 'Motor financeiro integrado',
    description: 'Conectado ao CRM e locações sem duplicar dados críticos.',
  },
];

export const financeDashMetrics = [
  {
    label: 'Saldo atual',
    value: 'R$ 4.982.540',
    trend: '+6,2% vs. mês anterior',
  },
  {
    label: 'Previsão de caixa (90 dias)',
    value: 'R$ 7.420.120',
    trend: 'Risco baixo em 3 centros de custo',
  },
  {
    label: 'Receitas do mês',
    value: 'R$ 1.832.900',
    trend: '+12% em locações',
  },
  {
    label: 'Despesas do mês',
    value: 'R$ 1.120.400',
    trend: 'Impostos representam 38%',
  },
  {
    label: 'Inadimplência',
    value: '2,4%',
    trend: '18 contratos críticos',
  },
  {
    label: 'Repasses pendentes',
    value: 'R$ 286.300',
    trend: '23 proprietários aguardando',
  },
];

export const financeAlerts = [
  {
    title: 'Reajustes IGPM programados',
    detail: '12 contratos com reajuste em até 10 dias.',
    status: 'Ação necessária',
  },
  {
    title: 'Pagamentos críticos de fornecedores',
    detail: 'R$ 84.600 vencendo nesta semana.',
    status: 'Prioridade alta',
  },
  {
    title: 'Retenção IRRF pendente',
    detail: '8 lançamentos aguardando validação fiscal.',
    status: 'Revisão fiscal',
  },
];

export const financeDreSummary = [
  { label: 'Receita operacional', value: 'R$ 2.430.000' },
  { label: 'Custos diretos', value: 'R$ 860.000' },
  { label: 'Despesas administrativas', value: 'R$ 480.000' },
  { label: 'Resultado líquido', value: 'R$ 1.090.000' },
];

export const financeCashflowSeries = [
  { label: 'Entradas previstas', value: 'R$ 2,1M' },
  { label: 'Saídas previstas', value: 'R$ 1,4M' },
  { label: 'Resultado projetado', value: 'R$ 700k' },
];

export const financeReceivablesInsights = [
  {
    title: 'Boletos emitidos',
    value: '1.248',
    detail: '92% enviados por WhatsApp',
  },
  {
    title: 'Pagos no prazo',
    value: '84%',
    detail: 'Media de recebimento: 2,1 dias',
  },
  {
    title: 'Em atraso',
    value: '196',
    detail: 'Alugueis com 5+ dias de atraso',
  },
];

export const financePayablesInsights = [
  {
    title: 'Despesas operacionais',
    value: 'R$ 420k',
    detail: '18 fornecedores recorrentes',
  },
  {
    title: 'Comissões programadas',
    value: 'R$ 198k',
    detail: '42 corretores ativos',
  },
  {
    title: 'Impostos do trimestre',
    value: 'R$ 310k',
    detail: 'DIMOB e retenções atualizadas',
  },
];

export const financeIntegrations = [
  'Banco Itaú, Bradesco, Santander e Sicoob',
  'Gateways de pagamento com PIX e cartão',
  'Exportação contábil para ERPs externos',
  'APIs Hunter para integrações customizadas',
];

export const financeReports = [
  'DRE completo com centro de custo e imóvel',
  'Fluxo de caixa real vs previsto',
  'Inadimplência por carteira e contrato',
  'Repasses, comissões e retenções',
];

export const financeConfigurations = [
  'Planos de contas e centros de custo dinâmicos',
  'Contas bancárias e regras de conciliação',
  'Modelos de cobrança e repasse automático',
  'Índices de reajuste IGPM, IPCA e personalizados',
];

export const financePermissions = [
  { role: 'Administrador', access: 'Visão total com auditoria e configurações estratégicas.' },
  { role: 'Gestor', access: 'KPIs financeiros, aprovações e relatórios gerenciais.' },
  { role: 'Financeiro', access: 'Operação completa, conciliação e cobranças.' },
  { role: 'Corretor', access: 'Acesso restrito a comissões e repasses próprios.' },
];

export const financeContractsHighlights = [
  'Contratos de locação e venda sincronizados com CRM e Locação',
  'Reajustes automáticos por IGPM/IPCA com alertas inteligentes',
  'Aditivos, rescisões e impacto financeiro imediato',
];

export const financeRepassesHighlights = [
  'Split de pagamento com retenções automáticas',
  'IRRF, taxa administrativa e rateios configuráveis',
  'Extrato do proprietário com histórico completo',
];

export const financeTaxHighlights = [
  'DIMOB e DIRF com exportação pronta',
  'NFSe e retenções integradas',
  'Calendário fiscal com alertas automáticos',
];

export const financeCollectionsHighlights = [
  'Emissão de boletos e PIX com QR dinâmico',
  'Agenda de cobrança com juros, multas e segunda via',
  'Envio automático por WhatsApp e e-mail',
];

export const financeReconciliationHighlights = [
  'Importação automática de OFX e CNAB',
  'Conciliação inteligente com divergências destacadas',
  'Status de revisão por time e banco',
];

export const financeCommissionHighlights = [
  'Cálculo automático por negociação e locação',
  'Status previsto, em aberto e pago',
  'Simulação de comissões futuras',
];

export const financeCashflowFilters = [
  'Período, centro de custo, imóvel e projeto',
  'Comparativo real x previsto',
  'Alertas de saldo negativo',
];

export const financeReceivablesFilters = [
  'Filtro por imóvel, cliente, contrato e corretor',
  'Segmentação por centro de custo',
  'Status: emitido, pago ou em atraso',
];

export const financePayablesFilters = [
  'Fornecedores, impostos e despesas por imóvel',
  'Despesas administrativas e operacionais',
  'Calendário de pagamentos recorrentes',
];

export const financeSettingsGroups = [
  {
    title: 'Modelos e automações',
    items: ['Modelos de cobrança', 'Modelos de repasse', 'Agenda de cobrança'],
  },
  {
    title: 'Estrutura contábil',
    items: ['Plano de contas', 'Centros de custo', 'Contas bancárias'],
  },
  {
    title: 'Índices e reajustes',
    items: ['IGPM', 'IPCA', 'Índices personalizados'],
  },
];

export const financeReportExports = [
  { label: 'Exportação PDF', detail: 'Relatórios formatados para conselho.' },
  { label: 'Exportação Excel', detail: 'Dados analíticos por carteira e imóvel.' },
];

export const financeIntegrationTypes = [
  { label: 'Bancos', detail: 'Integrações diretas e conciliação automática.' },
  { label: 'Gateways', detail: 'PIX, cartão e split de pagamento.' },
  { label: 'Contabilidade', detail: 'Exportação contábil e APIs externas.' },
  { label: 'ERP externos', detail: 'Conectores com TOTVS e Superlógica.' },
];
