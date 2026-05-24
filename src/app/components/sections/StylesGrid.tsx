import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useI18n, translations } from '../../../lib/i18n';
import { useScrollReveal } from '../../../lib/hooks/useScrollReveal';
import { StyleCard } from '../ui/StyleCard';
import { DanceStyle } from '../../../lib/types';
import { AnimatedLetters } from '../ui/AnimatedLetters';

interface StylesGridProps {
  styles: DanceStyle[];
  maxVisible?: number;
}

export function StylesGrid({ styles }: StylesGridProps) {
  const { language } = useI18n();
  const { ref: carouselRef, isInView } = useScrollReveal({ amount: 0.15 });
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const activeStyles = styles.filter((s) => s.isActive);

  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncScrollState, { passive: true });
    // run after layout settles
    const raf = requestAnimationFrame(syncScrollState);
    return () => {
      el.removeEventListener('scroll', syncScrollState);
      cancelAnimationFrame(raf);
    };
  }, [syncScrollState, activeStyles.length]);

  function scrollByCard(dir: 'left' | 'right') {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector('[data-card]') as HTMLElement | null;
    const amount = firstCard ? firstCard.offsetWidth + 24 : 300; // 24px = gap-6
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  }

  const arrowBase =
    'flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2';
  const arrowActive =
    'bg-gold text-ink shadow-[0_4px_16px_rgba(246,176,0,0.30)] hover:bg-gold-hover hover:-translate-y-0.5 active:translate-y-0 cursor-pointer';
  const arrowDisabled =
    'bg-surface-elevated text-border-strong opacity-25 pointer-events-none cursor-default';

  return (
    <section className="py-24 relative bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <AnimatedLetters
            text={language === 'es' ? 'NUESTROS ' : 'OUR '}
            accent={translations.sections.styles.title[language].toUpperCase()}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className="text-xl uppercase tracking-wider text-text-muted mt-4"
          >
            {translations.sections.styles.subtitle[language]}
          </motion.p>
        </div>

        {/* [← arrow] [scrollable track] [→ arrow] */}
        <div
          ref={carouselRef as RefObject<HTMLDivElement>}
          className="flex items-center gap-3 lg:gap-5"
        >
          {/* Left Arrow — desktop only */}
          <div className="hidden sm:block flex-shrink-0">
            <button
              onClick={() => scrollByCard('left')}
              disabled={!canScrollLeft}
              className={`${arrowBase} ${canScrollLeft ? arrowActive : arrowDisabled}`}
              aria-label="Previous styles"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Scrollable Track — scroll-snap + touch swipe built-in */}
          <div
            ref={trackRef}
            className="flex-1 flex gap-6 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {activeStyles.map((style) => (
              <div
                key={style.id}
                data-card=""
                className="snap-start flex-shrink-0 w-[78vw] sm:w-[44vw] lg:w-[30vw] xl:w-[23vw]"
              >
                <StyleCard style={style} />
              </div>
            ))}
          </div>

          {/* Right Arrow — desktop only */}
          <div className="hidden sm:block flex-shrink-0">
            <button
              onClick={() => scrollByCard('right')}
              disabled={!canScrollRight}
              className={`${arrowBase} ${canScrollRight ? arrowActive : arrowDisabled}`}
              aria-label="Next styles"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Swipe hint — mobile only */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-5">
          <motion.div
            animate={{ x: [-3, 0] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.9, ease: 'easeInOut' }}
          >
            <ChevronLeft size={14} className="text-gold/50" />
          </motion.div>
          <span className="font-body text-xs uppercase tracking-[0.2em] text-text-muted/70">swipe</span>
          <motion.div
            animate={{ x: [3, 0] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.9, ease: 'easeInOut' }}
          >
            <ChevronRight size={14} className="text-gold/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
