// PackagesPage - Pricing packages

import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ExternalLink, Phone } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { packages, siteSettings } from '../../lib/data';
import { staggerContainer, fadeInUp } from '../../lib/animations';

export function PackagesPage() {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('adults-salsa-bachata');

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
                <a
                  href={`tel:${siteSettings.phone.replace(/\D/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-hover text-ink font-bold uppercase tracking-wider rounded-lg transition-all group-hover:-translate-y-1"
                >
                  <Phone size={16} />
                  {language === 'es' ? 'Llámanos' : 'Call Us'}
                </a>
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
            <p className="text-gold font-semibold">{siteSettings.phone}</p>
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
              {language === 'es'
                ? 'Todas las tarjetas de clases son válidas solo para clases de Salsa y Bachata para adultos.'
                : 'All class cards are valid only for adult Salsa & Bachata classes.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
