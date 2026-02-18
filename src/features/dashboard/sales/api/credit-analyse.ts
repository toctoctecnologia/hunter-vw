import { api } from '@/shared/lib/api';

import { CreditAnalyseItem, CreditAnalyseDocument } from '@/shared/types';

export async function getCreditAnalyse(leadUuid: string) {
  const { data } = await api.get<CreditAnalyseItem[]>(`dashboard/lead/${leadUuid}/credit/analyse`);
  return data;
}

export async function getCreditAnalyseById(leadUuid: string, analyseUuid: string) {
  const { data } = await api.get<CreditAnalyseItem>(`dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}`);
  return data;
}

export async function updateCreditAnalyse(
  leadUuid: string,
  analyseUuid: string,
  analyseData: Partial<CreditAnalyseItem>,
) {
  const { data } = await api.put<CreditAnalyseItem>(
    `dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}`,
    analyseData,
  );
  return data;
}

export async function createCreditAnalyse(leadUuid: string, analyseData: CreditAnalyseItem) {
  const { data } = await api.post<CreditAnalyseItem>(`dashboard/lead/${leadUuid}/credit/analyse`, analyseData);
  return data;
}

export async function deleteCreditAnalyse(leadUuid: string, analyseUuid: string) {
  const { data } = await api.delete<{ message: string }>(`dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}`);
  return data;
}

export async function getCreditAnalyseDocuments(leadUuid: string, analyseUuid: string) {
  const { data } = await api.get<CreditAnalyseDocument[]>(
    `dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}/document`,
  );
  return data;
}

export async function saveCreditAnalyseDocuments(leadUuid: string, analyseUuid: string, medias: File[]) {
  await Promise.all(
    medias.map(async (file) => {
      const { data } = await api.post<{ url: string }>(
        `dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}/document/upload`,
        { mediaType: file.type, fileName: file.name.trim().split(' ').join('-') },
      );

      if (file) {
        await api.put(data.url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
      }
    }),
  );
}

export async function downloadCreditAnalyseDocument(leadUuid: string, analyseUuid: string, fileName: string) {
  const { data } = await api.get<{ url: string }>(
    `dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}/document/file/${fileName}`,
  );
  return data;
}

export async function deleteCreditAnalyseDocument(leadUuid: string, analyseUuid: string, fileName: string) {
  const { data } = await api.delete(
    `dashboard/lead/${leadUuid}/credit/analyse/${analyseUuid}/document/file/${fileName}`,
  );
  return data;
}
