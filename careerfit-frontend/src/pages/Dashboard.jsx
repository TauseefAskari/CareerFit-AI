import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { analysisService } from '../services/analysisService.js';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { QuickStartCard } from '../components/dashboard/QuickStartCard.jsx';
import { RecentAnalysisTable } from '../components/dashboard/RecentAnalysisTable.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Layers, Award, Clock, Plus, RefreshCw } from 'lucide-react';

/**
 * Main protected Dashboard overview page
 */
export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageMatchScore: 0,
    latestAnalysis: null,
    recentAnalyses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analysisService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="cf-page-title text-3xl sm:text-4xl text-slate-900">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your saved analyses or compare your resume with another role.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
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
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <StatCard
          title="Total Analyses"
          value={isLoading || error ? '—' : stats.totalAnalyses}
          subtitle={error ? 'Unable to load analysis history' : 'Resumes analyzed to date'}
          icon={<Layers className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Average Match Score"
          value={
            isLoading || error
              ? '—'
              : stats.totalAnalyses > 0
                ? `${stats.averageMatchScore}%`
                : 'N/A'
          }
          subtitle={error ? 'Unable to load analysis history' : 'Across all resume-to-role comparisons'}
          icon={<Award className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Latest Analysis"
          value={
            isLoading || error
              ? '—'
              : stats.latestAnalysis
              ? `${stats.latestAnalysis.matchScore}%`
              : 'None'
          }
          subtitle={
            error
              ? 'Unable to load analysis history'
              : stats.latestAnalysis
              ? 'Resume match analysis'
              : 'Submit a resume to begin'
          }
          icon={<Clock className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Quick Start Guide */}
      <QuickStartCard />

      {/* Recent Analyses History Section */}
      {!error && <RecentAnalysisTable analyses={stats.recentAnalyses} isLoading={isLoading} />}
    </div>
  );
}
