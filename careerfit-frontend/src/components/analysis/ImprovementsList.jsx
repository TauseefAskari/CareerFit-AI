import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Actionable resume improvement recommendations
 */
export function ImprovementsList({ improvements = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recommended Improvements</h3>
          <p className="text-xs text-slate-500">Suggestions based on the submitted resume and role</p>
        </div>
      </div>

      <ul className="space-y-3">
        {improvements.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
