import type {
  KpiDetalhado,
  AuditEvent,
  UserHealthSnapshot,
} from '@/features/users/types';

export type UserRole = 'admin' | 'gestor' | 'corretor';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
  avatar?: string;
  appVersion?: string;
  active: boolean;
  roletaoEnabled?: boolean;
  canReceiveNewLeads?: boolean;
  canClaimRoletao?: boolean;
  autoEnforceHealthLeads?: boolean;
  autoEnforceRoletao?: boolean;
  healthSnapshot?: UserHealthSnapshot | null;
  filial?: 'Filial 01' | 'Filial 02' | 'Filial 03';
  nextCheckpointAt?: string | null;
  suspendLeadsUntil?: string | null;
  suspendRoletaoUntil?: string | null;
  checkpointReason?: string | null;
}

type UserSeed = Omit<User, 'autoEnforceHealthLeads' | 'autoEnforceRoletao'> &
  Partial<Pick<User, 'autoEnforceHealthLeads' | 'autoEnforceRoletao'>> & {
    next_checkpoint_at?: string | null;
    suspend_leads_until?: string | null;
    suspend_roletao_until?: string | null;
    checkpoint_reason?: string | null;
  };

const USER_SEEDS: UserSeed[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    phone: '11999990001',
    role: 'admin',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    autoEnforceHealthLeads: true,
    autoEnforceRoletao: false,
    appVersion: '1.0.0',
    next_checkpoint_at: '2025-08-30T13:00:00Z',
    suspend_leads_until: null,
    suspend_roletao_until: null,
    checkpoint_reason: null,
  },
  {
    id: '2',
    name: 'Bruno Souza',
    email: 'bruno@example.com',
    phone: '11999990002',
    role: 'corretor',
    active: false,
    roletaoEnabled: false,
    canReceiveNewLeads: false,
    canClaimRoletao: false,
    autoEnforceHealthLeads: false,
    autoEnforceRoletao: true,
    appVersion: '1.0.0',
    suspend_leads_until: '2025-01-12T12:00:00Z',
    suspend_roletao_until: null,
    checkpoint_reason: 'Férias da equipe',
  },
  {
    id: '3',
    name: 'Carlos Ferreira',
    email: 'carlos@example.com',
    phone: '11999990003',
    role: 'gestor',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0',
    suspend_leads_until: null,
    suspend_roletao_until: null,
    checkpoint_reason: null,
  },
  {
    id: '4',
    name: 'Daniela Lima',
    email: 'daniela@example.com',
    phone: '11999990004',
    role: 'corretor',
    active: true,
    roletaoEnabled: false,
    canReceiveNewLeads: true,
    canClaimRoletao: false,
    appVersion: '1.0.0',
    suspend_leads_until: null,
    suspend_roletao_until: null,
    checkpoint_reason: null,
  },
  {
    id: '5',
    name: 'Eduardo Santos',
    email: 'eduardo@example.com',
    phone: '11999990005',
    role: 'admin',
    active: false,
    roletaoEnabled: true,
    canReceiveNewLeads: false,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '6',
    name: 'Fernanda Gomes',
    email: 'fernanda@example.com',
    phone: '11999990006',
    role: 'gestor',
    active: true,
    roletaoEnabled: false,
    canReceiveNewLeads: true,
    canClaimRoletao: false,
    appVersion: '1.0.0'
  },
  {
    id: '7',
    name: 'Guilherme Costa',
    email: 'guilherme@example.com',
    phone: '11999990007',
    role: 'corretor',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '8',
    name: 'Helena Rocha',
    email: 'helena@example.com',
    phone: '11999990008',
    role: 'admin',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '9',
    name: 'Igor Almeida',
    email: 'igor@example.com',
    phone: '11999990009',
    role: 'gestor',
    active: false,
    roletaoEnabled: false,
    canReceiveNewLeads: false,
    canClaimRoletao: false,
    appVersion: '1.0.0'
  },
  {
    id: '10',
    name: 'Juliana Mendes',
    email: 'juliana@example.com',
    phone: '11999990010',
    role: 'corretor',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '11',
    name: 'Kleber Pinto',
    email: 'kleber@example.com',
    phone: '11999990011',
    role: 'corretor',
    active: false,
    roletaoEnabled: false,
    canReceiveNewLeads: false,
    canClaimRoletao: false,
    appVersion: '1.0.0'
  },
  {
    id: '12',
    name: 'Larissa Ribeiro',
    email: 'larissa@example.com',
    phone: '11999990012',
    role: 'gestor',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '13',
    name: 'Marcos Vinicius',
    email: 'marcos@example.com',
    phone: '11999990013',
    role: 'corretor',
    active: true,
    roletaoEnabled: false,
    canReceiveNewLeads: true,
    canClaimRoletao: false,
    appVersion: '1.0.0'
  },
  {
    id: '14',
    name: 'Natalia Castro',
    email: 'natalia@example.com',
    phone: '11999990014',
    role: 'admin',
    active: false,
    roletaoEnabled: true,
    canReceiveNewLeads: false,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '15',
    name: 'Otavio Barbosa',
    email: 'otavio@example.com',
    phone: '11999990015',
    role: 'corretor',
    active: true,
    roletaoEnabled: false,
    canReceiveNewLeads: true,
    canClaimRoletao: false,
    appVersion: '1.0.0'
  },
  {
    id: '16',
    name: 'Patricia Araujo',
    email: 'patricia@example.com',
    phone: '11999990016',
    role: 'gestor',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '17',
    name: 'Quirino Duarte',
    email: 'quirino@example.com',
    phone: '11999990017',
    role: 'corretor',
    active: false,
    roletaoEnabled: false,
    canReceiveNewLeads: false,
    canClaimRoletao: false,
    appVersion: '1.0.0'
  },
  {
    id: '18',
    name: 'Rafaela Brito',
    email: 'rafaela@example.com',
    phone: '11999990018',
    role: 'admin',
    active: true,
    roletaoEnabled: true,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    appVersion: '1.0.0'
  },
  {
    id: '19',
    name: 'Sergio Matos',
    email: 'sergio@example.com',
    phone: '11999990019',
    role: 'gestor',
    active: true,
    roletaoEnabled: false,
    appVersion: '1.0.0'
  },
  {
    id: '20',
    name: 'Tatiana Lopes',
    email: 'tatiana@example.com',
    phone: '11999990020',
    role: 'corretor',
    active: true,
    roletaoEnabled: true,
    appVersion: '1.0.0'
  },
  {
    id: '21',
    name: 'Ulisses Nogueira',
    email: 'ulisses@example.com',
    phone: '11999990021',
    role: 'corretor',
    active: true,
    roletaoEnabled: false,
    appVersion: '1.0.0'
  },
  {
    id: '22',
    name: 'Vanessa Teixeira',
    email: 'vanessa@example.com',
    phone: '11999990022',
    role: 'gestor',
    active: false,
    roletaoEnabled: false,
    appVersion: '1.0.0'
  },
  {
    id: '23',
    name: 'Wagner Guedes',
    email: 'wagner@example.com',
    phone: '11999990023',
    role: 'admin',
    active: true,
    roletaoEnabled: true,
    appVersion: '1.0.0'
  },
  {
    id: '24',
    name: 'Ximena Pires',
    email: 'ximena@example.com',
    phone: '11999990024',
    role: 'gestor',
    active: true,
    roletaoEnabled: true,
    appVersion: '1.0.0'
  },
  {
    id: '25',
    name: 'Yasmin Farias',
    email: 'yasmin@example.com',
    phone: '11999990025',
    role: 'corretor',
    active: false,
    roletaoEnabled: false,
    appVersion: '1.0.0'
  }
];

