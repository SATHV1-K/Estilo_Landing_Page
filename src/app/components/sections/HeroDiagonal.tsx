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
import { parseYouTubeId } from '../../../lib/youtube';

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
    <section className="relative min-h-[100svh] lg:min-h-[90vh] flex items-center overflow-hidden bg-bg pt-32">
      <div className="absolute inset-0 z-0">
        {heroVideoSrc ? (() => {
          const ytId = parseYouTubeId(heroVideoSrc);
          return ytId ? (
            <>
              {/* YouTube background — scaled to cover full area without letterboxing */}
              <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
                  allow="autoplay; encrypted-media"
                  aria-hidden="true"
                  tabIndex={-1}
                  title="Hero background video"
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.25)',
                    width: '100%', height: '100%',
                    minWidth: '177.78vh', minHeight: '56.25vw',
                    border: 'none', pointerEvents: 'none',
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-bg/95 via-bg/85 to-bg/50 lg:hidden" />
              <div
                className="absolute inset-0 bg-bg hidden lg:block"
                style={{ clipPath: 'polygon(0 0, 45% 0, 50% 100%, 0 100%)' }}
              />
            </>
          ) : (
            <>
              {/* Native video — confined to the right panel so small videos don't get upscaled across the full bg */}
              <div className="absolute inset-0 bg-bg" />
              <video
                autoPlay muted loop playsInline preload="metadata"
                className="absolute top-0 bottom-0 right-0 h-full object-cover hidden lg:block"
                style={{ left: '45%', width: '55%', objectPosition: 'center 10%' }}
                src={heroVideoSrc}
              />
              {/* Diagonal split overlay */}
              <div
                className="absolute inset-0 bg-bg hidden lg:block"
                style={{ clipPath: 'polygon(0 0, 45% 0, 50% 100%, 0 100%)' }}
              />
              {/* Mobile: full-width video with gradient overlay */}
              <video
                autoPlay muted loop playsInline preload="metadata"
                className="absolute inset-0 w-full h-full object-cover lg:hidden"
                src={heroVideoSrc}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-bg/95 via-bg/85 to-bg/50 lg:hidden" />
            </>
          );
        })() : (
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
              <span className="hero-gradient-text">
                {language === 'es' ? headlineEs : headline}
              </span>
              {(headlineAccent || headlineAccentEs) && (
                <>
                  <br />
                  <span className="hero-gradient-text-reverse">
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
              <CTAButton variant="outline" size="lg" to="/online-lessons">
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
