import { CheckCircle2, Edit3, Loader2, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { useUpdateTask } from '../hooks/useTasks';
import { StatusPill } from './StatusPill';
import { confirmDialog } from './ConfirmDialog';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const updateTaskMutation = useUpdateTask();
  const isUpdating = updateTaskMutation.isPending;

  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    if (currentStatus === 'Todo') return 'In Progress';
    if (currentStatus === 'In Progress') return 'Done';
    return 'Todo';
  };

  const handleStatusChange = async () => {
    const confirmed = await confirmDialog(
      'Change status',
      `Move this task from ${task.status} to ${getNextStatus(task.status)}?`,
      { confirmText: 'Change status', confirmClass: 'bg-slate-900 hover:bg-slate-800' },
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        title: task.title,
        description: task.description,
        deadline: task.deadline ?? null,
        status: getNextStatus(task.status),
      });
      toast.success('Task status updated');
    } catch {
      toast.error('Unable to update status');
    }
  };

  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{task.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
        </div>
        <StatusPill status={task.status} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <span>{new Date(task.created_at).toLocaleDateString()}</span>
          {task.deadline ? (() => {
            const deadlineDate = new Date(task.deadline);
            const isOverdue = deadlineDate < new Date(new Date().setHours(0, 0, 0, 0));
            return (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOverdue ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                Deadline: {deadlineDate.toLocaleDateString()}
              </span>
            );
          })() : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
          >
            <Edit3 size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            type="button"
            onClick={handleStatusChange}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
            Change status
          </button>
        </div>
      </div>
    </article>
  );
}
