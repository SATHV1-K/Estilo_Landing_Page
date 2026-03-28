// Main App Component - Estilo Latino Dance Company

import { RouterProvider } from 'react-router';
import { I18nProvider } from '../lib/i18n';
import { router } from './routes';

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
