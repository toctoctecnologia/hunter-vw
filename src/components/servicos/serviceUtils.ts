import { differenceInHours } from 'date-fns';
import type { Priority, Status, Ticket } from '@/types/service-management';
import { getSlaDeadline } from '@/services/serviceTickets';

export const STATUS_CONFIG: Array<{ id: Status; label: string; description: string }> = [
  { id: 'pendente', label: 'Pendente', description: 'Aguardando triagem.' },
  { id: 'orcamento', label: 'Orçamento', description: 'Orçamentos e aprovações.' },
  { id: 'em_andamento', label: 'Em andamento', description: 'Em execução pelo time.' },
  { id: 'resolvido', label: 'Resolvido', description: 'Finalizados com sucesso.' },
  { id: 'arquivado', label: 'Arquivado e Descartado', description: 'Itens encerrados.' }
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente'
};

export const ORIGIN_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  plataforma: 'Plataforma',
  telefone: 'Telefone',
  outro: 'Outro'
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  urgente: 4,
  alta: 3,
  media: 2,
  baixa: 1
};

export type SlaState = 'ok' | 'warning' | 'overdue';

export const getSlaState = (ticket: Ticket): SlaState => {
  const deadline = getSlaDeadline(ticket);
  const hoursRemaining = differenceInHours(deadline, new Date());

  if (hoursRemaining < 0) return 'overdue';
  if (hoursRemaining <= 6) return 'warning';
  return 'ok';
};

export const getSlaLabel = (ticket: Ticket): string => {
  const deadline = getSlaDeadline(ticket);
  const hoursRemaining = differenceInHours(deadline, new Date());

  if (hoursRemaining < 0) return 'Vencido';
  if (hoursRemaining <= 6) return 'Vencendo';
  return 'Dentro do prazo';
};

export const formatHoursRemaining = (ticket: Ticket): string => {
  const deadline = getSlaDeadline(ticket);
  const hoursRemaining = differenceInHours(deadline, new Date());
  if (hoursRemaining < 0) return `${Math.abs(hoursRemaining)}h atrasado`;
  return `${hoursRemaining}h restantes`;
};
