import type {
  CreateTeamInput,
  Team,
  TeamFilters,
  TeamListResponse,
  TeamMember,
  TeamMemberFilters,
  TeamMemberInput,
  TeamMemberListResponse,
  UpdateTeamInput,
  UpdateTeamMemberInput,
  UpdateTeamStatusInput,
} from '@/types/teams';
import { USERS } from '@/mocks/users';

const TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Equipe Centro-Sul',
    type: 'regional',
    branch: 'Filial Paulista',
    description: 'Time dedicado aos lançamentos e empreendimentos de alto padrão na capital.',
    city: 'São Paulo',
    state: 'SP',
    address: {
      street: 'Avenida Paulista',
      number: '1578',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-200',
    },
    status: 'active',
    managerId: 'user-ana',
    manager: {
      id: 'user-ana',
      name: 'Ana Carolina',
      email: 'ana.carolina@example.com',
    },
    tags: ['Lançamentos', 'Alto padrão'],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-04-20T10:15:00.000Z',
  },
  {
    id: 'team-2',
    name: 'Equipe Litoral',
    type: 'parceria',
    branch: 'Filial Santos',
    description: 'Equipe especializada em locações e vendas de imóveis no litoral paulista.',
    city: 'Santos',
    state: 'SP',
    address: {
      street: 'Rua Alexandre Martins',
      number: '45',
      neighborhood: 'Aparecida',
      city: 'Santos',
      state: 'SP',
      zipCode: '11065-400',
    },
    status: 'expansion',
    managerId: 'user-felipe',
    manager: {
      id: 'user-felipe',
      name: 'Felipe Mendes',
      email: 'felipe.mendes@example.com',
    },
    tags: ['Franquia', 'Aluguel'],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: '2023-09-18T12:30:00.000Z',
    updatedAt: '2024-02-02T09:45:00.000Z',
  },
  {
    id: 'team-3',
    name: 'Equipe Zona Norte',
    type: 'especializada',
    branch: 'Filial Santana',
    description: 'Foco em programas Minha Casa Minha Vida e captação ativa.',
    city: 'São Paulo',
    state: 'SP',
    address: {
      street: 'Rua Voluntários da Pátria',
      number: '3400',
      neighborhood: 'Santana',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02402-400',
    },
    status: 'active',
    managerId: 'user-joana',
    manager: {
      id: 'user-joana',
      name: 'Joana Prado',
      email: 'joana.prado@example.com',
    },
    tags: ['MCMV', 'Captação'],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: '2024-03-05T15:20:00.000Z',
    updatedAt: '2024-03-22T11:10:00.000Z',
  },
  {
    id: 'team-4',
    name: 'Equipe Rio Capital',
    type: 'regional',
    branch: 'Filial Rio',
    description: 'Cobertura completa da capital carioca, com foco em eventos de relacionamento.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: {
      street: 'Rua da Assembléia',
      number: '10',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20011-901',
    },
    status: 'active',
    managerId: 'user-marcos',
    manager: {
      id: 'user-marcos',
      name: 'Marcos Paes',
      email: 'marcos.paes@example.com',
    },
    tags: ['Lançamentos', 'Eventos'],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: '2022-11-01T09:00:00.000Z',
    updatedAt: '2024-01-14T16:25:00.000Z',
  },
  {
    id: 'team-5',
    name: 'Equipe Vale do Paraíba',
    type: 'apoio',
    branch: 'Filial Taubaté',
    description: 'Time em reestruturação com foco em parcerias locais.',
    city: 'Taubaté',
    state: 'SP',
    address: {
      street: 'Avenida Itália',
      number: '300',
      neighborhood: 'Jardim das Nações',
      city: 'Taubaté',
      state: 'SP',
      zipCode: '12030-210',
    },
    status: 'inactive',
    managerId: 'user-vitoria',
    manager: {
      id: 'user-vitoria',
      name: 'Vitória Leal',
      email: 'vitoria.leal@example.com',
    },
    tags: ['Reestruturação'],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: '2023-01-12T14:00:00.000Z',
    updatedAt: '2024-05-18T17:40:00.000Z',
  },
  {
    id: 'team-6',
    name: 'Equipe Minas Centro',
    type: 'especializada',
    branch: 'Filial Belo Horizonte',
    description: 'Operação híbrida com foco em incorporação e mercado corporativo.',
    city: 'Belo Horizonte',
    state: 'MG',
    address: {
      street: 'Avenida do Contorno',
      number: '4000',
      neighborhood: 'Funcionários',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30110-017',
    },
    status: 'expansion',
    managerId: 'user-lucas',
    manager: {
      id: 'user-lucas',
      name: 'Lucas Amaral',
      email: 'lucas.amaral@example.com',
    },
    tags: ['Incorporação', 'Comercial'],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: '2022-05-08T10:45:00.000Z',
    updatedAt: '2024-04-28T08:55:00.000Z',
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1-member-1',
    teamId: 'team-1',
    userId: 'user-ana',
    name: 'Ana Carolina',
    email: 'ana.carolina@example.com',
    role: 'Líder regional',
    status: 'active',
    isManager: true,
    joinedAt: '2022-01-10T08:00:00.000Z',
  },
  {
    id: 'team-1-member-2',
    teamId: 'team-1',
    userId: 'user-diego',
    name: 'Diego Ramos',
    email: 'diego.ramos@example.com',
    role: 'Especialista em lançamentos',
    status: 'active',
    joinedAt: '2022-02-15T10:00:00.000Z',
  },
  {
    id: 'team-1-member-3',
    teamId: 'team-1',
    userId: 'user-maria',
    name: 'Maria Helena',
    email: 'maria.helena@example.com',
    role: 'Consultora sênior',
    status: 'inactive',
    joinedAt: '2023-05-01T09:00:00.000Z',
  },
  {
    id: 'team-2-member-1',
    teamId: 'team-2',
    userId: 'user-felipe',
    name: 'Felipe Mendes',
    email: 'felipe.mendes@example.com',
    role: 'Líder regional',
    status: 'active',
    isManager: true,
    joinedAt: '2021-08-22T09:00:00.000Z',
  },
  {
    id: 'team-2-member-2',
    teamId: 'team-2',
    userId: 'user-larissa',
    name: 'Larissa Oliveira',
    email: 'larissa.oliveira@example.com',
    role: 'Especialista em locação',
    status: 'active',
    joinedAt: '2022-04-11T11:30:00.000Z',
  },
  {
    id: 'team-2-member-3',
    teamId: 'team-2',
    userId: 'user-matheus',
    name: 'Matheus Duarte',
    email: 'matheus.duarte@example.com',
    role: 'Consultor pleno',
    status: 'active',
    joinedAt: '2023-02-21T14:30:00.000Z',
  },
  {
    id: 'team-3-member-1',
    teamId: 'team-3',
    userId: 'user-joana',
    name: 'Joana Prado',
    email: 'joana.prado@example.com',
    role: 'Coordenadora',
    status: 'active',
    isManager: true,
    joinedAt: '2023-01-05T08:45:00.000Z',
  },
  {
    id: 'team-3-member-2',
    teamId: 'team-3',
    userId: 'user-renan',
    name: 'Renan Lima',
    email: 'renan.lima@example.com',
    role: 'Captador',
    status: 'active',
    joinedAt: '2023-06-17T12:00:00.000Z',
  },
  {
    id: 'team-3-member-3',
    teamId: 'team-3',
    userId: 'user-juliana',
    name: 'Juliana Santos',
    email: 'juliana.santos@example.com',
    role: 'Consultora associada',
    status: 'active',
    joinedAt: '2024-01-12T09:20:00.000Z',
  },
  {
    id: 'team-4-member-1',
    teamId: 'team-4',
    userId: 'user-marcos',
    name: 'Marcos Paes',
    email: 'marcos.paes@example.com',
    role: 'Diretor comercial',
    status: 'active',
    isManager: true,
    joinedAt: '2020-03-01T10:15:00.000Z',
  },
  {
    id: 'team-4-member-2',
    teamId: 'team-4',
    userId: 'user-carolina',
    name: 'Carolina Dias',
    email: 'carolina.dias@example.com',
    role: 'Analista de eventos',
    status: 'active',
    joinedAt: '2021-07-19T09:40:00.000Z',
  },
  {
    id: 'team-4-member-3',
    teamId: 'team-4',
    userId: 'user-ricardo',
    name: 'Ricardo Alves',
    email: 'ricardo.alves@example.com',
    role: 'Consultor sênior',
    status: 'active',
    joinedAt: '2022-10-03T13:10:00.000Z',
  },
  {
    id: 'team-5-member-1',
    teamId: 'team-5',
    userId: 'user-vitoria',
    name: 'Vitória Leal',
    email: 'vitoria.leal@example.com',
    role: 'Supervisora',
    status: 'inactive',
    isManager: true,
    joinedAt: '2021-05-08T09:30:00.000Z',
  },
  {
    id: 'team-5-member-2',
    teamId: 'team-5',
    userId: 'user-antonio',
    name: 'Antônio Rocha',
    email: 'antonio.rocha@example.com',
    role: 'Consultor',
    status: 'inactive',
    joinedAt: '2022-02-18T11:00:00.000Z',
  },
  {
    id: 'team-6-member-1',
    teamId: 'team-6',
    userId: 'user-lucas',
    name: 'Lucas Amaral',
    email: 'lucas.amaral@example.com',
    role: 'Head de operações',
    status: 'active',
    isManager: true,
    joinedAt: '2020-09-14T08:00:00.000Z',
  },
  {
    id: 'team-6-member-2',
    teamId: 'team-6',
    userId: 'user-mariana',
    name: 'Mariana Freitas',
    email: 'mariana.freitas@example.com',
    role: 'Executiva corporativa',
    status: 'active',
    joinedAt: '2021-11-25T10:20:00.000Z',
  },
  {
    id: 'team-6-member-3',
    teamId: 'team-6',
    userId: 'user-bernardo',
    name: 'Bernardo Silva',
    email: 'bernardo.silva@example.com',
    role: 'Consultor de investimentos',
    status: 'active',
    joinedAt: '2023-04-02T15:00:00.000Z',
  },
];

