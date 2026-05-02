'use client';

import { useState, type RefObject } from 'react';
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

  const activeInstructors = instructors.filter((i) => i.isActive);

  function prevCard() {
    setActiveIndex(i => (i > 0 ? i - 1 : activeInstructors.length - 1));
  }

  function nextCard() {
    setActiveIndex(i => (i < activeInstructors.length - 1 ? i + 1 : 0));
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <AnimatedLetters
            text={translations.sections.instructors.title[language]}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="text-xl uppercase tracking-wider text-text-muted mt-4"
          >
            {translations.sections.instructors.subtitle[language]}
          </motion.p>
        </div>

        {/* Content — ref on wrapper so isInView works for both layouts */}
        <div ref={ref as RefObject<HTMLDivElement>}>
          {/* Mobile Carousel (< sm) */}
          <div className="sm:hidden relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {activeInstructors.map((instructor) => (
                  <div key={instructor.id} className="w-full flex-shrink-0">
                    <InstructorCard instructor={instructor} />
                  </div>
                ))}
              </div>
            </div>

            {activeInstructors.length > 1 && (
              <>
                <button
                  onClick={prevCard}
                  className="absolute left-0 top-[240px] -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-gold text-ink flex items-center justify-center shadow-lg hover:bg-gold-hover transition-colors"
                  aria-label="Previous instructor"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextCard}
                  className="absolute right-0 top-[240px] -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-gold text-ink flex items-center justify-center shadow-lg hover:bg-gold-hover transition-colors"
                  aria-label="Next instructor"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {activeInstructors.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {activeInstructors.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeIndex ? 'bg-gold' : 'bg-border-strong'
                    }`}
                    aria-label={`Go to instructor ${i + 1}`}
                  />
                ))}
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
