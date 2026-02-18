import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/types/task';

export function useLeadTasks(leadId: number | string) {
  const queryClient = useQueryClient();
  const qk = ['lead-tasks', leadId] as const;

  const tasksQuery = useQuery<Task[]>({
    queryKey: qk,
    queryFn: async () => {
      const res = await fetch(`/api/leads/${leadId}/tasks`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load lead tasks');
      return res.json() as Promise<Task[]>;
    },
    enabled: !!leadId,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Task>) => {
      const res = await fetch(`/api/leads/${leadId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json() as Promise<Task>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<Task> }) => {
      const res = await fetch(`/api/leads/${leadId}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json() as Promise<Task>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await fetch(`/api/leads/${leadId}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  return {
    ...tasksQuery,
    createTask: createMutation.mutate,
    updateTask: (id: string | number, data: Partial<Task>) => updateMutation.mutate({ id, data }),
    deleteTask: (id: string | number) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
  };
}

export type UseLeadTasksReturn = ReturnType<typeof useLeadTasks>;
