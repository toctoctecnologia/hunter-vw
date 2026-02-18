import type { ComponentType, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { addDays, endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlarmClock,
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Flag,
  Home,
  ListChecks,
  Search,
  Star,
  Tag,
  User2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useAgendaStore } from '@/hooks/agenda/useAgendaStore';
import { getLeadDetailPath } from '@/lib/routes/leads';
import { cn } from '@/lib/utils';
import type { AgendaTask } from '@/types/agenda';
import {
  USE_MOCK_TASKS,
  agendaLeadsMock,
  agendaNegotiationsMock,
  agendaTasksMock
} from '@/data/agendaMockData';

type TaskScope = 'today' | 'overdue' | 'future' | 'all' | 'completed';

interface TarefasTabProps {
  date: Date;
  type?: AgendaTask['type'];
  leadId?: string;
  showForm?: boolean;
  onShowFormChange?: (open: boolean) => void;
}

interface HydratedTask extends AgendaTask {
  lead?: typeof agendaLeadsMock[number];
  negotiation?: typeof agendaNegotiationsMock[number];
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const TASK_TYPE_LABEL: Record<string, string> = {
  callback: 'Retornar para o cliente',
  visit: 'Visita agendada',
  'follow-up': 'Follow up',
  document: 'Documento',
  appointment: 'Compromisso',
  message: 'Mensagem',
  call: 'Ligação',
  email: 'Email',
  proposta: 'Proposta',
  tarefa: 'Tarefa',
  other: 'Tarefa'
};

const TASK_STAGE_LABEL: Record<NonNullable<AgendaTask['stage']>, string> = {
  agendamento: 'Agendamento',
  visita: 'Visita',
  proposta: 'Proposta'
};

const scopeOptions: { id: TaskScope; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'today', label: 'A fazer hoje', icon: Home },
  { id: 'overdue', label: 'Atrasadas', icon: CalendarDays },
  { id: 'future', label: 'Futuras ações', icon: AlarmClock },
  { id: 'all', label: 'Todas', icon: ListChecks },
  { id: 'completed', label: 'Concluídas', icon: BadgeCheck }
];

const isCompleted = (task: AgendaTask) => task.done || task.status === 'done';

const formatDueLabel = (dueAt: string) => {
  const date = new Date(dueAt);
  return `${format(date, "dd MMM", { locale: ptBR })} · ${format(date, 'HH:mm')}`;
};

const TaskBadge = ({ icon: Icon, children }: { icon: ComponentType<{ className?: string }>; children: ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
    <Icon className="h-3.5 w-3.5" />
    {children}
  </span>
);

const SectionHeader = ({
  title,
  description,
  count,
  icon: Icon
}: {
  title: string;
  description: string;
  count: number;
  icon: ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">{title}</p>
      <span className="text-sm font-medium text-muted-foreground">{description}</span>
    </div>
    <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-foreground">
      <Icon className="h-4 w-4 text-orange-500" />
      {count} tarefas
    </div>
  </div>
);

export function TarefasTab({ leadId }: TarefasTabProps) {
  const { tasks: storeTasks, setDone } = useAgendaStore();
  const navigate = useNavigate();
  const [tasksState, setTasksState] = useState<AgendaTask[]>(() =>
    USE_MOCK_TASKS ? agendaTasksMock : storeTasks
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [responsibleFilter, setResponsibleFilter] = useState<string[]>([]);
  const [responsibleSearch, setResponsibleSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [teamSearch, setTeamSearch] = useState('');
  const [taskScope, setTaskScope] = useState<TaskScope>('today');
  const [stageFilter, setStageFilter] = useState<NonNullable<AgendaTask['stage']>[]>([]);
  const [showCompletedSection, setShowCompletedSection] = useState(true);
  const [selectedTask, setSelectedTask] = useState<HydratedTask | null>(null);
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(normalizeText(searchTerm));
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!USE_MOCK_TASKS) {
      setTasksState(storeTasks);
    }
  }, [storeTasks]);

  const leadsById = useMemo(
    () =>
      agendaLeadsMock.reduce<Record<string, (typeof agendaLeadsMock)[number]>>((acc, lead) => {
        acc[lead.leadId] = lead;
        return acc;
      }, {}),
    []
  );

  const negotiationsById = useMemo(
    () =>
      agendaNegotiationsMock.reduce<Record<string, (typeof agendaNegotiationsMock)[number]>>((acc, negotiation) => {
        acc[negotiation.negotiationId] = negotiation;
        return acc;
      }, {}),
    []
  );

  const hydratedTasks: HydratedTask[] = useMemo(
    () =>
      tasksState.map(task => ({
        ...task,
        lead: task.leadId ? leadsById[task.leadId] : undefined,
        negotiation: task.negotiationId ? negotiationsById[task.negotiationId] : undefined
      })),
    [leadsById, negotiationsById, tasksState]
  );

  const tasks = useMemo(
    () => (leadId ? hydratedTasks.filter(task => task.leadId === leadId) : hydratedTasks),
    [hydratedTasks, leadId]
  );

  const availableResponsibles = useMemo(
    () =>
      Array.from(
        new Set(
          tasks
            .map(task => task.ownerName || task.responsible)
            .filter(Boolean) as string[]
        )
      ),
    [tasks]
  );
  const availableTeams = useMemo(
    () =>
      Array.from(
        new Set(
          tasks
            .map(task => task.team)
            .filter(Boolean) as string[]
        )
      ),
    [tasks]
  );

  useEffect(() => {
    if (taskScope === 'completed') {
      setShowCompletedSection(true);
    }
  }, [taskScope]);

  const matchesSearch = (task: HydratedTask) => {
    if (!debouncedSearch) return true;
    const compactQuery = debouncedSearch.replace(/\s+/g, '');
    const candidates = [
      task.title,
      task.description,
      task.notes,
      task.source,
      task.ownerName,
      task.type,
      task.lead?.leadName,
      task.lead?.productOrServiceTitle,
      task.lead?.interestSummary
    ].filter(Boolean) as string[];

    return candidates.some(value => {
      const normalized = normalizeText(value);
      const compactValue = normalized.replace(/\s+/g, '');
      return normalized.includes(debouncedSearch) || compactValue.includes(compactQuery);
    });
  };

  const matchesScope = (task: AgendaTask) => {
    if (taskScope === 'today') return task.status === 'today';
    if (taskScope === 'overdue') return task.status === 'overdue';
    if (taskScope === 'future') return task.status === 'future';
    if (taskScope === 'completed') return isCompleted(task);
    return true;
  };

  const filteredTasks = useMemo(() => {
    const includeCompleted = taskScope === 'completed' || taskScope === 'all';
    return tasks.filter(task => {
      if (!matchesSearch(task)) return false;
      const dueDate = new Date(task.dueAt);
      if (dateRange?.start && dateRange?.end) {
        const start = startOfDay(new Date(dateRange.start));
        const end = endOfDay(new Date(dateRange.end));
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        if (!isWithinInterval(dueDate, { start, end })) return false;
      }
      if (!includeCompleted && isCompleted(task)) return false;
      if (responsibleFilter.length > 0) {
        const owner = task.ownerName || task.responsible;
        if (!owner || !responsibleFilter.includes(owner)) return false;
      }
      if (teamFilter.length > 0) {
        if (!task.team || !teamFilter.includes(task.team)) return false;
      }
      if (stageFilter.length > 0) {
        if (!task.stage || !stageFilter.includes(task.stage)) return false;
      }
      if (!matchesScope(task)) return false;
      return true;
    });
  }, [tasks, dateRange, responsibleFilter, taskScope, debouncedSearch, teamFilter, stageFilter]);

  const scopeCounts = useMemo<Record<TaskScope, number>>(() => {
    const baseList = tasks.filter(task => {
      if (!matchesSearch(task)) return false;
      if (dateRange?.start && dateRange?.end) {
        const start = startOfDay(new Date(dateRange.start));
        const end = endOfDay(new Date(dateRange.end));
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        if (!isWithinInterval(new Date(task.dueAt), { start, end })) return false;
      }
      if (responsibleFilter.length > 0) {
        const owner = task.ownerName || task.responsible;
        if (!owner || !responsibleFilter.includes(owner)) return false;
      }
      if (teamFilter.length > 0) {
        if (!task.team || !teamFilter.includes(task.team)) return false;
      }
      if (stageFilter.length > 0) {
        if (!task.stage || !stageFilter.includes(task.stage)) return false;
      }
      return true;
    });

    return {
      today: baseList.filter(t => t.status === 'today').length,
      overdue: baseList.filter(t => t.status === 'overdue').length,
      future: baseList.filter(t => t.status === 'future').length,
      all: baseList.length,
      completed: baseList.filter(t => isCompleted(t)).length
    };
  }, [tasks, dateRange, responsibleFilter, debouncedSearch, teamFilter, stageFilter]);

  const todayTasks = filteredTasks.filter(task => task.status === 'today');
  const overdueTasks = filteredTasks.filter(task => task.status === 'overdue');
  const futureTasks = filteredTasks.filter(task => task.status === 'future');
  const completedTasks = filteredTasks.filter(task => isCompleted(task));
  const showTodaySection = taskScope === 'all' || taskScope === 'today';
  const showFutureSection = taskScope === 'all' || taskScope === 'future';
  const showOverdueSection = taskScope === 'all' || taskScope === 'overdue';
  const showCompleted = taskScope === 'completed' || taskScope === 'all';

  const taskFiltersCount =
    (dateRange ? 1 : 0) +
    (responsibleFilter.length ? 1 : 0) +
    (teamFilter.length ? 1 : 0) +
    (stageFilter.length ? 1 : 0);

  const toggleResponsible = (owner: string) => {
    setResponsibleFilter(prev =>
      prev.includes(owner) ? prev.filter(item => item !== owner) : [...prev, owner]
    );
  };
  const toggleTeam = (team: string) => {
    setTeamFilter(prev =>
      prev.includes(team) ? prev.filter(item => item !== team) : [...prev, team]
    );
  };
  const toggleStage = (stage: NonNullable<AgendaTask['stage']>) => {
    setStageFilter(prev =>
      prev.includes(stage) ? prev.filter(item => item !== stage) : [...prev, stage]
    );
  };

  const filteredResponsibles = useMemo(() => {
    if (!responsibleSearch) return availableResponsibles;
    const normalized = normalizeText(responsibleSearch);
    return availableResponsibles.filter(owner => normalizeText(owner).includes(normalized));
  }, [availableResponsibles, responsibleSearch]);
  const filteredTeams = useMemo(() => {
    if (!teamSearch) return availableTeams;
    const normalized = normalizeText(teamSearch);
    return availableTeams.filter(team => normalizeText(team).includes(normalized));
  }, [availableTeams, teamSearch]);

  const dateRangeLabel = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) return 'Selecionar período';
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Selecionar período';
    const sameMonth = start.getMonth() === end.getMonth();
    return `${format(start, "dd 'de' MMM", { locale: ptBR })} - ${format(end, sameMonth ? "dd" : "dd 'de' MMM", { locale: ptBR })}`;
  }, [dateRange]);

  const handleComplete = (task: AgendaTask) => {
    const dueDate = startOfDay(new Date(task.dueAt));
    const today = startOfDay(new Date());
    const nextStatus: AgendaTask['status'] = dueDate.getTime() < today.getTime() ? 'overdue' : dueDate.getTime() > today.getTime() ? 'future' : 'today';

    const updated = tasksState.map(t =>
      t.id === task.id ? { ...t, done: !t.done, status: (!t.done ? 'done' : nextStatus) as AgendaTask['status'] } : t
    );
    setTasksState(updated);
    setDone(task.id, !task.done);
  };

  const handleNavigateToLead = (task: HydratedTask) => {
    if (!task.leadId && !task.lead?.leadId) {
      setSelectedTask(task);
      return;
    }
    const targetLead = task.leadId || task.lead?.leadId;
    if (!targetLead) return;
    const params = new URLSearchParams({ tab: 'tarefas', taskId: task.id.toString() });
    navigate(`${getLeadDetailPath(targetLead)}?${params.toString()}`);
  };

  const handleNavigateNegotiation = (negotiationId?: string) => {
    if (!negotiationId) return;
    navigate(`/vendas?negotiationId=${negotiationId}`);
  };

  const rescheduleTask = (task: AgendaTask) => {
    if (task.type === 'follow-up') return;
    const currentDate = new Date(task.dueAt);
    const nextDate = addDays(currentDate, 1);
    const todayStart = startOfDay(new Date());
    const nextStatus: AgendaTask['status'] = startOfDay(nextDate).getTime() > todayStart.getTime() ? 'future' : 'today';
    const updatedTasks = tasksState.map(t =>
      t.id === task.id
        ? { ...t, dueAt: nextDate.toISOString(), status: nextStatus, done: false }
        : t
    );
    setTasksState(updatedTasks);
    setDone(task.id, false);
  };

  const TaskCard = ({ task }: { task: HydratedTask }) => {
    const hasLead = Boolean(task.leadId || task.lead);
    const leadName = task.lead?.leadName;
    const priorityColor = task.priorityColor || task.color || 'hsl(var(--accent))';
    const cardTitle = hasLead && leadName ? `${task.title}, ${leadName}` : task.title;
    const description = task.description || task.notes;

    return (
      <div
        data-task-id={task.id}
        role="button"
        tabIndex={0}
        onClick={() => handleNavigateToLead(task)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNavigateToLead(task);
          }
        }}
        className="flex gap-4 rounded-3xl border border-border bg-surface2 p-5 shadow-sm transition hover:border-orange-500/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <div className="flex flex-col items-center pt-1">
          <Checkbox
            checked={isCompleted(task)}
            onCheckedChange={() => handleComplete(task)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 border-border"
          />
          <span
            className="mt-3 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: priorityColor }}
            aria-label="Prioridade"
          />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                {TASK_TYPE_LABEL[task.type] || 'Tarefa'}
              </p>
              <h3 className={cn('text-lg font-semibold text-foreground', isCompleted(task) && 'text-muted-foreground line-through')}>
                {cardTitle}
              </h3>
              {hasLead && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{task.lead?.productOrServiceTitle}</span>
                {task.lead?.productOrServiceTitle && task.lead?.interestSummary && ' · '}
                {task.lead?.interestSummary}
              </p>
            )}
            {task.stage && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="rounded-full bg-orange-50 text-orange-700">
                  {TASK_STAGE_LABEL[task.stage]}
                </Badge>
                {task.stageDescription && <span className="text-foreground">{task.stageDescription}</span>}
                {task.qualifications && task.qualifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {task.qualifications.map(item => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="rounded-full border-dashed text-xs text-muted-foreground"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!hasLead && description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
              {task.type === 'proposta' && description && (
                <div className="rounded-xl bg-surface px-3 py-2">
                  <p className="text-xs font-semibold text-muted-foreground">Descrição</p>
                  <p className="text-sm text-foreground">{description}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-sm font-medium text-muted-foreground">
              <Clock3 className="h-4 w-4 text-orange-500" />
              <span>{formatDueLabel(task.dueAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TaskBadge icon={CalendarClock}>{format(new Date(task.dueAt), "dd 'de' MMMM", { locale: ptBR })}</TaskBadge>
            <TaskBadge icon={Tag}>{TASK_TYPE_LABEL[task.type] || task.type}</TaskBadge>
            {task.origin && <TaskBadge icon={Tag}>Origem: {task.origin}</TaskBadge>}
            {task.channel && <TaskBadge icon={Flag}>Canal: {task.channel}</TaskBadge>}
            {task.ownerName && <TaskBadge icon={User2}>Resp.: {task.ownerName}</TaskBadge>}
            {task.lead?.origin && <TaskBadge icon={Tag}>{task.lead.origin}</TaskBadge>}
            {task.negotiationId && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-dashed"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateNegotiation(task.negotiationId);
                }}
              >
                Ver negociação
              </Button>
            )}
            {task.isFavorite && (
              <Badge variant="secondary" className="flex items-center gap-1 rounded-full">
                <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                Favorito
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={task.type === 'follow-up'}
              onClick={(e) => {
                e.stopPropagation();
                rescheduleTask(task);
              }}
            >
              Reagendar para amanhã
            </Button>
            {task.type === 'follow-up' && (
              <span className="text-xs text-muted-foreground">
                Follow-ups precisam de contato para serem remarcados.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-surface2 px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface">
        <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface2 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2 shadow-inner">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas por lead, título, descrição, origem, responsável ou tipo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 border-0 bg-transparent p-0 text-base focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-full border-border bg-surface px-5 text-sm font-semibold">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                    {taskFiltersCount > 0 && (
                      <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                        {taskFiltersCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] rounded-2xl border border-border bg-surface2 shadow-lg z-50 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Período</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => setDateRange(null)}
                        >
                          Limpar
                        </Button>
                      </div>
                      <div className="rounded-xl border border-border bg-surface p-3">
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-between rounded-xl border-border bg-surface text-left font-semibold"
                          onClick={() => setDateRangeDialogOpen(true)}
                        >
                          <span className="text-sm text-foreground">{dateRangeLabel}</span>
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">Use o seletor para escolher rapidamente o intervalo.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Responsável</p>
                      <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
                        <div className="flex items-center gap-2 rounded-lg bg-surface2 px-3 py-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar responsável"
                            value={responsibleSearch}
                            onChange={(e) => setResponsibleSearch(e.target.value)}
                            className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                          />
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {filteredResponsibles.map(owner => (
                            <label
                              key={owner}
                              className={cn(
                                'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition',
                                responsibleFilter.includes(owner)
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'hover:bg-surface2 text-foreground'
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <Checkbox
                                  checked={responsibleFilter.includes(owner)}
                                  onCheckedChange={() => toggleResponsible(owner)}
                                />
                                {owner}
                              </span>
                              {responsibleFilter.includes(owner) && (
                                <Badge variant="secondary" className="rounded-full bg-orange-100 text-orange-700">
                                  Selecionado
                                </Badge>
                              )}
                            </label>
                          ))}
                          {filteredResponsibles.length === 0 && (
                            <p className="text-xs text-muted-foreground">Nenhum responsável encontrado</p>
                          )}
                        </div>
                        {responsibleFilter.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {responsibleFilter.map(owner => (
                              <Badge
                                key={owner}
                                variant="secondary"
                                className="flex items-center gap-1 rounded-full bg-orange-50 text-orange-700"
                              >
                                {owner}
                                <button
                                  type="button"
                                  className="text-xs text-orange-600 hover:text-orange-700"
                                  onClick={() => toggleResponsible(owner)}
                                  aria-label={`Remover ${owner}`}
                                >
                                  ✕
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Equipe</p>
                      <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
                        <div className="flex items-center gap-2 rounded-lg bg-surface2 px-3 py-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar equipe"
                            value={teamSearch}
                            onChange={(e) => setTeamSearch(e.target.value)}
                            className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                          />
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {filteredTeams.map(team => (
                            <label
                              key={team}
                              className={cn(
                                'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition',
                                teamFilter.includes(team)
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'hover:bg-surface2 text-foreground'
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <Checkbox
                                  checked={teamFilter.includes(team)}
                                  onCheckedChange={() => toggleTeam(team)}
                                />
                                {team}
                              </span>
                              {teamFilter.includes(team) && (
                                <Badge variant="secondary" className="rounded-full bg-orange-100 text-orange-700">
                                  Selecionado
                                </Badge>
                              )}
                            </label>
                          ))}
                          {filteredTeams.length === 0 && (
                            <p className="text-xs text-muted-foreground">Nenhuma equipe encontrada</p>
                          )}
                        </div>
                        {teamFilter.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {teamFilter.map(team => (
                              <Badge
                                key={team}
                                variant="secondary"
                                className="flex items-center gap-1 rounded-full bg-orange-50 text-orange-700"
                              >
                                {team}
                                <button
                                  type="button"
                                  className="text-xs text-orange-600 hover:text-orange-700"
                                  onClick={() => toggleTeam(team)}
                                  aria-label={`Remover ${team}`}
                                >
                                  ✕
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Etapa</p>
                      <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
                        {(['agendamento', 'visita', 'proposta'] as NonNullable<AgendaTask['stage']>[]).map(stage => (
                          <label
                            key={stage}
                            className={cn(
                              'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition',
                              stageFilter.includes(stage)
                                ? 'bg-orange-50 text-orange-700'
                                : 'hover:bg-surface2 text-foreground'
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <Checkbox
                                checked={stageFilter.includes(stage)}
                                onCheckedChange={() => toggleStage(stage)}
                              />
                              {TASK_STAGE_LABEL[stage]}
                            </span>
                            {stageFilter.includes(stage) && (
                              <Badge variant="secondary" className="rounded-full bg-orange-100 text-orange-700">
                                Selecionado
                              </Badge>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {scopeOptions.map(scope => (
              <button
                key={scope.id}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap shadow-[0_1px_0_rgba(0,0,0,0.03)]',
                  taskScope === scope.id
                    ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-500/10'
                    : 'border-border bg-surface text-foreground hover:border-orange-200'
                )}
                onClick={() => setTaskScope(scope.id)}
              >
                <scope.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{scope.label}</span>
                <span className="sm:hidden">{scope.id === 'today' ? 'Hoje' : scope.id === 'future' ? 'Futuras' : 'Todas'}</span>
                <span className="rounded-full bg-surface2 px-2 py-0.5 text-xs font-bold text-foreground">
                  {scopeCounts[scope.id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showTodaySection && (
        <section className="rounded-3xl border border-border bg-surface2 shadow-sm">
          <SectionHeader
            title="Tarefas para hoje"
            description={
              taskScope === 'all'
                ? 'Todas as tarefas disponíveis nesta visualização'
                : 'Acompanhe o andamento das suas tarefas'
            }
            count={todayTasks.length}
            icon={Clock3}
          />
          <div className="p-4 sm:p-6 space-y-4">
            {todayTasks.length === 0 ? (
              <EmptyState title="Nenhuma tarefa" description="Nenhuma tarefa nesta visão" />
            ) : (
              todayTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </section>
      )}

      {showFutureSection && (
        <section className="rounded-3xl border border-border bg-surface2 shadow-sm">
          <SectionHeader
            title="Futuras ações"
            description="Planeje as próximas entregas e compromissos"
            count={futureTasks.length}
            icon={AlarmClock}
          />
          <div className="p-4 sm:p-6">
            {futureTasks.length === 0 ? (
              <EmptyState title="Nenhuma ação futura" description="Nenhuma tarefa agendada para datas seguintes" />
            ) : (
              <div className="space-y-4">
                {futureTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {showOverdueSection && (
        <section className="rounded-3xl border border-border bg-surface2 shadow-sm">
          <SectionHeader
            title="Atrasadas"
            description="Gerencie suas tarefas e follow-ups pendentes"
            count={overdueTasks.length}
            icon={CalendarDays}
          />
          <div className="p-4 sm:p-6">
            {overdueTasks.length === 0 ? (
              <EmptyState title="Nenhuma tarefa" description="Nenhuma tarefa atrasada" />
            ) : (
              <div className="space-y-4">
                {overdueTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Concluídas Section - Always visible when showCompleted is true, collapsible */}
      {showCompleted && (
        <section className="rounded-3xl border border-border bg-surface2 shadow-sm">
          <button
            type="button"
            onClick={() => setShowCompletedSection(prev => !prev)}
            className="flex w-full items-center justify-between gap-3 px-4 sm:px-6 py-5 text-left hover:bg-surface transition-colors rounded-t-3xl"
            aria-expanded={showCompletedSection}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Concluídas</p>
              <span className="text-sm font-medium text-muted-foreground">Tarefas já finalizadas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                <BadgeCheck className="h-4 w-4" />
                {completedTasks.length} tarefas
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                showCompletedSection && "rotate-180"
              )} />
            </div>
          </button>
          {showCompletedSection && (
            <div className="p-4 sm:p-6 pt-0 space-y-4 border-t border-border">
              {completedTasks.length === 0 ? (
                <EmptyState title="Nenhuma tarefa concluída" description="Suas tarefas concluídas aparecerão aqui" />
              ) : (
                completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          )}
        </section>
      )}

      <DateRangePicker
        open={dateRangeDialogOpen}
        onOpenChange={setDateRangeDialogOpen}
        initialRange={dateRange}
        onSelect={(range) => setDateRange(range)}
      />

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>{selectedTask?.description || selectedTask?.notes}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-foreground">
            {selectedTask?.ownerName && <p>Responsável: {selectedTask.ownerName}</p>}
            {selectedTask?.source && <p>Origem: {selectedTask.source}</p>}
            <p>Data: {selectedTask ? format(new Date(selectedTask.dueAt), "dd/MM 'às' HH:mm") : ''}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
