import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
type Status = 'site' | 'interno' | 'indisponivel';
interface Novidade {
  id: number;
  codigo: string;
  tipo: string;
  data: string;
  titulo: string;
  bairro: string;
  cidade: string;
  preco: number;
  status: Status;
  thumbUrl: string;
}
const mockNovidades: Novidade[] = [{
  id: 1,
  codigo: 'A123',
  tipo: 'Apartamento',
  data: '20/07/2024',
  titulo: 'Apartamento moderno com vista para o mar',
  bairro: 'Copacabana',
  cidade: 'Rio de Janeiro',
  preco: 1250000,
  status: 'site',
  thumbUrl: '/placeholder.svg'
}, {
  id: 2,
  codigo: 'C456',
  tipo: 'Casa',
  data: '12/07/2024',
  titulo: 'Casa espaçosa com quintal',
  bairro: 'Vila Mariana',
  cidade: 'São Paulo',
  preco: 850000,
  status: 'interno',
  thumbUrl: '/placeholder.svg'
}, {
  id: 3,
  codigo: 'L789',
  tipo: 'Loft',
  data: '05/07/2024',
  titulo: 'Loft industrial reformado',
  bairro: 'Centro',
  cidade: 'Belo Horizonte',
  preco: 540000,
  status: 'indisponivel',
  thumbUrl: '/placeholder.svg'
}, {
  id: 4,
  codigo: 'S321',
  tipo: 'Sobrado',
  data: '01/07/2024',
  titulo: 'Sobrado charmoso em bairro tranquilo',
  bairro: 'Boqueirão',
  cidade: 'Curitiba',
  preco: 600000,
  status: 'site',
  thumbUrl: '/placeholder.svg'
}];
export default function NovidadesMockPrint() {
  return null;
}