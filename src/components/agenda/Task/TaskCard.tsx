import { format } from 'date-fns';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import {
  MessageCircle,
  Phone,
  Calendar,
  Building2,
  Clock,
  CheckCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  highlighted?: boolean;
}

function getTaskIcon(type: Task['type']) {
  switch (type) {
    case 'message':
      return MessageCircle;
    case 'call':
    case 'callback':
      return Phone;
    case 'visit':
    case 'appointment':
      return Calendar;
    case 'document':
      return Building2;
    default:
      return Clock;
  }
}

export function TaskCard({ task, highlighted }: TaskCardProps) {
  const IconComponent = getTaskIcon(task.type);
  const infoText = task.lead?.interesse || task.notes;
  const time = format(new Date(task.dueAt), 'HH:mm');

  return (
    <div
      id={`task-${task.id}`}
      className={cn(
        'bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentSoft))] rounded-2xl p-4 text-white shadow-sm',
        highlighted && 'ring-2 ring-[hsl(var(--accent))]'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-white mb-1">{task.title || task.lead?.nome}</h4>
            {infoText && (
              <p className="text-sm text-white/90">{infoText}</p>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-white">{time}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
          {task.status === 'done' ? 'Concluída' : 'Pendente'}
        </div>
        <button className="bg-white text-[hsl(var(--accent))] rounded-full text-sm font-semibold px-4 py-2 hover:bg-gray-50 active:scale-95 transition-all">
          {task.status === 'done' ? 'Ver' : 'Executar'}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
