import type {
  Availability,
  PersonRef,
  Proprietario,
} from '@/features/properties/types';

export interface MockProperty {
  id: number;
  code: string;
  type: string;
  title: string;
  address: string;
  city: string;
  price: string;
  image: string;
  specs: string[];
  areaPrivativa: number;
  quartos: number;
  suites: number;
  vagas: number;
  pavimentos: number;
  ultimoContatoEm: string;
  disponibilidade: Availability;
  captador?: PersonRef;
  proprietario?: Proprietario;
  tags: string[];
  condominio?: string;
  unidade?: string;
}

export const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: 1742,
    code: 'COD:1742',
    type: 'Casa',
    title: 'Casa Luxo com Piscina',
    address: 'Avenida Atlântica 2500, Balneário Camboriú',
    city: 'Balneário Camboriú',
    price: 'R$ 2.850.000',
    image: '/uploads/f50b6900-0b8c-4f5d-93cb-f962ee0f2be0.png',
    specs: ['420 m²', '4 Quartos', '5 Banheiros', '3 Vagas', 'Piscina'],
    areaPrivativa: 420,
    quartos: 4,
    suites: 2,
    vagas: 3,
    pavimentos: 2,
    ultimoContatoEm: '2024-05-01T12:00:00Z',
    disponibilidade: 'Disponível',
    captador: {
      id: 'current-user',
      nome: 'João Captador',
      telefone: '(47) 98888-0002',
    },
    proprietario: {
      id: 'u3',
      nome: 'Carlos Proprietário',
      telefone: '(47) 97777-0003',
    },
    tags: ['luxo', 'piscina', 'exclusivo'],
  },
  {
    id: 2,
    code: 'AP002',
    type: 'Apartamento',
    title: 'Apartamento Vista Mar',
    condominio: 'One Tower',
    unidade: '5201',
    address: 'Avenida Atlântica 1702, Copacabana, Rio de Janeiro',
    city: 'Rio de Janeiro',
    price: 'R$ 1.800.000',
    image: '/uploads/0a65a9d8-6587-49d4-8729-8a46c66b1a37.png',
    specs: ['180 m²', '3 Quartos', '3 Banheiros', '2 Vagas', 'Vista para o mar'],
    areaPrivativa: 350,
    quartos: 4,
    suites: 3,
    vagas: 3,
    pavimentos: 2,
    ultimoContatoEm: '2024-05-15T15:30:00Z',
    disponibilidade: 'Disponível interno',
    captador: {
      id: 'u5',
      nome: 'Mariana Captadora',
      telefone: '(21) 98888-5678',
    },
    proprietario: {
      id: 'u6',
      nome: 'Fernanda Proprietária',
      telefone: '(21) 97777-9012',
    },
    tags: ['vista-mar', 'apartamento', 'exclusivo'],
  },
  {
    id: 2384,
    code: 'COD:2384',
    type: 'Apartamento',
    title: 'Cobertura Frente Mar',
    condominio: 'One Tower',
    unidade: '5201',
    address: 'Avenida Atlântica 2500, Balneário Camboriú',
    city: 'Balneário Camboriú',
    price: 'R$ 1.800.000',
    image: '/uploads/example-cobertura-frente-mar.png',
    specs: ['350 m²', '4 Quartos', '4 Banheiros', '3 Vagas', 'Frente mar'],
    areaPrivativa: 350,
    quartos: 4,
    suites: 3,
    vagas: 3,
    pavimentos: 2,
    ultimoContatoEm: '2024-05-28T10:00:00Z',
    disponibilidade: 'Disponível interno',
    captador: {
      id: 'u8',
      nome: 'Mariana Captadora',
      telefone: '(47) 95555-3333',
    },
    proprietario: {
      id: 'u9',
      nome: 'João Proprietário',
      telefone: '(47) 94444-2222',
    },
    tags: ['frente-mar', 'alto-padrao', 'exclusivo'],
  },
];
