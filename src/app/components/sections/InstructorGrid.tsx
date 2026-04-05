// InstructorGrid - 4-column instructor showcase

import { motion } from 'motion/react';
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

  const activeInstructors = instructors.filter((i) => i.isActive);

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

        {/* Grid */}
        <motion.div
          ref={ref as any}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {activeInstructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