export const USERS: User[] = USER_SEEDS.map(
  ({
    next_checkpoint_at,
    suspend_leads_until,
    suspend_roletao_until,
    checkpoint_reason,
    ...user
  }) => ({
  ...user,
  autoEnforceHealthLeads: user.autoEnforceHealthLeads ?? true,
  autoEnforceRoletao: user.autoEnforceRoletao ?? true,
  nextCheckpointAt: next_checkpoint_at ?? null,
  suspendLeadsUntil: suspend_leads_until ?? null,
  suspendRoletaoUntil: suspend_roletao_until ?? null,
  checkpointReason: checkpoint_reason ?? null,
}));

export function searchUsers(query: string): User[] {
  const q = query.trim().toLowerCase();
  if (!q) return USERS;
  return USERS.filter(
    u =>
      u.id.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );
}

export interface UserMetric {
  userId: string;
  leads: number;
  deals: number;
}

export const METRICS: UserMetric[] = [
  {
    userId: '1',
    leads: 3,
    deals: 1
  },
  {
    userId: '2',
    leads: 6,
    deals: 2
  },
  {
    userId: '3',
    leads: 9,
    deals: 3
  },
  {
    userId: '4',
    leads: 12,
    deals: 4
  },
  {
    userId: '5',
    leads: 15,
    deals: 5
  },
  {
    userId: '6',
    leads: 18,
    deals: 1
  },
  {
    userId: '7',
    leads: 21,
    deals: 2
  },
  {
    userId: '8',
    leads: 24,
    deals: 3
  },
  {
    userId: '9',
    leads: 27,
    deals: 4
  },
  {
    userId: '10',
    leads: 30,
    deals: 5
  },
  {
    userId: '11',
    leads: 33,
    deals: 1
  },
  {
    userId: '12',
    leads: 36,
    deals: 2
  },
  {
    userId: '13',
    leads: 39,
    deals: 3
  },
  {
    userId: '14',
    leads: 42,
    deals: 4
  },
  {
    userId: '15',
    leads: 45,
    deals: 5
  },
  {
    userId: '16',
    leads: 48,
    deals: 1
  },
  {
    userId: '17',
    leads: 1,
    deals: 2
  },
  {
    userId: '18',
    leads: 4,
    deals: 3
  },
  {
    userId: '19',
    leads: 7,
    deals: 4
  },
  {
    userId: '20',
    leads: 10,
    deals: 5
  },
  {
    userId: '21',
    leads: 13,
    deals: 1
  },
  {
    userId: '22',
    leads: 16,
    deals: 2
  },
  {
    userId: '23',
    leads: 19,
    deals: 3
  },
  {
    userId: '24',
    leads: 22,
    deals: 4
  },
  {
    userId: '25',
    leads: 25,
    deals: 5
  }
];

