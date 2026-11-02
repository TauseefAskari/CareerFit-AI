import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

/**
 * Matched and missing technical competencies breakdown
 */
export function SkillsSection({ matchedSkills = [], missingSkills = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Matched Skills & Keywords</h3>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {matchedSkills.length} identified
          </span>
        </div>

        {matchedSkills.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No matched skills were listed in this analysis.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Skills */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Identified Skill Gaps</h3>
          </div>
          <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            {missingSkills.length} missing
          </span>
        </div>

        {missingSkills.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No missing skills were listed in this analysis.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{skill}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
