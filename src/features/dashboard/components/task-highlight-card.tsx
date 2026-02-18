'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Edit3, Clock } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { SaveTaskModal } from '@/features/dashboard/calendar/components/modal/save-task';
import { Task } from '@/features/dashboard/calendar/types';
import { Button } from '@/shared/components/ui/button';

interface TaskHighlightCardProps {
  task: Task;
  onUpdate?: () => void;
}

export function TaskHighlightCard({ task, onUpdate }: TaskHighlightCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActionButton = () => {
    const taskCode = task.taskType.code;

    if (taskCode === 'WHATSAPP_MESSAGE') {
      if (!task.lead?.phone) {
        toast.error('Este lead não possui número de telefone cadastrado.');
        return;
      }

      const phoneNumber = task.lead.phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    } else if (taskCode === 'PHONE_CALL') {
      if (!task.lead?.phone) {
        toast.error('Este lead não possui número de telefone cadastrado.');
        return;
      }

      const phoneNumber = task.lead.phone.replace(/\D/g, '');
      const telUrl = `tel:${phoneNumber}`;
      window.location.href = telUrl;
    } else if (taskCode === 'GENERAL_TASKS') {
      setIsModalOpen(true);
    }
  };

  const getActionButtonConfig = () => {
    const taskCode = task.taskType.code;

    if (taskCode === 'WHATSAPP_MESSAGE') {
      return {
        icon: MessageCircle,
        label: 'Abrir WhatsApp',
        color: '#25D366',
      };
    } else if (taskCode === 'PHONE_CALL') {
      return {
        icon: Phone,
        label: 'Ligar',
        color: '#3b82f6',
      };
    } else {
      return {
        icon: Edit3,
        label: 'Ver Tarefa',
        color: 'var(--primary)',
      };
    }
  };

  const formatDateTime = () => {
    try {
      const [year, month, day] = task.taskDate.split('-');
      const taskTime =
        typeof task.taskTime === 'string'
          ? task.taskTime
          : `${String(task.taskTime.hour).padStart(2, '0')}:${String(task.taskTime.minute).padStart(2, '0')}`;
      const [hours, minutes] = taskTime.split(':');
      const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));

      return {
        date: format(date, "dd 'de' MMM", { locale: ptBR }),
        time: format(date, 'HH:mm', { locale: ptBR }),
      };
    } catch {
      const timeStr =
        typeof task.taskTime === 'string'
          ? task.taskTime
          : `${String(task.taskTime.hour).padStart(2, '0')}:${String(task.taskTime.minute).padStart(2, '0')}`;
      return { date: task.taskDate, time: timeStr };
    }
  };

  const actionButton = getActionButtonConfig();
  const ActionIcon = actionButton.icon;
  const dateTime = formatDateTime();

  return (
    <>
      <SaveTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTask={task}
        onSubmit={() => {
          setIsModalOpen(false);
          onUpdate?.();
        }}
        isLoading={false}
      />

      <div
        className="w-[280px] rounded-2xl p-4 border-l-4 border bg-card shadow-sm transition-all hover:shadow-md"
        style={{ borderLeftColor: task.color }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="px-3 py-1 rounded-full" style={{ backgroundColor: `${task.color}20` }}>
            <span className="text-xs font-semibold" style={{ color: task.color }}>
              {task.taskType.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3" />
            <span className="text-xs">{dateTime.time}</span>
          </div>
        </div>

        <h3 className="text-base font-bold mb-2 text-card-foreground line-clamp-2">{task.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          Descrição: {task.description || 'Sem descrição'}
        </p>

        {task.lead && (
          <div className="p-2 rounded-lg mb-3 bg-muted/50">
            <p className="text-sm font-medium text-card-foreground truncate">{task.lead.name}</p>
            {task.lead.phone && <p className="text-xs text-muted-foreground mt-1">{task.lead.phone}</p>}
          </div>
        )}

        <div className="flex items-center mb-3">
          <span className="text-xs text-muted-foreground">{dateTime.date}</span>
        </div>

        <Button
          onClick={handleActionButton}
          className="w-full transition-opacity hover:opacity-90"
          style={{ backgroundColor: actionButton.color, color: 'white' }}
        >
          <ActionIcon className="size-4" />
          {actionButton.label}
        </Button>
      </div>
    </>
  );
}
