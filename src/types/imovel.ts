export interface ImovelMedia {
  id: string;
  url: string;
  order: number;
  descricao: string;
  sigla: string;
  isCover?: boolean;
  type: 'imovel' | 'lazer';
  roomTag: string;
  co: string;
  seo?: {
    title: string;
    alt: string;
    slug: string;
    tags: string[];
  };
}

export interface ImovelUpdate {
  id: string;
  texto: string;
  tag: 'verde' | 'amarelo' | 'vermelho' | 'azul';
  anexos?: { id: string; name: string; url: string }[];
  createdAt: string;
  author?: { id: string; name: string };
}

export interface SituacaoImovel {
  tipo: 'vago' | 'indisponivel';
  dataLiberacao?: string;
  observacao?: string;
  motivo?: string;
  codigoMotivo?: string;
  prazoEstimado?: string;
}

export interface PropertyStatus {
  id: string;
  label: string;
  color: string;
  description?: string;
  isActive: boolean;
  order: number;
}