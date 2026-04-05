// StylesPage - All dance styles listing

import { motion } from 'motion/react';
import { useI18n, translations } from '../../lib/i18n';
import { danceStyles } from '../../lib/data';
import { StyleCard } from '../components/ui/StyleCard';
import { staggerContainer } from '../../lib/animations';

export function StylesPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {translations.nav.styles[language]}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {language === 'es'
              ? 'Descubre nuestros diversos estilos de baile y encuentra tu pasión'
              : 'Discover our diverse dance styles and find your passion'}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {danceStyles
            .filter((s) => s.isActive)
            .map((style) => (
              <StyleCard key={style.id} style={style} />
            ))}
        </motion.div>
      </div>
    </div>
  );
}
