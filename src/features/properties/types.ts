export type Availability =
  | 'Disponível'
  | 'Disponível no site'
  | 'Disponível interno'
  | 'Vago/Disponível'
  | 'Indisponível'
  | 'Vendido'
  | 'Reservado';

export interface PersonRef {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
}

export interface Proprietario extends PersonRef {
  porcentagem?: number;
}

export interface Imovel {
  code: string;
  city: string;
  pricing: {
    sale?: number;
    rent?: number;
  };
  characteristics: {
    area?: number;
    beds?: number;
    baths?: number;
    parking?: number;
  };
  responsavel: PersonRef;
  captador?: PersonRef;
  proprietario?: Proprietario;
  tags?: string[];
  disponibilidade: Availability;
}

export interface PropertySummary {
  id: number;
  code: string;
  type: string;
  title: string;
  city: string;
  area: number;
  beds: number;
  baths: number;
  parking: number;
  status: string;
  salePrice: number;
  saleDate: string; // ISO date
  image?: string;
}
