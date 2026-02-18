import { api } from '@/shared/lib/api';
import { FiscalDataFormData } from '@/features/dashboard/payments/components/form/fiscal-data-schema';

export async function updateFiscalData(data: FiscalDataFormData) {
  await api.put('account/fiscal-data', data);
}
