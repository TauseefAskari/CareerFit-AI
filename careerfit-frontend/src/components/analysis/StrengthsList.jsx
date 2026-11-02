import React from 'react';
import { ThumbsUp, CheckCircle2 } from 'lucide-react';

/**
 * List of AI-identified resume strengths
 */
export function StrengthsList({ strengths = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ThumbsUp className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Key Resume Strengths</h3>
          <p className="text-xs text-slate-500">Areas where your qualifications stand out</p>
        </div>
      </div>

      <ul className="space-y-3">
        {strengths.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
