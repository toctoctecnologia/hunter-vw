import type { AgendaEvent } from '@/types/agendaEvent';

export const eventosMock: AgendaEvent[] = [
  {
    id: 1,
    title: 'Reuni\u00e3o com Cliente X',
    description: 'Sala A',
    status: 'confirmed',
    date: '2025-07-26',
    startTime: '09:00',
    endTime: '10:00',
    color: '#ffede5',
    badge: 'Online'
  },
  {
    id: 2,
    title: 'Visita T\u00e9cnica',
    description: 'Obra Y',
    status: 'pending',
    date: '2025-07-26',
    startTime: '11:00',
    endTime: '12:00',
    color: '#e5f6ff'
  },
  {
    id: 3,
    title: 'Almo\u00e7o com Parceiros',
    status: 'confirmed',
    date: '2025-07-26',
    startTime: '12:30',
    endTime: '13:30',
    color: '#e7f8ed'
  },
  {
    id: 4,
    title: 'Apresenta\u00e7\u00e3o de Projeto',
    status: 'pending',
    date: '2025-07-26',
    startTime: '14:00',
    endTime: '15:00',
    color: '#fff4e5',
    badge: 'Presencial'
  },
  {
    id: 5,
    title: 'Call com equipe',
    status: 'canceled',
    date: '2025-07-26',
    startTime: '16:00',
    endTime: '17:00',
    color: '#fdecef'
  },
  {
    id: 6,
    title: 'Reuni\u00e3o Mensal',
    status: 'confirmed',
    date: '2025-07-26',
    startTime: '18:00',
    endTime: '19:00',
    color: '#e5e8ff'
  }
];
