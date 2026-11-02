import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, Plus, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button.jsx';

/**
 * Top header in dashboard with breadcrumbs and New Analysis CTA
 */
export function DashboardHeader({ onOpenMobileMenu, isMobileMenuOpen = false, menuButtonRef }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumb = () => {
    const pathname = location.pathname;
    if (pathname === '/dashboard') return 'Overview';
    if (pathname === '/dashboard/analyze') return 'Analyze Resume';
    if (pathname.startsWith('/dashboard/results')) return 'Analysis Results';
    if (pathname === '/dashboard/history') return 'Analysis History';
    if (pathname === '/dashboard/profile') return 'Profile Settings';
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          ref={menuButtonRef}
          onClick={onOpenMobileMenu}
          aria-controls="workspace-navigation"
          aria-expanded={isMobileMenuOpen}
          className="inline-flex min-h-11 min-w-11 -ml-2 items-center justify-center text-slate-500 hover:text-slate-800 md:hidden rounded-lg hover:bg-slate-100"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
            Workspace
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {location.pathname !== '/dashboard/analyze' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/dashboard/analyze')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Analysis
          </Button>
        )}
      </div>
    </header>
  );
}
