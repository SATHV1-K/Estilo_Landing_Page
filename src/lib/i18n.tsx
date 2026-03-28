// i18n Context for Bilingual Support (EN/ES)

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from './types';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, es: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (en: string, es: string) => {
    return language === 'es' ? es : en;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// Common translations
export const translations = {
  nav: {
    home: { en: 'Home', es: 'Inicio' },
    styles: { en: 'Styles', es: 'Estilos' },
    schedule: { en: 'Schedule', es: 'Horario' },
    packages: { en: 'Packages', es: 'Paquetes' },
    instructors: { en: 'Instructors', es: 'Instructores' },
    about: { en: 'About', es: 'Nosotros' },
    contact: { en: 'Contact', es: 'Contacto' },
  },
  common: {
    learnMore: { en: 'Learn More', es: 'Aprende Más' },
    getStarted: { en: 'Get Started', es: 'Comenzar' },
    contactUs: { en: 'Contact Us', es: 'Contáctanos' },
    bookNow: { en: 'Book Now', es: 'Reservar Ahora' },
    freeClass: { en: 'Free Class', es: 'Clase Gratis' },
    viewAll: { en: 'View All', es: 'Ver Todo' },
    readMore: { en: 'Read More', es: 'Leer Más' },
  },
  hero: {
    tagline: {
      en: 'Live & On-Demand Dance Lessons',
      es: 'Clases de Baile en Vivo y Bajo Demanda',
    },
    cta: { en: 'Start Dancing Today', es: 'Comienza a Bailar Hoy' },
  },
  sections: {
    styles: {
      title: { en: 'Styles', es: 'Estilos' },
      subtitle: {
        en: 'Master the moves & skills of your favorite style',
        es: 'Domina los movimientos y habilidades de tu estilo favorito',
      },
    },
    instructors: {
      title: { en: 'Meet Your Instructors', es: 'Conoce a Tus Instructores' },
      subtitle: {
        en: 'Nothing but the best for you',
        es: 'Nada más que lo mejor para ti',
      },
    },
    onDemand: {
      title: { en: 'On-Demand Lessons', es: 'Lecciones Bajo Demanda' },
      subtitle: {
        en: 'Learn at your own pace, anytime',
        es: 'Aprende a tu propio ritmo, en cualquier momento',
      },
    },
  },
  footer: {
    community: { en: 'Community', es: 'Comunidad' },
    newsletter: { en: 'Newsletter', es: 'Boletín' },
    legal: { en: 'Legal', es: 'Legal' },
    subscribe: { en: 'Subscribe', es: 'Suscribirse' },
    emailPlaceholder: {
      en: 'Enter your email',
      es: 'Ingresa tu correo',
    },
    rights: {
      en: 'All rights reserved',
      es: 'Todos los derechos reservados',
    },
  },
};
