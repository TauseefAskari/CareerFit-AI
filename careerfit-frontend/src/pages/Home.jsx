import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { analysisService } from '../services/analysisService.js';
import { formatDate } from '../utils/formatters.js';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Search,
  Target,
  Zap,
} from 'lucide-react';

const DEMO_SCORE = 78;
const DEMO_SCORE_DURATION = 1100;

/**
 * Marketing landing page for CareerFit AI
 */
export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [historyOwnerId, setHistoryOwnerId] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const reportPreviewRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== '/' || location.hash !== '#home-hero') return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('home-hero')?.scrollIntoView({ block: 'start' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key, location.pathname]);

  useEffect(() => {
    if (isAuthLoading) return undefined;

    let isCurrent = true;
    if (!isAuthenticated) {
      setLatestAnalysis(null);
      setHistoryOwnerId(null);
      setHistoryError(null);
      setHistoryLoaded(true);
      return () => {
        isCurrent = false;
      };
    }

    setHistoryLoaded(false);
    setHistoryError(null);
    analysisService.getHistory()
      .then((history) => {
        if (isCurrent) setLatestAnalysis(history[0] || null);
      })
      .catch((error) => {
        if (isCurrent) setHistoryError(error.message || 'Your latest analysis could not be loaded.');
      })
      .finally(() => {
        if (isCurrent) {
          setHistoryOwnerId(user?.id || null);
          setHistoryLoaded(true);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated, isAuthLoading, historyRefreshKey, user?.id]);

  const isCurrentHistory = isAuthenticated && historyOwnerId === user?.id;
  const reportAnalysis = isCurrentHistory ? latestAnalysis : null;
  const reportError = isCurrentHistory ? historyError : null;
  const isReportLoading = isAuthLoading || !historyLoaded || (isAuthenticated && !isCurrentHistory);
  const isDemoReport = !isAuthLoading && historyLoaded && !reportError && !reportAnalysis;
  const reportIsReady = !isReportLoading && !reportError;
  const reportScore = reportAnalysis
    ? Math.max(0, Math.min(100, Math.round(Number(reportAnalysis.matchScore) || 0)))
    : DEMO_SCORE;

  useEffect(() => {
    if (!reportIsReady) return undefined;

    const targetScore = reportScore;
    let animationFrame;
    let startTime;
    setDisplayedScore(0);

    const updateScore = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / DEMO_SCORE_DURATION, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayedScore(Math.round(targetScore * easedProgress));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(updateScore);
      }
    };

    let observer;
    let hasStarted = false;
    const startAnimation = () => {
      if (hasStarted) return;
      hasStarted = true;
      observer?.disconnect();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplayedScore(targetScore);
      } else {
        animationFrame = window.requestAnimationFrame(updateScore);
      }
    };

    const checkVisibility = () => {
      const preview = reportPreviewRef.current;
      if (!preview) return;

      const bounds = preview.getBoundingClientRect();
      const visibleWidth = Math.max(0, Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0));
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
      const visibleRatio = bounds.width && bounds.height
        ? (visibleWidth * visibleHeight) / (bounds.width * bounds.height)
        : 0;

      if (visibleRatio >= 0.25) startAnimation();
    };

    if (!reportPreviewRef.current || !('IntersectionObserver' in window)) {
      startAnimation();
    } else {
      observer = new window.IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;

        startAnimation();
      }, { threshold: 0.25 });
      observer.observe(reportPreviewRef.current);
      checkVisibility();
      window.addEventListener('scroll', checkVisibility, { passive: true });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', checkVisibility);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, [reportIsReady, reportScore, reportAnalysis?.id]);

  const retryHistory = () => {
    setHistoryLoaded(false);
    setHistoryRefreshKey((key) => key + 1);
  };

  const handleStartAnalysis = () => {
    navigate(isAuthenticated ? '/dashboard/analyze' : '/register');
  };

  return (
    <div className="space-y-24 pb-20 md:space-y-32">
      <section id="home-hero" className="cf-hero scroll-mt-24 px-6 pb-12 pt-16 sm:pt-20 lg:pb-20 lg:pt-28">
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-7">
            <h1 className="cf-display text-slate-900">
              Resume Analysis,
              <br />
              <span className="cf-display-accent">focused on the role.</span>
            </h1>

            <p className="cf-measure text-base leading-relaxed text-slate-600 sm:text-lg">
              Compare your resume with a job description. Review your score, skill matches and gaps, strengths, and
              suggestions in one report.
            </p>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartAnalysis}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Analyze My Resume
              </Button>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                See how it works
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                PDF or DOCX
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                A target job description
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Saved analysis history
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              ref={reportPreviewRef}
              className="cf-report-preview overflow-hidden rounded-2xl"
              aria-label={isDemoReport
                ? 'Illustrative sample resume analysis report, not a real analysis'
                : 'Latest saved resume analysis report'}
            >
              {isReportLoading ? (
                <div className="space-y-5 p-6 sm:p-7" aria-label="Loading latest analysis" role="status">
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-700" />
                  <div className="h-20 animate-pulse rounded-lg bg-slate-800" />
                  <div className="h-16 animate-pulse rounded-lg bg-slate-800" />
                  <span className="sr-only">Loading your latest analysis...</span>
                </div>
              ) : reportError ? (
                <div className="space-y-4 p-5 sm:p-7">
                  <p className="text-sm font-semibold text-slate-100">Latest report unavailable</p>
                  <Alert type="error">{reportError}</Alert>
                  <Button variant="outline" size="sm" onClick={retryHistory}>
                    Try again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7">
                    <div className="min-w-0">
                      <p className="cf-label">{isDemoReport ? 'Sample report' : 'Latest analysis'}</p>
                      <p className="mt-1 truncate text-sm font-medium text-slate-600">
                        {isDemoReport
                          ? 'Product Designer'
                          : reportAnalysis.resumeFileName || 'Saved resume analysis'}
                      </p>
                    </div>
                    {isDemoReport ? (
                      <span className="cf-report-demo-badge">Illustrative data</span>
                    ) : (
                      <Link
                        to={`/dashboard/results/${reportAnalysis.id}`}
                        state={{ analysis: reportAnalysis }}
                        className="cf-report-demo-badge inline-flex items-center gap-1 transition-colors hover:border-indigo-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        View report <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  <div className="cf-report-demo-score px-5 py-6 sm:px-7">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="cf-label">Match score</p>
                        <p className="cf-report-demo-value mt-2" aria-hidden="true">
                          {displayedScore}<span>%</span>
                        </p>
                        <span className="sr-only">
                          {isDemoReport
                            ? `${reportScore}% match score, illustrative example only; not a real analysis.`
                            : `${reportScore}% match score from your latest saved analysis.`}
                        </span>
                      </div>
                      <p className="cf-report-demo-note">
                        {isDemoReport ? (
                          <>Example only<br />Not a real analysis</>
                        ) : (
                          <>Saved report<br />{formatDate(reportAnalysis.createdAt)}</>
                        )}
                      </p>
                    </div>
                    <div
                      className="cf-score-track mt-5 h-2 overflow-hidden rounded-full"
                      role="progressbar"
                      aria-label={isDemoReport ? 'Illustrative match score' : 'Latest analysis match score'}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={displayedScore}
                      aria-valuetext={isDemoReport
                        ? `${displayedScore} percent, illustrative example only`
                        : `${displayedScore} percent, latest saved analysis`}
                    >
                      <div
                        className="cf-score-fill h-full w-full origin-left rounded-full"
                        style={{ transform: `scaleX(${displayedScore / 100})` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between font-mono text-xs tabular-nums text-slate-400" aria-hidden="true">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="space-y-4 px-5 py-5 sm:px-7">
                    <div>
                      <p className="cf-label">{isDemoReport ? 'Matched skills' : 'Skills matched'}</p>
                      <ul
                        className="cf-report-demo-skills mt-2"
                        aria-label={isDemoReport ? 'Illustrative matched skills' : 'Matched skills from latest analysis'}
                      >
                        {(isDemoReport
                          ? ['Figma', 'Prototyping', 'Design systems']
                          : (reportAnalysis.matchedSkills || []).slice(0, 3)
                        ).map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}
                        {!isDemoReport && !reportAnalysis.matchedSkills?.length && (
                          <li>See full report for skill details</li>
                        )}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                      <p className="text-sm font-medium text-slate-700">
                        {isDemoReport ? 'Potential gap' : 'Needs review'}
                      </p>
                      <span className="cf-report-demo-gap">
                        {isDemoReport
                          ? 'Accessibility testing'
                          : reportAnalysis.missingSkills?.slice(0, 2).join(', ') || 'No gaps listed'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <div>
              <h2 className="cf-page-title max-w-md text-3xl text-slate-900 sm:text-4xl">
                One report. A clearer view of your fit.
              </h2>
              <p className="cf-measure mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                The report gathers your score and supporting details so you can choose what to review next.
              </p>
            </div>

            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              <article className="grid gap-3 py-5 sm:grid-cols-[2rem_1fr] sm:gap-5">
                <Target className="mt-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">A role-specific match score</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    See a compatibility score for the resume and job description you submitted.
                  </p>
                </div>
              </article>
              <article className="grid gap-3 py-5 sm:grid-cols-[2rem_1fr] sm:gap-5">
                <Search className="mt-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Skills in context</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Review matched skills and keywords alongside potential gaps from the target role.
                  </p>
                </div>
              </article>
              <article className="grid gap-3 py-5 sm:grid-cols-[2rem_1fr] sm:gap-5">
                <Zap className="mt-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Suggestions to review</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Read the identified strengths, suggested improvements, and proposed professional summary.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <figure className="cf-ats-illustration overflow-hidden rounded-2xl">
            <img
              src="/ats-checker.svg"
              width="623"
              height="483"
              alt="Illustration of a resume being reviewed by a scoring device with feedback on screen."
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span className="cf-label">Illustration</span>
              <span>Resume review</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-6">
        <div className="max-w-2xl">
          <h2 className="cf-page-title text-3xl text-slate-900 sm:text-4xl">From resume to review</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Start with one role, then use the report to guide your next resume revision.
          </p>
        </div>

        <ol className="mt-10 grid gap-x-10 md:grid-cols-3">
          <li className="border-t border-slate-300 py-5">
            <span className="cf-label">01 / Upload</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Choose your resume</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Upload one PDF or DOCX file, up to 5 MB.
            </p>
          </li>
          <li className="border-t border-slate-300 py-5">
            <span className="cf-label">02 / Compare</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Add the job description</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Paste the description for the role you want to review.
            </p>
          </li>
          <li className="border-t border-slate-300 py-5">
            <span className="cf-label">03 / Review</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Read your analysis</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              See the score, skills, strengths, and suggestions in your report.
            </p>
          </li>
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 border-y border-slate-200 py-10 sm:flex-row sm:items-center sm:py-12">
          <div className="cf-measure">
            <h2 className="cf-page-title text-2xl text-slate-900 sm:text-3xl">
              Start with the role you have in mind.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Scores and suggestions are analytical guidance, not hiring guarantees or automated employment decisions.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartAnalysis}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Analyze My Resume
          </Button>
        </div>
      </section>
    </div>
  );
}
