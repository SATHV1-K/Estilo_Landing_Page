// React Router configuration

import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { AdminShell } from './components/admin/AdminShell';
import { HomePage } from './pages/HomePage';
import { StylesPage } from './pages/StylesPage';
import { StyleDetailPage } from './pages/StyleDetailPage';
import { SchedulePage } from './pages/SchedulePage';
import { PackagesPage } from './pages/PackagesPage';
import { InstructorsPage } from './pages/InstructorsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { VideosPage } from './pages/VideosPage';
import { SpecialClassesPage } from './pages/AdminPage';
import { ReservationSuccessPage } from './pages/ReservationSuccessPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ContentPage } from './pages/admin/ContentPage';
import { MediaPage } from './pages/admin/MediaPage';
import { InstructorsAdminPage } from './pages/admin/InstructorsAdminPage';
import { StylesAdminPage } from './pages/admin/StylesAdminPage';
import { ScheduleAdminPage } from './pages/admin/ScheduleAdminPage';
import { ReviewsAdminPage } from './pages/admin/ReviewsAdminPage';
import { PackagesAdminPage } from './pages/admin/PackagesAdminPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { AlertsAdminPage } from './pages/admin/AlertsAdminPage';
import { VideosAdminPage } from './pages/admin/VideosAdminPage';
import { KidsPage } from './pages/KidsPage';

export const router = createBrowserRouter([
  // ── Admin panel ── all routes share AdminShell (auth gate + sidebar) ────────
  {
    path: '/admin',
    Component: AdminShell,
    children: [
      { index: true,              Component: DashboardPage },
      { path: 'content',          Component: ContentPage },
      { path: 'media',            Component: MediaPage },
      { path: 'instructors',      Component: InstructorsAdminPage },
      { path: 'styles',           Component: StylesAdminPage },
      { path: 'schedule',         Component: ScheduleAdminPage },
      { path: 'special-classes',  Component: SpecialClassesPage },
      { path: 'reviews',          Component: ReviewsAdminPage },
      { path: 'packages',         Component: PackagesAdminPage },
      { path: 'videos',           Component: VideosAdminPage },
      { path: 'settings',         Component: SettingsPage },
      { path: 'alerts',           Component: AlertsAdminPage },
    ],
  },

  // ── Public site ── all pages share dark Layout (Header + Footer) ─────────────
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,              Component: HomePage },
      { path: 'styles',           Component: StylesPage },
      { path: 'styles/:slug',     Component: StyleDetailPage },
      { path: 'schedule',         Component: SchedulePage },
      { path: 'videos',            Component: VideosPage },
      { path: 'packages',         Component: PackagesPage },
      { path: 'instructors',      Component: InstructorsPage },
      { path: 'about',            Component: AboutPage },
      { path: 'contact',          Component: ContactPage },
      { path: 'kids',             Component: KidsPage },
      { path: 'reserve/success',  Component: ReservationSuccessPage },
      { path: '*',                Component: NotFoundPage },
    ],
  },
]);
