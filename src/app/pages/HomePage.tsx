import { useState, useEffect } from 'react';
import { HeroDiagonal } from '../components/sections/HeroDiagonal';
import { MarqueeTicker } from '../components/sections/MarqueeTicker';
import { StylesGrid } from '../components/sections/StylesGrid';
import { InstructorGrid } from '../components/sections/InstructorGrid';
import { CTABanner } from '../components/sections/CTABanner';
import { TestimonialsCarousel } from '../components/sections/TestimonialsCarousel';
import { FeaturedVideosSection } from '../components/sections/FeaturedVideosSection';
import { getActiveStyles } from '../../lib/stylesService';
import { getActiveInstructors } from '../../lib/instructorsService';
import { getMedia } from '../../lib/mediaService';
import { useCmsContent } from '../../lib/hooks/useCmsContent';
import { useI18n } from '../../lib/i18n';
import type { DanceStyle, Instructor } from '../../lib/types';

export function HomePage() {
  const { language } = useI18n();
  const [styles, setStyles]           = useState<DanceStyle[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [heroVideoSrc, setHeroVideoSrc] = useState<string>('');

  useEffect(() => {
    getActiveStyles().then(setStyles).catch(console.error);
    getActiveInstructors().then(setInstructors).catch(console.error);
    getMedia('home.hero.video').then(m => {
      if (m?.url) setHeroVideoSrc(m.url);
    }).catch(console.error);
  }, []);

  // Text content — async, renders with fallbacks immediately
  const cms = useCmsContent({
    'home.hero.headline':         'ESTILO LATINO',
    'home.hero.headline_es':      'ESTILO LATINO',
    'home.hero.subheadline':      'Live & On-Demand Dance Lessons',
    'home.hero.subheadline_es':   'Clases de Baile en Vivo y Bajo Demanda',
    'home.hero.cta_label':        'Enroll Now',
    'home.hero.cta_label_es':     'Inscríbete',
    'home.hero.cta_link':         '/packages',
    'home.cta_banner.heading':    'Ready to Dance?',
    'home.cta_banner.heading_es': '¿Listo para Bailar?',
    'home.cta_banner.body':       'Join our classes and start your dance journey today. No experience needed.',
    'home.cta_banner.body_es':    'Únete a nuestras clases y comienza tu viaje de baile hoy. No se necesita experiencia.',
    'home.cta_banner.cta_label':  'Enroll Now',
    'home.cta_banner.cta_label_es': 'Inscríbete Ahora',
    'home.cta_banner.cta_link':   '/packages',
  });

  const isEs = language === 'es';

  return (
    <div>
      <HeroDiagonal
        headline={cms['home.hero.headline']}
        headlineEs={cms['home.hero.headline_es']}
        headlineAccent="DANCE COMPANY"
        headlineAccentEs="COMPAÑÍA DE BAILE"
        subheadline={cms['home.hero.subheadline']}
        subheadlineEs={cms['home.hero.subheadline_es']}
        ctaLabel={cms['home.hero.cta_label']}
        ctaLabelEs={cms['home.hero.cta_label_es']}
        ctaHref={cms['home.hero.cta_link']}
        heroImageSrc="https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=1200&q=80"
        heroVideoSrc={heroVideoSrc || undefined}
        showBadge={true}
      />

      <MarqueeTicker
        items={[
          'SALSA ON1',
          'SALSA CALEÑA',
          'BACHATA',
          'URBAN / HIPHOP',
          'LATIN RHYTHMS KIDS',
          'WEDDINGS',
          'SWEET 16',
          'PRIVATES',
          'CORPORATE',
        ]}
      />

      <StylesGrid styles={styles} maxVisible={6} />

      <InstructorGrid instructors={instructors} />

      <TestimonialsCarousel />

      <FeaturedVideosSection />

      <CTABanner
        title={isEs ? cms['home.cta_banner.heading_es'] : cms['home.cta_banner.heading']}
        subtitle={isEs ? cms['home.cta_banner.body_es'] : cms['home.cta_banner.body']}
        ctaLabel={isEs ? cms['home.cta_banner.cta_label_es'] : cms['home.cta_banner.cta_label']}
        ctaLink={cms['home.cta_banner.cta_link']}
      />
    </div>
  );
}