export interface UserService {
  userId: string;
  id: string;
  name: string;
}

export const SERVICES: UserService[] = [
  {
    userId: '1',
    id: 's1',
    name: 'Fotografia'
  },
  {
    userId: '1',
    id: 's2',
    name: 'Limpeza'
  },
  {
    userId: '2',
    id: 's3',
    name: 'Limpeza'
  },
  {
    userId: '2',
    id: 's4',
    name: 'Inspeção'
  },
  {
    userId: '3',
    id: 's5',
    name: 'Inspeção'
  },
  {
    userId: '3',
    id: 's6',
    name: 'Visita guiada'
  },
  {
    userId: '4',
    id: 's7',
    name: 'Visita guiada'
  },
  {
    userId: '4',
    id: 's8',
    name: 'Avaliação'
  },
  {
    userId: '5',
    id: 's9',
    name: 'Avaliação'
  },
  {
    userId: '5',
    id: 's10',
    name: 'Documentação'
  },
  {
    userId: '6',
    id: 's11',
    name: 'Documentação'
  },
  {
    userId: '6',
    id: 's12',
    name: 'Marketing'
  },
  {
    userId: '7',
    id: 's13',
    name: 'Marketing'
  },
  {
    userId: '7',
    id: 's14',
    name: 'Fotografia'
  },
  {
    userId: '8',
    id: 's15',
    name: 'Fotografia'
  },
  {
    userId: '8',
    id: 's16',
    name: 'Limpeza'
  },
  {
    userId: '9',
    id: 's17',
    name: 'Limpeza'
  },
  {
    userId: '9',
    id: 's18',
    name: 'Inspeção'
  },
  {
    userId: '10',
    id: 's19',
    name: 'Inspeção'
  },
  {
    userId: '10',
    id: 's20',
    name: 'Visita guiada'
  },
  {
    userId: '11',
    id: 's21',
    name: 'Visita guiada'
  },
  {
    userId: '11',
    id: 's22',
    name: 'Avaliação'
  },
  {
    userId: '12',
    id: 's23',
    name: 'Avaliação'
  },
  {
    userId: '12',
    id: 's24',
    name: 'Documentação'
  },
  {
    userId: '13',
    id: 's25',
    name: 'Documentação'
  },
  {
    userId: '13',
    id: 's26',
    name: 'Marketing'
  },
  {
    userId: '14',
    id: 's27',
    name: 'Marketing'
  },
  {
    userId: '14',
    id: 's28',
    name: 'Fotografia'
  },
  {
    userId: '15',
    id: 's29',
    name: 'Fotografia'
  },
  {
    userId: '15',
    id: 's30',
    name: 'Limpeza'
  },
  {
    userId: '16',
    id: 's31',
    name: 'Limpeza'
  },
  {
    userId: '16',
    id: 's32',
    name: 'Inspeção'
  },
  {
    userId: '17',
    id: 's33',
    name: 'Inspeção'
  },
  {
    userId: '17',
    id: 's34',
    name: 'Visita guiada'
  },
  {
    userId: '18',
    id: 's35',
    name: 'Visita guiada'
  },
  {
    userId: '18',
    id: 's36',
    name: 'Avaliação'
  },
  {
    userId: '19',
    id: 's37',
    name: 'Avaliação'
  },
  {
    userId: '19',
    id: 's38',
    name: 'Documentação'
  },
  {
    userId: '20',
    id: 's39',
    name: 'Documentação'
  },
  {
    userId: '20',
    id: 's40',
    name: 'Marketing'
  },
  {
    userId: '21',
    id: 's41',
    name: 'Marketing'
  },
  {
    userId: '21',
    id: 's42',
    name: 'Fotografia'
  },
  {
    userId: '22',
    id: 's43',
    name: 'Fotografia'
  },
  {
    userId: '22',
    id: 's44',
    name: 'Limpeza'
  },
  {
    userId: '23',
    id: 's45',
    name: 'Limpeza'
  },
  {
    userId: '23',
    id: 's46',
    name: 'Inspeção'
  },
  {
    userId: '24',
    id: 's47',
    name: 'Inspeção'
  },
  {
    userId: '24',
    id: 's48',
    name: 'Visita guiada'
  },
  {
    userId: '25',
    id: 's49',
    name: 'Visita guiada'
  },
  {
    userId: '25',
    id: 's50',
    name: 'Avaliação'
  }
];

