import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.jsx';

/**
 * Onboarding card detailing 3-step resume analysis flow
 */
export function QuickStartCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-sm border border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <h3 className="text-lg md:text-xl font-bold tracking-tight">
            Three steps from resume to analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold border border-indigo-400/40">
                1
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload your latest resume in <strong className="text-white">.pdf</strong> or <strong className="text-white">.docx</strong> format (up to 5 MB).
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold border border-indigo-400/40">
                2
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste the specific requirements and role description from the hiring posting.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold border border-indigo-400/40">
                3
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review a match score, matched and missing skills, strengths, and suggestions.
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard/analyze')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
