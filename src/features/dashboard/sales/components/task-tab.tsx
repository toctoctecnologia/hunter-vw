import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { LeadDetail, LeadFunnelStages, TaskFilters } from '@/shared/types';

import { updateLeadFunnelStep } from '@/features/dashboard/sales/api/lead';

import { TaskFormData } from '@/features/dashboard/calendar/components/modal/save-task/schema';
import { completeTask, createTask, deleteTask, getTasks, updateTask } from '@/features/dashboard/calendar/api/tasks';
import { Task } from '@/features/dashboard/calendar/types';

import { SaveTaskModal } from '@/features/dashboard/calendar/components/modal/save-task';
import { TaskList } from '@/features/dashboard/calendar/components/task-list';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

interface TaskTabProps {
  lead: LeadDetail;
}

export function TaskTab({ lead }: TaskTabProps) {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<TaskFilters>({ leadUuid: lead.uuid });
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useQuery({
    queryKey: ['calendar-tasks', filters, searchTerm],
    queryFn: () => getTasks({ ...filters, search: searchTerm }),
    enabled: !!lead.uuid,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa atualizada com sucesso!');
      setTaskDialogOpen(false);
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa excluída com sucesso!');
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa concluída!');
    },
  });

  const leadPropertyVisited = useMutation({
    mutationFn: (funnelStage: LeadFunnelStages) => updateLeadFunnelStep(lead?.uuid, funnelStage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Status de qualificação do lead atualizado com sucesso!');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa criada com sucesso!');
      setTaskDialogOpen(false);

      if (data.lead && data.taskType.code === 'PROPERTY_VISIT') {
        const stagesToChange = [LeadFunnelStages.PRE_ATENDIMENTO, LeadFunnelStages.EM_ATENDIMENTO];
        if (stagesToChange.includes(lead.funnelStep)) {
          leadPropertyVisited.mutate(LeadFunnelStages.AGENDAMENTO);
        }
      }
    },
  });

  const handleCompleteTask = (task: Task) => {
    completeTaskMutation.mutate(task.uuid);
    if (task.lead && task.taskType.code === 'PROPERTY_VISIT') {
      if (lead.funnelStep === LeadFunnelStages.AGENDAMENTO) {
        leadPropertyVisited.mutate(LeadFunnelStages.VISITA);
      }
    }
  };

  const handleSubmitTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.uuid, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  if (isLoadingTasks) return <Loading />;
  if (tasksError) return <ErrorCard error={tasksError} title="Erro ao carregar tarefas" />;

  return (
    <>
      <SaveTaskModal
        open={taskDialogOpen}
        onClose={() => {
          setTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        lead={{ name: lead.name, uuid: lead.uuid }}
      />

      <TaskList
        tasks={tasks}
        onCompleteTask={(task) => handleCompleteTask(task)}
        onDeleteTask={(taskId) => deleteTaskMutation.mutate(taskId)}
        onApplyFilters={setFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreateTask={() => {
          setEditingTask(null);
          setTaskDialogOpen(true);
        }}
        onEditTask={(task) => {
          setEditingTask(task);
          setTaskDialogOpen(true);
        }}
      />
    </>
  );
}
