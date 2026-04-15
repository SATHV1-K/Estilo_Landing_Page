// InstructorsPage — reads instructors from adminData (localStorage) with seed
// data as fallback, and section headings from the CMS API.

import { motion } from 'motion/react';
import { useI18n } from '../../lib/i18n';
import { getInstructors } from '../../lib/adminData';
import { useCmsContent } from '../../lib/hooks/useCmsContent';
import { InstructorGrid } from '../components/sections/InstructorGrid';

export function InstructorsPage() {
  const { language } = useI18n();

  const instructors = getInstructors().filter((i) => i.isActive);

  const cms = useCmsContent({
    'instructors.heading':      'OUR INSTRUCTORS',
    'instructors.heading_es':   'NUESTROS INSTRUCTORES',
    'instructors.subheading':   'Meet our talented team of professional instructors',
    'instructors.subheading_es': 'Conoce a nuestro talentoso equipo de instructores profesionales',
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {language === 'es' ? cms['instructors.heading_es'] : cms['instructors.heading']}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {language === 'es'
              ? cms['instructors.subheading_es']
              : cms['instructors.subheading']}
          </p>
        </motion.div>
      </div>

      <InstructorGrid instructors={instructors} />
    </div>
  );
}
