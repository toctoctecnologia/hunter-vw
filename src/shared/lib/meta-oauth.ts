/**
 * Helpers para gerenciar tokens OAuth do Meta (Facebook/Instagram) no localStorage
 */

export type MetaOAuthTokens = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type MetaAccountData = {
  meta_user_id: string;
  ad_account_id?: string;
  page_id?: string;
  leadgen_form_id?: string;
};

export type MetaConnectionData = {
  tokens: MetaOAuthTokens;
  accountData: MetaAccountData;
  connected_at: string;
};

/**
 * Salva tokens e dados da conta Meta no localStorage
 */
export function saveMetaConnection(data: MetaConnectionData): void {
  localStorage.setItem('meta_leads_connection', JSON.stringify(data));
  localStorage.setItem('meta_leads_connected', 'true');
  localStorage.setItem('meta_leads_connected_at', data.connected_at);
}

/**
 * Recupera dados de conexão do Meta do localStorage
 */
export function getMetaConnection(): MetaConnectionData | null {
  const connection = localStorage.getItem('meta_leads_connection');
  return connection ? JSON.parse(connection) : null;
}

/**
 * Verifica se o Meta Leads está conectado
 */
export function isMetaLeadsConnected(): boolean {
  return localStorage.getItem('meta_leads_connected') === 'true';
}

/**
 * Verifica se o token de acesso do Meta expirou
 */
export function isMetaTokenExpired(): boolean {
  const connection = getMetaConnection();
  if (!connection) return true;

  const connectedDate = new Date(connection.connected_at);
  const expiresInMs = connection.tokens.expires_in * 1000;
  const expirationDate = new Date(connectedDate.getTime() + expiresInMs);

  return new Date() >= expirationDate;
}

/**
 * Obtém o access token do Meta se válido
 */
export function getMetaAccessToken(): string | null {
  if (isMetaTokenExpired()) return null;
  const connection = getMetaConnection();
  return connection?.tokens.access_token ?? null;
}