function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function normalizeFilterValue(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function computeStatusCounts(source: Team[]): Record<string, number> {
  return source.reduce<Record<string, number>>((acc, team) => {
    acc[team.status] = (acc[team.status] ?? 0) + 1;
    return acc;
  }, {});
}

function computeCityCounts(source: Team[]): Record<string, number> {
  return source.reduce<Record<string, number>>((acc, team) => {
    if (!team.city) return acc;
    const key = team.city;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function recomputeTeamMembersCount(teamId: string): void {
  const team = TEAMS.find(item => item.id === teamId);
  if (!team) return;

  const members = TEAM_MEMBERS.filter(member => member.teamId === teamId);
  team.membersCount = members.length;
  team.activeMembersCount = members.filter(member => member.status !== 'inactive').length;

  const managerMember = members.find(member => member.isManager);
  if (managerMember) {
    team.managerId = managerMember.userId;
    const managerUser = USERS.find(user => user.id === managerMember.userId);
    team.manager = {
      id: managerMember.userId,
      name: managerUser?.name ?? managerMember.name,
      email: managerUser?.email ?? managerMember.email ?? null,
    };
  } else if (team.managerId) {
    const managerUser = USERS.find(user => user.id === team.managerId);
    team.manager = managerUser
      ? {
          id: managerUser.id,
          name: managerUser.name,
          email: managerUser.email ?? null,
        }
      : null;
  }
}

TEAMS.forEach(team => recomputeTeamMembersCount(team.id));

function applyTeamFilters(teams: Team[], filters: TeamFilters): Team[] {
  let filtered = [...teams];

  if (filters.q) {
    const query = normalizeFilterValue(filters.q);
    filtered = filtered.filter(team => {
      const tokens = [
        team.name,
        team.branch,
        team.city,
        team.state,
        team.manager?.name,
        ...(team.tags ?? []),
      ]
        .filter(Boolean)
        .map(value => normalizeFilterValue(String(value)));

      return tokens.some(token => token.includes(query));
    });
  }

  const cityFilter = Array.isArray(filters.city)
    ? filters.city
    : filters.city
      ? [filters.city]
      : [];

  if (cityFilter.length > 0) {
    const normalized = cityFilter.map(normalizeFilterValue);
    filtered = filtered.filter(team =>
      team.city ? normalized.includes(normalizeFilterValue(team.city)) : false,
    );
  }

  const statusFilter = Array.isArray(filters.status)
    ? filters.status
    : filters.status
      ? [filters.status]
      : [];

  if (statusFilter.length > 0) {
    filtered = filtered.filter(team => statusFilter.includes(team.status));
  }

  const managerFilter = Array.isArray(filters.managerId)
    ? filters.managerId
    : filters.managerId
      ? [filters.managerId]
      : [];

  if (managerFilter.length > 0) {
    const managerSet = new Set(managerFilter);
    filtered = filtered.filter(team => team.managerId && managerSet.has(team.managerId));
  }

  return filtered;
}

function paginateTeams(teams: Team[], page = 1, perPage = 12): Team[] {
  const start = (page - 1) * perPage;
  return teams.slice(start, start + perPage);
}

export function listTeamsMock(filters: TeamFilters = {}): TeamListResponse {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 12;
  const filteredTeams = applyTeamFilters(TEAMS, filters);
  const total = filteredTeams.length;
  const items = paginateTeams(filteredTeams, page, perPage).map(team => deepClone(team));

  return {
    items,
    total,
    page,
    perPage,
    meta: {
      statusCounts: computeStatusCounts(TEAMS),
      cityCounts: computeCityCounts(TEAMS),
    },
  };
}

export function getTeamMock(id: string): Team | undefined {
  const team = TEAMS.find(item => item.id === id);
  return team ? deepClone(team) : undefined;
}

export function createTeamMock(payload: CreateTeamInput): Team {
  const id = `team-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const address = payload.address
    ? {
        street: payload.address.street ?? null,
        number: payload.address.number ?? null,
        complement: payload.address.complement ?? null,
        neighborhood: payload.address.neighborhood ?? null,
        city: payload.address.city ?? null,
        state: payload.address.state ?? null,
        zipCode: payload.address.zipCode ?? null,
      }
    : null;
  const addressCity = address?.city ?? null;
  const addressState = address?.state ?? null;
  const managerUser = payload.managerId
    ? USERS.find(user => user.id === payload.managerId)
    : undefined;
  const team: Team = {
    id,
    name: payload.name,
    type: payload.type ?? null,
    branch: payload.branch ?? null,
    description: payload.description ?? null,
    address,
    city: payload.city ?? addressCity ?? null,
    state: payload.state ?? addressState ?? null,
    status: payload.status ?? 'active',
    managerId: payload.managerId ?? null,
    manager: payload.managerId
      ? managerUser
        ? {
            id: managerUser.id,
            name: managerUser.name,
            email: managerUser.email ?? null,
          }
        : {
            id: payload.managerId,
            name: 'Responsável não identificado',
            email: null,
          }
      : null,
    tags: payload.tags ?? [],
    membersCount: 0,
    activeMembersCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  TEAMS.unshift(team);
  return deepClone(team);
}

export function updateTeamMock(id: string, payload: UpdateTeamInput): Team {
  const team = TEAMS.find(item => item.id === id);
  if (!team) {
    throw new Error('Equipe não encontrada');
  }

  const { address, ...rest } = payload;
  Object.assign(team, rest, { updatedAt: new Date().toISOString() });

  if (address !== undefined) {
    team.address = address
      ? {
          street: address.street ?? team.address?.street ?? null,
          number: address.number ?? team.address?.number ?? null,
          complement: address.complement ?? team.address?.complement ?? null,
          neighborhood: address.neighborhood ?? team.address?.neighborhood ?? null,
          city: address.city ?? team.address?.city ?? null,
          state: address.state ?? team.address?.state ?? null,
          zipCode: address.zipCode ?? team.address?.zipCode ?? null,
        }
      : null;

    if (address?.city !== undefined) {
      team.city = address.city ?? null;
    }
    if (address?.state !== undefined) {
      team.state = address.state ?? null;
    }
  }

  if (payload.city !== undefined) {
    team.city = payload.city ?? null;
  }
  if (payload.state !== undefined) {
    team.state = payload.state ?? null;
  }

  if (payload.managerId !== undefined) {
    if (payload.managerId) {
      team.managerId = payload.managerId;
      const member = TEAM_MEMBERS.find(
        item => item.teamId === id && (item.userId === payload.managerId || item.isManager),
      );
      if (member) {
        team.manager = {
          id: member.userId,
          name: member.name,
          email: member.email ?? null,
        };
      } else {
        const managerUser = USERS.find(user => user.id === payload.managerId);
        team.manager = managerUser
          ? {
              id: managerUser.id,
              name: managerUser.name,
              email: managerUser.email ?? null,
            }
          : {
              id: payload.managerId,
              name: 'Responsável não identificado',
              email: null,
            };
      }
    } else {
      team.managerId = null;
      team.manager = null;
    }
  }

  recomputeTeamMembersCount(id);

  return deepClone(team);
}

export function updateTeamStatusMock(id: string, payload: UpdateTeamStatusInput): Team {
  const team = TEAMS.find(item => item.id === id);
  if (!team) {
    throw new Error('Equipe não encontrada');
  }

  team.status = payload.status;
  team.updatedAt = new Date().toISOString();
  return deepClone(team);
}

export function deleteTeamMock(id: string): void {
  const index = TEAMS.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error('Equipe não encontrada');
  }

  TEAMS.splice(index, 1);

  for (let i = TEAM_MEMBERS.length - 1; i >= 0; i -= 1) {
    if (TEAM_MEMBERS[i]?.teamId === id) {
      TEAM_MEMBERS.splice(i, 1);
    }
  }
}

function applyMemberFilters(members: TeamMember[], filters: TeamMemberFilters): TeamMember[] {
  let filtered = [...members];

  const statusFilter = Array.isArray(filters.status)
    ? filters.status
    : filters.status
      ? [filters.status]
      : [];

  if (statusFilter.length > 0) {
    filtered = filtered.filter(member => statusFilter.includes(member.status));
  }

  const roleFilter = Array.isArray(filters.role)
    ? filters.role
    : filters.role
      ? [filters.role]
      : [];

  if (roleFilter.length > 0) {
    const normalizedRoles = roleFilter.map(normalizeFilterValue);
    filtered = filtered.filter(member =>
      member.role ? normalizedRoles.includes(normalizeFilterValue(member.role)) : false,
    );
  }

  return filtered;
}

export function listTeamMembersMock(
  teamId: string,
  filters: TeamMemberFilters = {},
): TeamMemberListResponse {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 12;

  const members = TEAM_MEMBERS.filter(member => member.teamId === teamId);
  const filtered = applyMemberFilters(members, filters);
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage).map(member => deepClone(member));

  return {
    items,
    total,
    page,
    perPage,
  };
}

export function addTeamMembersMock(teamId: string, payload: TeamMemberInput[]): TeamMemberListResponse {
  const now = new Date().toISOString();
  const existingMembers = TEAM_MEMBERS.filter(member => member.teamId === teamId);
  const existingUserIds = new Set(existingMembers.map(member => member.userId));

  payload.forEach(member => {
    if (existingUserIds.has(member.userId)) {
      return;
    }

    const id = `team-member-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const user = USERS.find(item => item.id === member.userId);
    const entry: TeamMember = {
      id,
      teamId,
      userId: member.userId,
      name: user?.name ?? member.userId,
      email: user?.email ?? null,
      phone: user?.phone ?? null,
      role: member.role ?? null,
      status: member.status ?? 'active',
      isManager: member.isManager ?? false,
      joinedAt: member.joinedAt ?? now,
      tags: member.tags ?? [],
    };
    TEAM_MEMBERS.push(entry);
    existingUserIds.add(member.userId);
  });

  recomputeTeamMembersCount(teamId);

  return listTeamMembersMock(teamId);
}

export function updateTeamMemberMock(
  teamId: string,
  memberId: string,
  payload: UpdateTeamMemberInput,
): TeamMember {
  const member = TEAM_MEMBERS.find(item => item.id === memberId && item.teamId === teamId);
  if (!member) {
    throw new Error('Membro não encontrado');
  }

  Object.assign(member, payload);
  recomputeTeamMembersCount(teamId);
  return deepClone(member);
}

export function removeTeamMemberMock(teamId: string, memberId: string): void {
  const index = TEAM_MEMBERS.findIndex(item => item.id === memberId && item.teamId === teamId);
  if (index === -1) {
    throw new Error('Membro não encontrado');
  }

  TEAM_MEMBERS.splice(index, 1);
  recomputeTeamMembersCount(teamId);
}
