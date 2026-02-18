'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '@/hooks/agenda/useTasks';
import { TaskCard } from '@/components/agenda/Task';
import type { TaskProperty } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function AgendaPage() {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const taskIdParam = searchParams.get('taskId');
  const sourceParam = searchParams.get('source');

  const selectedDate = useMemo(() => (dateParam ? new Date(dateParam) : new Date()), [dateParam]);
  const { data: tasks = [] } = useTasks(selectedDate);

  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [quickInfo, setQuickInfo] = useState<TaskProperty | null>(null);

  useEffect(() => {
    if (taskIdParam && tasks.length > 0) {
      setHighlightId(taskIdParam);
      const el = document.getElementById(`task-${taskIdParam}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [taskIdParam, tasks]);

  useEffect(() => {
    if (!taskIdParam && timeParam && tasks.length > 0) {
      const match = tasks.find(
        t => new Date(t.dueAt).toISOString().slice(11, 16) === timeParam
      );
      if (match) {
        const el = document.getElementById(`task-${match.id}`);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    }
  }, [timeParam, taskIdParam, tasks]);

  useEffect(() => {
    if (sourceParam === 'lead' && taskIdParam && tasks.length > 0) {
      const task = tasks.find(t => String(t.id) === taskIdParam);
      if (task?.property) {
        setQuickInfo(task.property);
      }
    }
  }, [sourceParam, taskIdParam, tasks]);

  useEffect(() => {
    if (highlightId) {
      const timer = setTimeout(() => setHighlightId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  return (
    <div className="p-4 space-y-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={{
          ...task,
          status: (task.status || 'todo') as 'todo' | 'done' | 'cancelled',
          reminders: task.reminders || [],
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt || new Date().toISOString(),
        }} highlighted={String(task.id) === highlightId} />
      ))}

      <Dialog open={!!quickInfo} onOpenChange={open => !open && setQuickInfo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{quickInfo?.titulo}</DialogTitle>
            {quickInfo?.codigo && (
              <DialogDescription>{quickInfo.codigo}</DialogDescription>
            )}
          </DialogHeader>
          {quickInfo?.endereco && (
            <p className="mt-2 text-sm text-gray-700">{quickInfo.endereco}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
