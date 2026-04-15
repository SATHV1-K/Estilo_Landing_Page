// ReservationSuccessPage — shown after a free reservation or as a landing page
// for customers returning from Square payment.

import { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, CalendarDays } from 'lucide-react';

export function ReservationSuccessPage() {
  useEffect(() => {
    document.title = 'Reservation Confirmed | Estilo Latino Dance Company';
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-24"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="text-center max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.12)' }}
          >
            <CheckCircle size={44} color="var(--success)" strokeWidth={1.8} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="font-display uppercase leading-none mb-3"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'var(--white)' }}
        >
          You're <span style={{ color: 'var(--gold)' }}>In!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="font-body mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Your spot has been reserved. If you haven't completed payment yet, use the link in your confirmation.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="font-body text-sm mb-10"
          style={{ color: 'var(--text-dim)' }}
        >
          Questions? Call us at{' '}
          <a
            href="tel:+12018788977"
            className="font-semibold hover:underline"
            style={{ color: 'var(--gold)' }}
          >
            (201) 878-8977
          </a>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/schedule"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-body font-bold uppercase tracking-wide text-sm transition-all"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
          >
            <CalendarDays size={16} /> View Full Schedule
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center px-7 py-3.5 rounded-lg font-body font-bold uppercase tracking-wide text-sm transition-all"
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-strong)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
