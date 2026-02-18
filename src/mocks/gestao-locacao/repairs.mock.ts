export interface ContractRepair {
  id: string;
  contratoId: string;
  titulo: string;
  status: string;
  dataAbertura: string;
  responsavel: string;
}

export const repairsMock: ContractRepair[] = [
  {
    id: '1',
    contratoId: '1',
    titulo: 'Reparo no ar-condicionado',
    status: 'Em andamento',
    dataAbertura: '14/10/2024',
    responsavel: 'Equipe Hunter',
  },
  {
    id: '2',
    contratoId: '2',
    titulo: 'Ajuste hidráulico',
    status: 'Aberto',
    dataAbertura: '02/10/2024',
    responsavel: 'Usuário Demo',
  },
];
