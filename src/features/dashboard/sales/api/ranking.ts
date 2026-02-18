import { api } from '@/shared/lib/api';

import { RoulleteRankingData } from '@/shared/types';

export async function getRanking(month: number, year: number) {
  const params = { month, year };
  const { data } = await api.get<RoulleteRankingData>('dashboard/roullete-settings/ranking', { params });
  return data;
}
