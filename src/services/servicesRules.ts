import type { Priority, Status, TaskStatus } from '@/types/service-management';

export const STATUS_TO_TASK_STATUS: Record<Status, TaskStatus> = {
  pendente: 'a_fazer',
  orcamento: 'em_validacao',
  em_andamento: 'em_execucao',
  resolvido: 'concluida',
  arquivado: 'arquivada'
};

export const PRIORITY_TO_TASK_PRIORITY: Record<Priority, Priority> = {
  baixa: 'baixa',
  media: 'media',
  alta: 'alta',
  urgente: 'urgente'
};
