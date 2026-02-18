/**
 * Decodifica uma string base64url para string UTF-8
 * Base64url é uma variante do Base64 segura para URLs
 *
 * Esta função funciona tanto no navegador quanto no servidor
 */
export function decodeBase64Url(input: string): string {
  // Verifica se está no ambiente Node.js (servidor)
  if (typeof Buffer !== 'undefined') {
    // No servidor, tenta usar Buffer com base64url (Node.js 14.18+)
    try {
      return Buffer.from(input, 'base64url' as BufferEncoding).toString('utf-8');
    } catch {
      // Fallback para conversão manual se base64url não estiver disponível
    }
  }

  // No navegador ou fallback: conversão manual
  // Substitui caracteres base64url por base64 padrão
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  // Adiciona padding se necessário
  while (base64.length % 4) {
    base64 += '=';
  }

  // Decodifica base64 para string
  return atob(base64);
}

/**
 * Codifica uma string UTF-8 para base64url
 * Base64url é uma variante do Base64 segura para URLs
 *
 * Esta função funciona tanto no navegador quanto no servidor
 */
export function encodeBase64Url(input: string): string {
  // Verifica se está no ambiente Node.js (servidor)
  if (typeof Buffer !== 'undefined') {
    // No servidor, tenta usar Buffer com base64url (Node.js 14.18+)
    try {
      return Buffer.from(input, 'utf-8').toString('base64url' as BufferEncoding);
    } catch {
      // Fallback para conversão manual se base64url não estiver disponível
    }
  }

  // No navegador ou fallback: conversão manual
  // Codifica para base64
  const base64 = btoa(input);

  // Converte para base64url (remove padding e substitui caracteres)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
