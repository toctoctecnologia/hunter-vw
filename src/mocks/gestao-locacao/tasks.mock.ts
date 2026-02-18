export interface ContractTask {
  id: string;
  contratoId: string;
  tarefa: string;
  concluido: boolean;
  responsavel: string;
  data?: string;
}

export const tasksMock: ContractTask[] = [
  { id: '1', contratoId: '1', tarefa: 'Enviar contrato assinado', concluido: true, responsavel: 'Usuário Demo', data: '20/10/2022' },
  { id: '2', contratoId: '1', tarefa: 'Realizar vistoria de entrada', concluido: true, responsavel: 'Equipe Hunter', data: '18/10/2022' },
  { id: '3', contratoId: '1', tarefa: 'Cadastrar fiador', concluido: false, responsavel: 'Usuário Demo' },
  { id: '4', contratoId: '2', tarefa: 'Agendar devolução das chaves', concluido: false, responsavel: 'Sistema' },
];
