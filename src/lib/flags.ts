/**
 * Feature flags para controle de mocks e features em desenvolvimento
 * 
 * Em desenvolvimento: mocks habilitados por padrão
 * Em produção: mocks desabilitados
 * 
 * Para forçar mock em produção (debug), use variáveis de ambiente VITE_USE_MOCK_*
 */

const isDev = import.meta.env.DEV;

export const USE_MOCK_LEADS = isDev || import.meta.env.VITE_USE_MOCK_LEADS === 'true';
export const USE_MOCK_NEGOTIATIONS = isDev || import.meta.env.VITE_USE_MOCK_NEGOTIATIONS === 'true';
export const USE_MOCK_PROPERTIES = isDev || import.meta.env.VITE_USE_MOCK_PROPERTIES === 'true';
export const USE_MOCK_TASKS = isDev || import.meta.env.VITE_USE_MOCK_TASKS === 'true';
export const USE_MOCK_CALENDAR = isDev || import.meta.env.VITE_USE_MOCK_CALENDAR === 'true';
export const USE_MOCK_PROPOSALS = isDev || import.meta.env.VITE_USE_MOCK_PROPOSALS === 'true';
export const USE_MOCK_USERS = isDev || import.meta.env.VITE_USE_MOCK_USERS === 'true';
export const USE_MOCK_DASHBOARD = isDev || import.meta.env.VITE_USE_MOCK_DASHBOARD === 'true';
export const USE_MOCK_DISTRIBUTION = isDev || import.meta.env.VITE_USE_MOCK_DISTRIBUTION === 'true';
export const USE_MOCK_RENTALS = isDev || import.meta.env.VITE_USE_MOCK_RENTALS === 'true';

/**
 * Helper para verificar se deve usar mock
 */
export function shouldUseMock(flag: boolean, apiAvailable: boolean = false): boolean {
  if (!flag) return false;
  if (apiAvailable) return false;
  return true;
}
