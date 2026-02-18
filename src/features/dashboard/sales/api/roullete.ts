import { api } from '@/shared/lib/api';
import { Record, RoulleteLastOfferItem, RoulleteSettings } from '@/shared/types';

export async function getRoulleteSettings() {
  const { data } = await api.get<RoulleteSettings>('dashboard/roullete-settings');
  return data;
}

export async function updateRoulleteSettings(formData: RoulleteSettings) {
  const { data } = await api.put('dashboard/roullete-settings', formData);
  return data;
}

export async function getRoulleteLastOffers() {
  const { data } = await api.get<Record<RoulleteLastOfferItem>>('dashboard/roullete-settings/offers');
  return data;
}
