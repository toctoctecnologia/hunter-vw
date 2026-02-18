'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bell, Loader2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn } from '@/shared/lib/utils';
import { NotificationItem, NotificationTargetType } from '@/shared/types';

import { getAppointment, updateAppointment } from '@/features/dashboard/calendar/api/appointment';
import { getTask, updateTask } from '@/features/dashboard/calendar/api/tasks';

import { CalendarAppointment, Task } from '@/features/dashboard/calendar/types';

import { AppointmentFormData } from '@/features/dashboard/calendar/components/modal/save-appointment/schema';
import { SaveAppointmentModal } from '@/features/dashboard/calendar/components/modal/save-appointment';
import { TaskFormData } from '@/features/dashboard/calendar/components/modal/save-task/schema';
import { SaveTaskModal } from '@/features/dashboard/calendar/components/modal/save-task';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

interface NotificationCardProps {
  notification: NotificationItem;
  onDelete: (uuid: string) => void;
  onMarkAsRead: (uuid: string) => void;
  className?: string;
}

export function NotificationCard({ notification, onDelete, onMarkAsRead, className }: NotificationCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isNavigating, setIsNavigating] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<CalendarAppointment | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentFormData }) => updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Compromisso atualizado com sucesso!');
      setAppointmentModalOpen(false);
      setEditingAppointment(null);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa atualizada com sucesso!');
      setTaskModalOpen(false);
      setEditingTask(null);
    },
  });

  const handleMarkAsRead = () => {
    if (!notification.isViewed) {
      onMarkAsRead(notification.uuid);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.uuid);
  };

  const handleClick = async () => {
    handleMarkAsRead();

    const { targetEntityType, targetEntityUuid } = notification;
    if (!targetEntityType || !targetEntityUuid) return;

    setIsNavigating(true);

    try {
      switch (targetEntityType) {
        case NotificationTargetType.LEAD:
          router.push(`/dashboard/sales/${targetEntityUuid}/details`);
          break;

        case NotificationTargetType.APPOINTMENT: {
          const appointment = await getAppointment(targetEntityUuid);
          setEditingAppointment(appointment);
          setAppointmentModalOpen(true);
          break;
        }

        case NotificationTargetType.TASK: {
          const task = await getTask(targetEntityUuid);
          setEditingTask(task);
          setTaskModalOpen(true);
          break;
        }
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const handleSubmitAppointment = (data: AppointmentFormData) => {
    if (editingAppointment) {
      updateAppointmentMutation.mutate({ id: editingAppointment.uuid, data });
    }
  };

  const handleSubmitTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.uuid, data });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ptBR });

  return (
    <>
      <SaveAppointmentModal
        open={appointmentModalOpen}
        onClose={() => {
          setAppointmentModalOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleSubmitAppointment}
        editingEvent={editingAppointment}
        isLoading={updateAppointmentMutation.isPending}
      />

      <SaveTaskModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        isLoading={updateTaskMutation.isPending}
      />

      <Card
        className={cn(
          'relative flex items-start gap-4 p-4 transition-colors hover:bg-accent/50 cursor-pointer min-w-[325px]',
          !notification.isViewed && 'border-l-4 border-l-primary',
          className,
        )}
        onClick={handleClick}
      >
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-2 mr-4">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                notification.isViewed ? 'bg-muted' : 'bg-orange-500/10',
              )}
            >
              {isNavigating ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <Bell className={cn('size-4', notification.isViewed ? 'text-muted-foreground' : 'text-primary')} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{notification.title}</h3>
            </div>
          </div>

          <TypographySmall>{notification.description}</TypographySmall>
          <TypographyMuted>{timeAgo}</TypographyMuted>
        </div>

        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleDelete}>
          <X className="size-4" />
          <span className="sr-only">Remover notificação</span>
        </Button>
      </Card>
    </>
  );
}
