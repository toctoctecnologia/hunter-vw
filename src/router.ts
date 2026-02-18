import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/routes/appRoutes';
import {
  LegacyCondoEditRedirect,
  LegacyCondoNewRedirect,
  LegacyCondoSlugRedirect,
  LegacyGestaoImoveisRedirect,
} from '@/routes/legacyRedirects';
import Distribuicao from './pages/Distribuicao';
import AcaoCheckinDetalhePage from './pages/Distribuicao/AcaoCheckinDetalhePage';
import AcaoCheckinHistoricoPage from './pages/Distribuicao/AcaoCheckinHistoricoPage';
import AcaoCheckinNovaPage from './pages/Distribuicao/AcaoCheckinNovaPage';
import FilaConfigPage from './pages/Distribuicao/FilaConfigPage';
import CadenciaConfigPage from './pages/Distribuicao/CadenciaConfigPage';
import PagamentosPage from './pages/billing/PagamentosPage';
import GestaoImoveisPage from './pages/gestao-imoveis/GestaoImoveisPage';
import EditCondominioPage from './pages/condominios/EditCondominioPage';
import NewCondominioPage from './pages/condominios/NewCondominioPage';
import BusinessRulesPage from './pages/BusinessRulesPage';
import CreateAccountPage from './pages/onboarding/CreateAccountPage';

export const router: RouteObject[] = [
  { path: '/distribuicao', element: React.createElement(Distribuicao) },
  { path: '/distribuicao/auditoria', element: React.createElement(Distribuicao) },
  { path: '/distribuicao/captacoes', element: React.createElement(Distribuicao) },
  { path: '/distribuicao/cadencia', element: React.createElement(Distribuicao) },
  { path: '/distribuicao/cadencia/:id', element: React.createElement(CadenciaConfigPage) },
  { path: '/distribuicao/acoes', element: React.createElement(Distribuicao) },
  { path: '/distribuicao/acoes/nova', element: React.createElement(AcaoCheckinNovaPage) },
  { path: '/distribuicao/acoes/:id', element: React.createElement(AcaoCheckinDetalhePage) },
  {
    path: '/distribuicao/acoes/:id/historico',
    element: React.createElement(AcaoCheckinHistoricoPage),
  },
  { path: '/distribuicao/redistribuicao', element: React.createElement(Distribuicao) },
  { path: '/distribuicao/:id', element: React.createElement(FilaConfigPage) },
  { path: '/pagamentos', element: React.createElement(PagamentosPage) },
  { path: '/billing', element: React.createElement(PagamentosPage) },
  { path: '/onboarding/cadastro', element: React.createElement(CreateAccountPage) },
  { path: '/regras-de-negocio', element: React.createElement(BusinessRulesPage) },
  { path: '/business-rules', element: React.createElement(Navigate, { to: '/regras-de-negocio', replace: true }) },
  { path: '/regrasdenegocios', element: React.createElement(Navigate, { to: '/regras-de-negocio', replace: true }) },
  { path: ROUTES.GESTAO_IMOVEIS, element: React.createElement(GestaoImoveisPage) },
  { path: ROUTES.TEAM_NEW, element: React.createElement(GestaoImoveisPage) },
  { path: ROUTES.TEAM_VIEW(':id'), element: React.createElement(GestaoImoveisPage) },
  { path: ROUTES.TEAM_PERF(':id'), element: React.createElement(GestaoImoveisPage) },
  { path: ROUTES.CONDO_NEW, element: React.createElement(NewCondominioPage) },
  { path: ROUTES.CONDO_EDIT(':id'), element: React.createElement(EditCondominioPage) },
  { path: '/condominios/nc', element: React.createElement(LegacyCondoNewRedirect) },
  { path: '/condominios/u:rest', element: React.createElement(LegacyCondoSlugRedirect) },
  { path: '/condominios/:id', element: React.createElement(LegacyCondoEditRedirect) },
  { path: '/gestao-imoveis.', element: React.createElement(LegacyGestaoImoveisRedirect) },
];

export default router;
