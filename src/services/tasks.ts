import type { Task } from '@/types/task';
import { httpJSON } from '@/lib/http';

export async function getTasks(date?: string): Promise<Task[]> {
  try {
    let url = '/agenda/tasks';
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    return await httpJSON<Task[]>(url);
  } catch (error) {
    const message =
      error instanceof Error
        ? `Erro ao buscar tarefas: ${error.message}`
        : 'Erro ao buscar tarefas';
    throw new Error(message);
  }
}

export async function createTask(payload: any): Promise<Task> {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dueAt = payload.dueAt || payload.dueDate;
    const body = { ...payload, dueAt, timeZone };

    return await httpJSON<Task>('/agenda/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Erro ao criar tarefa: ${error.message}`
        : 'Erro ao criar tarefa';
    throw new Error(message);
  }
}

export async function updateTask(id: string | number, payload: any): Promise<Task> {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const bodyPayload: any = { ...payload };
    if (payload.dueAt || payload.dueDate) {
      bodyPayload.dueAt = payload.dueAt || payload.dueDate;
      bodyPayload.timeZone = timeZone;
    }

    return await httpJSON<Task>(`/agenda/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Erro ao atualizar tarefa: ${error.message}`
        : 'Erro ao atualizar tarefa';
    throw new Error(message);
  }
}

export async function deleteTask(id: string | number): Promise<void> {
  try {
    await httpJSON<void>(`/agenda/tasks/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Erro ao excluir tarefa: ${error.message}`
        : 'Erro ao excluir tarefa';
    throw new Error(message);
  }
}

