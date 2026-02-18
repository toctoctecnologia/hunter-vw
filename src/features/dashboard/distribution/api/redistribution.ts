import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import {
  RedistributionFilters,
  Record,
  RedistributionItem,
  RedistributionBatchJobItem,
  RedistributionUploadUrlItem,
} from '@/shared/types';

export async function getRedistributions(pagination: PaginationState, filters: RedistributionFilters) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    ...filters,
    catcherUuid: filters.selectedCatcher?.uuid,
    page: pageIndex,
    size: pageSize,
  };
  const { data } = await api.get<Record<RedistributionItem>>('dashboard/redistribution/archived', { params });
  return data;
}

export async function getBatchJobs() {
  const { data } = await api.get<Record<RedistributionBatchJobItem>>('dashboard/redistribution/batch/jobs');
  return data;
}

export async function getBatchJob(jobId: string) {
  const { data } = await api.get<RedistributionBatchJobItem>(`dashboard/redistribution/batch/jobs/${jobId}`);
  return data;
}

export async function startBatch(fileName: string, queueUuid?: string) {
  // Starts processing a previously uploaded CSV file for batch redistribution.
  // The file will be processed asynchronously in background.
  // If queueUuid is provided, leads are assigned directly to the specified queue instead of the distribution engine.
  await api.post('dashboard/redistribution/batch/start', { fileName, queueUuid });
}

export async function getUploadUrl() {
  // Generates a presigned URL for uploading a CSV file with lead UUIDs for batch redistribution
  const { data } = await api.get<RedistributionUploadUrlItem>('dashboard/redistribution/batch/upload-url');
  return data;
}

export async function redistribute(leadUuids: string[], queueUuid?: string) {
  // Unarchives the selected leads and sends them to the distribution engine for reassignment.
  // If queueUuid is provided, leads are assigned directly to the specified queue instead.
  await api.post('dashboard/redistribution/redistribute', { leadUuids, queueUuid });
}
