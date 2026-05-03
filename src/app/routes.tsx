// React Router configuration

import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { AdminShell } from './components/admin/AdminShell';
import { KidsLayout } from './components/kids/KidsLayout';
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
import { GalleryPage } from './pages/GalleryPage';
import { GalleryAdminPage } from './pages/admin/GalleryAdminPage';
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
import { MessagesAdminPage } from './pages/admin/MessagesAdminPage';
// Kids public pages
import { KidsHomePage } from './pages/kids/KidsHomePage';
import { KidsAboutPage } from './pages/kids/KidsAboutPage';
import { KidsGalleryPage } from './pages/kids/KidsGalleryPage';
import { KidsAchievementsPage } from './pages/kids/KidsAchievementsPage';
import { KidsProgramDetailPage } from './pages/kids/KidsProgramDetailPage';
import { KidsSchedulePage } from './pages/kids/KidsSchedulePage';
// Kids admin pages
import { KidsContentAdminPage } from './pages/admin/kids/KidsContentAdminPage';
import { KidsProgramsAdminPage } from './pages/admin/kids/KidsProgramsAdminPage';
import { KidsGalleryAdminPage } from './pages/admin/kids/KidsGalleryAdminPage';
import { KidsAchievementsAdminPage } from './pages/admin/kids/KidsAchievementsAdminPage';
import { EuphoriaLadiesPage } from './pages/EuphoriaLadiesPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

export const router = createBrowserRouter([
  // ── Admin panel ── all routes share AdminShell (auth gate + sidebar) ─────────
  {
    path: '/admin',
    Component: AdminShell,
    children: [
      { index: true,                      Component: DashboardPage },
      { path: 'content',                  Component: ContentPage },
      { path: 'media',                    Component: MediaPage },
      { path: 'instructors',             Component: InstructorsAdminPage },
      { path: 'styles',                  Component: StylesAdminPage },
      { path: 'schedule',                Component: ScheduleAdminPage },
      { path: 'special-classes',         Component: SpecialClassesPage },
      { path: 'reviews',                 Component: ReviewsAdminPage },
      { path: 'packages',                Component: PackagesAdminPage },
      { path: 'videos',                  Component: VideosAdminPage },
      { path: 'gallery',                 Component: GalleryAdminPage },
      { path: 'settings',                Component: SettingsPage },
      { path: 'alerts',                  Component: AlertsAdminPage },
      { path: 'messages',                Component: MessagesAdminPage },
      // ── Kids admin ──
      { path: 'kids/content',            Component: KidsContentAdminPage },
      { path: 'kids/programs',           Component: KidsProgramsAdminPage },
      { path: 'kids/gallery',            Component: KidsGalleryAdminPage },
      { path: 'kids/achievements',       Component: KidsAchievementsAdminPage },
    ],
  },

  // ── Kids mini-site ── blue theme layout, completely separate from main site ──
  {
    path: '/kids',
    Component: KidsLayout,
    children: [
      { index: true,              Component: KidsHomePage },
      { path: 'about',           Component: KidsAboutPage },
      { path: 'schedule',        Component: KidsSchedulePage },
      { path: 'gallery',         Component: KidsGalleryPage },
      { path: 'achievements',    Component: KidsAchievementsPage },
      { path: 'programs/:id',    Component: KidsProgramDetailPage },
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
      { path: 'videos',           Component: VideosPage },
      { path: 'gallery',          Component: GalleryPage },
      { path: 'packages',         Component: PackagesPage },
      { path: 'instructors',      Component: InstructorsPage },
      { path: 'about',            Component: AboutPage },
      { path: 'contact',          Component: ContactPage },
      { path: 'reserve/success',  Component: ReservationSuccessPage },
      { path: 'euphoria-ladies',  Component: EuphoriaLadiesPage },
      { path: 'privacy',          Component: PrivacyPolicyPage },
      { path: 'terms',            Component: TermsOfServicePage },
      { path: '*',                Component: NotFoundPage },
    ],
  },
]);
