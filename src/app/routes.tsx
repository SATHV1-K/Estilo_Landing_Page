// React Router configuration

import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { StylesPage } from './pages/StylesPage';
import { StyleDetailPage } from './pages/StyleDetailPage';
import { SchedulePage } from './pages/SchedulePage';
import { PackagesPage } from './pages/PackagesPage';
import { InstructorsPage } from './pages/InstructorsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'styles', Component: StylesPage },
      { path: 'styles/:slug', Component: StyleDetailPage },
      { path: 'schedule', Component: SchedulePage },
      { path: 'packages', Component: PackagesPage },
      { path: 'instructors', Component: InstructorsPage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
