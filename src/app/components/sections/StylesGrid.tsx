// StylesGrid - 3-column grid of dance styles with gradient background

import { motion } from 'motion/react';
import { useI18n, translations } from '../../../lib/i18n';
import { staggerContainer } from '../../../lib/animations';
import { useScrollReveal } from '../../../lib/hooks/useScrollReveal';
import { StyleCard } from '../ui/StyleCard';
import { DanceStyle } from '../../../lib/types';
import { AnimatedLetters } from '../ui/AnimatedLetters';

interface StylesGridProps {
  styles: DanceStyle[];
  maxVisible?: number;
}

export function StylesGrid({ styles, maxVisible = 6 }: StylesGridProps) {
  const { language } = useI18n();
  const { ref, isInView } = useScrollReveal({ amount: 0.2 });

  const visibleStyles = styles.filter((s) => s.isActive).slice(0, maxVisible);

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, var(--gradient-start) 0%, var(--gradient-end) 100%)`,
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <AnimatedLetters text={translations.sections.styles.title[language]} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="text-xl uppercase tracking-wider text-ink-soft mt-4"
          >
            {translations.sections.styles.subtitle[language]}
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref as any}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleStyles.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
