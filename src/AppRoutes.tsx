
import React, { Suspense } from 'react';
import { Route, Routes, useParams, Navigate } from 'react-router-dom';

import { ROUTES } from '@/routes/appRoutes';
import {
  LegacyCondoEditRedirect,
  LegacyCondoNewRedirect,
  LegacyCondoSlugRedirect,
  LegacyGestaoImoveisRedirect,
} from '@/routes/legacyRedirects';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { debugLog } from '@/utils/debug';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary';
import Index from './pages/Index';
import Vendas from './pages/Vendas';
import Gestao from './pages/Gestao';
import DesktopHome from './pages/desktop/Home';
import DesktopVendas from './pages/desktop/Vendas';
import DesktopServicos from './pages/desktop/Servicos';
import DesktopImoveis from './pages/desktop/Imoveis';
import DesktopGestao from './pages/desktop/Gestao';
import LeadDetailVendasPage from './pages/leads/LeadDetailVendasPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import Servicos from './pages/Servicos';
import AgendarServicosPage from './pages/AgendarServicosPage';
import AgendarAgendaPage from './pages/agenda/AgendarAgendaPage';
import AddLeadPage from './pages/leads/AddLeadPage';
import PerfilPage from './pages/PerfilPage';
import AppLayout from '@/layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import Imoveis from './pages/imoveis/Imoveis';
import AddImovelPage from './pages/imoveis/AddImovelPage';
import AtualizarImovelPage from './pages/imoveis/AtualizarImovelPage';
import PropertyDetailPage from './pages/imoveis/PropertyDetailPage';
import ImovelEditRedirect from './pages/imoveis/ImovelEditRedirect';
import NewCondominioPage from './pages/condominios/NewCondominioPage';
import EditCondominioPage from './pages/condominios/EditCondominioPage';
import AgendaPage from './pages/AgendaPage';
import TarefasPage from './pages/TarefasPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import { TocTocPage } from './pages/apps/TocTocPage';
import { DisparadorPage } from './pages/apps/DisparadorPage';
import { PesquisasPage } from './pages/apps/PesquisasPage';
import { LocacoesPage } from './pages/apps/LocacoesPage';
import AutomacoesPage from './pages/AutomacoesPage';
import AutomacaoRecebimentoPage from './pages/AutomacaoRecebimentoPage';
import {
  GestaoLocacaoDashboard,
  ContratosPage,
  FaturasPage,
  RepassesPage,
  RepasseDetalhesPage,
  AnalisesPage,
  ReguaCobrancaPage,
  ReajustesPage,
  DimobPage,
  NovoContratoPage,
  PadroesContratoPage,
  SegurosPage,
  EditarPadraoContratoPage,
  ContratoDetalhesPage,
  FaturaDetalhesPage,
  NovaFaturaPage
} from './pages/gestao-locacao';
import {
  GestaoVendasDashboard,
  ContratosVendaPage,
  ContratoVendaDetalhesPage,
  ComissoesPage as GestaoVendasComissoesPage,
  TransferenciasPage as GestaoVendasTransferenciasPage,
  DocumentosPage as GestaoVendasDocumentosPage,
  AgendaVendaPage,
} from './pages/gestao-vendas';
import { TemplatesPage } from './pages/TemplatesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BlogPage } from './pages/BlogPage';
import { DesktopLayout } from '@/components/shell/DesktopLayout';
import NotFound from './pages/NotFound';
import PerfilTemaPage from './pages/perfil/PerfilTemaPage';
import PerfilIAPage from './pages/perfil/PerfilIAPage';
import PerfilSegurancaPage from './pages/perfil/PerfilSegurancaPage';
import PerfilAppPage from './pages/perfil/PerfilAppPage';
import PerfilDadosPage from './pages/perfil/PerfilDadosPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FunnelPage from './pages/FunnelPage';
import CaptacoesPage from './pages/CaptacoesPage';
import AgendarAniversarioPage from './pages/AgendarAniversarioPage';
import SuportePage from './pages/SuportePage';
import SairPage from './pages/SairPage';
import ServicosPage from './pages/ServicosPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';
import UserDetailPage from './pages/usuarios/UserDetailPage';
import Distribuicao from './pages/Distribuicao';
import AcaoCheckinDetalhePage from './pages/Distribuicao/AcaoCheckinDetalhePage';
import AcaoCheckinHistoricoPage from './pages/Distribuicao/AcaoCheckinHistoricoPage';
import AcaoCheckinNovaPage from './pages/Distribuicao/AcaoCheckinNovaPage';
import FilaConfigPage from './pages/Distribuicao/FilaConfigPage';
import CadenciaConfigPage from './pages/Distribuicao/CadenciaConfigPage';
import GestaoApi from './pages/GestaoApi';
import GestaoRoletao from './pages/GestaoRoletao';
import ReportsPage from './pages/gestao-relatorios';
import AccessManagement from './pages/gestao/AccessManagement';
import BusinessRulesPage from './pages/BusinessRulesPage';
import { LeadsDashboard, LeadsListPage } from './pages/leads/LeadsPage';
import CampaignsTabPage from './pages/leads/CampaignsTabPage';
import PagamentosPage from './pages/billing/PagamentosPage';
import GestaoImoveisPage from './pages/gestao-imoveis/GestaoImoveisPage';
import CreateAccountPage from './pages/onboarding/CreateAccountPage';
import { toast } from '@/hooks/use-toast';
import HunterSitesLayout from '@/apps/huntersites/layout';
import HunterSitesDashboardPage from '@/apps/huntersites/page';
import HunterSitesListPage from '@/apps/huntersites/sites/page';
import HunterSitesTemplatesPage from '@/apps/huntersites/templates/page';
import HunterSitesLandingsPage from '@/apps/huntersites/landings/page';
import HunterSitesAnalyticsPage from '@/apps/huntersites/analytics/page';
import HunterSitesSettingsPage from '@/apps/huntersites/settings/page';
import HunterSitesBillingPage from '@/apps/huntersites/billing/page';
import HunterFinancasLayout from '@/apps/hunter-financas/layout';
import HunterFinancasDashboardPage from '@/apps/hunter-financas/page';
import ContasReceberPage from '@/apps/hunter-financas/contas-receber/page';
import ContasPagarPage from '@/apps/hunter-financas/contas-pagar/page';
import FluxoCaixaPage from '@/apps/hunter-financas/fluxo-caixa/page';
import BoletosCobrancaPage from '@/apps/hunter-financas/boletos-cobranca/page';
import ConciliacaoBancariaPage from '@/apps/hunter-financas/conciliacao-bancaria/page';
import ContratosFinanceirosPage from '@/apps/hunter-financas/contratos-financeiros/page';
import RepassesFinanceirosPage from '@/apps/hunter-financas/repasses/page';
import ComissoesFinanceirasPage from '@/apps/hunter-financas/comissoes/page';
import ImpostosFiscalPage from '@/apps/hunter-financas/impostos-fiscal/page';
import RelatoriosFinanceirosPage from '@/apps/hunter-financas/relatorios/page';
import ConfiguracoesFinanceirasPage from '@/apps/hunter-financas/configuracoes/page';
import IntegracoesFinanceirasPage from '@/apps/hunter-financas/integracoes/page';
import PortalProprietariosPage from './pages/apps/PortalProprietariosPage';
import PortalLocatariosPage from './pages/apps/PortalLocatariosPage';

