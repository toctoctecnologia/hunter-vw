import { httpJSON } from '@/lib/http';
import type { 
  DistributionPreviewResponse, 
  DistributionStrategy, 
  DistributionScope,
  SearchResult 
} from '../types/distribution';

export async function searchDistributionTargets(
  type: 'team' | 'store' | 'user',
  query: string,
  onlyActive = true
): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({
      type,
      q: query,
      onlyActive: onlyActive.toString()
    });
    
    return await httpJSON<SearchResult[]>(`/api/distribution/search?${params}`);
  } catch (error) {
    console.error('Error searching distribution targets:', error);
    return [];
  }
}

export async function previewDistribution(
  strategy: DistributionStrategy,
  scope: DistributionScope,
  totals: {
    leadsHot: number;
    leadsWarm: number;
    leadsCold: number;
    properties: number;
  }
): Promise<DistributionPreviewResponse> {
  try {
    return await httpJSON<DistributionPreviewResponse>('/api/distribution/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strategy: strategy.type,
        targets: strategy.targets,
        scope,
        totals,
        maxItemsPerPerson: strategy.maxItemsPerPerson
      })
    });
  } catch (error) {
    console.error('Error previewing distribution:', error);
    // Return mock data for development
    return {
      rows: strategy.targets.map(target => ({
        destId: target.id,
        destLabel: target.name,
        leadsHot: Math.floor(totals.leadsHot / strategy.targets.length),
        leadsWarm: Math.floor(totals.leadsWarm / strategy.targets.length),
        leadsCold: Math.floor(totals.leadsCold / strategy.targets.length),
        properties: Math.floor(totals.properties / strategy.targets.length),
        total: Math.floor((totals.leadsHot + totals.leadsWarm + totals.leadsCold + totals.properties) / strategy.targets.length)
      })),
      warnings: [],
      totals: {
        ...totals,
        total: totals.leadsHot + totals.leadsWarm + totals.leadsCold + totals.properties
      }
    };
  }
}