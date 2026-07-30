import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  accentColor?: 'orange' | 'sky' | 'emerald' | 'slate';
  icon?: React.ReactNode;
}

const accentMap: Record<NonNullable<StatsCardProps['accentColor']>, { bg: string; icon: string }> = {
  orange: { bg: 'bg-orange-100', icon: 'text-orange-700' },
  sky: { bg: 'bg-sky-100', icon: 'text-sky-700' },
  emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-700' },
  slate: { bg: 'bg-slate-200', icon: 'text-slate-800' },
};

export function StatsCard({ title, value, subtitle, accentColor = 'slate', icon }: StatsCardProps) {
  const accent = accentMap[accentColor];
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`rounded-full p-3 ${accent.bg} flex items-center justify-center ring-1 ring-slate-200`}>{icon ? <span className={`${accent.icon}`}>{icon}</span> : null}</div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
