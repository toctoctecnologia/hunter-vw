'use client';

import { useMemo, useState } from 'react';
import { isBefore, isToday, isTomorrow } from 'date-fns';
import { Plus, Inbox } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { Task } from '@/features/dashboard/calendar/types';
import { TaskFilters } from '@/shared/types';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';
import TaskFiltersSheet from '@/features/dashboard/calendar/components/sheet/task-filters-sheet';
import { TaskCard } from '@/features/dashboard/calendar/components/task-card';
import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

type TaskFilter = 'today' | 'overdue' | 'future' | 'all' | 'completed';

interface TaskListProps {
  tasks: Task[];
  onCreateTask: () => void;
  onCompleteTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onApplyFilters?: (filters: TaskFilters) => void;
}

export function TaskList({
  tasks,
  onCreateTask,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  searchTerm,
  setSearchTerm,
  onApplyFilters,
}: TaskListProps) {
  const { user } = useAuth();
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>('today');

  const { todayTasks, overdueTasks, futureTasks, allTasks, completedTasks, filteredTasks } = useMemo(() => {
    const now = new Date();

    const today: Task[] = [];
    const overdue: Task[] = [];
    const future: Task[] = [];
    const completed: Task[] = [];
    const all: Task[] = [];

    tasks.forEach((task) => {
      all.push(task);

      if (task.completed) {
        completed.push(task);
        return;
      }

      try {
        const taskDateTime = new Date(`${task.taskDate}T${task.taskTime}`);

        if (isBefore(taskDateTime, now)) {
          overdue.push(task);
        } else if (isToday(taskDateTime)) {
          today.push(task);
        } else if (isTomorrow(taskDateTime)) {
          future.push(task);
        }
      } catch {
        // Se houver erro ao processar a data, adiciona em todas
      }
    });

    const sortByDateTime = (a: Task, b: Task) => {
      try {
        const dateA = new Date(`${a.taskDate}T${a.taskTime}`);
        const dateB = new Date(`${b.taskDate}T${b.taskTime}`);

        return dateA.getTime() - dateB.getTime();
      } catch {
        return 0;
      }
    };

    today.sort(sortByDateTime);
    overdue.sort(sortByDateTime);
    future.sort(sortByDateTime);
    all.sort(sortByDateTime);
    completed.reverse();

    let filtered: Task[] = [];
    switch (selectedFilter) {
      case 'today':
        filtered = today;
        break;
      case 'overdue':
        filtered = overdue;
        break;
      case 'future':
        filtered = future;
        break;
      case 'completed':
        filtered = completed;
        break;
      case 'all':
      default:
        filtered = all;
        break;
    }

    return {
      todayTasks: today,
      overdueTasks: overdue,
      futureTasks: future,
      allTasks: all,
      completedTasks: completed,
      filteredTasks: filtered,
    };
  }, [tasks, selectedFilter]);

  const filterButtons = [
    { key: 'today' as TaskFilter, label: 'A fazer hoje', count: todayTasks.length },
    { key: 'overdue' as TaskFilter, label: 'Atrasadas', count: overdueTasks.length },
    { key: 'future' as TaskFilter, label: 'Futuras ações', count: futureTasks.length },
    { key: 'all' as TaskFilter, label: 'Todas', count: allTasks.length },
    { key: 'completed' as TaskFilter, label: 'Concluídas', count: completedTasks.length },
  ];

  const getEmptyMessage = () => {
    switch (selectedFilter) {
      case 'today':
        return 'Nenhuma tarefa para fazer hoje';
      case 'overdue':
        return 'Nenhuma tarefa atrasada';
      case 'future':
        return 'Nenhuma futura ação';
      case 'completed':
        return 'Nenhuma tarefa concluída';
      case 'all':
      default:
        return 'Nenhuma tarefa cadastrada';
    }
  };

  return (
    <>
      <TaskFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={onApplyFilters} />

      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <Filter className="grid md:flex gap-4">
              <FilterSearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFilter={() => setShowFiltersSheet(true)}
              />

              {hasFeature(user?.userInfo.profile.permissions, '1302') && (
                <Button onClick={onCreateTask} className="gap-2">
                  <Plus className="size-4" />
                  Nova Tarefa
                </Button>
              )}
            </Filter>

            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.key)}
                  className="gap-2"
                >
                  {filter.label}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      selectedFilter === filter.key ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {filter.count}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {filteredTasks.length === 0 ? (
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox />
                  </EmptyMedia>
                  <EmptyTitle>Nenhuma tarefa</EmptyTitle>
                  <EmptyDescription>{getEmptyMessage()}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.uuid}
                    task={task}
                    onComplete={onCompleteTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    isOverdue={selectedFilter === 'overdue' || overdueTasks.some((t) => t.uuid === task.uuid)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
