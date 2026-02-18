import { MockGestaoVendasService } from '@/mocks/gestao-vendas/MockGestaoVendasService';

const service = new MockGestaoVendasService();

export const getGestaoVendasService = () => service;
