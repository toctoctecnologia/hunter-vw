export type TeamStatus = 'active' | 'inactive' | 'expansion';

export type TeamType = 'regional' | 'especializada' | 'parceria' | 'apoio';

export interface TeamAddress {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface TeamManagerSummary {
  id: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface Team {
  id: string;
  name: string;
  type?: TeamType | null;
  branch?: string | null;
  description?: string | null;
  address?: TeamAddress | null;
  city?: string | null;
  state?: string | null;
  status: TeamStatus;
  managerId?: string | null;
  manager?: TeamManagerSummary | null;
  tags?: string[];
  membersCount: number;
  activeMembersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamFilters {
  q?: string;
  city?: string | string[];
  status?: TeamStatus | TeamStatus[];
  managerId?: string | string[];
  page?: number;
  perPage?: number;
}

export interface TeamListMeta {
  statusCounts?: Partial<Record<TeamStatus, number>>;
  cityCounts?: Record<string, number>;
  managerCounts?: Record<string, number>;
}

export interface TeamListResponse {
  items: Team[];
  total: number;
  page: number;
  perPage: number;
  meta?: TeamListMeta;
}

export interface CreateTeamInput {
  name: string;
  type?: TeamType | null;
  branch?: string | null;
  description?: string | null;
  address?: TeamAddress | null;
  city?: string | null;
  state?: string | null;
  status?: TeamStatus;
  managerId?: string | null;
  tags?: string[];
}

export type UpdateTeamInput = Partial<CreateTeamInput>;

export interface UpdateTeamStatusInput {
  status: TeamStatus;
  reason?: string | null;
}

export type TeamMemberStatus = 'active' | 'inactive';

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  status: TeamMemberStatus;
  isManager?: boolean;
  joinedAt?: string | null;
  avatarUrl?: string | null;
  tags?: string[];
}

export interface TeamMemberFilters {
  status?: TeamMemberStatus | TeamMemberStatus[];
  role?: string | string[];
  page?: number;
  perPage?: number;
}

export interface TeamMemberListResponse {
  items: TeamMember[];
  total: number;
  page: number;
  perPage: number;
}

export interface TeamMemberInput {
  userId: string;
  role?: string | null;
  status?: TeamMemberStatus;
  isManager?: boolean;
  joinedAt?: string | null;
  tags?: string[];
}

export type UpdateTeamMemberInput = Partial<TeamMemberInput>;
