import { api } from '@/shared/lib/api';

import { TaskFilters } from '@/shared/types';

import { Task, TaskType } from '@/features/dashboard/calendar/types';
import { TaskFormData } from '@/features/dashboard/calendar/components/modal/save-task/schema';

export async function getTasks(filters: TaskFilters) {
  const { data } = await api.get<Task[]>('dashboard/schedule/task', { params: filters });
  return data;
}

export async function getTask(uuid: string) {
  const { data } = await api.get<Task>(`dashboard/schedule/task/${uuid}`);
  return data;
}

export async function createTask(task: TaskFormData) {
  const { data } = await api.post<Task>('dashboard/schedule/task', {
    ...task,
    leadUuid: task.leadUuid || undefined,
    taskTime: `${String(task.taskTime.hour).padStart(2, '0')}:${String(task.taskTime.minute).padStart(2, '0')}:${String(
      task.taskTime.second,
    ).padStart(2, '0')}`,
  });
  return data;
}

export async function updateTask(taskId: string, task: TaskFormData) {
  const { data } = await api.put<Task>(`dashboard/schedule/task/${taskId}`, {
    ...task,
    leadUuid: task.leadUuid || undefined,
    taskTime: `${String(task.taskTime.hour).padStart(2, '0')}:${String(task.taskTime.minute).padStart(2, '0')}:${String(
      task.taskTime.second,
    ).padStart(2, '0')}`,
  });
  return data;
}

export async function deleteTask(taskId: string) {
  await api.delete(`dashboard/schedule/task/${taskId}`);
}

export async function completeTask(taskId: string) {
  await api.patch(`dashboard/schedule/task/${taskId}/complete`);
  return null;
}

export async function getTaskTypes() {
  const { data } = await api.get<TaskType[]>('dashboard/schedule/task/type');
  return data;
}