const IndicacaoPage = React.lazy(() => import('./pages/apps/IndicacaoPage'));
const ComissoesPage = React.lazy(() => import('./pages/vendas/ComissoesPage'));
const PerfilSuportePage = React.lazy(() => import('./pages/perfil/PerfilSuportePage'));
const PerfilNegocioEmpresaPage = React.lazy(() => import('./pages/perfil/PerfilNegocioEmpresaPage'));
const PerfilContatoEmailPage = React.lazy(() => import('./pages/perfil/PerfilContatoEmailPage'));
const PerfilContatoTelefonePage = React.lazy(() => import('./pages/perfil/PerfilContatoTelefonePage'));
const PerfilContatoWhatsappPage = React.lazy(() => import('./pages/perfil/PerfilContatoWhatsappPage'));
const PerfilIALembretesPage = React.lazy(() => import('./pages/perfil/PerfilIALembretesPage'));
const PerfilIASugestoesPage = React.lazy(() => import('./pages/perfil/PerfilIASugestoesPage'));
const PerfilIATreinamentoPage = React.lazy(() => import('./pages/perfil/PerfilIATreinamentoPage'));
const PerfilSeguranca2FAPage = React.lazy(() => import('./pages/perfil/PerfilSeguranca2FAPage'));
const PerfilSegurancaSenhaPage = React.lazy(() => import('./pages/perfil/PerfilSegurancaSenhaPage'));
const PerfilPrivacidadeDadosPage = React.lazy(() => import('./pages/perfil/PerfilPrivacidadeDadosPage'));
const PerfilNotificacoesPage = React.lazy(() => import('./pages/perfil/PerfilNotificacoesPage'));
const PerfilIdiomaPage = React.lazy(() => import('./pages/perfil/PerfilIdiomaPage'));
const PerfilExportarDadosPage = React.lazy(() => import('./pages/perfil/PerfilExportarDadosPage'));
const PerfilImportarContatosPage = React.lazy(() => import('./pages/perfil/PerfilImportarContatosPage'));
const PerfilCentralAjudaPage = React.lazy(() => import('./pages/perfil/PerfilCentralAjudaPage'));
const PerfilTermosPage = React.lazy(() => import('./pages/perfil/PerfilTermosPage'));

