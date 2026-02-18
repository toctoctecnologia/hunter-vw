/**
 * Helpers para gerenciar tokens OAuth do Google no localStorage
 */

export type GoogleOAuthTokens = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

export type GoogleServiceType = 'calendar' | 'ads';

/**
 * Salva tokens OAuth do Google no localStorage
 */
export function saveGoogleTokens(service: GoogleServiceType, tokens: GoogleOAuthTokens): void {
  const key = `google_${service}_tokens`;
  localStorage.setItem(key, JSON.stringify(tokens));
  localStorage.setItem(`google_${service}_connected`, 'true');
  localStorage.setItem(`google_${service}_connected_at`, new Date().toISOString());
}

/**
 * Recupera tokens OAuth do Google do localStorage
 */
export function getGoogleTokens(service: GoogleServiceType): GoogleOAuthTokens | null {
  const key = `google_${service}_tokens`;
  const tokens = localStorage.getItem(key);
  return tokens ? JSON.parse(tokens) : null;
}

/**
 * Verifica se um serviço do Google está conectado
 */
export function isGoogleServiceConnected(service: GoogleServiceType): boolean {
  return localStorage.getItem(`google_${service}_connected`) === 'true';
}

/**
 * Remove tokens OAuth do Google do localStorage
 */
export function removeGoogleTokens(service: GoogleServiceType): void {
  localStorage.removeItem(`google_${service}_tokens`);
  localStorage.removeItem(`google_${service}_connected`);
  localStorage.removeItem(`google_${service}_connected_at`);
}

/**
 * Verifica se o token de acesso expirou
 */
export function isTokenExpired(service: GoogleServiceType): boolean {
  const connectedAt = localStorage.getItem(`google_${service}_connected_at`);
  const tokens = getGoogleTokens(service);

  if (!connectedAt || !tokens) return true;

  const connectedDate = new Date(connectedAt);
  const expiresInMs = tokens.expires_in * 1000;
  const expirationDate = new Date(connectedDate.getTime() + expiresInMs);

  return new Date() >= expirationDate;
}
