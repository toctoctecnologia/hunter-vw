import type { Task } from '@/types/task';

export const tasksMock: Task[] = [
  {
    id: '1',
    title: 'Enviar documentos',
    type: 'document',
    lead: { id: '1', nome: 'Cliente 1', email: 'cliente1@email.com' },
    dueAt: '2024-07-20T10:00:00Z',
    status: 'todo',
    reminders: [],
    notes: 'Enviar documentos necessários para análise',
    createdAt: '2024-07-20T09:00:00Z',
    updatedAt: '2024-07-20T09:00:00Z',
  },
  {
    id: '2',
    title: 'Agendar visita',
    type: 'appointment',
    lead: { id: '2', nome: 'Cliente 2', email: 'cliente2@email.com' },
    dueAt: '2024-07-25T14:00:00Z',
    status: 'todo',
    reminders: [],
    notes: 'Agendar visita ao imóvel',
    createdAt: '2024-07-25T13:00:00Z',
    updatedAt: '2024-07-25T13:00:00Z',
  },
];

export default tasksMock;
