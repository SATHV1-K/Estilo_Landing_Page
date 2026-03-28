// Footer Component - 3-column layout

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Facebook, Instagram, Youtube, Music } from 'lucide-react';
import { useI18n, translations } from '../../../lib/i18n';
import { siteSettings } from '../../../lib/data';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { useScrollReveal } from '../../../lib/hooks/useScrollReveal';

export function Footer() {
  const { t, language } = useI18n();
  const { ref, isInView } = useScrollReveal({ amount: 0.2 });

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      ref={ref as any}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="bg-ink text-white py-16"
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
                className="block text-white/70 hover:text-white transition-colors"
              >
                {translations.nav.styles[language]}
              </Link>
              <Link
                to="/schedule"
                className="block text-white/70 hover:text-white transition-colors"
              >
                {translations.nav.schedule[language]}
              </Link>
              <Link
                to="/instructors"
                className="block text-white/70 hover:text-white transition-colors"
              >
                {translations.nav.instructors[language]}
              </Link>
              <Link
                to="/about"
                className="block text-white/70 hover:text-white transition-colors"
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
                  className="text-white/70 hover:text-accent transition-colors"
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
            <div className="space-y-3 text-white/70">
              <p>
                {siteSettings.address}
                <br />
                {siteSettings.city}, {siteSettings.state} {siteSettings.zip}
              </p>
              <p>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteSettings.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-white transition-colors"
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
            <p className="text-white/70 mb-4 text-sm">
              {language === 'en'
                ? 'Stay updated with our latest classes and events.'
                : 'Mantente actualizado con nuestras últimas clases y eventos.'}
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={translations.footer.emailPlaceholder[language]}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors uppercase tracking-wider text-sm"
              >
                {translations.footer.subscribe[language]}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60"
        >
          <p>
            © {currentYear} {siteSettings.studioName}.{' '}
            {translations.footer.rights[language]}.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
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
