import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { scrollToHomeHeroIfCurrentPage } from '../utils/navigation.js';

/**
 * 404 Not Found fallback view
 */
export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The requested page could not be located. It might have been moved or does not exist.
        </p>
        <div className="pt-2">
          <Link to="/#home-hero" onClick={scrollToHomeHeroIfCurrentPage}>
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
