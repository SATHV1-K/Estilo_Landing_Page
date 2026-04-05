// AboutPage - Studio information

import { motion } from 'motion/react';
import { Award, Heart, Users, Calendar } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { siteSettings } from '../../lib/data';
import { staggerContainer, fadeInUp } from '../../lib/animations';

export function AboutPage() {
  const { language } = useI18n();

  const stats = [
    {
      icon: Calendar,
      value: '14+',
      label: language === 'es' ? 'Años de Experiencia' : 'Years of Experience',
    },
    {
      icon: Users,
      value: '1000+',
      label: language === 'es' ? 'Estudiantes' : 'Students',
    },
    {
      icon: Award,
      value: '50+',
      label: language === 'es' ? 'Campeonatos' : 'Championships',
    },
    {
      icon: Heart,
      value: '100%',
      label: language === 'es' ? 'Pasión' : 'Passion',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center p-8 bg-surface-card rounded-xl shadow-[var(--shadow-card)]"
            >
              <stat.icon className="w-12 h-12 text-gold mx-auto mb-4" />
              <div className="text-4xl font-display mb-2">{stat.value}</div>
              <div className="text-sm text-text-muted uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-text"
        >
          <p>
            {language === 'es'
              ? 'Fundada el 21 de abril de 2010, Estilo Latino Dance Company ha sido un pilar de la comunidad de baile latino en Elizabeth, Nueva Jersey. Nuestra misión es llevar la cultura del baile latino tanto a comunidades hispanas como no hispanas.'
              : 'Founded on April 21, 2010, Estilo Latino Dance Company has been a cornerstone of the Latin dance community in Elizabeth, New Jersey. Our mission is to bring Latin dance culture to both Hispanic and non-Hispanic communities.'}
          </p>
          <p>
            {language === 'es'
              ? 'Nos especializamos en Salsa, Bachata, Ballet y Baile Urbano (Hip Hop, Reggaeton, Dancehall, Afrobeat). Nuestros servicios incluyen clases grupales para niños y adultos, lecciones privadas, coreografías para quinceañeras, bailes de boda y presentaciones escolares.'
              : 'We specialize in Salsa, Bachata, Ballet, and Street Dance (Hip Hop, Reggaeton, Dancehall, Afrobeat). Our services include group classes for kids and adults, private lessons, Sweet Sixteen choreography, wedding dances, and school performances.'}
          </p>
          <p className="font-semibold">
            {language === 'es'
              ? 'Múltiples campeones mundiales de baile han sido entrenados en nuestro estudio.'
              : 'Multiple world dance champions have been trained at our studio.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
