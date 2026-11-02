/**
 * Formatting and display helper utilities for CareerFit AI
 * Plain JavaScript (ES6+) implementation
 */

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm))} ${sizes[safeIndex]}`;
}

export function formatDate(dateInput) {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

export function getScoreTier(score) {
  const rounded = Math.round(Math.max(0, Math.min(100, score || 0)));
  if (rounded >= 80) {
    return {
      label: 'Strong Compatibility',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      strokeColor: '#059669',
      textColor: 'text-emerald-600',
      bgLightColor: 'bg-emerald-50',
      description: 'This analysis shows substantial overlap between the resume and the target role.',
    };
  }
  if (rounded >= 60) {
    return {
      label: 'Moderate Alignment',
      badgeClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      strokeColor: '#4f46e5',
      textColor: 'text-indigo-600',
      bgLightColor: 'bg-indigo-50',
      description: 'This analysis shows some overlap, with areas you may want to review.',
    };
  }
  if (rounded >= 40) {
    return {
      label: 'Developing Fit',
      badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
      strokeColor: '#d97706',
      textColor: 'text-amber-600',
      bgLightColor: 'bg-amber-50',
      description: 'This analysis shows partial overlap and identifies skills to review.',
    };
  }
  return {
    label: 'Low Alignment',
    badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
    strokeColor: '#e11d48',
    textColor: 'text-rose-600',
    bgLightColor: 'bg-rose-50',
    description: 'This analysis shows limited overlap with the target role requirements.',
  };
}
