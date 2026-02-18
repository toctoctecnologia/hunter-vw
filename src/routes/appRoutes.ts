const gestaoImoveis = '/gestao-imoveis';
const condosList = `${gestaoImoveis}?tab=condominios`;
const condoEdit = (id: string = ':id') => `/condominios/${id}/editar`;
const teamView = (id: string = ':id') => `${gestaoImoveis}/equipe/${id}`;
const teamPerformance = (id: string = ':id') => `${teamView(id)}/performance`;

export const ROUTES = {
  GESTAO_IMOVEIS: gestaoImoveis,
  CONDOS_LIST: condosList,
  CONDO_NEW: '/condominios/novo',
  CONDO_EDIT: condoEdit,
  TEAM_NEW: `${gestaoImoveis}/equipe/novo`,
  TEAM_VIEW: teamView,
  TEAM_PERF: teamPerformance,
} as const;

export type AppRoutes = typeof ROUTES;
