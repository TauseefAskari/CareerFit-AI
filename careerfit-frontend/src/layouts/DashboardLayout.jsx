import React, { useCallback, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.jsx';

/**
 * Protected dashboard layout with sidebar, header, and content area
 */
export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    mobileMenuButtonRef.current?.focus();
  }, []);

  return (
    <div className="cf-workspace-shell min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
        <div
          className="flex-1 flex flex-col min-w-0"
          inert={mobileMenuOpen}
          aria-hidden={mobileMenuOpen}
        >
          <DashboardHeader
            menuButtonRef={mobileMenuButtonRef}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            isMobileMenuOpen={mobileMenuOpen}
          />
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
