// LanguageToggle - EN/ES switcher component

import { motion } from 'motion/react';
import { useI18n } from '../../../lib/i18n';
import { Language } from '../../../lib/types';

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-semibold uppercase tracking-wider"
      aria-label="Toggle language"
    >
      <span
        className={`transition-colors ${
          language === 'en' ? 'text-white' : 'text-text-muted'
        }`}
      >
        EN
      </span>
      <span className="text-text-muted">|</span>
      <span
        className={`transition-colors ${
          language === 'es' ? 'text-white' : 'text-text-muted'
        }`}
      >
        ES
      </span>
      <motion.div
        className="absolute inset-0 bg-gold rounded-full -z-10"
        initial={false}
        animate={{
          opacity: 0,
        }}
        whileHover={{
          opacity: 0.05,
        }}
      />
    </button>
  );
}
