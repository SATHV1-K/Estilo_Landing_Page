// NotFoundPage - 404 page

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function NotFoundPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-cream flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <h1 className="font-display text-[10rem] leading-none text-accent mb-4">
          404
        </h1>
        <h2 className="font-display text-4xl mb-6">
          {language === 'es' ? 'Página No Encontrada' : 'Page Not Found'}
        </h2>
        <p className="text-xl text-ink-soft mb-8 max-w-md mx-auto">
          {language === 'es'
            ? 'Lo sentimos, la página que buscas no existe.'
            : "Sorry, the page you're looking for doesn't exist."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider rounded-lg transition-all"
        >
          <Home size={20} />
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Link>
      </motion.div>
    </div>
  );
}
