export interface Tenant {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
}

export interface Ocupante {
  nome: string;
  parentesco: string;
}

export const tenantsMock: Tenant[] = [
  {
    id: 'locatario-1',
    nome: 'Luiz Victor Ferreira',
    documento: '111.222.333-44',
    email: 'luiz.ferreira@exemplo.com',
    telefone: '(11) 90000-1111',
  },
  {
    id: 'locatario-2',
    nome: 'Carolina Lima',
    documento: '222.333.444-55',
    email: 'carolina.lima@exemplo.com',
    telefone: '(41) 90000-2222',
  },
  {
    id: 'locatario-3',
    nome: 'Felipe Rocha',
    documento: '333.444.555-66',
    email: 'felipe.rocha@exemplo.com',
    telefone: '(51) 90000-3333',
  },
  {
    id: 'locatario-4',
    nome: 'Bruna Alves',
    documento: '444.555.666-77',
    email: 'bruna.alves@exemplo.com',
    telefone: '(21) 90000-4444',
  },
  {
    id: 'locatario-5',
    nome: 'Rafael Souza',
    documento: '555.666.777-88',
    email: 'rafael.souza@exemplo.com',
    telefone: '(31) 90000-5555',
  },
];

export const ocupantesMockByContrato: Record<string, Ocupante[]> = {
  '1': [{ nome: 'Ana Ferreira', parentesco: 'Cônjuge' }],
  '2': [{ nome: 'Bruna Alves', parentesco: 'Irmã' }],
  '3': [{ nome: 'Rafael Souza', parentesco: 'Sócio' }],
};
