import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { siteSettings } from '../../lib/data';
import { fadeInUp } from '../../lib/animations';
import { saveContactMessage } from '../../lib/contactService';
import { sendContactNotification } from '../../lib/emailService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}

interface FormErrors {
  name?:    string;
  email?:   string;
  message?: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', phone: '', message: '' };

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: FormState, lang: string): FormErrors {
  const es = lang === 'es';
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = es ? 'El nombre es obligatorio.' : 'Name is required.';
  } else if (form.name.trim().length < 2) {
    errors.name = es ? 'El nombre debe tener al menos 2 caracteres.' : 'Name must be at least 2 characters.';
  }

  if (!form.email.trim()) {
    errors.email = es ? 'El correo es obligatorio.' : 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = es ? 'Ingresa un correo válido.' : 'Enter a valid email address.';
  }

  if (!form.message.trim()) {
    errors.message = es ? 'El mensaje es obligatorio.' : 'Message is required.';
  } else if (form.message.trim().length < 10) {
    errors.message = es
      ? 'El mensaje debe tener al menos 10 caracteres.'
      : 'Message must be at least 10 characters.';
  }

  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactPage() {
  const { language } = useI18n();
  const [form,      setForm]      = useState<FormState>(EMPTY_FORM);
  const [errors,    setErrors]    = useState<FormErrors>({});
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status,    setStatus]    = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const es = language === 'es';

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name as keyof FormState]) {
      setErrors(validate(next, language));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as keyof FormState;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validate(form, language));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = { name: true, email: true, phone: true, message: true };
    setTouched(allTouched);
    const errs = validate(form, language);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    try {
      await Promise.all([
        saveContactMessage(form),
        sendContactNotification(form),
      ]);
      setStatus('success');
      setForm(EMPTY_FORM);
      setTouched({});
      setErrors({});
    } catch {
      setStatus('error');
    }
  }

  const inputClass = (field: keyof FormErrors) =>
    [
      'w-full px-4 py-3 border rounded-lg bg-surface focus:outline-none text-text transition-colors',
      errors[field] && touched[field as keyof FormState]
        ? 'border-error focus:border-error'
        : 'border-border focus:border-gold',
    ].join(' ');

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] mb-6 uppercase">
            {es ? 'Contáctanos' : 'Contact Us'}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {es
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
            <div className="bg-surface-card p-8 rounded-xl shadow-[var(--shadow-card)]">
              <h2 className="font-display text-2xl mb-6 uppercase">
                {es ? 'Información de Contacto' : 'Contact Information'}
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-gold flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-1">{es ? 'Dirección' : 'Address'}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${siteSettings.address}, ${siteSettings.city}, ${siteSettings.state} ${siteSettings.zip}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-gold transition-colors"
                    >
                      {siteSettings.address}
                      <br />
                      {siteSettings.city}, {siteSettings.state} {siteSettings.zip}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-gold flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-1">
                      {es ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
                    </p>
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="text-text-muted hover:text-gold transition-colors"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-gold flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-1">
                      {es ? 'Correo Electrónico' : 'Email'}
                    </p>
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="text-text-muted hover:text-gold transition-colors"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="text-gold flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold mb-2">{es ? 'Horario' : 'Hours'}</p>
                    <div className="space-y-1 text-sm text-text-muted">
                      {siteSettings.businessHours.map((hours) => (
                        <div key={hours.day} className="flex justify-between gap-4">
                          <span>{hours.day}:</span>
                          <span>
                            {hours.isClosed
                              ? es ? 'Cerrado' : 'Closed'
                              : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="rounded-xl overflow-hidden border border-border shadow-[var(--shadow-card)]">
              <iframe
                title={es ? 'Mapa de ubicación' : 'Location map'}
                src={siteSettings.googleMapsEmbed}
                width="100%"
                height="300"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {status === 'success' ? (
              <div className="bg-surface-card p-10 rounded-xl shadow-[var(--shadow-card)] flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                <CheckCircle size={56} className="text-success" />
                <h3 className="font-display text-2xl uppercase">
                  {es ? '¡Mensaje Enviado!' : 'Message Sent!'}
                </h3>
                <p className="text-text-muted">
                  {es
                    ? 'Nos pondremos en contacto contigo pronto.'
                    : "We'll get back to you as soon as possible."}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-3 bg-gold hover:bg-gold-hover text-ink font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  {es ? 'Enviar otro mensaje' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-surface-card p-8 rounded-xl shadow-[var(--shadow-card)] space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {es ? 'Nombre' : 'Name'} <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={es ? 'Tu nombre completo' : 'Your full name'}
                    className={inputClass('name')}
                  />
                  {errors.name && touched.name && (
                    <p className="text-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {es ? 'Correo Electrónico' : 'Email'} <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={es ? 'tu@correo.com' : 'you@email.com'}
                    className={inputClass('email')}
                  />
                  {errors.email && touched.email && (
                    <p className="text-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {es ? 'Teléfono' : 'Phone'}{' '}
                    <span className="text-text-muted font-normal text-xs">
                      ({es ? 'opcional' : 'optional'})
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={es ? '+1 (000) 000-0000' : '+1 (000) 000-0000'}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-surface focus:outline-none focus:border-gold text-text transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {es ? 'Mensaje' : 'Message'} <span className="text-gold">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={5}
                    placeholder={
                      es
                        ? '¿En qué podemos ayudarte?'
                        : 'How can we help you?'
                    }
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && touched.message && (
                    <p className="text-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.message}
                    </p>
                  )}
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-error text-sm bg-error/10 px-4 py-3 rounded-lg">
                    <AlertCircle size={16} />
                    {es
                      ? 'Algo salió mal. Inténtalo de nuevo.'
                      : 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-4 bg-gold hover:bg-gold-hover text-ink font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
                  {es ? 'Enviar Mensaje' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
