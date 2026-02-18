export interface SaleTask {
  id: string;
  contratoId: string;
  tarefa: string;
  responsavel: string;
  data: string;
  concluido: boolean;
}

export interface SaleNote {
  id: string;
  contratoId: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  data: string;
}
