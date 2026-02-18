import {
  USERS,
  METRICS,
  SERVICES,
  EVALUATIONS,
  USER_KPI_DETAILS,
  USER_AUDIT_LOGS,
  searchUsers,
  type User,
} from '@/mocks/users';
import {
  LEADS_POR_FONTE,
  LEADS_POR_VENDEDOR,
  ARQUIVADOS_POR_CANAL,
} from '@/mocks/dashboard';
import { mockAuditoria, mockCaptacoes, mockCheckin } from '@/mocks/filas';
import {
  getArchivedLeadsMock,
  importLeadsMock,
  createRedistributionPreview,
  executeRedistributionMock,
} from '@/mocks/redistribution';
import {
  campaignsAnalyticsMock,
  campaignsIntegrationsMock,
} from '@/features/leads/mocks/campaigns.mock';
import { transferLeadOwner } from '@/data/leads/leadsMockService';
import {
  getPropertyReportDetail,
  getReportsPropertiesAggregates,
  getReportsPropertiesList,
} from '@/mocks/reportsProperties';
import {
  addTeamMembersMock,
  createTeamMock,
  deleteTeamMock,
  getTeamMock,
  listTeamMembersMock,
  listTeamsMock,
  removeTeamMemberMock,
  updateTeamMemberMock,
  updateTeamMock,
  updateTeamStatusMock,
} from '@/mocks/teams';
import type { TeamMemberStatus, TeamStatus } from '@/types/teams';
import { IS_MOCK } from './env';

// Helpers exported for tests so that mutations performed here can also be done
// directly within unit tests when running in mocked mode. They simply mutate
// the in-memory USERS array.
export function mockPatchUser(id: string, data: Partial<User>) {
  const user = USERS.find((u) => u.id === id);
  if (user) Object.assign(user, data);
  return user;
}

export function mockPatchUserStatus(id: string, active: boolean) {
  return mockPatchUser(id, { active });
}

export function mockBulkPatchUserStatus(ids: string[], active: boolean) {
  ids.forEach((id) => mockPatchUserStatus(id, active));
}

export function mockLinkImobiliaria(id: string, companyId: string) {
  const user = USERS.find((u) => u.id === id);
  if (user) (user as any).companyId = companyId;
  return user;
}

export function mockResetPassword(id: string) {
  // nothing to do, just return success for consistency
  return id;
}