function UserDetailPageWrapper({ isMobile }: { isMobile: boolean }) {
  const { id } = useParams<{ id: string }>();
  return isMobile ? (
    <UserDetailPage params={{ userId: id || '' }} />
  ) : (
    <DesktopLayout activeTab="usuarios">
      <UserDetailPage params={{ userId: id || '' }} />
    </DesktopLayout>
  );
}

function LegacyLeadVendasRedirect() {
  const { id } = useParams<{ id?: string }>();

  React.useEffect(() => {
    if (!id) {
      toast({
        title: 'Lead não encontrado',
        description: 'Não foi possível localizar o lead informado.',
        variant: 'destructive',
      });
    }
  }, [id]);

  if (!id) {
    return <Navigate to="/vendas" replace />;
  }

  return <Navigate to={`/lead-vendas/${id}`} replace />;
}

function AppRoutes() {
  const isMobile = useIsMobile();
  debugLog('AppRoutes component rendering');

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/onboarding/cadastro" element={<CreateAccountPage />} />
        <Route path="/" element={isMobile ? <Index /> : <DesktopHome />} />
        <Route path="/dashboard" element={isMobile ? <Index /> : <DesktopHome />} />
        <Route path="/vendas" element={isMobile ? <Vendas /> : <DesktopVendas />} />
        <Route path="/vendas/comissoes" element={<Suspense fallback={<div>Carregando...</div>}><ComissoesPage /></Suspense>} />
        <Route path="/servicos" element={isMobile ? <Servicos /> : <DesktopServicos />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/tarefas" element={<TarefasPage />} />
        <Route path="/imoveis" element={isMobile ? <Imoveis /> : <DesktopImoveis />} />
        <Route path={ROUTES.GESTAO_IMOVEIS} element={<GestaoImoveisPage />} />
        <Route path={ROUTES.TEAM_NEW} element={<GestaoImoveisPage />} />
        <Route path={ROUTES.TEAM_VIEW(':id')} element={<GestaoImoveisPage />} />
        <Route path={ROUTES.TEAM_PERF(':id')} element={<GestaoImoveisPage />} />
        <Route path="/usuarios" element={isMobile ? <UsuariosPage /> : <DesktopLayout activeTab="usuarios"><UsuariosPage /></DesktopLayout>} />
        <Route
          path="/usuarios/:id"
          element={
            <UserDetailPageWrapper isMobile={isMobile} />
          }
        />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/indicadores" element={isMobile ? <Gestao /> : <DesktopGestao />} />
        <Route path="/distribuicao" element={<Distribuicao />} />
        <Route path="/distribuicao/auditoria" element={<Distribuicao />} />
        <Route path="/distribuicao/captacoes" element={<Distribuicao />} />
        <Route path="/distribuicao/cadencia" element={<Distribuicao />} />
        <Route path="/distribuicao/cadencia/:id" element={<CadenciaConfigPage />} />
        <Route path="/distribuicao/acoes" element={<Distribuicao />} />
        <Route path="/distribuicao/acoes/nova" element={<AcaoCheckinNovaPage />} />
        <Route path="/distribuicao/acoes/:id" element={<AcaoCheckinDetalhePage />} />
        <Route path="/distribuicao/acoes/:id/historico" element={<AcaoCheckinHistoricoPage />} />
        <Route path="/distribuicao/redistribuicao" element={<Distribuicao />} />
        <Route path="/distribuicao/:id" element={<FilaConfigPage />} />
        <Route path="/gestao-api" element={<GestaoApi />} />
        <Route path="/gestao-roletao" element={<GestaoRoletao />} />
        <Route path="/gestao-relatorios" element={<ReportsPage />} />
        <Route path="/automacoes" element={<AutomacoesPage />} />
        <Route path="/automacoes/recebimento" element={<AutomacaoRecebimentoPage />} />
        <Route path="/regras-de-negocio" element={<BusinessRulesPage />} />
        <Route path="/business-rules" element={<Navigate to="/regras-de-negocio" replace />} />
        <Route path="/regrasdenegocios" element={<Navigate to="/regras-de-negocio" replace />} />
        <Route path="/gestao-acessos" element={<AccessManagement />} />
        <Route path="/pagamentos" element={<PagamentosPage />} />
        <Route path="/billing" element={<PagamentosPage />} />
        <Route
          path="/leads"
          element={
            isMobile ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/leads/dashboard" replace />
            )
          }
        />
        <Route
          path="/leads/dashboard"
          element={
            isMobile ? <Navigate to="/" replace /> : <LeadsDashboard />
          }
        />
        <Route
          path="/leads/lista"
          element={
            isMobile ? <Navigate to="/" replace /> : <LeadsListPage />
          }
        />
        <Route
          path="/leads/campanhas"
          element={
            isMobile ? <Navigate to="/" replace /> : <CampaignsTabPage />
          }
        />
        <Route
          path="/gestao-leads"
          element={
            isMobile ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/leads" replace />
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/funnel" element={<FunnelPage />} />
        <Route
          path="/lead-vendas/:id"
          element={
            <AppLayout>
              <LeadDetailVendasPage />
            </AppLayout>
          }
        />
        {/* Compatibility redirects to legacy route */}
        <Route path="/vendas/lead/:id" element={<LegacyLeadVendasRedirect />} />
        <Route path="/lead/:id" element={<LegacyLeadVendasRedirect />} />
        <Route
          path="/pesquisa"
          element={
            isMobile ? (
              <SearchPage />
            ) : (
              <AppLayout>
                <SearchPage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/notificacoes"
          element={
            isMobile ? (
              <NotificationsPage />
            ) : (
              <AppLayout>
                <NotificationsPage />
              </AppLayout>
            )
          }
        />
        <Route path="/agendar-servicos" element={<AgendarServicosPage />} />
        <Route path="/agenda/agendar" element={<AgendarAgendaPage />} />
        <Route path="/agenda/novo" element={<AgendarAgendaPage />} />
        <Route
          path="/agendar-aniversario"
          element={
            isMobile ? (
              <AgendarAniversarioPage />
            ) : (
              <DesktopLayout activeTab="agenda">
                <AgendarAniversarioPage />
              </DesktopLayout>
            )
          }
        />
        <Route path="/add-lead" element={<AddLeadPage />} />
        <Route path="/leads/novo" element={<AddLeadPage />} />
        <Route
          path="/add-imovel"
          element={
            isMobile ? (
              <AddImovelPage />
            ) : (
              <DesktopLayout activeTab="imoveis">
                <AddImovelPage />
              </DesktopLayout>
            )
          }
        />
        <Route
          path="/imoveis/novo"
          element={
            isMobile ? (
              <AddImovelPage />
            ) : (
              <DesktopLayout activeTab="imoveis">
                <AddImovelPage />
              </DesktopLayout>
            )
          }
        />
        <Route
          path="/captacoes"
          element={
            isMobile ? (
              <CaptacoesPage />
            ) : (
              <DesktopLayout activeTab="gestao">
                <CaptacoesPage />
              </DesktopLayout>
            )
          }
        />
        <Route
          path="/suporte"
          element={
            isMobile ? (
              <SuportePage />
            ) : (
              <AppLayout>
                <SuportePage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/sair"
          element={
            isMobile ? (
              <SairPage />
            ) : (
              <AppLayout>
                <SairPage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/servicos-page"
          element={
            isMobile ? (
              <ServicosPage />
            ) : (
              <AppLayout>
                <ServicosPage />
              </AppLayout>
            )
          }
        />
        <Route path="/imoveis/:id/edit" element={<ImovelEditRedirect />} />
        <Route
          path="/imoveis/:id/atualizar"
          element={
            isMobile ? (
              <AtualizarImovelPage />
            ) : (
              <DesktopLayout activeTab="imoveis">
                <AtualizarImovelPage />
              </DesktopLayout>
            )
          }
        />
        <Route
          path={ROUTES.CONDO_NEW}
          element={
            isMobile ? (
              <NewCondominioPage />
            ) : (
              <DesktopLayout activeTab="imoveis">
                <NewCondominioPage />
              </DesktopLayout>
            )
          }
        />
        <Route
          path={ROUTES.CONDO_EDIT(':id')}
          element={
            isMobile ? (
              <EditCondominioPage />
            ) : (
              <DesktopLayout activeTab="imoveis">
                <EditCondominioPage />
              </DesktopLayout>
            )
          }
        />
        <Route path="/condominios/nc" element={<LegacyCondoNewRedirect />} />
        <Route path="/condominios/u:rest" element={<LegacyCondoSlugRedirect />} />
        <Route path="/condominios/:id" element={<LegacyCondoEditRedirect />} />
        <Route path="/gestao-imoveis." element={<LegacyGestaoImoveisRedirect />} />
        <Route path="/configuracoes" element={isMobile ? <ConfiguracoesPage /> : <DesktopLayout activeTab="configuracoes"><ConfiguracoesPage /></DesktopLayout>} />
        <Route path="/apps/huntersites" element={<HunterSitesLayout />}>
          <Route index element={<HunterSitesDashboardPage />} />
          <Route path="sites" element={<HunterSitesListPage />} />
          <Route path="templates" element={<HunterSitesTemplatesPage />} />
          <Route path="landings" element={<HunterSitesLandingsPage />} />
          <Route path="analytics" element={<HunterSitesAnalyticsPage />} />
          <Route path="settings" element={<HunterSitesSettingsPage />} />
          <Route path="billing" element={<HunterSitesBillingPage />} />
        </Route>
        <Route path="/apps/financas" element={<HunterFinancasLayout />}>
          <Route index element={<HunterFinancasDashboardPage />} />
          <Route path="contas-receber" element={<ContasReceberPage />} />
          <Route path="contas-pagar" element={<ContasPagarPage />} />
          <Route path="fluxo-caixa" element={<FluxoCaixaPage />} />
          <Route path="boletos-cobranca" element={<BoletosCobrancaPage />} />
          <Route path="conciliacao-bancaria" element={<ConciliacaoBancariaPage />} />
          <Route path="contratos-financeiros" element={<ContratosFinanceirosPage />} />
          <Route path="repasses" element={<RepassesFinanceirosPage />} />
          <Route path="comissoes" element={<ComissoesFinanceirasPage />} />
          <Route path="impostos-fiscal" element={<ImpostosFiscalPage />} />
          <Route path="relatorios" element={<RelatoriosFinanceirosPage />} />
          <Route path="configuracoes" element={<ConfiguracoesFinanceirasPage />} />
          <Route path="integracoes" element={<IntegracoesFinanceirasPage />} />
        </Route>
        <Route path="/apps/toctoc" element={<TocTocPage />} />
        <Route path="/apps/disparador" element={<DisparadorPage />} />
        <Route path="/apps/pesquisas" element={<PesquisasPage />} />
        <Route path="/apps/locacoes" element={<LocacoesPage />} />
        <Route path="/gestao-locacao" element={<GestaoLocacaoDashboard />} />
        <Route path="/gestao-locacao/contratos" element={<ContratosPage />} />
        <Route path="/gestao-locacao/contratos/:id" element={<ContratoDetalhesPage />} />
        <Route path="/gestao-locacao/faturas" element={<FaturasPage />} />
        <Route path="/gestao-locacao/faturas/nova" element={<NovaFaturaPage />} />
        <Route path="/gestao-locacao/faturas/:id" element={<FaturaDetalhesPage />} />
        <Route path="/gestao-locacao/repasses" element={<RepassesPage />} />
        <Route path="/gestao-locacao/repasses/:id" element={<RepasseDetalhesPage />} />
        <Route path="/gestao-locacao/analises" element={<AnalisesPage />} />
        <Route path="/gestao-locacao/regua-cobranca" element={<ReguaCobrancaPage />} />
        <Route path="/gestao-locacao/reajustes" element={<ReajustesPage />} />
        <Route path="/gestao-locacao/dimob" element={<DimobPage />} />
        <Route path="/gestao-locacao/contratos/novo" element={<NovoContratoPage />} />
        <Route path="/gestao-locacao/padroes-contrato" element={<PadroesContratoPage />} />
        <Route path="/gestao-locacao/padroes-contrato/:id/editar" element={<EditarPadraoContratoPage />} />
        <Route path="/gestao-locacao/seguros" element={<SegurosPage />} />
        <Route
          path="/gestao-vendas"
          element={(
            <RouteErrorBoundary>
              <GestaoVendasDashboard />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/contratos"
          element={(
            <RouteErrorBoundary>
              <ContratosVendaPage />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/contratos/:saleId"
          element={(
            <RouteErrorBoundary>
              <ContratoVendaDetalhesPage />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/padroes-contrato"
          element={(
            <RouteErrorBoundary>
              <PadroesContratoPage />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/padroes-contrato/:id/editar"
          element={(
            <RouteErrorBoundary>
              <EditarPadraoContratoPage />
            </RouteErrorBoundary>
          )}
        />
        <Route path="/gestao-vendas/recebimentos" element={<Navigate to="/gestao-vendas/comissoes" replace />} />
        <Route
          path="/gestao-vendas/comissoes"
          element={(
            <RouteErrorBoundary>
              <GestaoVendasComissoesPage />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/transferencias"
          element={(
            <RouteErrorBoundary>
              <GestaoVendasTransferenciasPage />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/documentos"
          element={(
            <RouteErrorBoundary>
              <GestaoVendasDocumentosPage />
            </RouteErrorBoundary>
          )}
        />
        <Route
          path="/gestao-vendas/agenda"
          element={(
            <RouteErrorBoundary>
              <AgendaVendaPage />
            </RouteErrorBoundary>
          )}
        />
        <Route path="/gestao-vendas/dados" element={<Navigate to="/gestao-vendas" replace />} />
        <Route path="/apps/portal-proprietarios" element={<PortalProprietariosPage />} />
        <Route path="/apps/portal-locatarios" element={<PortalLocatariosPage />} />
        <Route path="/apps/indicacao" element={<Suspense fallback={<div>Carregando...</div>}><IndicacaoPage /></Suspense>} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route
          path="/perfil/ia"
          element={
            isMobile ? (
              <PerfilIAPage />
            ) : (
              <AppLayout>
                <PerfilIAPage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/seguranca"
          element={
            isMobile ? (
              <PerfilSegurancaPage />
            ) : (
              <AppLayout>
                <PerfilSegurancaPage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/app"
          element={
            isMobile ? (
              <PerfilAppPage />
            ) : (
              <AppLayout>
                <PerfilAppPage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/dados"
          element={
            isMobile ? (
              <PerfilDadosPage />
            ) : (
              <AppLayout>
                <PerfilDadosPage />
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/suporte"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilSuportePage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilSuportePage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/app/tema"
          element={
            isMobile ? (
              <PerfilTemaPage />
            ) : (
              <AppLayout>
                <PerfilTemaPage />
              </AppLayout>
            )
          }
        />
        
        {/* New Profile Sub-pages */}
        <Route
          path="/perfil/negocio/empresa"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilNegocioEmpresaPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilNegocioEmpresaPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/contato/email"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilContatoEmailPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilContatoEmailPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/contato/telefone"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilContatoTelefonePage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilContatoTelefonePage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/contato/whatsapp"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilContatoWhatsappPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilContatoWhatsappPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/ia/lembretes"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilIALembretesPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilIALembretesPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/ia/sugestoes"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilIASugestoesPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilIASugestoesPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/ia/treinamento"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilIATreinamentoPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilIATreinamentoPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/seguranca/2fa"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilSeguranca2FAPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilSeguranca2FAPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/seguranca/senha"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilSegurancaSenhaPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilSegurancaSenhaPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/seguranca/privacidade"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilPrivacidadeDadosPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilPrivacidadeDadosPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/app/notificacoes"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilNotificacoesPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilNotificacoesPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/app/idioma"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilIdiomaPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilIdiomaPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/dados/exportar"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilExportarDadosPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilExportarDadosPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/dados/importar"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilImportarContatosPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilImportarContatosPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/suporte/ajuda"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilCentralAjudaPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilCentralAjudaPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/suporte/chat"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilSuportePage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilSuportePage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        <Route
          path="/perfil/suporte/termos"
          element={
            isMobile ? (
              <Suspense fallback={<div>Loading...</div>}>
                <PerfilTermosPage />
              </Suspense>
            ) : (
              <AppLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PerfilTermosPage />
                </Suspense>
              </AppLayout>
            )
          }
        />
        
        <Route
          path="/perfil"
          element={
            isMobile ? (
              <PerfilPage />
            ) : (
              <AppLayout>
                <PerfilPage />
              </AppLayout>
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
