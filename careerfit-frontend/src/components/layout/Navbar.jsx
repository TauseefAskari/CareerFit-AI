import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { BrandMark } from '../common/BrandMark.jsx';
import { scrollToHomeHeroIfCurrentPage } from '../../utils/navigation.js';

/**
 * Top navigation bar following strict one-line 3-zone contract
 */
export function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element brand wordmark */}
        <Link
          to="/#home-hero"
          onClick={scrollToHomeHeroIfCurrentPage}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <BrandMark className="h-8 w-8" />
          <span>CareerFit AI</span>
        </Link>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link
            to="/#home-hero"
            onClick={scrollToHomeHeroIfCurrentPage}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Home
          </Link>
          <a href="#features" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          {isAuthenticated ? (
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Sign In
            </Link>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/analyze')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze Resume
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
            aria-controls="site-mobile-navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div
        id="site-mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-b border-slate-200 bg-white px-6 py-4 space-y-3`}
      >
        <Link
          to="/#home-hero"
          onClick={(event) => {
            setMobileMenuOpen(false);
            scrollToHomeHeroIfCurrentPage(event);
          }}
          className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
        >
          Home
        </Link>
        <a
          href="#features"
          onClick={() => setMobileMenuOpen(false)}
          className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          onClick={() => setMobileMenuOpen(false)}
          className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
        >
          How It Works
        </a>
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-indigo-600"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            Sign In
          </Link>
        )}
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate(isAuthenticated ? '/dashboard/analyze' : '/register');
            }}
          >
            {isAuthenticated ? 'Analyze Resume' : 'Get Started Free'}
          </Button>
        </div>
      </div>
    </header>
  );
}
