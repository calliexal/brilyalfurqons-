import type { Task, TaskCreatePayload, TaskUpdatePayload, TaskStats } from '../types';
import { api } from '../lib/api';

export async function fetchTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
}

export async function fetchTaskStats(): Promise<TaskStats> {
  const response = await api.get<TaskStats>('/tasks/stats');
  return response.data;
}

export async function createTask(payload: TaskCreatePayload): Promise<Task> {
  const response = await api.post<Task>('/tasks', payload);
  return response.data;
}

export async function updateTask(payload: TaskUpdatePayload): Promise<Task> {
  const response = await api.put<Task>(`/tasks/${payload.id}`, payload);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
