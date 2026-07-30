import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit3, Loader2, CheckCircle2 } from 'lucide-react';
import { useTasks, useTaskStats, useDeleteTask } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { FILTER_OPTIONS } from '../components/StatusPill';
import { confirmDialog } from '../components/ConfirmDialog';
import { StatsCard } from '../components/StatsCard';
import gliLogo from '../foto/image.png';
import type { Task } from '../types';

export function Home() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Todo' | 'In Progress' | 'Done'>('All');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: tasks = [], isLoading, isError, refetch } = useTasks();
  const { data: stats } = useTaskStats();
  const deleteTaskMutation = useDeleteTask();

  const filteredTasks = useMemo(() => {
    const taskList = Array.isArray(tasks) ? tasks : [];
    if (selectedFilter === 'All') {
      return taskList;
    }
    return taskList.filter((task) => task.status === selectedFilter);
  }, [tasks, selectedFilter]);

  const itemsCount = filteredTasks.length;

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  const startOfToday = useMemo(() => {
    const date = new Date(currentTime);
    date.setHours(7, 0, 0, 0);
    return date;
  }, [currentTime]);

  const endOfToday = useMemo(() => {
    const date = new Date(currentTime);
    date.setHours(15, 0, 0, 0);
    return date;
  }, [currentTime]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const timelineItems = useMemo(() => {
    const taskList = Array.isArray(tasks) ? tasks : [];
    return taskList
      .filter((task) => {
        if (!task.deadline) {
          return false;
        }
        const deadlineDate = new Date(task.deadline);
        return !Number.isNaN(deadlineDate.getTime()) && isSameDay(deadlineDate, currentTime);
      })
      .sort((a, b) => new Date(a.deadline ?? '').getTime() - new Date(b.deadline ?? '').getTime());
  }, [tasks, currentTime]);

  const timelineRange = useMemo(() => ({ start: startOfToday, end: endOfToday }), [startOfToday, endOfToday]);

  const computeCurrentTimeMarker = (range: { start: Date; end: Date } | null, now: Date) => {
    if (!range) {
      return null;
    }
    const nowTime = now.getTime();
    const start = range.start.getTime();
    const end = range.end.getTime();
    if (nowTime < start || nowTime > end) {
      return null;
    }
    return ((nowTime - start) / (end - start)) * 100;
  };

  const currentTimeMarker = useMemo(() => computeCurrentTimeMarker(timelineRange, currentTime), [timelineRange, currentTime]);

  const timelineAxisPoints = useMemo(() => {
    if (!timelineRange) {
      return [];
    }
    return [0, 20, 40, 60, 80, 100].map((percent) =>
      new Date(timelineRange.start.getTime() + ((timelineRange.end.getTime() - timelineRange.start.getTime()) * percent) / 100),
    );
  }, [timelineRange]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-6 rounded-[40px] bg-[#0C3D5C] p-6 text-slate-50 shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden bg-[#0C3D5C] shadow-lg">
                <img src={gliLogo} alt="GLI Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-orange-300">Global Loyalty Indonesia</p>
                <p className="mt-1 text-sm opacity-70">Welcome Back,</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Brily Al Furqon S</h1>
              </div>
            </div>
            {/* mobile: compact icon; desktop: full button */}
            <div className="flex items-center gap-2 absolute right-4 top-4 sm:static">
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }}
                aria-label="Add New Task"
                title="Add New Task"
                className="inline-flex sm:hidden h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
              >
                <Plus size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <Plus size={18} />
                Add New Task
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard title="All Tasks" value={tasks.length} subtitle="All assigned tasks" accentColor="slate" icon={<Plus size={18} />} />
            <StatsCard title="Todo" value={stats?.todo ?? 0} subtitle="Tasks waiting to start" accentColor="orange" icon={<Edit3 size={18} />} />
            <StatsCard title="In Progress" value={stats?.in_progress ?? 0} subtitle="Tasks currently in progress" accentColor="sky" icon={<Loader2 size={18} />} />
            <StatsCard title="Completed" value={stats?.done ?? 0} subtitle="Successfully completed tasks" accentColor="emerald" icon={<CheckCircle2 size={18} />} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Timeline Project</p>
                  <p className="mt-1 text-sm text-slate-500">Daily schedule preview</p>
                </div>
              </div>
              <div className="mt-6">
                {timelineItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No tasks yet. Create one to see the project timeline.
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mt-1 text-sm text-slate-500">Overview by task time and day</p>
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Sekarang: {currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {currentTime.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6">
                      <div className="relative h-[240px]">
                        <div className="absolute inset-x-0 top-12 h-px bg-slate-200" />
                        <div className="absolute inset-x-0 top-24 h-px bg-slate-200" />
                        <div className="absolute inset-x-0 top-36 h-px bg-slate-200" />
                        <div className="absolute inset-x-0 top-48 h-px bg-slate-200" />

                      {currentTimeMarker !== null && (
                        <>
                          <div className="absolute left-0 right-0 top-4 z-10 flex justify-center">
                            <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                              Now
                            </span>
                          </div>
                          <div className="absolute inset-y-0 top-0 z-10 h-full w-1 bg-red-500 opacity-90" style={{ left: `${currentTimeMarker}%`, transform: 'translateX(-50%)' }} />
                        </>
                      )}

                      {timelineItems.map((task, index) => {
                        const deadlineDate = new Date(task.deadline ?? '');
                        const rangeStart = timelineRange?.start.getTime() ?? deadlineDate.getTime();
                        const rangeEnd = timelineRange?.end.getTime() ?? deadlineDate.getTime();
                        const left = rangeEnd > rangeStart ? ((deadlineDate.getTime() - rangeStart) / (rangeEnd - rangeStart)) * 100 : 50;
                        const color = task.status === 'Todo' ? 'bg-orange-100 border-orange-300 text-orange-800' : task.status === 'In Progress' ? 'bg-sky-100 border-sky-300 text-sky-800' : 'bg-emerald-100 border-emerald-300 text-emerald-800';
                        const top = 8 + (index % 3) * 24;
                        return (
                          <div
                            key={task.id}
                            className={`absolute rounded-2xl border px-3 py-2 text-xs font-semibold ${color}`}
                            style={{ left: `${left}%`, top: `${top}%`, transform: 'translateX(-50%)' }}
                          >
                            <div className="truncate">{task.title}</div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{deadlineDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{deadlineDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                          </div>
                        );
                      })}

                      <div className="mt-24 grid grid-cols-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {timelineAxisPoints.map((labelDate) => (
                          <div key={labelDate.toISOString()} className="whitespace-pre-line">
                            {`${labelDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}\n${labelDate.toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Workload by Status</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Work In Progress</p>
                      <p className="mt-1 text-xs text-slate-500">{stats?.in_progress ?? 0} tasks</p>
                    </div>
                    <div className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                      {stats?.total ? `${Math.round((stats.in_progress / stats.total) * 100)}%` : '0%'}
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-full bg-slate-200 px-1 py-1">
                    <div
                      className="h-3 rounded-full bg-orange-500"
                      style={{ width: `${stats?.total ? (stats.in_progress / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Completed</p>
                      <p className="mt-1 text-xs text-slate-500">{stats?.done ?? 0} tasks</p>
                    </div>
                    <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      {stats?.total ? `${Math.round((stats.done / stats.total) * 100)}%` : '0%'}
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-full bg-slate-200 px-1 py-1">
                    <div
                      className="h-3 rounded-full bg-emerald-500"
                      style={{ width: `${stats?.total ? (stats.done / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white shadow-sm">
            <div className="px-6 py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Task list</p>
                  <p className="mt-1 text-sm text-slate-500">Manage tasks and update status quickly.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedFilter(option)}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${selectedFilter === option ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 border-t border-slate-200 px-6 py-6">
              {isLoading && <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">Loading tasks…</div>}
              {isError && <div className="rounded-3xl bg-slate-50 p-8 text-center text-red-600">Unable to load tasks. Please refresh the page.</div>}
              {!isLoading && !isError && itemsCount === 0 && <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">No tasks matched your filter yet.</div>}
              {!isLoading && !isError && filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => {
                    setEditingTask(task);
                    setIsFormOpen(true);
                  }}
                  onDelete={async () => {
                    const confirmed = await confirmDialog('Delete task', 'Are you sure you want to delete this task?');
                    if (confirmed) {
                      await deleteTaskMutation.mutateAsync({ id: task.id });
                      refetch();
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <TaskForm
          task={editingTask}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          onSaved={() => {
            setEditingTask(null);
            setIsFormOpen(false);
            refetch();
          }}
        />
      </div>
    </div>
  );
}
