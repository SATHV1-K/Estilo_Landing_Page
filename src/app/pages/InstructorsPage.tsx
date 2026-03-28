// InstructorsPage - All instructors

import { motion } from 'motion/react';
import { useI18n } from '../../lib/i18n';
import { instructors } from '../../lib/data';
import { InstructorGrid } from '../components/sections/InstructorGrid';

export function InstructorsPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-cream">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {language === 'es' ? 'Nuestros Instructores' : 'Our Instructors'}
          </h1>
          <p className="text-xl text-ink-soft max-w-2xl mx-auto">
            {language === 'es'
              ? 'Conoce a nuestro talentoso equipo de instructores profesionales'
              : 'Meet our talented team of professional instructors'}
          </p>
        </motion.div>
      </div>

      <InstructorGrid instructors={instructors} />
    </div>
  );
}
