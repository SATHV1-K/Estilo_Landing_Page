// React Router configuration — all page components are lazy-loaded (route-based code splitting).
// Only the layout shells are eagerly loaded; each page chunk is fetched only when navigated to.

import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { AdminShell } from './components/admin/AdminShell';
import { KidsLayout } from './components/kids/KidsLayout';

// ── Lazy page imports ──────────────────────────────────────────────────────────

// Public site
const HomePage               = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const StylesPage             = lazy(() => import('./pages/StylesPage').then(m => ({ default: m.StylesPage })));
const StyleDetailPage        = lazy(() => import('./pages/StyleDetailPage').then(m => ({ default: m.StyleDetailPage })));
const SchedulePage           = lazy(() => import('./pages/SchedulePage').then(m => ({ default: m.SchedulePage })));
const PackagesPage           = lazy(() => import('./pages/PackagesPage').then(m => ({ default: m.PackagesPage })));
const InstructorsPage        = lazy(() => import('./pages/InstructorsPage').then(m => ({ default: m.InstructorsPage })));
const AboutPage              = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage            = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const VideosPage             = lazy(() => import('./pages/VideosPage').then(m => ({ default: m.VideosPage })));
const GalleryPage            = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const ReservationSuccessPage = lazy(() => import('./pages/ReservationSuccessPage').then(m => ({ default: m.ReservationSuccessPage })));
const OnlineLessonsPage      = lazy(() => import('./pages/OnlineLessonsPage').then(m => ({ default: m.OnlineLessonsPage })));
const PrivacyPolicyPage      = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage     = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const NotFoundPage           = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Admin — main
const DashboardPage          = lazy(() => import('./pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ContentPage            = lazy(() => import('./pages/admin/ContentPage').then(m => ({ default: m.ContentPage })));
const MediaPage              = lazy(() => import('./pages/admin/MediaPage').then(m => ({ default: m.MediaPage })));
const InstructorsAdminPage   = lazy(() => import('./pages/admin/InstructorsAdminPage').then(m => ({ default: m.InstructorsAdminPage })));
const StylesAdminPage        = lazy(() => import('./pages/admin/StylesAdminPage').then(m => ({ default: m.StylesAdminPage })));
const ScheduleAdminPage      = lazy(() => import('./pages/admin/ScheduleAdminPage').then(m => ({ default: m.ScheduleAdminPage })));
const SpecialClassesPage     = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.SpecialClassesPage })));
const ReviewsAdminPage       = lazy(() => import('./pages/admin/ReviewsAdminPage').then(m => ({ default: m.ReviewsAdminPage })));
const PackagesAdminPage      = lazy(() => import('./pages/admin/PackagesAdminPage').then(m => ({ default: m.PackagesAdminPage })));
const VideosAdminPage        = lazy(() => import('./pages/admin/VideosAdminPage').then(m => ({ default: m.VideosAdminPage })));
const GalleryAdminPage       = lazy(() => import('./pages/admin/GalleryAdminPage').then(m => ({ default: m.GalleryAdminPage })));
const SettingsPage           = lazy(() => import('./pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AlertsAdminPage        = lazy(() => import('./pages/admin/AlertsAdminPage').then(m => ({ default: m.AlertsAdminPage })));
const MessagesAdminPage      = lazy(() => import('./pages/admin/MessagesAdminPage').then(m => ({ default: m.MessagesAdminPage })));

// Admin — Kids
const KidsContentAdminPage      = lazy(() => import('./pages/admin/kids/KidsContentAdminPage').then(m => ({ default: m.KidsContentAdminPage })));
const KidsProgramsAdminPage     = lazy(() => import('./pages/admin/kids/KidsProgramsAdminPage').then(m => ({ default: m.KidsProgramsAdminPage })));
const KidsGalleryAdminPage      = lazy(() => import('./pages/admin/kids/KidsGalleryAdminPage').then(m => ({ default: m.KidsGalleryAdminPage })));
const KidsAchievementsAdminPage = lazy(() => import('./pages/admin/kids/KidsAchievementsAdminPage').then(m => ({ default: m.KidsAchievementsAdminPage })));

// Admin — Euphoria
const EuphoriaContentAdminPage      = lazy(() => import('./pages/admin/euphoria/EuphoriaContentAdminPage').then(m => ({ default: m.EuphoriaContentAdminPage })));
const EuphoriaGalleryAdminPage      = lazy(() => import('./pages/admin/euphoria/EuphoriaGalleryAdminPage').then(m => ({ default: m.EuphoriaGalleryAdminPage })));
const EuphoriaTestimonialsAdminPage = lazy(() => import('./pages/admin/euphoria/EuphoriaTestimonialsAdminPage').then(m => ({ default: m.EuphoriaTestimonialsAdminPage })));
const EuphoriaAuditionsAdminPage    = lazy(() => import('./pages/admin/euphoria/EuphoriaAuditionsAdminPage').then(m => ({ default: m.EuphoriaAuditionsAdminPage })));

// Kids public
const EuphoriaLayout          = lazy(() => import('./components/euphoria/EuphoriaLayout').then(m => ({ default: m.EuphoriaLayout })));
const EuphoriaHomePage        = lazy(() => import('./pages/euphoria/EuphoriaHomePage').then(m => ({ default: m.EuphoriaHomePage })));
const EuphoriaGalleryPage     = lazy(() => import('./pages/euphoria/EuphoriaGalleryPage').then(m => ({ default: m.EuphoriaGalleryPage })));
const EuphoriaTestimonialsPage = lazy(() => import('./pages/euphoria/EuphoriaTestimonialsPage').then(m => ({ default: m.EuphoriaTestimonialsPage })));

const KidsHomePage           = lazy(() => import('./pages/kids/KidsHomePage').then(m => ({ default: m.KidsHomePage })));
const KidsAboutPage          = lazy(() => import('./pages/kids/KidsAboutPage').then(m => ({ default: m.KidsAboutPage })));
const KidsGalleryPage        = lazy(() => import('./pages/kids/KidsGalleryPage').then(m => ({ default: m.KidsGalleryPage })));
const KidsAchievementsPage   = lazy(() => import('./pages/kids/KidsAchievementsPage').then(m => ({ default: m.KidsAchievementsPage })));
const KidsProgramDetailPage  = lazy(() => import('./pages/kids/KidsProgramDetailPage').then(m => ({ default: m.KidsProgramDetailPage })));
const KidsSchedulePage       = lazy(() => import('./pages/kids/KidsSchedulePage').then(m => ({ default: m.KidsSchedulePage })));

// ── Suspense fallback ──────────────────────────────────────────────────────────
// Minimal spinner that matches the dark theme; shown while a chunk is loading.
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '3px solid #2A2A2A',
        borderTopColor: '#F6B000',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return function SuspenseWrapper(props: Record<string, unknown>) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export const router = createBrowserRouter([
  // ── Admin panel ── all routes share AdminShell (auth gate + sidebar) ─────────
  {
    path: '/admin',
    Component: AdminShell,
    children: [
      { index: true,                      Component: withSuspense(DashboardPage) },
      { path: 'content',                  Component: withSuspense(ContentPage) },
      { path: 'media',                    Component: withSuspense(MediaPage) },
      { path: 'instructors',             Component: withSuspense(InstructorsAdminPage) },
      { path: 'styles',                  Component: withSuspense(StylesAdminPage) },
      { path: 'schedule',                Component: withSuspense(ScheduleAdminPage) },
      { path: 'special-classes',         Component: withSuspense(SpecialClassesPage) },
      { path: 'reviews',                 Component: withSuspense(ReviewsAdminPage) },
      { path: 'packages',                Component: withSuspense(PackagesAdminPage) },
      { path: 'videos',                  Component: withSuspense(VideosAdminPage) },
      { path: 'gallery',                 Component: withSuspense(GalleryAdminPage) },
      { path: 'settings',                Component: withSuspense(SettingsPage) },
      { path: 'alerts',                  Component: withSuspense(AlertsAdminPage) },
      { path: 'messages',                Component: withSuspense(MessagesAdminPage) },
      // ── Kids admin ──
      { path: 'kids/content',            Component: withSuspense(KidsContentAdminPage) },
      { path: 'kids/programs',           Component: withSuspense(KidsProgramsAdminPage) },
      { path: 'kids/gallery',            Component: withSuspense(KidsGalleryAdminPage) },
      { path: 'kids/achievements',       Component: withSuspense(KidsAchievementsAdminPage) },
      // ── Euphoria admin ──
      { path: 'euphoria/content',        Component: withSuspense(EuphoriaContentAdminPage) },
      { path: 'euphoria/gallery',        Component: withSuspense(EuphoriaGalleryAdminPage) },
      { path: 'euphoria/testimonials',   Component: withSuspense(EuphoriaTestimonialsAdminPage) },
      { path: 'euphoria/auditions',      Component: withSuspense(EuphoriaAuditionsAdminPage) },
    ],
  },

  // ── Euphoria Ladies mini-site ── dark + pink theme, separate from main site ──
  {
    path: '/euphoria-ladies',
    Component: withSuspense(EuphoriaLayout),
    children: [
      { index: true,          Component: withSuspense(EuphoriaHomePage) },
      { path: 'gallery',      Component: withSuspense(EuphoriaGalleryPage) },
      { path: 'testimonials', Component: withSuspense(EuphoriaTestimonialsPage) },
    ],
  },

  // ── Kids mini-site ── blue theme layout, completely separate from main site ──
  {
    path: '/kids',
    Component: KidsLayout,
    children: [
      { index: true,              Component: withSuspense(KidsHomePage) },
      { path: 'about',           Component: withSuspense(KidsAboutPage) },
      { path: 'schedule',        Component: withSuspense(KidsSchedulePage) },
      { path: 'gallery',         Component: withSuspense(KidsGalleryPage) },
      { path: 'achievements',    Component: withSuspense(KidsAchievementsPage) },
      { path: 'programs/:id',    Component: withSuspense(KidsProgramDetailPage) },
    ],
  },

  // ── Public site ── all pages share dark Layout (Header + Footer) ─────────────
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,              Component: withSuspense(HomePage) },
      { path: 'styles',           Component: withSuspense(StylesPage) },
      { path: 'styles/:slug',     Component: withSuspense(StyleDetailPage) },
      { path: 'schedule',         Component: withSuspense(SchedulePage) },
      { path: 'videos',           Component: withSuspense(VideosPage) },
      { path: 'gallery',          Component: withSuspense(GalleryPage) },
      { path: 'packages',         Component: withSuspense(PackagesPage) },
      { path: 'instructors',      Component: withSuspense(InstructorsPage) },
      { path: 'about',            Component: withSuspense(AboutPage) },
      { path: 'contact',          Component: withSuspense(ContactPage) },
      { path: 'reserve/success',  Component: withSuspense(ReservationSuccessPage) },
      { path: 'online-lessons',   Component: withSuspense(OnlineLessonsPage) },
      { path: 'privacy',          Component: withSuspense(PrivacyPolicyPage) },
      { path: 'terms',            Component: withSuspense(TermsOfServicePage) },
      { path: '*',                Component: withSuspense(NotFoundPage) },
    ],
  },
]);
