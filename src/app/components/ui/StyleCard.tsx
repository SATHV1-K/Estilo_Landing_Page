// StyleCard - Dance style card with image and label bar

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { cardReveal } from '../../../lib/animations';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { DanceStyle } from '../../../lib/types';
import { useI18n } from '../../../lib/i18n';

interface StyleCardProps {
  style: DanceStyle;
}

export function StyleCard({ style }: StyleCardProps) {
  const { language } = useI18n();

  return (
    <Link to={`/styles/${style.slug}`}>
      <motion.div
        variants={cardReveal}
        className="group relative bg-white rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={style.cardImage}
              alt={language === 'es' ? style.nameEs : style.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Tagline Overlay */}
          {style.tagline && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
              {style.tagline}
            </div>
          )}
        </div>

        {/* Black Label Bar */}
        <div className="bg-black text-white px-6 py-4">
          <h3 className="font-display text-2xl uppercase tracking-tight">
            {language === 'es' ? style.nameEs : style.name}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
}
