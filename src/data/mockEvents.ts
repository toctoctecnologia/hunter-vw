import type { Event } from '@/types/event';

interface RawMockEvent {
  id: string;
  title: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

const rawMockEvents: RawMockEvent[] = [
  {
    id: 'evt1',
    title: 'Reuni\u00e3o de Equipe com Maria Silva',
    date: '2025-07-26',
    startTime: '08:00',
    endTime: '09:00'
  },
  {
    id: 'evt2',
    title: 'Visita T\u00e9cnica em Obra com Carlos Santos',
    date: '2025-07-26',
    startTime: '10:00',
    endTime: '11:30'
  },
  {
    id: 'evt3',
    title: 'Demonstra\u00e7\u00e3o de Projeto com Lucas Oliveira',
    date: '2025-07-26',
    startTime: '13:00',
    endTime: '14:00'
  },
  {
    id: 'evt4',
    title: 'Almo\u00e7o com Jo\u00e3o Pereira',
    date: '2025-07-26',
    startTime: '15:00',
    endTime: '16:00'
  },
  {
    id: 'evt5',
    title: 'Conversa de Planejamento com Gisele Costa',
    date: '2025-07-26',
    startTime: '17:00',
    endTime: '18:00'
  },
  {
    id: 'evt6',
    title: 'Reuni\u00e3o Mensal de Resultados',
    date: '2025-07-26',
    startTime: '19:00',
    endTime: '20:00'
  }
];

export const formattedMockEvents: Event[] = rawMockEvents.map(ev => ({
  id: ev.id,
  title: ev.title,
  start: new Date(`${ev.date}T${ev.startTime}`),
  end: new Date(`${ev.date}T${ev.endTime}`),
  calendar: 'personal',
  status: 'pending'
}));
