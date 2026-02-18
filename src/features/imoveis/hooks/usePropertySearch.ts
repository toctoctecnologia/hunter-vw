import { useMemo, useState } from 'react';
import type { Imovel } from '@/features/properties/types';

/**
 * Checks if a property matches a search query by comparing the query
 * with various property fields.
 *
 * Fields considered: title, city, code, responsible name, captador name,
 * availability, tags and, if the current user is the captador, the owner name.
 */
export function propertyMatches(
  q: string,
  imovel: any,
  currentUserId?: string
): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;

  const parts: (string | undefined)[] = [
    imovel.title || imovel.name,
    imovel.city,
    imovel.code,
    imovel.responsavel?.nome,
    imovel.captador?.nome,
    imovel.disponibilidade || imovel.availability,
    imovel.status,
    ...(imovel.tags || []),
  ];

  if (currentUserId && imovel.captador?.id === currentUserId) {
    parts.push(imovel.proprietario?.nome);
  }

  const haystack = parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

/**
 * React hook to filter a list of properties based on a search query.
 */
export function usePropertySearch(
  items: any[],
  currentUserId?: string
) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      query
        ? items.filter(item => propertyMatches(query, item, currentUserId))
        : items,
    [items, query, currentUserId]
  );

  return { query, setQuery, filtered };
}

export default usePropertySearch;

