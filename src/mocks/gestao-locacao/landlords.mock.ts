export type TipoRepasse = 'Pix' | 'Transferência';

export interface LandlordHistorico {
  id: string;
  data: string;
  status: string;
  valor: string;
}

export interface Landlord {
  id: string;
  nome: string;
  documento: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoRepasse: TipoRepasse;
  historico: LandlordHistorico[];
}

export const landlordsMock: Landlord[] = [
  {
    id: 'locador-1',
    nome: 'Maria Santos',
    documento: '111.222.333-44',
    banco: 'Banco Atlântico',
    agencia: '0001',
    conta: '12345-6',
    tipoRepasse: 'Pix',
    historico: [
      { id: 'rep-1', data: '15/10/2024', status: 'Concluído', valor: 'R$ 1.575,00' },
      { id: 'rep-2', data: '15/09/2024', status: 'Concluído', valor: 'R$ 1.575,00' },
    ],
  },
  {
    id: 'locador-2',
    nome: 'João Exemplo',
    documento: '222.333.444-55',
    banco: 'Banco Horizonte',
    agencia: '0002',
    conta: '67890-1',
    tipoRepasse: 'Transferência',
    historico: [
      { id: 'rep-3', data: '15/10/2024', status: 'Concluído', valor: 'R$ 675,00' },
      { id: 'rep-4', data: '15/09/2024', status: 'Concluído', valor: 'R$ 675,00' },
    ],
  },
  {
    id: 'locador-3',
    nome: 'Luiz Victor Ferreira',
    documento: '333.444.555-66',
    banco: 'Banco Aurora',
    agencia: '0003',
    conta: '23456-7',
    tipoRepasse: 'Pix',
    historico: [
      { id: 'rep-5', data: '20/10/2024', status: 'Processando', valor: 'R$ 1.920,00' },
    ],
  },
  {
    id: 'locador-4',
    nome: 'Ana Duarte',
    documento: '444.555.666-77',
    banco: 'Banco Horizonte',
    agencia: '0004',
    conta: '34567-8',
    tipoRepasse: 'Transferência',
    historico: [
      { id: 'rep-6', data: '20/10/2024', status: 'Planejado', valor: 'R$ 1.280,00' },
    ],
  },
  {
    id: 'locador-5',
    nome: 'Renata Nogueira',
    documento: '555.666.777-88',
    banco: 'Banco Atlântico',
    agencia: '0005',
    conta: '45678-9',
    tipoRepasse: 'Pix',
    historico: [
      { id: 'rep-7', data: '12/10/2024', status: 'Concluído', valor: 'R$ 6.210,00' },
    ],
  },
];
