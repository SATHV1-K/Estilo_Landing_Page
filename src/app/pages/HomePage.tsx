// HomePage - Main landing page

import { HeroDiagonal } from '../components/sections/HeroDiagonal';
import { MarqueeTicker } from '../components/sections/MarqueeTicker';
import { StylesGrid } from '../components/sections/StylesGrid';
import { InstructorGrid } from '../components/sections/InstructorGrid';
import { CTABanner } from '../components/sections/CTABanner';
import { TestimonialsCarousel } from '../components/sections/TestimonialsCarousel';
import { danceStyles, instructors } from '../../lib/data';
import { useI18n } from '../../lib/i18n';

export function HomePage() {
  const { language } = useI18n();

  return (
    <div>
      <HeroDiagonal
        headline="ESTILO LATINO"
        headlineEs="ESTILO LATINO"
        headlineAccent="DANCE COMPANY"
        headlineAccentEs="COMPAÑÍA DE BAILE"
        subheadline="Live & On-Demand Dance Lessons"
        subheadlineEs="Clases de Baile en Vivo y Bajo Demanda"
        ctaLabel="Free Class"
        ctaLabelEs="Clase Gratis"
        ctaHref="/contact"
        heroImageSrc="https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=1200&q=80"
        showBadge={true}
      />

      <MarqueeTicker items={['SALSA ON1', 'SALSA CALEÑA', 'BACHATA', 'URBAN / HIPHOP', 'LATIN RHYTHMS KIDS', 'WEDDINGS', 'SWEET 16', 'PRIVATES', 'CORPORATE']} />

      <StylesGrid styles={danceStyles} maxVisible={6} />

      <InstructorGrid instructors={instructors} />

      <TestimonialsCarousel />

      <CTABanner
        title={
          language === 'es' ? 'Comienza Tu Viaje de Baile Hoy' : 'Start Your Dance Journey Today'
        }
        subtitle={
          language === 'es'
            ? 'Únete a nuestra comunidad de bailarines apasionados'
            : 'Join our community of passionate dancers'
        }
        ctaLabel={language === 'es' ? 'Ver Paquetes' : 'View Packages'}
        ctaLink="/packages"
      />
    </div>
  );
}
