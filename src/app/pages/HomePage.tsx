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
import { useCmsContent } from '../../lib/hooks/useCmsContent';
import { useI18n } from '../../lib/i18n';
import type { DanceStyle, Instructor } from '../../lib/types';

export function HomePage() {
  const { language } = useI18n();
  const [styles, setStyles]           = useState<DanceStyle[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    getActiveStyles().then(setStyles).catch(console.error);
    getActiveInstructors().then(setInstructors).catch(console.error);
  }, []);

  // Text content — async, renders with fallbacks immediately
  const cms = useCmsContent({
    'home.hero.headline':         'ESTILO LATINO',
    'home.hero.headline_es':      'ESTILO LATINO',
    'home.hero.subheadline':      'Live & On-Demand Dance Lessons',
    'home.hero.subheadline_es':   'Clases de Baile en Vivo y Bajo Demanda',
    'home.hero.cta_label':        'Manage Classes',
    'home.hero.cta_label_es':     'Administrar Clases',
    'home.hero.cta_link':         'https://payments.estilolatinodance.com',
    'home.cta_banner.heading':    'Start Your Dance Journey Today',
    'home.cta_banner.heading_es': 'Comienza Tu Viaje de Baile Hoy',
    'home.cta_banner.body':       'Join our community of passionate dancers',
    'home.cta_banner.body_es':    'Únete a nuestra comunidad de bailarines apasionados',
    'home.cta_banner.cta_label':  'View Packages',
    'home.cta_banner.cta_label_es': 'Ver Paquetes',
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
