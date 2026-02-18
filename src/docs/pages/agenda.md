# Agenda

> Gestão de tarefas e calendário integrado

## 1. Objetivo
Centralizar todas as atividades agendadas (tarefas, visitas, compromissos) em uma interface unificada com visualização em lista e calendário.

## 2. Rotas
```
/agenda - Página principal (tabs)
/agenda?tab=tasks - Aba de tarefas
/agenda?tab=calendar - Aba de calendário
/agenda/agendar - Criar novo evento
/agenda/novo - Alias para criar
```

## 3. Permissões
- **Usuário**: Próprias tarefas
- **Gestor**: Tarefas da equipe
- **Admin**: Todas as tarefas

## 4. Layout e Seções

### Header
- Título: "Agenda"
- Tabs: Tarefas | Agenda
- Botão: "+ Nova Tarefa"

### Aba Tarefas

#### Filtros
- SearchBar
- Escopo: Hoje | Esta semana | Futuras | Atrasadas
- Filtro por tipo (visita, ligação, etc.)
- Filtro por status

#### Lista de Tarefas
- Cards de tarefa agrupados por data
- Status visual (pendente, concluída, atrasada)
- Ação rápida: Concluir

#### Seção Concluídas
- Toggle para mostrar/ocultar
- Lista colapsável de tarefas concluídas

### Aba Calendário

#### Controles
- Navegação: Mês anterior/próximo
- Visão: Mês | Semana | Dia
- Filtros por tipo

#### Calendário
- Grid de dias com eventos
- Cores por tipo de evento
- Clique para ver detalhes

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `TarefasTab` | `@/components/agenda/Task/TarefasTab` | Aba de tarefas |
| `AgendaCalendar` | `@/components/agenda/AgendaCalendar` | Calendário |
| `TaskCard` | `@/components/agenda/TaskCard` | Card de tarefa |
| `TaskForm` | `@/components/agenda/TaskForm` | Formulário |
| `DateRangePicker` | `@/components/ui/date-range-picker` | Seletor de datas |

## 6. Estados

### Tarefas
- **Loading**: Skeleton de cards
- **Vazio**: "Nenhuma tarefa encontrada" + CTA
- **Atrasadas**: Destaque visual (borda vermelha)
- **Concluídas**: Seção colapsável com estilo muted

### Calendário
- **Loading**: Shimmer no grid
- **Dia sem eventos**: Célula vazia
- **Dia com eventos**: Dots coloridos

## 7. Regras de Negócio
1. Tarefa atrasada = data anterior a hoje e status não concluído
2. Tarefa pode ter múltiplos lembretes
3. Tarefa pode ser vinculada a lead e/ou imóvel
4. Concluir tarefa registra data de conclusão
5. Reagendar preserva histórico original
6. Tarefa cancelada não pode ser reaberta

## 8. Eventos e Ações

### Lista de Tarefas
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Criar tarefa | "+ Nova Tarefa" | Abre formulário |
| Concluir | Checkbox | Marca como done |
| Ver detalhes | Clique no card | Abre detalhe |
| Reagendar | Botão reagendar | Abre date picker |
| Cancelar | Menu "..." | Confirmação |

### Calendário
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Navegar mês | Setas | Muda período |
| Criar evento | Clique em dia | Abre form com data |
| Ver evento | Clique em evento | Abre detalhe |

## 9. Contratos de Dados

### Task
```typescript
interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  dueAt: string; // ISO datetime
  durationMin?: number;
  location?: string;
  notes?: string;
  leadId?: string;
  lead?: LeadLite;
  propertyId?: string;
  property?: PropertyLite;
  reminders: TaskReminder[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

type TaskType = 
  | 'call'
  | 'visit'
  | 'email'
  | 'whatsapp'
  | 'follow-up'
  | 'document'
  | 'appointment'
  | 'other';

type TaskStatus = 'todo' | 'done' | 'cancelled';

interface TaskReminder {
  id: string;
  remindAt: string;
}
```

### CalendarEvent
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  startAt: string;
  endAt?: string;
  allDay: boolean;
  color?: string;
  leadId?: string;
}
```

## 10. Mocks

### Arquivos
```
src/mocks/tasks.ts
src/mocks/calendar.ts
```

### Flag
```typescript
USE_MOCK_TASKS = true
USE_MOCK_CALENDAR = true
```

### Dados Mock
- 15 tarefas pendentes (diferentes datas)
- 5 tarefas atrasadas
- 10 tarefas concluídas
- 8 eventos de calendário

## 11. Pontos de Troca para API

### Provider
```
src/modules/agenda/data/agendaProvider.ts
```

### Funções
| Função | Descrição |
|--------|-----------|
| `listTasks(filters)` | Lista com filtros |
| `getTaskById(id)` | Detalhe da tarefa |
| `createTask(data)` | Criar tarefa |
| `updateTask(id, data)` | Atualizar |
| `completeTask(id)` | Marcar concluída |
| `rescheduleTask(id, newDate)` | Reagendar |
| `getCalendarEvents(start, end)` | Eventos do período |

## 12. Dependências
- Módulo de Leads (vínculo opcional)
- Módulo de Imóveis (vínculo opcional)
- Módulo de Notificações (lembretes)
