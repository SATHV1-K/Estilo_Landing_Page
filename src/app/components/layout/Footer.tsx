// Footer Component - 3-column layout

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Facebook, Instagram, Youtube, Music } from 'lucide-react';
import { useI18n, translations } from '../../../lib/i18n';
import { getSiteSettings } from '../../../lib/settingsService';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { useScrollReveal } from '../../../lib/hooks/useScrollReveal';
import type { AdminSiteSettings } from '../../../lib/adminData';

const DEFAULT_SETTINGS: AdminSiteSettings = {
  studioName:      'Estilo Latino Dance Company',
  studioNameShort: 'Estilo Latino',
  tagline:         'Dance Academy',
  address:         '345 Morris Ave Ste 1B',
  addressLine2:    '',
  city:            'Elizabeth',
  state:           'NJ',
  zip:             '07208',
  phone:           '+1 (201) 878-8977',
  whatsapp:        '+12018788977',
  email:           'info@EstiloLatinoDance.com',
  googleMapsEmbed: '',
  socialLinks: [
    { platform: 'Facebook',  url: 'https://facebook.com/EstiloLatinoDC',      label: 'EstiloLatinoDC' },
    { platform: 'Instagram', url: 'https://instagram.com/estilo.latino',        label: '@estilo.latino' },
    { platform: 'TikTok',   url: 'https://tiktok.com/@estilolatino',           label: '@estilolatino' },
    { platform: 'YouTube',  url: 'https://youtube.com/@estilolatino',          label: 'Estilo Latino' },
  ],
  businessHours:   [],
  metaTitle:       '',
  metaDescription: '',
  footerText:      '',
};

export function Footer() {
  const { t, language } = useI18n();
  const { ref, isInView } = useScrollReveal({ amount: 0.2 });
  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSiteSettings().then((s) => { if (s) setSiteSettings(s); }).catch(console.error);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      ref={ref as any}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="bg-surface border-t border-border text-text py-16"
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Community */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-display mb-6">
              {translations.footer.community[language]}
            </h3>
            <div className="space-y-3">
              <Link
                to="/styles"
                className="block text-text-muted hover:text-gold transition-colors"
              >
                {translations.nav.styles[language]}
              </Link>
              <Link
                to="/schedule"
                className="block text-text-muted hover:text-gold transition-colors"
              >
                {translations.nav.schedule[language]}
              </Link>
              <Link
                to="/instructors"
                className="block text-text-muted hover:text-gold transition-colors"
              >
                {translations.nav.instructors[language]}
              </Link>
              <Link
                to="/about"
                className="block text-text-muted hover:text-gold transition-colors"
              >
                {translations.nav.about[language]}
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-8">
              {siteSettings.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-gold transition-colors"
                  aria-label={link.platform}
                >
                  {link.platform === 'Facebook' && <Facebook size={20} />}
                  {link.platform === 'Instagram' && <Instagram size={20} />}
                  {link.platform === 'YouTube' && <Youtube size={20} />}
                  {link.platform === 'TikTok' && <Music size={20} />}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Contact Info */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-display mb-6">
              {translations.nav.contact[language]}
            </h3>
            <div className="space-y-3 text-text-muted">
              <p>
                {siteSettings.address}
                <br />
                {siteSettings.city}, {siteSettings.state} {siteSettings.zip}
              </p>
              <p>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="hover:text-gold transition-colors"
                >
                  {siteSettings.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-gold transition-colors"
                >
                  {siteSettings.email}
                </a>
              </p>
            </div>
          </motion.div>

          {/* Column 3: Newsletter */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-display mb-6">
              {translations.footer.newsletter[language]}
            </h3>
            <p className="text-text-muted mb-4 text-sm">
              {language === 'en'
                ? 'Stay updated with our latest classes and events.'
                : 'Mantente actualizado con nuestras últimas clases y eventos.'}
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={translations.footer.emailPlaceholder[language]}
                className="px-4 py-3 bg-surface-card border border-border-strong rounded-lg text-text placeholder-text-dim focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold hover:bg-gold-hover text-ink font-semibold rounded-lg transition-colors uppercase tracking-wider text-sm"
              >
                {translations.footer.subscribe[language]}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-dim"
        >
          <p>
            {siteSettings.footerText
              ? siteSettings.footerText
              : `© ${currentYear} ${siteSettings.studioName}. ${translations.footer.rights[language]}.`
            }
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">
              {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
            </Link>
            <Link to="/terms" className="hover:text-gold transition-colors">
              {language === 'en'
                ? 'Terms of Service'
                : 'Términos de Servicio'}
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
