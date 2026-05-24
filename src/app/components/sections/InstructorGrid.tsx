'use client';

import { useState, useRef, type RefObject } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n, translations } from '../../../lib/i18n';
import { staggerContainer } from '../../../lib/animations';
import { useScrollReveal } from '../../../lib/hooks/useScrollReveal';
import { InstructorCard } from '../ui/InstructorCard';
import { Instructor } from '../../../lib/types';
import { AnimatedLetters } from '../ui/AnimatedLetters';

interface InstructorGridProps {
  instructors: Instructor[];
}

export function InstructorGrid({ instructors }: InstructorGridProps) {
  const { language } = useI18n();
  const { ref, isInView } = useScrollReveal({ amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const activeInstructors = instructors.filter((i) => i.isActive);

  function prevCard() {
    setActiveIndex(i => (i > 0 ? i - 1 : activeInstructors.length - 1));
  }

  function nextCard() {
    setActiveIndex(i => (i < activeInstructors.length - 1 ? i + 1 : 0));
  }

  function handleSwipeStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleSwipeEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx > 0) nextCard();
      else prevCard();
    }
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        {/* Section Heading */}
        <div className="text-center mb-16">
          {(() => {
            const title = translations.sections.instructors.title[language].toUpperCase();
            const words = title.split(' ');
            const accentWord = words[words.length - 1];
            const mainText = words.slice(0, -1).join(' ') + ' ';
            return <AnimatedLetters text={mainText} accent={accentWord} />;
          })()}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className="text-xl uppercase tracking-wider text-text-muted mt-4"
          >
            {translations.sections.instructors.subtitle[language]}
          </motion.p>
        </div>

        {/* Content — ref on wrapper so isInView works for both layouts */}
        <div ref={ref as RefObject<HTMLDivElement>}>
          {/* Mobile Carousel (< sm) */}
          <div className="sm:hidden">
            <div
              className="overflow-hidden"
              onTouchStart={handleSwipeStart}
              onTouchEnd={handleSwipeEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {activeInstructors.map((instructor, i) => (
                  <div key={instructor.id} className="w-full flex-shrink-0">
                    <InstructorCard instructor={instructor} autoPlay={i === activeIndex} />
                  </div>
                ))}
              </div>
            </div>

            {/* Swipe hint */}
            {activeInstructors.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-5">
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
            )}
          </div>

          {/* Desktop Grid (sm+) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {activeInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
