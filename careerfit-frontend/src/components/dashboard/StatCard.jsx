import React from 'react';

/**
 * Metric card displaying statistical numbers, icons, and captions
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}) {
  return (
    <section className="min-w-0 p-5 sm:p-6" aria-label={title}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="cf-label">{title}</p>
        <span className="text-indigo-600" aria-hidden="true">{icon}</span>
      </div>
      <p className="cf-metric-value text-slate-900 tabular-nums">{value}</p>
      {subtitle && <p className="mt-3 truncate text-sm text-slate-500">{subtitle}</p>}
      {trend && <p className="mt-2 text-xs font-medium text-indigo-600">{trend}</p>}
    </section>
  );
}
