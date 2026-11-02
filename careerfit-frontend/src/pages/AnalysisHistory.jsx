import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService.js';
import { formatDate, getScoreTier } from '../utils/formatters.js';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import {
  FileText,
  Search,
  ArrowRight,
  Clock,
  Plus,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

/**
 * Filterable analysis history page
 */
export function AnalysisHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analysisService.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve analysis history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.resumeFileName || '').toLowerCase().includes(q) ||
      (item.matchedSkills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="cf-page-title text-3xl sm:text-4xl text-slate-900">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past resume comparisons, match scores, and matched skills.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/analyze')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Analysis
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error">
          {error}
        </Alert>
      )}

      {/* Search Filter Bar */}
      {history.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search analyses by resume filename or matched skill"
            placeholder="Search by filename or matched skill..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-xs"
          />
        </div>
      )}

      {/* Content State */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <Spinner size="lg" className="text-indigo-600" />
          <p className="text-sm font-medium text-slate-600">Loading analysis records...</p>
        </div>
      ) : error && history.length === 0 ? null : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Analysis History Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              You haven't run any resume evaluations yet. Upload your resume and job description to see your first report.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/analyze')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Analyze Your First Resume
            </Button>
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center shadow-xs">
          <p className="text-sm text-slate-600">
            No analyses match “{searchQuery}”. Try another filename or skill.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredHistory.map((item) => {
            const tier = getScoreTier(item.matchScore);
            return (
              <article
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        <Link
                          to={`/dashboard/results/${item.id}`}
                          state={{ analysis: item }}
                          className="rounded-sm hover:text-indigo-600"
                        >
                          Resume match analysis
                        </Link>
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${tier.badgeClass}`}>
                        {item.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="truncate max-w-[220px]">
                        {item.resumeFileName || 'Filename unavailable'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    {/* Matched skills preview */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(item.matchedSkills || []).slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {(item.matchedSkills || []).length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                          +{item.matchedSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/results/${item.id}`, { state: { analysis: item } });
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Report
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
