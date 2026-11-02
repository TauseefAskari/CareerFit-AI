import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../common/BrandMark.jsx';
import { scrollToHomeHeroIfCurrentPage } from '../../utils/navigation.js';

/**
 * Footer component with links, copyright, and employment disclaimer
 */
export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              to="/#home-hero"
              onClick={scrollToHomeHeroIfCurrentPage}
              className="flex items-center gap-2.5 text-white font-bold text-lg"
            >
              <BrandMark className="h-8 w-8" />
              <span>CareerFit AI</span>
            </Link>
            <p className="cf-measure text-sm text-slate-400 leading-relaxed">
              Compare a resume with a job description, then review its score, skill gaps, strengths, and suggestions.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase">Platform</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard/analyze" className="hover:text-white transition-colors">
                  Analyze Resume
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/history" className="hover:text-white transition-colors">
                  Analysis History
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase">Account</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className="hover:text-white transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="max-w-[65ch] text-center md:text-left">
            Scores and suggestions are analytical guidance, not hiring guarantees or automated employment decisions.
          </p>
          <p className="shrink-0 text-slate-400">
            &copy; {new Date().getFullYear()} CareerFit AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
