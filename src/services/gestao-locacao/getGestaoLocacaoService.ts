import { MockGestaoLocacaoService } from '@/mocks/gestao-locacao/MockGestaoLocacaoService';
import type { GestaoLocacaoService } from './gestaoLocacaoService';

const toBoolean = (value: unknown) => String(value).toLowerCase() === 'true';

const resolveAppMode = () =>
  (import.meta.env.NEXT_PUBLIC_APP_MODE ??
    import.meta.env.VITE_APP_MODE ??
    import.meta.env.MODE ??
    'dev') as string;

export const shouldUseGestaoLocacaoMocks = () => {
  const appMode = resolveAppMode();
  const useMocksFlag =
    toBoolean(import.meta.env.NEXT_PUBLIC_USE_MOCKS) || toBoolean(import.meta.env.VITE_USE_MOCKS);
  const isNonProd = appMode !== 'prod';
  return useMocksFlag || isNonProd;
};

class RealGestaoLocacaoService implements GestaoLocacaoService {
  getContractById() {
    return undefined;
  }

  listContracts() {
    return { items: [] };
  }

  listContractBeneficiaries() {
    return [];
  }

  listInvoicesByContract() {
    return [];
  }

  listTransfersByContract() {
    return [];
  }

  listRepairsByContract() {
    return [];
  }

  listTasksByContract() {
    return [];
  }

  listNotesByContract() {
    return [];
  }
}

let cachedService: GestaoLocacaoService | null = null;

export const getGestaoLocacaoService = (): GestaoLocacaoService => {
  if (cachedService) return cachedService;
  cachedService = shouldUseGestaoLocacaoMocks()
    ? new MockGestaoLocacaoService()
    : new RealGestaoLocacaoService();
  return cachedService;
};
