import { UserSaleItem, UserSaleDetail } from '../types';

export const mockUserLastSales: UserSaleItem[] = [
  {
    saleId: '1',
    propertyId: '2702',
    soldAt: '2025-07-28',
    soldPrice: 4978000,
  },
  {
    saleId: '2',
    propertyId: '9021',
    soldAt: '2025-07-15',
    soldPrice: 1200000,
  },
  {
    saleId: '3',
    propertyId: '7735',
    soldAt: '2025-06-30',
    soldPrice: 890000,
  },
];

export const mockUserSaleDetails: UserSaleDetail = {
  '2702': {
    id: 2702,
    code: 'TT2702',
    type: 'Apartamento',
    title: 'Falcon Tower • Unidade 2702',
    city: 'São Paulo, SP',
    area: 120,
    beds: 3,
    baths: 2,
    parking: 2,
    status: 'Vendido',
    salePrice: 4978000,
    saleDate: '2025-07-28',
    image: '/uploads/0a65a9d8-6587-49d4-8729-8a46c66b1a37.png',
  },
  '9021': {
    id: 9021,
    code: 'ALPH9021',
    type: 'Casa',
    title: 'Casa Alphaville',
    city: 'Barueri, SP',
    area: 350,
    beds: 4,
    baths: 5,
    parking: 4,
    status: 'Vendido',
    salePrice: 1200000,
    saleDate: '2025-07-15',
    image: '/uploads/1ad80c17-8c8c-4dbb-9846-293afd76d673.png',
  },
  '7735': {
    id: 7735,
    code: 'JAR7735',
    type: 'Apartamento',
    title: 'Apto Jardins',
    city: 'São Paulo, SP',
    area: 85,
    beds: 2,
    baths: 2,
    parking: 1,
    status: 'Vendido',
    salePrice: 890000,
    saleDate: '2025-06-30',
    image: '/uploads/1f3e6296-858b-4299-a58e-662dd00e91ce.png',
  },
};

export default mockUserLastSales;