export async function fetchWithMock(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (typeof input === 'string' && IS_MOCK) {
    console.log('Mock enabled, processing:', input);
    const urlObj = new URL(input, 'http://localhost');
    const { pathname, searchParams } = urlObj;
    const method = init?.method?.toUpperCase() ?? 'GET';
    const parseListParam = (value: string | null) =>
      value
        ? value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : undefined;
    const parseNumberParam = (value: string | null, fallback: number) => {
      if (!value) return fallback;
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? fallback : parsed;
    };

    if (pathname === '/api/teams' && method === 'GET') {
      const data = listTeamsMock({
        q: searchParams.get('q') ?? undefined,
        city: parseListParam(searchParams.get('city')),
        status: parseListParam(searchParams.get('status')) as (TeamStatus[] | undefined),
        managerId: parseListParam(searchParams.get('managerId')),
        page: parseNumberParam(searchParams.get('page'), 1),
        perPage: parseNumberParam(searchParams.get('perPage'), 12),
      });

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/api/teams' && method === 'POST') {
      try {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const team = createTeamMock(body);
        return new Response(JSON.stringify(team), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ message: (error as Error).message ?? 'Falha ao criar equipe' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    const teamMatch = pathname.match(/^\/api\/teams\/([^/]+)$/);
    if (teamMatch) {
      const teamId = decodeURIComponent(teamMatch[1]!);
      if (method === 'GET') {
        const team = getTeamMock(teamId);
        if (!team) {
          return new Response(JSON.stringify({ message: 'Equipe não encontrada' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify(team), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'PATCH') {
        try {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const team = updateTeamMock(teamId, body);
          return new Response(JSON.stringify(team), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ message: (error as Error).message ?? 'Falha ao atualizar equipe' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }

      if (method === 'DELETE') {
        try {
          deleteTeamMock(teamId);
          return new Response(null, { status: 204 });
        } catch (error) {
          return new Response(
            JSON.stringify({ message: (error as Error).message ?? 'Falha ao remover equipe' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }
    }

    const teamStatusMatch = pathname.match(/^\/api\/teams\/([^/]+)\/status$/);
    if (teamStatusMatch && method === 'PATCH') {
      const teamId = decodeURIComponent(teamStatusMatch[1]!);
      try {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const team = updateTeamStatusMock(teamId, body);
        return new Response(JSON.stringify(team), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ message: (error as Error).message ?? 'Falha ao atualizar status' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    const teamMembersMatch = pathname.match(/^\/api\/teams\/([^/]+)\/members$/);
    if (teamMembersMatch) {
      const teamId = decodeURIComponent(teamMembersMatch[1]!);
      if (method === 'GET') {
        const data = listTeamMembersMock(teamId, {
          status: parseListParam(searchParams.get('status')) as (TeamMemberStatus[] | undefined),
          role: parseListParam(searchParams.get('role')),
          page: parseNumberParam(searchParams.get('page'), 1),
          perPage: parseNumberParam(searchParams.get('perPage'), 12),
        });

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'POST') {
        try {
          const body = init?.body ? JSON.parse(init.body as string) : { members: [] };
          const members = Array.isArray(body?.members) ? body.members : [];
          const data = addTeamMembersMock(teamId, members);
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ message: (error as Error).message ?? 'Falha ao adicionar membros' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }
    }

    const teamMemberMatch = pathname.match(/^\/api\/teams\/([^/]+)\/members\/([^/]+)$/);
    if (teamMemberMatch) {
      const teamId = decodeURIComponent(teamMemberMatch[1]!);
      const memberId = decodeURIComponent(teamMemberMatch[2]!);

      if (method === 'PATCH') {
        try {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const member = updateTeamMemberMock(teamId, memberId, body);
          return new Response(JSON.stringify(member), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ message: (error as Error).message ?? 'Falha ao atualizar membro' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }

      if (method === 'DELETE') {
        try {
          removeTeamMemberMock(teamId, memberId);
          return new Response(null, { status: 204 });
        } catch (error) {
          return new Response(
            JSON.stringify({ message: (error as Error).message ?? 'Falha ao remover membro' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }
    }

    if (pathname === '/api/usuarios') {
      const query = searchParams.get('query') ?? searchParams.get('q') ?? '';
      const items = query ? searchUsers(query) : USERS;
      return new Response(
        JSON.stringify({ items, total: items.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/dashboard/leads-por-fonte') {
      return new Response(
        JSON.stringify({ items: LEADS_POR_FONTE, total: LEADS_POR_FONTE.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/dashboard/leads-por-vendedor') {
      return new Response(
        JSON.stringify({ items: LEADS_POR_VENDEDOR, total: LEADS_POR_VENDEDOR.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/dashboard/arquivados-por-canal') {
      const totalGeral = ARQUIVADOS_POR_CANAL.reduce((acc, item) => acc + item.total, 0);
      return new Response(
        JSON.stringify({
          items: ARQUIVADOS_POR_CANAL,
          total: ARQUIVADOS_POR_CANAL.length,
          totalGeral,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/leads/archived' && method === 'GET') {
      try {
        const data = getArchivedLeadsMock({
          search: searchParams.get('search') ?? undefined,
          reason: searchParams.get('reason') ?? undefined,
          owner: searchParams.get('owner') ?? undefined,
          queue: searchParams.get('queue') ?? undefined,
          tag: searchParams.get('tag') ?? undefined,
          startDate: searchParams.get('startDate') ?? undefined,
          endDate: searchParams.get('endDate') ?? undefined,
          status: searchParams.get('status') ?? undefined,
          page: parseInt(searchParams.get('page') ?? '1', 10),
          perPage: parseInt(searchParams.get('perPage') ?? '10', 10),
        });
        console.log('Mock data for /api/leads/archived:', data);
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error in archived leads mock:', error);
        return new Response(JSON.stringify({ items: [], total: 0, reasons: [], owners: [], queues: [], tags: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (pathname === '/api/redistribution/preview' && method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const { selection, destination } = body;
      const { preview } = createRedistributionPreview(selection ?? { type: 'ids', ids: [] }, destination);
      return new Response(JSON.stringify(preview), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/api/redistribution/execute' && method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const { selection, destination, requestedBy } = body;
      const filtersPayload = selection?.filters ?? {};
      const response = executeRedistributionMock(
        selection ?? { type: 'ids', ids: [] },
        destination,
        requestedBy ?? 'Sistema',
        filtersPayload
      );
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/api/leads/import' && method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const response = importLeadsMock(body);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transferMatch = pathname.match(/^\/leads\/([^/]+)\/transfer$/);
    if (transferMatch && method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const leadId = body.leadId ?? transferMatch[1];
      const toUserId = body.toUserId as string | undefined;
      if (!leadId || !toUserId) {
        return new Response(
          JSON.stringify({ message: 'Dados de transferência inválidos.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const targetUser = USERS.find(user => user.id === toUserId);
      const updatedLead = transferLeadOwner(
        leadId,
        toUserId,
        targetUser?.name ?? ''
      );

      if (!updatedLead) {
        return new Response(
          JSON.stringify({ message: 'Lead não encontrado.' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const message = targetUser
        ? `Lead transferido para ${targetUser.name}`
        : 'Lead transferido com sucesso';

      return new Response(
        JSON.stringify({ lead: updatedLead, message }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/analytics/campaigns') {
      return new Response(JSON.stringify(campaignsAnalyticsMock), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/integrations/campaigns') {
      return new Response(JSON.stringify(campaignsIntegrationsMock), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/api/distribuicao/auditoria') {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const perPage = parseInt(searchParams.get('perPage') || '10', 10);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      return new Response(
        JSON.stringify({ items: mockAuditoria.slice(start, end), total: mockAuditoria.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/distribuicao/captacoes') {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const perPage = parseInt(searchParams.get('perPage') || '10', 10);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      return new Response(
        JSON.stringify({ items: mockCaptacoes.slice(start, end), total: mockCaptacoes.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/distribuicao/checkin') {
      return new Response(JSON.stringify(mockCheckin), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/api/reports/properties' && method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const { items, total } = getReportsPropertiesList({
        filters: body.filters ?? {},
        page: body.page ?? 1,
        pageSize: body.pageSize ?? 25,
        sort: body.sort,
      });

      return new Response(JSON.stringify({ items, total }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/api/reports/properties/aggregates' && method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const payload = getReportsPropertiesAggregates({
        filters: body.filters ?? {},
      });

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const propertyDetailMatch = pathname.match(/^\/api\/reports\/properties\/(\d+)\/detail$/);
    if (propertyDetailMatch && method === 'GET') {
      const id = Number(propertyDetailMatch[1]);
      const detail = getPropertyReportDetail(id);
      if (!detail) {
        return new Response(JSON.stringify({ message: 'Imóvel não encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ detail }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const checkoutMatch = pathname.match(/^\/api\/distribuicao\/checkin\/([^/]+)\/force-checkout$/);
    if (checkoutMatch && method === 'POST') {
      const [, userId] = checkoutMatch;
      const user = mockCheckin.find(u => u.usuarioId === userId);
      if (user) {
        user.status = 'offline';
        user.ultimoCheckout = new Date().toISOString();
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // bulk operations
    const exportMatch = pathname.match(/^\/api\/reports\/([^/]+)\/export$/);
    if (exportMatch && method === 'POST') {
      const [, dataset] = exportMatch;
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const selection = Array.isArray(body?.metadata?.selection) ? body.metadata.selection : [];
      const totalRows = typeof body?.metadata?.totalRows === 'number' ? body.metadata.totalRows : 0;
      const format = typeof body?.format === 'string' ? body.format : 'csv';
      const summary = `Exportação de ${dataset}\nFormato: ${format}\nSelecionados: ${selection.length}\nTotal estimado: ${totalRows}`;
      const base64 = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(summary))) : undefined;

      if (selection.length > 0 && base64) {
        return new Response(JSON.stringify({
          content: base64,
          contentType: 'text/plain',
          fileName: `${dataset}-selecionados.${format === 'pdf' ? 'pdf' : format}`,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        jobId: `job-${Date.now()}`,
        centerUrl: '/downloads/relatorios',
        message: 'Sua exportação foi agendada e estará disponível na Central de Downloads em instantes.',
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if ((pathname === '/api/usuarios/bulk/status' || pathname === '/api/usuarios/status') && method !== 'GET') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const { userIds = [], active } = body;
      mockBulkPatchUserStatus(userIds, active);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const match = pathname.match(/^\/api\/usuarios\/([^/]+)(?:\/([^/]+))?/);
    if (match) {
      const [, id, resource] = match;
      // profile update
      if (!resource && method === 'PATCH') {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const updated = mockPatchUser(id, body);
        return new Response(JSON.stringify(updated), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (!resource) {
        const user = USERS.find(u => u.id === id);
        return new Response(JSON.stringify(user), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (resource === 'status' && method === 'PATCH') {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        mockPatchUserStatus(id, body.active);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (resource === 'reset-password' && method === 'POST') {
        mockResetPassword(id);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (resource === 'link-imobiliaria' && method === 'POST') {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        mockLinkImobiliaria(id, body.companyId ?? body.imobiliariaId);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (resource === 'metrics') {
        const detailed = USER_KPI_DETAILS[id];
        if (detailed) {
          return new Response(JSON.stringify(detailed), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const metric = METRICS.find(m => m.userId === id) ?? {};
        return new Response(JSON.stringify(metric), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (resource === 'services') {
        const services = SERVICES.filter(s => s.userId === id);
        return new Response(JSON.stringify(services), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (resource === 'evaluations') {
        const evaluations = EVALUATIONS.filter(e => e.userId === id);
        return new Response(JSON.stringify(evaluations), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (resource === 'audit') {
        const events = USER_AUDIT_LOGS[id] ?? [];
        return new Response(JSON.stringify(events), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Billing endpoints
    if (pathname === '/billing/plans') {
      const mockPlans = [
        { id: 'basic', name: 'Básico', price: 99.90, description: 'Plano básico para pequenos negócios' },
        { id: 'professional', name: 'Profissional', price: 199.90, description: 'Plano profissional para empresas médias' },
        { id: 'enterprise', name: 'Enterprise', price: 399.90, description: 'Plano empresarial para grandes empresas' }
      ];
      return new Response(JSON.stringify(mockPlans), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/billing/summary') {
      const mockSummary = {
        currentPlan: 'Profissional',
        monthlyCost: 199.90,
        nextInvoiceDate: '2024-01-15',
        outstandingBalance: 0,
        couponCode: null,
        couponDiscount: 0
      };
      return new Response(JSON.stringify(mockSummary), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/billing/usage') {
      const mockUsage = {
        period: 'Dezembro 2023',
        metrics: [
          { label: 'Usuários ativos', value: 15, limit: 25, unit: 'usuários' },
          { label: 'Leads processados', value: 1250, limit: 2000, unit: 'leads' },
          { label: 'Armazenamento', value: 5.2, limit: 10, unit: 'GB' }
        ]
      };
      return new Response(JSON.stringify(mockUsage), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/billing/invoices') {
      const mockInvoices = [
        { id: '1', number: 'INV-2023-001', amount: 199.90, dueDate: '2023-12-15', status: 'paid', url: '#' },
        { id: '2', number: 'INV-2023-002', amount: 199.90, dueDate: '2024-01-15', status: 'open', url: '#' }
      ];
      return new Response(JSON.stringify(mockInvoices), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/billing/payment-methods') {
      const mockMethods = [
        { id: '1', type: 'card', last4: '1234', brand: 'visa', holder: 'João Silva', createdAt: '2023-01-15', status: 'verified' }
      ];
      return new Response(JSON.stringify(mockMethods), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/billing/fiscal-data') {
      const mockFiscalData = {
        companyName: 'Empresa Exemplo Ltda',
        cnpj: '12.345.678/0001-90',
        cep: '01234-567',
        address: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        emails: ['contato@empresa.com.br']
      };
      return new Response(JSON.stringify(mockFiscalData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/billing/manual-payment') {
      const mockInstructions = {
        bank: 'Banco Exemplo',
        agency: '1234',
        account: '56789-0',
        pixKey: 'contato@empresa.com.br',
        message: 'Informar número da fatura no comprovante'
      };
      return new Response(JSON.stringify(mockInstructions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  }

  // If we get here and mocking is enabled, return a 404 instead of fetching
  if (IS_MOCK && typeof input === 'string') {
    console.log('No mock found for:', input);
    return new Response(JSON.stringify({ error: 'Mock not implemented for this endpoint' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return fetch(input, init);
}

export default fetchWithMock;
