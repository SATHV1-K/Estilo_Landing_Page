// StyleDetailPage — reads the specific dance style from adminData (localStorage)
// with hardcoded seed data as fallback.

import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { getStyles } from '../../lib/stylesService';
import { getSiteSettings } from '../../lib/settingsService';
import { CTAButton } from '../components/ui/CTAButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { DanceStyle } from '../../lib/types';
import type { AdminSiteSettings } from '../../lib/adminData';

const FALLBACK_PHONE = '+1 (201) 878-8977';

const whatsappMessages: Record<string, string> = {
  'weddings-first-dance':  'Hi%2C+I%27m+interested+in+Wedding+%2F+First+Dance+choreography',
  'sweet-16-15':           'Hi%2C+I%27m+interested+in+Sweet+16+%2F+Quincea%C3%B1era+choreography',
  'one-on-one-privates':   'Hi%2C+I%27m+interested+in+Private+Lessons',
  'corporate-events':      'Hi%2C+I%27m+interested+in+Corporate+Event+dance+packages',
};

export function StyleDetailPage() {
  const { slug } = useParams();
  const { language } = useI18n();
  const [style, setStyle]         = useState<DanceStyle | null>(null);
  const [loading, setLoading]     = useState(true);
  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings | null>(null);

  useEffect(() => {
    getStyles().then((styles) => {
      const found = styles.find((s) => s.slug === slug) ?? null;
      setStyle(found);
      if (found) document.title = `${found.name} | Estilo Latino Dance Company`;
      setLoading(false);
    }).catch(() => setLoading(false));
    getSiteSettings().then(setSiteSettings).catch(() => {});
  }, [slug]);

  if (loading) return null;

  if (!style) {
    return <Navigate to="/styles" replace />;
  }

  return (
    <div className="min-h-screen pt-32">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        {style.videoUrl ? (
          <video
            src={style.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-[center_25%]"
          />
        ) : (
          <ImageWithFallback
            src={style.heroImage}
            alt={language === 'es' ? style.nameEs : style.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
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
                <a
                  href={`tel:${(siteSettings?.phone ?? FALLBACK_PHONE).replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-hover text-ink font-bold uppercase tracking-wider rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <Phone size={18} />
                  {language === 'es' ? 'Llámanos' : 'Call Us'}
                </a>
                <a
                  href={`https://wa.me/12018788977?text=${whatsappMessages[style.slug] ?? 'Hi%2C+I%27m+interested+in+your+dance+classes'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gold text-gold font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-gold/10 hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {language === 'es' ? 'Escríbenos' : 'Text Us'}
                </a>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton to="/schedule" size="lg">
                  {language === 'es' ? 'Ver Horario' : 'View Schedule'}
                </CTAButton>
                <CTAButton href="https://payments.estilolatinodance.com" variant="outline" size="lg">
                  {language === 'es' ? 'Únete' : 'Join Us'}
                </CTAButton>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
