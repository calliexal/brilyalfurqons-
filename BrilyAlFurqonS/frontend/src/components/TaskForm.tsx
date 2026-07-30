import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { taskSchema, type TaskFormValues } from '../schemas';
import type { Task } from '../types';

interface TaskFormProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TaskForm({ task, isOpen, onClose, onSaved }: TaskFormProps) {
  const isCreating = !task;
  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '', status: 'Todo', date: today, hour: '08', minute: '00', ampm: 'AM', deadline: '' },
  });

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    const nextDeadline = task?.deadline ?? '';
    if (nextDeadline) {
      const parsed = new Date(nextDeadline);
      const dateValue = parsed.toISOString().split('T')[0];
      const hour24 = parsed.getHours();
      const ampmValue = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 || 12;
      const hourValue = String(hour12).padStart(2, '0');
      const minuteValue = String(parsed.getMinutes()).padStart(2, '0');
      reset({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? 'Todo',
        date: dateValue,
        hour: hourValue,
        minute: minuteValue,
        ampm: ampmValue,
        deadline: task?.deadline ?? '',
      });
    } else {
      reset({ title: '', description: '', status: 'Todo', date: today, hour: '08', minute: '00', ampm: 'AM', deadline: '' });
    }
  }, [task, reset, today]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const hour24 = values.ampm === 'PM'
        ? values.hour === '12'
          ? 12
          : Number(values.hour) + 12
        : values.hour === '12'
          ? 0
          : Number(values.hour);
      const payload = {
        ...values,
        deadline: values.date ? `${values.date}T${String(hour24).padStart(2, '0')}:${values.minute}:00` : '',
        status: isCreating ? 'Todo' as const : values.status,
      };

      if (task) {
        await updateTaskMutation.mutateAsync({ id: task.id, ...payload });
      } else {
        await createTaskMutation.mutateAsync(payload);
      }
      toast.success(task ? 'Task updated successfully' : 'Task created successfully');
      reset({ title: '', description: '', status: 'Todo', deadline: '' });
      onSaved();
      onClose();
    } catch {
      toast.error('Unable to save task. Please try again.');
    }
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-2xl sm:rounded-3xl rounded-t-3xl bg-white shadow-2xl sm:p-6 p-4">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{task ? 'Edit Tugas' : 'Tambah Tugas'}</p>
          <p className="mt-1 text-sm text-slate-500">Gunakan formulir di bawah untuk menambah atau memperbarui tugas.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {task && (
            <button type="button" onClick={() => reset({ title: '', description: '', status: 'Todo', date: today, hour: '08', minute: '00', ampm: 'AM', deadline: '' })} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-slate-700">
              <X size={16} /> Reset
            </button>
          )}
          <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-slate-700">
            <X size={16} /> Tutup
          </button>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Judul</label>
          <input
            {...register('title')}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            placeholder="Masukkan judul tugas"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Deskripsi</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            placeholder="Jelaskan tugas secara singkat"
          />
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {!isCreating && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select
              {...register('status')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">Sedang Berjalan</option>
              <option value="Done">Selesai</option>
            </select>
            {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tanggal</label>
            <div className="rounded-3xl bg-slate-100 p-4 shadow-sm">
              <input
                type="date"
                {...register('date')}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-900"
              />
            </div>
            {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Pilih Waktu</label>
            <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-inner">
              <div className="mb-4 rounded-3xl bg-slate-900/80 px-4 py-3 text-lg font-semibold text-white">
                Waktu
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-3xl bg-white p-4 text-slate-900 shadow-sm border border-slate-200">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Jam</label>
                  <input
                    type="text"
                    {...register('hour')}
                    placeholder="HH"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                  {errors.hour && <p className="mt-2 text-sm text-red-600">{errors.hour.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Menit</label>
                  <input
                    type="text"
                    {...register('minute')}
                    placeholder="MM"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                  {errors.minute && <p className="mt-2 text-sm text-red-600">{errors.minute.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Format</label>
                  <select
                    {...register('ampm')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-medium text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                  {errors.ampm && <p className="mt-2 text-sm text-red-600">{errors.ampm.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </form>
        </div>
      </div>
    </div>
  );
}
