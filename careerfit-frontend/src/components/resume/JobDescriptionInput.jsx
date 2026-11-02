import React from 'react';
import { AlertCircle } from 'lucide-react';

const SAMPLE_JOB_PRESETS = [
  {
    title: 'Senior Frontend Engineer',
    text: `Job Title: Senior Frontend Engineer
Location: Remote (US / Global)
About the Role:
We are seeking a Senior Frontend Engineer to build robust, modern, and accessible web applications using React, TypeScript, and modern CSS/Tailwind.
Requirements:
- 5+ years of experience in modern frontend development with React, TypeScript, and state management.
- Strong knowledge of RESTful APIs, asynchronous workflows, and client-side performance optimization.
- Proficiency in responsive web design, WCAG accessibility standards, and unit/integration testing.
- Experience with Docker, Git version control, and CI/CD deployment pipelines.
- Excellent collaborative problem-solving skills and mentorship capability.`,
  },
  {
    title: 'Full Stack MERN Developer',
    text: `Job Title: Full Stack MERN Developer
Location: Hybrid
About the Role:
Looking for a Full Stack Software Engineer to build end-to-end features across MongoDB, Express, React, and Node.js.
Key Responsibilities:
- Design and implement scalable backend REST APIs using Node.js and Express.
- Build interactive, responsive client-side user interfaces with React and modern hooks.
- Write database schemas and queries in MongoDB/PostgreSQL.
- Ensure security hardening, authentication with JWT/HTTP-only cookies, and robust data validation.
- Work closely with product design to ship customer-facing improvements rapidly.`,
  },
];

/**
 * Multiline input for target job description with character and word counters
 */
export function JobDescriptionInput({
  value = '',
  onChange,
  error,
  disabled = false,
}) {
  const charCount = (value || '').length;
  const wordCount = (value || '').trim() ? (value || '').trim().split(/\s+/).length : 0;

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleApplyPreset = (presetText) => {
    if (disabled) return;
    onChange(presetText);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="job-description-textarea" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Step 2: Target Job Description <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="job-description-textarea"
          rows={7}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Paste the full job description here (e.g., job overview, key responsibilities, required technical skills, and qualifications)..."
          className={`w-full rounded-xl border bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors leading-relaxed ${
            error
              ? 'border-rose-400 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-300 hover:border-slate-400'
          } ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Preset Quick Fill Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Sample presets:</span>
        {SAMPLE_JOB_PRESETS.map((preset) => (
          <button
            key={preset.title}
            type="button"
            onClick={() => handleApplyPreset(preset.text)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-md bg-slate-100 text-indigo-700 hover:bg-indigo-50 transition-colors font-medium border border-slate-200"
          >
            + {preset.title}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
