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
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { SubBrands } from '../ui/SubBrands';

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
  heroImageSrc?: string;
  heroVideoSrc?: string;
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
  heroVideoSrc,
}: HeroDiagonalProps) {
  const { language } = useI18n();

  return (
    <section className="relative min-h-[100svh] lg:min-h-[90vh] flex items-center overflow-hidden bg-bg pt-20">
      <div className="absolute inset-0 z-0">
        {heroVideoSrc ? (
          <>
            {/* Video always full-bleed — clip only on desktop */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src={heroVideoSrc}
            />
            {/* Mobile: gradient overlay so text stays readable over the video */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg/95 via-bg/85 to-bg/50 lg:hidden" />
            {/* Desktop: solid dark panel on the left half (diagonal cut) */}
            <div
              className="absolute inset-0 bg-bg hidden lg:block"
              style={{ clipPath: 'polygon(0 0, 45% 0, 50% 100%, 0 100%)' }}
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-bg" />
            <div
              className="absolute inset-0 bg-photo-blue hidden lg:block"
              style={{ clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 50% 100%)' }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-16 w-full py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 lg:space-y-8">
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
                  <span className="text-gold">
                    {language === 'es' ? headlineAccentEs : headlineAccent}
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              variants={heroSubheadline}
              initial="hidden"
              animate="visible"
              className="text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-wider font-semibold text-text-muted"
            >
              {language === 'es' ? subheadlineEs : subheadline}
            </motion.p>

            <motion.div
              variants={heroCTA}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <CTAButton href={ctaHref} size="lg">
                {language === 'es' ? ctaLabelEs : ctaLabel}
              </CTAButton>
              <CTAButton variant="outline" size="lg">
                {language === 'es' ? 'Lecciones en Línea' : 'Online Lessons'}
              </CTAButton>
            </motion.div>

            <SubBrands />
          </div>

          {/* Right: Hero Image — only shown when no video is uploaded */}
          {!heroVideoSrc && heroImageSrc && (
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
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
