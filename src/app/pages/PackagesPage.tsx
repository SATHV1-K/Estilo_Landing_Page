// PackagesPage - Pricing packages

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ExternalLink, Phone } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { getPackages } from '../../lib/packagesService';
import { getSiteSettings } from '../../lib/settingsService';
import { useCmsContent } from '../../lib/hooks/useCmsContent';
import { staggerContainer, fadeInUp } from '../../lib/animations';
import type { Package } from '../../lib/types';
import type { AdminSiteSettings } from '../../lib/adminData';

const PUNCHCARD_DEFAULT = 'All class cards are valid only for adult Salsa & Bachata classes.';
const FALLBACK_PHONE    = '+1 (201) 878-8977';

export function PackagesPage() {
  const { language } = useI18n();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('tab') ?? 'adults-salsa-bachata'
  );
  const [packages, setPackages]         = useState<Package[]>([]);
  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings | null>(null);

  useEffect(() => {
    getPackages().then(setPackages).catch(console.error);
    getSiteSettings().then(setSiteSettings).catch(console.error);
  }, []);

  const cms = useCmsContent({ 'packages.punchcard.notice': PUNCHCARD_DEFAULT });

  const categories = [
    { id: 'adults-salsa-bachata', label: language === 'es' ? 'Salsa y Bachata' : 'Salsa & Bachata' },
    { id: 'adults-street', label: language === 'es' ? 'Urbano / HipHop' : 'Urban / HipHop' },
    { id: 'kids', label: language === 'es' ? 'Niños' : 'Kids' },
    { id: 'private', label: language === 'es' ? 'Privadas' : 'Privates' },
    { id: 'event', label: language === 'es' ? 'Eventos Especiales' : 'Special Events' },
  ];

  const filteredPackages = packages.filter(
    (pkg) => pkg.category === selectedCategory && pkg.isActive
  );

  const formatPrice = (price: number | null) => {
    if (price === null) return language === 'es' ? 'A Consultar' : 'Call Us';
    return `$${(price / 100).toFixed(0)}`;
  };

  const isContactCategory = selectedCategory === 'private' || selectedCategory === 'event';

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {language === 'es' ? 'Paquetes y Precios' : 'Packages & Pricing'}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {language === 'es'
              ? 'Elige el paquete perfecto para tus necesidades'
              : 'Choose the perfect package for your needs'}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === category.id
                  ? 'bg-gold text-ink'
                  : 'bg-surface-card text-text hover:bg-surface-elevated'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Package Cards */}
        <motion.div
          key={selectedCategory}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={fadeInUp}
              className="bg-surface-card rounded-xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all group flex flex-col"
            >
              <h3 className="font-display text-3xl mb-2">
                {language === 'es' ? pkg.nameEs : pkg.name}
              </h3>

              <div className="text-5xl font-bold text-gold my-6">
                {formatPrice(pkg.price)}
              </div>

              {pkg.classCount && (
                <p className="text-lg text-text-muted mb-2">
                  {pkg.classCount}{' '}
                  {language === 'es' ? 'clases' : 'classes'}
                </p>
              )}

              {pkg.expirationMonths && (
                <p className="text-sm text-text-muted mb-6">
                  {language === 'es' ? 'Expira en' : 'Expires in'}{' '}
                  {pkg.expirationMonths}{' '}
                  {language === 'es' ? 'mes(es)' : 'month(s)'}
                </p>
              )}

              <p className="text-text-muted mb-8 text-sm leading-relaxed flex-1">
                {language === 'es' ? pkg.descriptionEs : pkg.description}
              </p>

              {pkg.paymentLink ? (
                <a
                  href={pkg.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-hover text-ink font-bold uppercase tracking-wider rounded-lg transition-all group-hover:-translate-y-1"
                >
                  {language === 'es' ? 'Pagar Aquí' : 'Pay Here'}
                  <ExternalLink size={16} />
                </a>
              ) : (
                <div className="flex gap-2">
                  <a
                    href={`tel:${(siteSettings?.phone ?? FALLBACK_PHONE).replace(/\D/g, '')}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold-hover text-ink font-bold uppercase tracking-wider rounded-lg transition-all group-hover:-translate-y-1"
                  >
                    <Phone size={16} />
                    {language === 'es' ? 'Llámanos' : 'Call Us'}
                  </a>
                  <a
                    href="https://wa.me/12018788977?text=Hi%2C+I%27m+interested+in+Private+Lessons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-gold text-gold font-bold uppercase tracking-wider rounded-lg transition-all hover:bg-gold/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {language === 'es' ? 'Texto' : 'Text Us'}
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact note for special categories */}
        {isContactCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-gold/10 border border-gold/20 rounded-lg text-center"
          >
            <p className="text-text-muted mb-3">
              {language === 'es'
                ? 'Todos los paquetes de esta categoría son personalizados. Contáctanos para obtener un presupuesto.'
                : 'All packages in this category are custom. Contact us to get a quote.'}
            </p>
            <p className="text-gold font-semibold">{siteSettings?.phone ?? FALLBACK_PHONE}</p>
            <Link
              to="/contact"
              className="mt-4 inline-block text-sm text-text-muted hover:text-gold underline underline-offset-4 transition-colors"
            >
              {language === 'es' ? 'O envíanos un mensaje →' : 'Or send us a message →'}
            </Link>
          </motion.div>
        )}

        {/* Punch Card Note */}
        {selectedCategory === 'adults-salsa-bachata' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-gold/10 rounded-lg text-center"
          >
            <p className="text-text-muted">
              {cms['packages.punchcard.notice']}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
