// Layout - Main layout wrapper with Header and Footer

import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';
import { AlertPopup } from './AlertPopup';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { ScrollProgressBar } from '../ui/ScrollProgressBar';

const PATH_TITLES: Record<string, string> = {
  '/':                'Estilo Latino Dance Company',
  '/styles':          'Dance Styles | Estilo Latino Dance Company',
  '/schedule':        'Class Schedule | Estilo Latino Dance Company',
  '/packages':        'Classes & Pricing | Estilo Latino Dance Company',
  '/instructors':     'Our Instructors | Estilo Latino Dance Company',
  '/about':           'About Us | Estilo Latino Dance Company',
  '/contact':         'Contact | Estilo Latino Dance Company',
  '/videos':          'Videos | Estilo Latino Dance Company',
  '/gallery':         'Gallery | Estilo Latino Dance Company',
  '/online-lessons':  'Online Lessons | Estilo Latino Dance Company',
  '/privacy':         'Privacy Policy | Estilo Latino Dance Company',
  '/terms':           'Terms of Service | Estilo Latino Dance Company',
  '/reserve/success': 'Reservation Confirmed | Estilo Latino Dance Company',
};

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    const title = PATH_TITLES[location.pathname];
    if (title) document.title = title;
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <ScrollProgressBar />
      <AlertPopup />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
