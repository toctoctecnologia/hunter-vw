'use client';

import { CheckCircle2, Circle, Clock, Pencil, Trash2, Tag, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ptBR } from 'date-fns/locale';

import { Task } from '@/features/dashboard/calendar/types';

import { timeToString } from '@/shared/lib/utils';

import { getLeadProposal } from '@/features/dashboard/sales/api/lead-proposal';
import { getLeadById } from '@/features/dashboard/sales/api/lead';

import { TaskProposalInfo } from '@/features/dashboard/calendar/components/task-proposal-info';
import { TaskLeadInfo } from '@/features/dashboard/calendar/components/task-lead-info';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isOverdue?: boolean;
}

export function TaskCard({ task, onComplete, onEdit, onDelete, isOverdue }: TaskCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const { data: proposal } = useQuery({
    queryKey: ['lead-proposal', task.lead?.uuid],
    queryFn: () => getLeadProposal(task.lead?.uuid as string),
    enabled: !!task.lead?.uuid && task.taskType.code === 'PROPOSAL',
  });

  const { data: lead } = useQuery({
    queryKey: ['lead-detail', task.lead?.uuid],
    queryFn: () => getLeadById(task.lead?.uuid),
    enabled: !!task.lead?.uuid,
  });

  const formatDateTime = () => {
    try {
      const date = parseISO(task.taskDate);
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
      const formattedTime = timeToString(task.taskTime);
      return `${formattedDate} às ${formattedTime}`;
    } catch {
      return `${task.taskDate} ${timeToString(task.taskTime)}`;
    }
  };

  const handleCardClick = () => {
    if (task.lead?.uuid) {
      router.push(`/dashboard/sales/${task.lead.uuid}/details`);
    }
  };

  return (
    <Card
      className={`p-4 hover:shadow-md transition-shadow ${task.lead?.uuid ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {hasFeature(user?.userInfo.profile.permissions, '1303') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task);
            }}
            className="mt-1 transition-transform hover:scale-110"
            disabled={task.completed}
          >
            {task.completed ? (
              <CheckCircle2 className="size-5 text-green-500" />
            ) : (
              <Circle className="size-5 text-muted-foreground" />
            )}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h3>
              {task.lead && (
                <div className="flex items-center gap-1.5 mt-1 text-sm text-primary font-medium">
                  <User className="size-4" />
                  <span>{task.lead.name}</span>
                </div>
              )}
              {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
              {lead && <TaskLeadInfo lead={lead} />}
              {proposal && <TaskProposalInfo proposal={proposal} />}
            </div>

            {!task.completed && hasFeature(user?.userInfo.profile.permissions, '1303') && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.uuid);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="size-3" />
              {formatDateTime()}
            </Badge>

            {isOverdue && !task.completed && (
              <Badge variant="destructive" className="text-xs">
                Atrasada
              </Badge>
            )}

            {task.taskType && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Tag className="size-3" />
                {task.taskType.name}
              </Badge>
            )}

            <div
              className="size-4 rounded-full border-2 border-background shadow-sm"
              style={{ backgroundColor: task.color }}
              title="Cor da tarefa"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