export const USER_KPI_DETAILS: Record<string, KpiDetalhado> = {
  '1': {
    resumo: {
      captacoes: 12,
      vendasQtd: 5,
      vendasValorTotal: 4978000,
      leadsRecebidos: 180,
      visitas: 72,
      propostas: 18,
      vendas: 5,
      ticketMedio: 995600,
      tempoMedioFechamentoDias: 36,
      taxaFollowUp: 0.82,
      agendaCumprida: 0.91,
      tempoMedioRespostaMin: 14,
      usoFerramentasScore: 0.76,
      nps: 54,
      indicacoes: 7,
      retencoes: 3,
    },
    vacancia: [
      { mes: '2025-01', vendeu: false, vendasQtd: 0 },
      { mes: '2025-02', vendeu: true, vendasQtd: 2 },
      { mes: '2025-03', vendeu: true, vendasQtd: 1 },
      { mes: '2025-04', vendeu: false, vendasQtd: 0 },
      { mes: '2025-05', vendeu: true, vendasQtd: 1 },
      { mes: '2025-06', vendeu: true, vendasQtd: 1 },
      { mes: '2025-07', vendeu: false, vendasQtd: 0 },
    ],
    funilConversao: { leads: 180, visitas: 72, propostas: 18, vendas: 5 },
    ultimasVendas: [
      { saleId: 'V2702', propertyId: 'Unidade 2702', soldAt: '2025-07-29', soldPrice: 4978000 },
    ],
    ultimasIndicacoes: [
      { nome: 'Carlos Lima', origem: 'Helena Almeida', data: '2025-07-30' },
    ],
    ultimosFeedbacks: [
      {
        cliente: 'Helena Almeida',
        imovel: 'Falcon Tower • Apto',
        data: '2025-07-24',
        estrelas: 4,
        comentario: 'Atendimento ágil e claro.',
      },
    ],
  },
};

export const USER_AUDIT_LOGS: Record<string, AuditEvent[]> = {
  '1': [
    { id: 'a1', ts: '2025-07-31T13:20:00Z', type: 'login', label: 'Login realizado', actorUserId: 'U1' },
    {
      id: 'a2',
      ts: '2025-07-31T13:22:10Z',
      type: 'view_property',
      label: 'Visualizou imóvel #3421',
      targetId: '3421',
      actorUserId: 'U1',
    },
    {
      id: 'a3',
      ts: '2025-07-31T13:23:02Z',
      type: 'view_owner_phone',
      label: 'Visualizou telefone do proprietário',
      targetId: '3421',
      actorUserId: 'U1',
      meta: { masked: true },
    },
    {
      id: 'a4',
      ts: '2025-07-31T13:30:40Z',
      type: 'download_photos',
      label: 'Baixou pacote de fotos',
      targetId: '3421',
      actorUserId: 'U1',
    },
    {
      id: 'a5',
      ts: '2025-07-31T14:05:55Z',
      type: 'lead_update',
      label: 'Atualizou status do lead #884',
      targetId: '884',
      actorUserId: 'U1',
      meta: { from: 'Em Atendimento', to: 'Agendamento' },
    },
    {
      id: 'a6',
      ts: '2025-07-31T15:10:11Z',
      type: 'schedule_visit',
      label: 'Agendou visita',
      targetId: '3421',
      actorUserId: 'U1',
    },
    {
      id: 'a7',
      ts: '2025-07-31T16:50:33Z',
      type: 'share_listing',
      label: 'Compartilhou anúncio por link',
      targetId: '3421',
      actorUserId: 'U1',
    },
    {
      id: 'a8',
      ts: '2025-07-31T18:02:19Z',
      type: 'export_csv',
      label: 'Exportou relatório de leads',
      actorUserId: 'U1',
    },
  ],
};

