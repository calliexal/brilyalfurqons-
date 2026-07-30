export const FILTER_OPTIONS = ['All', 'Todo', 'In Progress', 'Done'] as const;

interface StatusPillProps {
  status: 'Todo' | 'In Progress' | 'Done';
}

const statusStyles: Record<StatusPillProps['status'], string> = {
  Todo: 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-sky-100 text-sky-700',
  Done: 'bg-emerald-100 text-emerald-700',
};

export function StatusPill({ status }: StatusPillProps) {
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status]}`}>{status}</span>;
}
