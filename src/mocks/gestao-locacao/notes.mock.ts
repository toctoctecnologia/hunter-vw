export interface ContractNote {
  id: string;
  contratoId: string;
  texto: string;
  autor: string;
  data: string;
}

export const notesMock: ContractNote[] = [
  {
    id: '1',
    contratoId: '1',
    texto: 'Locatário solicitou ajuste no ar-condicionado.',
    autor: 'Usuário Demo',
    data: '15/10/2024 14:30',
  },
  {
    id: '2',
    contratoId: '1',
    texto: 'Contrato renovado por mais 12 meses.',
    autor: 'Equipe Hunter',
    data: '18/10/2023 10:00',
  },
  {
    id: '3',
    contratoId: '2',
    texto: 'Solicitado parecer sobre encerramento antecipado.',
    autor: 'Sistema',
    data: '22/09/2024 09:10',
  },
];