export interface UserEvaluation {
  userId: string;
  id: string;
  score: number;
  comment: string;
}

export const EVALUATIONS: UserEvaluation[] = [
  {
    userId: '1',
    id: 'e1',
    score: 1,
    comment: 'Comentário do usuário Ana Silva'
  },
  {
    userId: '2',
    id: 'e2',
    score: 2,
    comment: 'Comentário do usuário Bruno Souza'
  },
  {
    userId: '3',
    id: 'e3',
    score: 3,
    comment: 'Comentário do usuário Carlos Ferreira'
  },
  {
    userId: '4',
    id: 'e4',
    score: 4,
    comment: 'Comentário do usuário Daniela Lima'
  },
  {
    userId: '5',
    id: 'e5',
    score: 5,
    comment: 'Comentário do usuário Eduardo Santos'
  },
  {
    userId: '6',
    id: 'e6',
    score: 1,
    comment: 'Comentário do usuário Fernanda Gomes'
  },
  {
    userId: '7',
    id: 'e7',
    score: 2,
    comment: 'Comentário do usuário Guilherme Costa'
  },
  {
    userId: '8',
    id: 'e8',
    score: 3,
    comment: 'Comentário do usuário Helena Rocha'
  },
  {
    userId: '9',
    id: 'e9',
    score: 4,
    comment: 'Comentário do usuário Igor Almeida'
  },
  {
    userId: '10',
    id: 'e10',
    score: 5,
    comment: 'Comentário do usuário Juliana Mendes'
  },
  {
    userId: '11',
    id: 'e11',
    score: 1,
    comment: 'Comentário do usuário Kleber Pinto'
  },
  {
    userId: '12',
    id: 'e12',
    score: 2,
    comment: 'Comentário do usuário Larissa Ribeiro'
  },
  {
    userId: '13',
    id: 'e13',
    score: 3,
    comment: 'Comentário do usuário Marcos Vinicius'
  },
  {
    userId: '14',
    id: 'e14',
    score: 4,
    comment: 'Comentário do usuário Natalia Castro'
  },
  {
    userId: '15',
    id: 'e15',
    score: 5,
    comment: 'Comentário do usuário Otavio Barbosa'
  },
  {
    userId: '16',
    id: 'e16',
    score: 1,
    comment: 'Comentário do usuário Patricia Araujo'
  },
  {
    userId: '17',
    id: 'e17',
    score: 2,
    comment: 'Comentário do usuário Quirino Duarte'
  },
  {
    userId: '18',
    id: 'e18',
    score: 3,
    comment: 'Comentário do usuário Rafaela Brito'
  },
  {
    userId: '19',
    id: 'e19',
    score: 4,
    comment: 'Comentário do usuário Sergio Matos'
  },
  {
    userId: '20',
    id: 'e20',
    score: 5,
    comment: 'Comentário do usuário Tatiana Lopes'
  },
  {
    userId: '21',
    id: 'e21',
    score: 1,
    comment: 'Comentário do usuário Ulisses Nogueira'
  },
  {
    userId: '22',
    id: 'e22',
    score: 2,
    comment: 'Comentário do usuário Vanessa Teixeira'
  },
  {
    userId: '23',
    id: 'e23',
    score: 3,
    comment: 'Comentário do usuário Wagner Guedes'
  },
  {
    userId: '24',
    id: 'e24',
    score: 4,
    comment: 'Comentário do usuário Ximena Pires'
  },
  {
    userId: '25',
    id: 'e25',
    score: 5,
    comment: 'Comentário do usuário Yasmin Farias'
  }
];
