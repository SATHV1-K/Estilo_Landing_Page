// Layout - Main layout wrapper with Header and Footer

import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';
import { AlertPopup } from './AlertPopup';

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <AlertPopup />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
