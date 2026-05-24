// Euphoria Ladies — Audition application popup modal.
// Checks active status on open; shows form when active, closed message when inactive.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Loader, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { submitAuditionApplication, checkDuplicateApplication } from '../../../lib/euphoriaAuditionsService';

const P = '#E83A7E';
const BG = '#0A0A0A';
const CARD = '#181818';
const BD = '#2A2A2A';
const TXT = '#E8E8E8';
const MUT = '#909090';

interface Props {
  isOpen: boolean;
  isActive: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  about: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  about?: string;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }
  if (data.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a complete 10-digit phone number.';
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.about.trim() || data.about.trim().length < 10) {
    errors.about = 'Please tell us a bit more (at least 10 characters).';
  }
  return errors;
}

type ModalState = 'form' | 'submitting' | 'success';

export function EuphoriaAuditionModal({ isOpen, isActive, onClose }: Props) {
  const [state, setState] = useState<ModalState>('form');
  const [data, setData] = useState<FormData>({ fullName: '', phone: '', email: '', about: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset form each time modal opens
  useEffect(() => {
    if (isOpen) {
      setState('form');
      setData({ fullName: '', phone: '', email: '', about: '' });
      setErrors({});
      setSubmitError('');
      setTimeout(() => firstFieldRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function set(field: keyof FormData, value: string) {
    setData(d => ({ ...d, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setState('submitting');
    setSubmitError('');
    try {
      const isDuplicate = await checkDuplicateApplication(data.email);
      if (isDuplicate) {
        setState('form');
        setErrors(prev => ({ ...prev, email: 'An application with this email already exists.' }));
        return;
      }
      await submitAuditionApplication(data);
      setState('success');
    } catch {
      setState('form');
      setSubmitError('Something went wrong. Please try again.');
    }
  }

  const inputBase = [
    'w-full px-4 py-3 rounded-xl text-sm font-body transition-all outline-none',
    'focus:ring-2',
  ].join(' ');

  function inputStyle(hasError: boolean) {
    return {
      backgroundColor: '#111111',
      border: `1px solid ${hasError ? '#EF4444' : BD}`,
      color: TXT,
      caretColor: P,
    };
  }

  function focusStyle(hasError: boolean) {
    return hasError
      ? { '--tw-ring-color': '#EF444455' } as React.CSSProperties
      : { '--tw-ring-color': `${P}33` } as React.CSSProperties;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Audition application"
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ backgroundColor: CARD, border: `1px solid rgba(232,58,126,0.25)`, boxShadow: `0 0 80px rgba(232,58,126,0.15), 0 24px 60px rgba(0,0,0,0.6)` }}
          >
            {/* Pink top accent line */}
            <div style={{ height: 3, background: `linear-gradient(to right, transparent, ${P} 30%, ${P} 70%, transparent)` }} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
              style={{ backgroundColor: 'rgba(232,58,126,0.12)', color: 'rgba(255,255,255,0.55)' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="px-7 pt-7 pb-8">

              {/* ── INACTIVE state ── */}
              {!isActive && (
                <div className="text-center py-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: 'rgba(232,58,126,0.12)', border: `1px solid rgba(232,58,126,0.2)` }}
                  >
                    <AlertCircle size={28} style={{ color: P }} />
                  </div>
                  <h2 className="font-display uppercase text-white mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                    Not Currently Accepting
                  </h2>
                  <p className="font-body text-sm leading-relaxed mb-6" style={{ color: MUT }}>
                    We are not accepting audition applications at this time. Check back soon — the next season of{' '}
                    <span style={{ color: P }}>Euphoria Ladies</span> is coming!
                  </p>
                  <p className="font-body text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(232,58,126,0.6)' }}>
                    We will start accepting applications soon
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-7 inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider text-sm px-7 py-3 rounded-full text-white transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: P, boxShadow: `0 6px 24px rgba(232,58,126,0.4)` }}
                  >
                    Got it
                  </button>
                </div>
              )}

              {/* ── SUCCESS state ── */}
              {isActive && state === 'success' && (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: `1px solid rgba(34,197,94,0.25)` }}
                  >
                    <CheckCircle size={28} color="#22C55E" />
                  </motion.div>
                  <h2 className="font-display uppercase text-white mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                    Application Submitted!
                  </h2>
                  <p className="font-body text-sm leading-relaxed mb-7" style={{ color: MUT }}>
                    Thank you for applying to <span style={{ color: P }}>Euphoria Ladies</span>. We have received your application and will be in touch soon. We look forward to meeting you!
                  </p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider text-sm px-7 py-3 rounded-full text-white transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: P, boxShadow: `0 6px 24px rgba(232,58,126,0.4)` }}
                  >
                    Close
                  </button>
                </div>
              )}

              {/* ── FORM state ── */}
              {isActive && (state === 'form' || state === 'submitting') && (
                <>
                  {/* Header */}
                  <div className="mb-6 pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-px" style={{ backgroundColor: P }} />
                      <span className="font-body text-[10px] uppercase tracking-[0.28em] font-semibold" style={{ color: P }}>
                        Euphoria Ladies
                      </span>
                    </div>
                    <h2
                      className="font-display uppercase text-white"
                      style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', lineHeight: 0.92 }}
                    >
                      Audition Application
                    </h2>
                    <p className="font-body text-xs mt-2.5 leading-relaxed" style={{ color: MUT }}>
                      Fill out the form below and our team will reach out to you shortly.
                    </p>
                  </div>

                  {submitError && (
                    <div
                      className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-body"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}
                    >
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">

                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: MUT }}>
                        <User size={11} style={{ color: P }} /> Full Name <span style={{ color: P }}>*</span>
                      </label>
                      <input
                        ref={firstFieldRef}
                        type="text"
                        value={data.fullName}
                        onChange={e => set('fullName', e.target.value)}
                        placeholder="Your full name"
                        className={inputBase}
                        style={{ ...inputStyle(!!errors.fullName), ...focusStyle(!!errors.fullName) }}
                        autoComplete="name"
                        disabled={state === 'submitting'}
                      />
                      {errors.fullName && (
                        <p className="text-xs mt-1 font-body" style={{ color: '#FCA5A5' }}>{errors.fullName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: MUT }}>
                        <Phone size={11} style={{ color: P }} /> Phone Number <span style={{ color: P }}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => set('phone', formatPhone(e.target.value))}
                        placeholder="(000) 000-0000"
                        className={inputBase}
                        style={{ ...inputStyle(!!errors.phone), ...focusStyle(!!errors.phone) }}
                        autoComplete="tel"
                        disabled={state === 'submitting'}
                      />
                      {errors.phone && (
                        <p className="text-xs mt-1 font-body" style={{ color: '#FCA5A5' }}>{errors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: MUT }}>
                        <Mail size={11} style={{ color: P }} /> Email Address <span style={{ color: P }}>*</span>
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="you@email.com"
                        className={inputBase}
                        style={{ ...inputStyle(!!errors.email), ...focusStyle(!!errors.email) }}
                        autoComplete="email"
                        disabled={state === 'submitting'}
                      />
                      {errors.email && (
                        <p className="text-xs mt-1 font-body" style={{ color: '#FCA5A5' }}>{errors.email}</p>
                      )}
                    </div>

                    {/* About */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: MUT }}>
                        <MessageSquare size={11} style={{ color: P }} /> Tell Us About Yourself <span style={{ color: P }}>*</span>
                      </label>
                      <textarea
                        value={data.about}
                        onChange={e => set('about', e.target.value)}
                        placeholder="Share your dance experience, goals, and why you want to join Euphoria Ladies…"
                        rows={4}
                        className={`${inputBase} resize-none`}
                        style={{ ...inputStyle(!!errors.about), ...focusStyle(!!errors.about) }}
                        disabled={state === 'submitting'}
                      />
                      {errors.about && (
                        <p className="text-xs mt-1 font-body" style={{ color: '#FCA5A5' }}>{errors.about}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={state === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 font-body font-bold uppercase tracking-wider text-sm py-4 rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                      style={{
                        backgroundColor: P,
                        boxShadow: state === 'submitting' ? 'none' : `0 8px 28px rgba(232,58,126,0.4)`,
                      }}
                    >
                      {state === 'submitting'
                        ? <><Loader size={15} className="animate-spin" /> Submitting…</>
                        : 'Submit Application'}
                    </button>

                    <p className="text-center font-body text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      Your information is kept private and only used for audition purposes.
                    </p>
                  </form>
                </>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
