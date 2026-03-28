// ContactPage - Contact form and information

import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { siteSettings } from '../../lib/data';
import { fadeInUp } from '../../lib/animations';
import { CTAButton } from '../components/ui/CTAButton';

export function ContactPage() {
  const { language } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      language === 'es'
        ? 'Formulario enviado! (Demo)'
        : 'Form submitted! (Demo)'
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-cream">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6">
            {language === 'es' ? 'Contáctanos' : 'Contact Us'}
          </h1>
          <p className="text-xl text-ink-soft max-w-2xl mx-auto">
            {language === 'es'
              ? 'Estamos aquí para responder tus preguntas'
              : "We're here to answer your questions"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-[var(--shadow-card)]">
              <h2 className="font-display text-2xl mb-6">
                {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-1">
                      {language === 'es' ? 'Dirección' : 'Address'}
                    </p>
                    <p className="text-ink-soft">
                      {siteSettings.address}
                      <br />
                      {siteSettings.city}, {siteSettings.state}{' '}
                      {siteSettings.zip}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-1">
                      {language === 'es' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
                    </p>
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="text-ink-soft hover:text-accent transition-colors"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-1">
                      {language === 'es' ? 'Correo Electrónico' : 'Email'}
                    </p>
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="text-ink-soft hover:text-accent transition-colors"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-2">
                      {language === 'es' ? 'Horario' : 'Hours'}
                    </p>
                    <div className="space-y-1 text-sm text-ink-soft">
                      {siteSettings.businessHours.map((hours) => (
                        <div key={hours.day} className="flex justify-between gap-4">
                          <span>{hours.day}:</span>
                          <span>
                            {hours.isClosed
                              ? language === 'es'
                                ? 'Cerrado'
                                : 'Closed'
                              : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl shadow-[var(--shadow-card)] space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'es' ? 'Nombre' : 'Name'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'es' ? 'Correo Electrónico' : 'Email'}
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'es' ? 'Teléfono' : 'Phone'}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'es' ? 'Mensaje' : 'Message'}
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:border-accent transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                {language === 'es' ? 'Enviar Mensaje' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
