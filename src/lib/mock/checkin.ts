export type CheckinEvent = {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  context: string;
  ip: string;
  obs: string;
};

const USERS = ['Usuário 1', 'Usuário 2', 'Usuário 3', 'Usuário 4', 'Usuário 5'];
const ACTIONS = ['Check-in', 'Check-out', 'Redistribuição'];
const CONTEXTS = ['Painel', 'Lead', 'Dashboard', 'Listagem'];
const startDate = new Date('2025-01-01T08:00:00Z').getTime();

export const checkinEvents: CheckinEvent[] = Array.from({ length: 50 }).map(
  (_, i) => ({
    id: i + 1,
    timestamp: new Date(startDate + i * 60 * 60 * 1000).toISOString(),
    user: USERS[i % USERS.length],
    action: ACTIONS[i % ACTIONS.length],
    context: `${CONTEXTS[i % CONTEXTS.length]} ${i + 1}`,
    ip: `192.168.0.${i % 255} - Cidade ${i % 10 + 1}`,
    obs: i % 7 === 0 ? 'Erro de conexão' : 'OK',
  }),
);
