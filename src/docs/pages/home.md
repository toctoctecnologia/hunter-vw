# Home / Dashboard

> Painel principal do Hunter V2 com visão geral de métricas, tarefas e leads

## 1. Objetivo
Fornecer uma visão rápida do estado atual do negócio, com KPIs principais, tarefas pendentes do dia e leads recentes que precisam de atenção.

## 2. Rota
```
/
/dashboard
```

## 3. Permissões
- **Acesso**: Todos os usuários autenticados
- **Dados visíveis**: Filtrados por permissão do usuário (próprios ou da equipe)

## 4. Layout e Seções

### Header
- Saudação personalizada: "Bom dia, [Nome]!"
- Data atual
- Botão de notificações

### Corpo

#### KPIs (Cards de Métricas)
- Leads novos (hoje/semana)
- Visitas agendadas (hoje)
- Propostas ativas
- Negócios fechados (mês)

#### Tarefas do Dia
- Lista compacta das próximas tarefas
- Status visual (pendente, atrasada, concluída)
- Ação rápida: Concluir

#### Leads Recentes
- Últimos leads recebidos
- Status do funil
- Ação rápida: Ver detalhes

#### Agenda Resumida
- Próximos 3 compromissos
- Link para agenda completa

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `KPICard` | `@/components/dashboard/KPICard` | Cards de métricas |
| `TaskListCompact` | `@/components/agenda/TaskListCompact` | Lista de tarefas |
| `LeadCard` | `@/components/leads/LeadCard` | Cards de leads |
| `CalendarWidget` | `@/components/agenda/CalendarWidget` | Mini calendário |

## 6. Estados da Página

### Loading
- Skeleton nos KPI cards
- Shimmer nas listas

### Vazio
- "Você não tem tarefas para hoje"
- "Nenhum lead novo recentemente"

### Erro
- Card de erro com retry

### Sucesso
- Dados carregados e interativos

## 7. Regras de Negócio
1. KPIs são calculados com base no período selecionado (padrão: hoje/mês)
2. Tarefas exibidas são apenas do usuário logado
3. Leads exibidos seguem permissão (próprios ou da equipe se for gestor)
4. Tarefas atrasadas aparecem com destaque visual (borda vermelha)

## 8. Eventos e Ações
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Ver todas as tarefas | Link "Ver mais" | Navega para `/agenda?tab=tasks` |
| Ver todos os leads | Link "Ver mais" | Navega para `/vendas` |
| Concluir tarefa | Checkbox | Atualiza status da tarefa |
| Ver lead | Clique no card | Navega para `/lead-vendas/:id` |

## 9. Contratos de Dados

### DashboardData
```typescript
interface DashboardData {
  kpis: {
    newLeads: number;
    scheduledVisits: number;
    activeProposals: number;
    closedDeals: number;
  };
  todayTasks: Task[];
  recentLeads: Lead[];
  upcomingEvents: CalendarEvent[];
}
```

## 10. Mocks

### Arquivo de Mock
```
src/mocks/dashboard.ts
```

### Flag de Ativação
```typescript
USE_MOCK_DASHBOARD = true
```

## 11. Pontos de Troca para API

### Provider
```
src/modules/dashboard/data/dashboardProvider.ts
```

### Funções
| Função | Mock | API |
|--------|------|-----|
| `getDashboardData()` | `mockDashboard` | `GET /api/dashboard` |
| `getKPIs(period)` | `mockKPIs` | `GET /api/dashboard/kpis` |

## 12. Dependências
- Módulo de Tarefas (tasks)
- Módulo de Leads (leads)
- Módulo de Agenda (calendar)
