import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { LeadImportJobItem, Record } from '@/shared/types';

export async function getLeadImportJobs(pagination: PaginationState) {
  const { pageIndex, pageSize } = pagination;
  const { data } = await api.get<Record<LeadImportJobItem>>('dashboard/lead-import/jobs', {
    params: {
      page: pageIndex,
      size: pageSize,
    },
  });
  return data;
}

// Inicia o processamento de um arquivo CSV ou XLSX previamente enviado.
// O arquivo será processado de forma assíncrona em segundo plano.
// Se catcherUuid for fornecido, todos os leads serão atribuídos a este corretor.
export async function getLeadImportJob(jobId: string) {
  const { data } = await api.get<LeadImportJobItem>(`dashboard/lead-import/jobs/${jobId}`);
  return data;
}

// Gera uma URL pré-assinada para upload do arquivo CSV ou XLSX contendo os leads a serem importados.
// A URL é válida por 10 minutos. Após o upload, use o endpoint /start para iniciar o processamento.
export async function getLeadImportPresignedUrl(originalFileName: string) {
  const { data } = await api.get<{ uploadUrl: string; fileName: string }>('dashboard/lead-import/upload-url', {
    params: { originalFileName },
  });
  return data;
}

// Inicia o processamento de um arquivo CSV ou XLSX previamente enviado.
// O arquivo será processado de forma assíncrona em segundo plano.
// Se catcherUuid for fornecido, todos os leads serão atribuídos a este corretor.
export async function startLeadImport(fileName: string, catcherUuid?: string) {
  await api.post('dashboard/lead-import/start', { fileName, catcherUuid });
}
