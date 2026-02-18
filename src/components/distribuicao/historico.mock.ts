import type { DistHistoryItem } from './useDistributionHistory';

const historyMock: DistHistoryItem[] = [
  {
    id: '1',
    ts: '2024-07-01T08:00:00Z',
    user: 'João',
    queue: 'Equipe A',
    lead: '101',
    action: 'assign',
    details: 'Lead distribuído para João',
    changes: [{ field: 'fila', from: 'Pendente', to: 'Equipe A' }],
  },
  {
    id: '2',
    ts: '2024-07-01T09:30:00Z',
    user: 'Maria',
    queue: 'Equipe B',
    lead: '102',
    action: 'move',
    details: 'Redistribuição manual',
    changes: [{ field: 'fila', from: 'Equipe A', to: 'Equipe B' }],
  },
  {
    id: '3',
    ts: '2024-07-01T10:15:00Z',
    user: 'Ana',
    queue: 'Equipe C',
    lead: '103',
    action: 'return',
    details: 'Devolvido sem contato',
    changes: [{ field: 'responsável', from: 'Ana', to: 'Equipe C' }],
  },
  {
    id: '4',
    ts: '2024-07-01T11:45:00Z',
    user: 'Carlos',
    queue: 'Equipe A',
    lead: '104',
    action: 'assign',
    details: 'Lead distribuído para Carlos',
    changes: [{ field: 'fila', from: 'Pendente', to: 'Equipe A' }],
  },
  {
    id: '5',
    ts: '2024-07-01T12:30:00Z',
    user: 'Joana',
    queue: 'Equipe B',
    lead: '105',
    action: 'move',
    details: 'Transferido para outra fila',
    changes: [{ field: 'fila', from: 'Equipe C', to: 'Equipe B' }],
  },
  {
    id: '6',
    ts: '2024-07-01T13:00:00Z',
    user: 'Pedro',
    queue: 'Equipe C',
    lead: '106',
    action: 'assign',
    details: 'Lead distribuído para Pedro',
    changes: [{ field: 'fila', from: 'Pendente', to: 'Equipe C' }],
  },
];

export default historyMock;

