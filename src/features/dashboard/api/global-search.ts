import { api } from '@/shared/lib/api';

import { GlobalSearchFilters, GlobalSearchResponse, GlobalSearchResultItem } from '@/shared/types';

// Realiza uma busca full-text em todas as entidades da conta ou filtradas por tipo.

// Entidades pesquisáveis:

// PROPERTY: Imóveis (nome, descrição, endereço, proprietário)
// LEAD: Leads (nome, email, telefone, título do produto)
// CONDOMINIUM: Condomínios (nome, edifício, síndico, descrição)
// TASK: Tarefas (título, descrição)
// APPOINTMENT: Compromissos (título, descrição)
// PROPERTY_BUILDER: Construtoras (nome)
// Funcionalidades:

// Busca com relevância (ranking por peso dos campos)
// Suporte a português com stemming
// Insensível a acentos
// Paginação
export async function globalSearch(filters: GlobalSearchFilters) {
  const params = { ...filters };
  const { data } = await api.get<GlobalSearchResponse>('search', { params });
  return data;
}

// Realiza uma busca rápida para sugestões de autocomplete.
// Otimizado para velocidade, retorna resultados parciais com busca por prefixo. Ideal para implementar sugestões enquanto o usuário digita.
export async function globalSearchAutoComplete(query: string, limit: number) {
  const params = { query, limit };
  const { data } = await api.get<GlobalSearchResultItem[]>('search/autocomplete', { params });
  return data;
}
