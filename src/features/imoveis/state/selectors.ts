import type { Imovel, Availability } from '@/features/properties/types';
import { propertyMatches } from '../hooks/usePropertySearch';

export interface PropertyState {
  items: Imovel[];
}

interface FilterOptions {
  availabilities?: Availability[];
  responsavelIds?: string[];
  captadorIds?: string[];
  query?: string;
  currentUserId?: string;
}

/**
 * Returns the raw property list from the state.
 */
export const selectProperties = (state: PropertyState) => state.items;

/**
 * Returns properties filtered by the provided options.
 * Filters applied:
 * - availability: property.disponibilidade must be included in the list
 * - responsavelIds: property.responsavel.id must be included
 * - captadorIds: property.captador.id must be included
 * - query: matches free-text search using {@link propertyMatches}
 */
export const selectFilteredProperties = (
  state: PropertyState,
  { availabilities, responsavelIds, captadorIds, query, currentUserId }: FilterOptions,
): Imovel[] => {
  return state.items.filter(imovel => {
    if (
      availabilities?.length &&
      !availabilities.includes(imovel.disponibilidade)
    ) {
      return false;
    }

    if (
      responsavelIds?.length &&
      !responsavelIds.includes(imovel.responsavel?.id)
    ) {
      return false;
    }

    if (captadorIds?.length) {
      const captadorId = imovel.captador?.id;
      if (!captadorId || !captadorIds.includes(captadorId)) {
        return false;
      }
    }

    if (query && !propertyMatches(query, imovel, currentUserId)) {
      return false;
    }

    return true;
  });
};

/**
 * Convenience selector to filter by availability only.
 */
export const selectByAvailability = (
  state: PropertyState,
  availabilities: Availability[],
) => selectFilteredProperties(state, { availabilities });

/**
 * Convenience selector to filter by responsible IDs only.
 */
export const selectByResponsavelIds = (
  state: PropertyState,
  responsavelIds: string[],
) => selectFilteredProperties(state, { responsavelIds });

/**
 * Convenience selector to filter by captador IDs only.
 */
export const selectByCaptadorIds = (
  state: PropertyState,
  captadorIds: string[],
) => selectFilteredProperties(state, { captadorIds });

/**
 * Convenience selector to filter by a search query only.
 */
export const selectByQuery = (
  state: PropertyState,
  query: string,
  currentUserId?: string,
) => selectFilteredProperties(state, { query, currentUserId });
