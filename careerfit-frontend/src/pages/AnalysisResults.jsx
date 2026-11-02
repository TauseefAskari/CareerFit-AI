import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService.js';
import { ScoreGauge } from '../components/analysis/ScoreGauge.jsx';
import { SkillsSection } from '../components/analysis/SkillsSection.jsx';
import { StrengthsList } from '../components/analysis/StrengthsList.jsx';
import { ImprovementsList } from '../components/analysis/ImprovementsList.jsx';
import { SummaryCard } from '../components/analysis/SummaryCard.jsx';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatDate, formatBytes } from '../utils/formatters.js';
import {
  FileText,
  Calendar,
  ArrowLeft,
  Plus,
  History,
  AlertCircle,
} from 'lucide-react';

/**
 * Detailed analysis results report page
 */
export function AnalysisResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Try to use analysis from route state first, or fetch via API by ID
  const stateAnalysis = location.state?.analysis;
  const [analysis, setAnalysis] = useState(
    stateAnalysis?.id === id ? stateAnalysis : null
  );
  const [isLoading, setIsLoading] = useState(stateAnalysis?.id !== id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stateAnalysis?.id === id) {
      setAnalysis(stateAnalysis);
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    let isCurrentRequest = true;
    setAnalysis(null);
    setIsLoading(true);
    setError(null);

    analysisService
      .getAnalysisById(id)
      .then((data) => {
        if (isCurrentRequest) setAnalysis(data);
      })
      .catch((err) => {
        if (isCurrentRequest) {
          setError(err.message || 'Failed to retrieve analysis report.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [id, stateAnalysis]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" className="text-indigo-600" />
        <p className="text-sm font-medium text-slate-600">Retrieving resume evaluation report...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Analysis Report Not Found</h2>
        <p className="text-sm text-slate-600">
          {error || 'The requested analysis results could not be located or may have been cleared.'}
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/history')}>
            View Analysis History
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/analyze')}>
            Analyze a Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/history')}
            leftIcon={<History className="w-3.5 h-3.5" />}
          >
            All History
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/analyze')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Analyze Another Resume
          </Button>
        </div>
      </div>

      {/* Overview Card: Score + Metadata */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="md:col-span-1 flex justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <ScoreGauge score={analysis.matchScore} size={190} />
          </div>

          {/* Role & File Details */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="cf-page-title text-2xl sm:text-3xl text-slate-900">
                Resume match analysis
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-800">Resume:</strong>{' '}
                  {analysis.resumeFileName || 'Filename not retained by the API'}
                  {analysis.resumeFileSize ? ` (${formatBytes(analysis.resumeFileSize)})` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  <strong className="text-slate-800">Evaluated on:</strong> {formatDate(analysis.createdAt)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-100/70 p-3 text-xs leading-relaxed text-slate-500">
              This AI-generated score compares the submitted resume and target job description. It does not predict
              hiring decisions or guarantee ATS outcomes.
            </div>
          </div>
        </div>
      </div>

      {/* Matched & Missing Skills Chips */}
      <SkillsSection matchedSkills={analysis.matchedSkills} missingSkills={analysis.missingSkills} />

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthsList strengths={analysis.strengths} />
        <ImprovementsList improvements={analysis.improvements} />
      </div>

      {/* Suggested Professional Summary */}
      <SummaryCard summary={analysis.suggestedSummary} />

      {/* Bottom Action Footer */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Want to test different job descriptions against this resume?
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            Dashboard
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/analyze')}
            className="w-full sm:w-auto"
            rightIcon={<Plus className="w-4 h-4" />}
          >
            Analyze Another
          </Button>
        </div>
      </div>
    </div>
  );
}
