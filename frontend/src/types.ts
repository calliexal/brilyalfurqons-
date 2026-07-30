export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  deadline?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
}

export interface TaskCreatePayload {
  title: string;
  description: string;
  status: TaskStatus;
  deadline?: string | null;
}

export interface TaskUpdatePayload extends TaskCreatePayload {
  id: number;
}
