import React, { useEffect, useMemo, useState } from 'react';
import { AlarmClock, CalendarDays, Home, ListChecks, User } from 'lucide-react';
import { endOfDay, format, isAfter, isBefore, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TaskStatus } from '@/types/task';
import { useLeadTasks } from '@/hooks/vendas';

const statusLabels: Record<TaskStatus, string> = {
  todo: 'Pendente',
  done: 'Concluída',
  cancelled: 'Cancelada',
};

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-[hsl(var(--warning))] text-[var(--text)] hover:opacity-90',
  done: 'bg-[hsl(var(--success))] text-[var(--text)] hover:opacity-90',
  cancelled: 'bg-[hsl(var(--danger))] text-[var(--text)] hover:opacity-90',
};

type LeadTaskScope = 'all' | 'today' | 'overdue' | 'future';

interface TasksTabProps {
  leadId: number;
  focusedTaskId?: string | null;
}

export function TasksTab({ leadId, focusedTaskId }: TasksTabProps) {
  const { data: tasks = [] } = useLeadTasks(leadId);

  const normalizedFocusId = focusedTaskId ? String(focusedTaskId) : null;

  useEffect(() => {
    if (!normalizedFocusId) return;
    const el = document.getElementById('focused-lead-task');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [normalizedFocusId]);

  // Mock task matching the design from the image
  const mockTask = {
    id: 1,
    dueAt: new Date('2025-07-12T12:00:00').toISOString(),
    title: 'Enviar mensagem para Artur',
    description: 'Enviar informações sobre apartamento no centro',
    phone: '(48) 9618-6116',
    dueDate: '12/07/2025',
    priority: 'Alta',
    status: 'todo' as const,
    isOverdue: true
  };

  const displayTasks = tasks.length > 0 ? tasks : [mockTask];
  const [taskScope, setTaskScope] = useState<LeadTaskScope>('all');

  const withDerivedStatus = useMemo(() => {
    const startToday = startOfDay(new Date());
    const endToday = endOfDay(new Date());

    return displayTasks.map(task => {
      const dueDateRaw = (task as any).dueAt || (task as any).dueDate;
      const dueDate = dueDateRaw ? new Date(dueDateRaw) : new Date();
      const isDone = (task as any).status === 'done';

      let lane: LeadTaskScope = 'today';
      if (isDone) {
        lane = 'all';
      } else if (isBefore(dueDate, startToday)) {
        lane = 'overdue';
      } else if (isAfter(dueDate, endToday)) {
        lane = 'future';
      } else {
        lane = 'today';
      }

      return {
        ...task,
        lane,
        dueDate,
      };
    });
  }, [displayTasks]);

  const scopeCounts = useMemo<Record<LeadTaskScope, number>>(() => ({
    all: withDerivedStatus.length,
    today: withDerivedStatus.filter(task => task.lane === 'today').length,
    overdue: withDerivedStatus.filter(task => task.lane === 'overdue').length,
    future: withDerivedStatus.filter(task => task.lane === 'future').length,
  }), [withDerivedStatus]);

  const filteredTasks = useMemo(() => {
    if (taskScope === 'all') return withDerivedStatus;
    return withDerivedStatus.filter(task => task.lane === taskScope);
  }, [taskScope, withDerivedStatus]);

  const scopeOptions: { id: LeadTaskScope; label: string; icon: typeof Home }[] = [
    { id: 'today', label: 'Para hoje', icon: Home },
    { id: 'overdue', label: 'Atrasadas', icon: CalendarDays },
    { id: 'future', label: 'Futuras', icon: AlarmClock },
    { id: 'all', label: 'Todas', icon: ListChecks },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-2">
        {scopeOptions.map(scope => (
          <Button
            key={scope.id}
            variant={taskScope === scope.id ? 'default' : 'outline'}
            onClick={() => setTaskScope(scope.id)}
            className={taskScope === scope.id ? 'bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accent))]/90' : 'border-border bg-white text-foreground'}
            size="sm"
          >
            <scope.icon className="mr-2 h-4 w-4" />
            {scope.label}
            <Badge variant="secondary" className="ml-2 bg-white text-foreground border border-border">
              {scopeCounts[scope.id]}
            </Badge>
          </Button>
        ))}
      </div>

      {filteredTasks.map((task, index) => {
        const isFocused = normalizedFocusId && String(task.id) === normalizedFocusId;
        const lane = (task as any).lane as LeadTaskScope;
        const laneLabel =
          lane === 'overdue'
            ? 'Atrasada'
            : lane === 'future'
              ? 'Futura'
              : lane === 'today'
                ? 'Para hoje'
                : 'Concluída';
        return (
          <div
            key={task.id || index}
            className={`space-y-4 ${isFocused ? 'ring-2 ring-orange-500 rounded-2xl' : ''}`}
            id={isFocused ? 'focused-lead-task' : undefined}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={
                  lane === 'overdue'
                    ? 'bg-red-100 text-red-600 text-xs px-2 py-1 font-medium'
                    : lane === 'future'
                      ? 'bg-blue-100 text-blue-700 text-xs px-2 py-1 font-medium'
                      : 'bg-orange-100 text-orange-700 text-xs px-2 py-1 font-medium'
                }>
                  {laneLabel}
                </Badge>
                {(task as any).priority === 'Alta' && (
                  <Badge className="bg-orange-100 text-orange-600 text-xs px-2 py-1 font-medium">
                    Alta
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-base">
                {task.title || (task as any).description}
              </h3>
              {((task as any).description || task.notes) && (
                <p className="text-sm text-gray-600">
                  {(task as any).description || task.notes}
                </p>
              )}
              <p className="text-sm text-gray-700 font-medium">
                {(task as any).phone || task.lead?.telefone}
              </p>
              <p className="text-xs text-gray-500">
                Vencimento: {format((task as any).dueDate || new Date(task.dueAt), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-orange-50 text-[hsl(var(--accent))] border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-white rounded-lg py-3"
            >
              Marcar como concluída
            </Button>
            <Button
              variant="outline"
              className="w-full bg-blue-50 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg py-3"
            >
              Ver na agenda
            </Button>
          </div>
        </div>
        );
      })}
    </div>
  );
}
