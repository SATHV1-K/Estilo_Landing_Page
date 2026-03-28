// HeroDiagonal - Diagonal split hero section with animations

import { motion } from 'motion/react';
import { useI18n } from '../../../lib/i18n';
import {
  heroHeadline,
  heroSubheadline,
  heroCTA,
  heroImage,
} from '../../../lib/animations';
import { CTAButton } from '../ui/CTAButton';
import { LatinBadge } from '../ui/LatinBadge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HeroDiagonalProps {
  headline: string;
  headlineEs: string;
  headlineAccent?: string;
  headlineAccentEs?: string;
  subheadline: string;
  subheadlineEs: string;
  ctaLabel: string;
  ctaLabelEs: string;
  ctaHref: string;
  heroImageSrc: string;
  showBadge?: boolean;
}

export function HeroDiagonal({
  headline,
  headlineEs,
  headlineAccent,
  headlineAccentEs,
  subheadline,
  subheadlineEs,
  ctaLabel,
  ctaLabelEs,
  ctaHref,
  heroImageSrc,
  showBadge = true,
}: HeroDiagonalProps) {
  const { language } = useI18n();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cream pt-20">
      <div className="absolute inset-0 z-0">
        {/* Diagonal Split Background */}
        <div
          className="absolute inset-0 bg-cream"
          style={{
            clipPath: 'polygon(0 0, 45% 0, 50% 100%, 0 100%)',
          }}
        />
        <div
          className="absolute inset-0 bg-photo-blue"
          style={{
            clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 50% 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <motion.h1
              variants={heroHeadline}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-[0.92] tracking-tight"
            >
              {language === 'es' ? headlineEs : headline}
              {(headlineAccent || headlineAccentEs) && (
                <>
                  <br />
                  <span className="text-accent">
                    {language === 'es' ? headlineAccentEs : headlineAccent}
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              variants={heroSubheadline}
              initial="hidden"
              animate="visible"
              className="text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-wider font-semibold text-ink-soft"
            >
              {language === 'es' ? subheadlineEs : subheadline}
            </motion.p>

            <motion.div
              variants={heroCTA}
              initial="hidden"
              animate="visible"
            >
              <CTAButton to={ctaHref} size="lg">
                {language === 'es' ? ctaLabelEs : ctaLabel}
              </CTAButton>
            </motion.div>
          </div>

          {/* Right: Hero Image with Badge */}
          <motion.div
            variants={heroImage}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <ImageWithFallback
              src={heroImageSrc}
              alt="Estilo Latino Dance"
              className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
            />
            {showBadge && (
              <div className="absolute top-8 -left-8 lg:-left-16">
                <LatinBadge />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
