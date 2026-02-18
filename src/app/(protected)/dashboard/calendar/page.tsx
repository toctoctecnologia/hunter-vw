'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cn, getCalculatedGrid } from '@/shared/lib/utils';

import { withPermission } from '@/shared/hoc/with-permission';
import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

import { TaskFilters } from '@/shared/types';

import { getTasks, createTask, updateTask, deleteTask, completeTask } from '@/features/dashboard/calendar/api/tasks';

import { Task } from '@/features/dashboard/calendar/types';

import { TaskFormData } from '@/features/dashboard/calendar/components/modal/save-task/schema';
import { SaveTaskModal } from '@/features/dashboard/calendar/components/modal/save-task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ScheduleTab } from '@/features/dashboard/calendar/components/schedule-tab';
import { TaskList } from '@/features/dashboard/calendar/components/task-list';
import { Loading } from '@/shared/components/loading';

function Page() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['calendar-tasks', filters, searchTerm],
    queryFn: () => getTasks({ ...filters, search: searchTerm }),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa criada com sucesso!');
      setTaskDialogOpen(false);
    },
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

  const handleSubmitTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.uuid, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

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
      />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className={cn('grid w-full rounded-xl p-1 gap-1', getCalculatedGrid(user, ['1301', '1302']))}>
          {hasFeature(user?.userInfo.profile.permissions, '1301') && <TabsTrigger value="tasks">Tarefas</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '1300') && <TabsTrigger value="agenda">Agenda</TabsTrigger>}
        </TabsList>

        {hasFeature(user?.userInfo.profile.permissions, '1300') && (
          <TabsContent value="agenda" className="space-y-4">
            <ScheduleTab />
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '1301') && (
          <TabsContent value="tasks" className="space-y-4">
            {isLoadingTasks ? (
              <Loading />
            ) : (
              <TaskList
                tasks={tasks}
                onCompleteTask={(task) => completeTaskMutation.mutate(task.uuid)}
                onDeleteTask={(taskId) => deleteTaskMutation.mutate(taskId)}
                onApplyFilters={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
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
            )}
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}

export default withPermission(Page, ['1300', '1301']);
