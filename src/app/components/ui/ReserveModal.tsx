// ReserveModal — Customer-facing reservation modal for Special Classes

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { SpecialClass } from '../../../lib/specialClasses';
import {
  addReservation,
  formatPriceCents,
  formatTimeOnly,
  formatDateOnly,
  getActiveReservationCount,
} from '../../../lib/specialClasses';

interface Props {
  specialClass: SpecialClass | null;
  onClose: () => void;
}

const inputBase: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text)',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

export function ReserveModal({ specialClass, onClose }: Props) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!specialClass) return null;

  const reservedCount = getActiveReservationCount(specialClass.id);
  const spotsLeft     = specialClass.maxCapacity - reservedCount;
  const isFree        = specialClass.price === 0;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    addReservation({
      specialClassId: specialClass.id,
      customerName:   name.trim(),
      customerEmail:  email.trim(),
      customerPhone:  phone.trim(),
      paymentStatus:  'pending',
      amount:         specialClass.price,
    });

    setTimeout(() => {
      setLoading(false);
      if (isFree || !specialClass.paymentLink) {
        // Free or no payment link — show success state directly
        setDone(true);
      } else {
        // Redirect to Square checkout
        window.location.href = specialClass.paymentLink;
      }
    }, 500);
  }

  function focusStyle(el: HTMLInputElement | HTMLTextAreaElement) {
    el.style.borderColor = 'var(--gold)';
    el.style.boxShadow   = '0 0 0 2px rgba(246,176,0,0.15)';
  }
  function blurStyle(el: HTMLInputElement | HTMLTextAreaElement, hasError: boolean) {
    el.style.borderColor = hasError ? 'var(--error)' : 'var(--border-strong)';
    el.style.boxShadow   = '';
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal card */}
        <motion.div
          className="relative w-full max-w-md rounded-2xl p-8 overflow-y-auto"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            maxHeight: '90vh',
          }}
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {done ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
                style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}
              >
                ✓
              </div>
              <h2
                className="font-display uppercase leading-none mb-3"
                style={{ fontSize: '2rem', color: 'var(--white)' }}
              >
                You're Booked!
              </h2>
              <p className="font-body text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                Your spot is reserved for <strong style={{ color: 'var(--white)' }}>{specialClass.name}</strong>.
              </p>
              <p className="font-body text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                See you on {formatDateOnly(specialClass.date)} at {formatTimeOnly(specialClass.date)}!
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-lg font-body font-bold uppercase tracking-wide text-sm transition-all"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Reservation form ── */
            <>
              <h2
                className="font-display uppercase text-center leading-none mb-1"
                style={{ fontSize: '1.75rem', color: 'var(--white)' }}
              >
                Reserve Your Spot
              </h2>
              <p className="font-body text-sm text-center font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                {specialClass.name}
              </p>
              <p className="font-body text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
                {formatDateOnly(specialClass.date)} · {formatTimeOnly(specialClass.date)} · {formatPriceCents(specialClass.price)}
              </p>

              {spotsLeft <= 0 ? (
                <div className="text-center py-8">
                  <p className="font-body font-bold text-sm" style={{ color: 'var(--error)' }}>
                    Sorry — this class is sold out.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Urgency notice */}
                  {spotsLeft <= 5 && (
                    <p
                      className="text-center text-xs font-body font-bold rounded-lg py-2"
                      style={{ background: 'rgba(246,176,0,0.1)', color: 'var(--gold)' }}
                    >
                      Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left!
                    </p>
                  )}

                  {/* Full Name */}
                  <div>
                    <label
                      className="block font-body text-xs font-semibold uppercase tracking-wide mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                      placeholder="Your full name"
                      style={{
                        ...inputBase,
                        borderColor: errors.name ? 'var(--error)' : 'var(--border-strong)',
                      }}
                      onFocus={e => focusStyle(e.currentTarget)}
                      onBlur={e  => blurStyle(e.currentTarget, !!errors.name)}
                    />
                    {errors.name && (
                      <p className="text-xs mt-1 font-body" style={{ color: 'var(--error)' }}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block font-body text-xs font-semibold uppercase tracking-wide mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="your@email.com"
                      style={{
                        ...inputBase,
                        borderColor: errors.email ? 'var(--error)' : 'var(--border-strong)',
                      }}
                      onFocus={e => focusStyle(e.currentTarget)}
                      onBlur={e  => blurStyle(e.currentTarget, !!errors.email)}
                    />
                    {errors.email && (
                      <p className="text-xs mt-1 font-body" style={{ color: 'var(--error)' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block font-body text-xs font-semibold uppercase tracking-wide mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Phone <span style={{ color: 'var(--text-dim)' }}>(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(201) 000-0000"
                      style={inputBase}
                      onFocus={e => focusStyle(e.currentTarget)}
                      onBlur={e  => blurStyle(e.currentTarget, false)}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-lg font-body font-bold uppercase tracking-wide text-sm transition-all mt-2"
                    style={{
                      background: loading ? 'var(--gold-hover)' : 'var(--gold)',
                      color:      'var(--ink)',
                      cursor:     loading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => {
                      if (!loading) e.currentTarget.style.background = 'var(--gold-hover)';
                    }}
                    onMouseLeave={e => {
                      if (!loading) e.currentTarget.style.background = 'var(--gold)';
                    }}
                  >
                    {loading
                      ? 'Processing…'
                      : `Confirm & Pay → ${formatPriceCents(specialClass.price)}`}
                  </button>

                  <p className="text-center font-body text-xs" style={{ color: 'var(--text-dim)' }}>
                    {isFree
                      ? 'Free event — no payment required. Just show up!'
                      : 'Secure payment via Square · You will be redirected to checkout'}
                  </p>
                </form>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
