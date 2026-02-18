import type { Lead } from '@/types/lead';

export const leadDetailMock: Lead = {
  id: 1,
  name: 'Maria Silva',
  phone: '(11) 99999-8888',
  email: 'maria@example.com',
  source: 'Website',
  stage: 'pré_atendimento',
  qualified: true,
  qualifiedAt: '2024-07-15',
  summary: 'Cliente interessada em apartamento na zona sul',
  status: 'Aberto',
  lastContact: '2024-07-15',
  activities: [
    {
      id: 1,
      type: 'call',
      description: 'Ligação inicial realizada',
      date: '2024-07-15',
      time: '10:00',
    },
    {
      id: 2,
      type: 'email',
      description: 'Email de proposta enviado',
      date: '2024-07-16',
      time: '16:30',
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Enviar documentos',
      dueDate: '2024-07-20',
      completed: false,
    },
    {
      id: 2,
      title: 'Agendar visita',
      dueDate: '2024-07-25',
      completed: false,
    },
  ],
};

export default leadDetailMock;

