export interface Activity {
  id: number;
  datetime: string;
  channel: 'call' | 'email' | 'whatsapp';
  client: { id: number; name: string };
  summary: string;
}

export const activitiesMock: Activity[] = [
  {
    id: 1,
    datetime: '2024-07-21T10:00',
    channel: 'call',
    client: { id: 1, name: 'Maria Silva' },
    summary: 'Ligação inicial realizada',
  },
  {
    id: 2,
    datetime: '2024-07-22T16:30',
    channel: 'email',
    client: { id: 1, name: 'Maria Silva' },
    summary: 'E-mail de proposta enviado',
  },
];

export default activitiesMock;
