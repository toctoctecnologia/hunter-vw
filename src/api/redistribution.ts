import { httpJSON } from '@/lib/http';
import type {
  ArchivedLeadsFilters,
  ArchivedLeadsResponse,
  DestinationConfig,
  ImportBatchPayload,
  ImportBatchResponse,
  RedistributionExecuteResponse,
  RedistributionPreview,
  RedistributionSelection
} from '@/types/redistribution';

export interface ArchivedLeadsParams extends ArchivedLeadsFilters {
  search?: string;
  page?: number;
  perPage?: number;
}

export interface RedistributionPreviewPayload {
  selection: RedistributionSelection;
  destination: DestinationConfig;
}

export interface RedistributionExecutePayload extends RedistributionPreviewPayload {
  requestedBy: string;
}

export const redistributionApi = {
  async getArchivedLeads(params: ArchivedLeadsParams) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.reason) searchParams.set('reason', params.reason);
    if (params.owner) searchParams.set('owner', params.owner);
    if (params.queue) searchParams.set('queue', params.queue);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.perPage) searchParams.set('perPage', String(params.perPage));

    return httpJSON<ArchivedLeadsResponse>(`/api/leads/archived?${searchParams.toString()}`);
  },

  async previewRedistribution(payload: RedistributionPreviewPayload) {
    return httpJSON<RedistributionPreview>(`/api/redistribution/preview`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async executeRedistribution(payload: RedistributionExecutePayload) {
    return httpJSON<RedistributionExecuteResponse>(`/api/redistribution/execute`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async importBatch(payload: ImportBatchPayload) {
    return httpJSON<ImportBatchResponse>(`/api/leads/import`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};

export default redistributionApi;
