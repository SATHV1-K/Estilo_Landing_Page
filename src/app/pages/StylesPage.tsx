// StylesPage — reads dance styles from adminData (localStorage) with seed
// data as fallback, so admin changes are reflected immediately.

import { motion } from 'motion/react';
import { useI18n, translations } from '../../lib/i18n';
import { getStyles } from '../../lib/adminData';
import { useCmsContent } from '../../lib/hooks/useCmsContent';
import { StyleCard } from '../components/ui/StyleCard';
import { staggerContainer } from '../../lib/animations';

export function StylesPage() {
  const { language } = useI18n();

  const styles = getStyles().filter((s) => s.isActive);

  const cms = useCmsContent({
    'styles.heading':      'DANCE STYLES',
    'styles.heading_es':   'ESTILOS DE BAILE',
    'styles.subheading':   'Discover our diverse dance styles and find your passion',
    'styles.subheading_es': 'Descubre nuestros diversos estilos de baile y encuentra tu pasión',
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {language === 'es' ? cms['styles.heading_es'] : cms['styles.heading']}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {language === 'es' ? cms['styles.subheading_es'] : cms['styles.subheading']}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {styles.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
