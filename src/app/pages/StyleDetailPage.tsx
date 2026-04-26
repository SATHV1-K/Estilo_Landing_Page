// StyleDetailPage — reads the specific dance style from adminData (localStorage)
// with hardcoded seed data as fallback.

import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { useI18n } from '../../lib/i18n';
import { getStyles } from '../../lib/stylesService';
import { CTAButton } from '../components/ui/CTAButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { DanceStyle } from '../../lib/types';

export function StyleDetailPage() {
  const { slug } = useParams();
  const { language } = useI18n();
  const [style, setStyle]   = useState<DanceStyle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStyles().then((styles) => {
      setStyle(styles.find((s) => s.slug === slug) ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return null;

  if (!style) {
    return <Navigate to="/styles" replace />;
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <ImageWithFallback
          src={style.heroImage}
          alt={language === 'es' ? style.nameEs : style.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center text-center text-white"
        >
          <div>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.92] mb-4">
              {language === 'es' ? style.nameEs : style.name}
            </h1>
            <p className="text-2xl uppercase tracking-wider font-semibold">
              {style.tagline}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-24 bg-bg">
        <div className="max-w-4xl mx-auto px-4 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xl leading-relaxed text-text mb-8">
              {language === 'es' ? style.descriptionEs : style.description}
            </p>

            {style.contactOnly ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton to="/contact" size="lg">
                  {language === 'es' ? 'Contáctanos' : 'Contact Us'}
                </CTAButton>
                <CTAButton to="/packages" variant="outline" size="lg">
                  {language === 'es' ? 'Ver Paquetes' : 'View Packages'}
                </CTAButton>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton to="/schedule" size="lg">
                  {language === 'es' ? 'Ver Horario' : 'View Schedule'}
                </CTAButton>
                <CTAButton to="/contact" variant="outline" size="lg">
                  {language === 'es' ? 'Clase de Prueba' : 'Try a Class'}
                </CTAButton>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
