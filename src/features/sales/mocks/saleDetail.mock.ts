import type { SaleDetail } from '../types';

export const mockSaleDetails: Record<string, SaleDetail> = {
  '1': {
    saleId: '1',
    soldPrice: 4978000,
    soldAt: '2025-07-28',
    property: {
      id: 2702,
      code: 'TT2702',
      type: 'Apartamento',
      title: 'Falcon Tower • Unidade 2702',
      city: 'São Paulo, SP',
      area: 120,
      beds: 3,
      baths: 2,
      parking: 2,
      image: '/uploads/0a65a9d8-6587-49d4-8729-8a46c66b1a37.png',
    },
    negotiation: [
      {
        date: '2025-06-10',
        description: 'Proposta inicial recebida',
        actor: 'Comprador',
      },
      {
        date: '2025-06-15',
        description: 'Contra proposta enviada',
        actor: 'Corretor',
      },
      {
        date: '2025-07-01',
        description: 'Visita ao imóvel',
        actor: 'Comprador',
      },
      {
        date: '2025-07-20',
        description: 'Contrato assinado',
        actor: 'Corretor',
      },
    ],
    distribution: [
      { party: 'Captador', percentage: 40 },
      { party: 'Vendedor', percentage: 40 },
      { party: 'Imobiliária', percentage: 20 },
    ],
  },
};

export function getMockSaleDetail(id: string): SaleDetail | undefined {
  return mockSaleDetails[id];
}
