import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate, getScoreTier } from '../../utils/formatters.js';
import { FileText, ArrowRight, Clock, Plus } from 'lucide-react';
import { Button } from '../common/Button.jsx';

/**
 * Recent analyses table for the dashboard overview
 */
export function RecentAnalysisTable({
  analyses = [],
  isLoading = false,
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-10 shadow-xs text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 mb-1">No resume analyses yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
          Upload your resume and target job description to generate your first AI compatibility report.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/dashboard/analyze')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Analyze Resume Now
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Recent Analyses</h4>
          <p className="text-xs text-slate-500">Your recent resume comparisons and match scores</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/history')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View All History &rarr;
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {analyses.map((item) => {
          const tier = getScoreTier(item.matchScore);
          return (
            <div
              key={item.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">
                      <Link
                        to={`/dashboard/results/${item.id}`}
                        state={{ analysis: item }}
                        className="rounded-sm hover:text-indigo-600"
                      >
                        Resume match analysis
                      </Link>
                    </h5>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${tier.badgeClass}`}>
                      {item.matchScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="truncate max-w-[200px]">
                      {item.resumeFileName || 'Filename unavailable'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/results/${item.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Report
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
