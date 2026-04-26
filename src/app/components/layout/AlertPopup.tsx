// AlertPopup — modal overlay shown on page load when an active alert exists.
// Dismisses via sessionStorage so it doesn't reappear within the same browser session.
// A new alert (different id) will always show again even if a previous one was dismissed.

import { useEffect, useState } from 'react';
import { X, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import type { Alert } from '../../../lib/adminData';
import { getActiveAlerts } from '../../../lib/alertsService';
import { useI18n } from '../../../lib/i18n';

function typeConfig(type: Alert['type']): { Icon: React.ElementType; iconClass: string } {
  switch (type) {
    case 'warning': return { Icon: AlertTriangle, iconClass: 'text-gold' };
    case 'promo':   return { Icon: Sparkles,      iconClass: 'text-gold' };
    default:        return { Icon: Info,           iconClass: 'text-info' };
  }
}

export function AlertPopup() {
  const [alert, setAlert]   = useState<Alert | null>(null);
  const [visible, setVisible] = useState(false);
  const { language } = useI18n();

  useEffect(() => {
    getActiveAlerts().then((alerts) => {
      const active = alerts[0];
      if (!active) return;
      const key = `alertDismissed_${active.id}`;
      if (sessionStorage.getItem(key)) return;
      setAlert(active);
      setVisible(true);
    }).catch(console.error);
  }, []);

  function dismiss() {
    if (alert) sessionStorage.setItem(`alertDismissed_${alert.id}`, '1');
    setVisible(false);
  }

  if (!alert) return null;

  const title   = language === 'es' && alert.titleEs   ? alert.titleEs   : alert.title;
  const message = language === 'es' && alert.messageEs ? alert.messageEs : alert.message;
  const { Icon, iconClass } = typeConfig(alert.type);
  const buttonLabel = alert.type === 'promo' ? 'CHECK IT OUT' : 'GOT IT';

  const linkButton =
    alert.link && alert.type === 'promo' ? (
      alert.link.startsWith('http') ? (
        <a
          href={alert.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="block bg-gold text-ink font-bold uppercase tracking-wide px-8 py-3 rounded-lg w-full mt-6 text-center hover:bg-gold-hover transition-colors"
        >
          {buttonLabel}
        </a>
      ) : (
        <Link
          to={alert.link}
          onClick={dismiss}
          className="block bg-gold text-ink font-bold uppercase tracking-wide px-8 py-3 rounded-lg w-full mt-6 text-center hover:bg-gold-hover transition-colors"
        >
          {buttonLabel}
        </Link>
      )
    ) : (
      <button
        onClick={dismiss}
        className="bg-gold text-ink font-bold uppercase tracking-wide px-8 py-3 rounded-lg w-full mt-6 hover:bg-gold-hover transition-colors"
      >
        {buttonLabel}
      </button>
    );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center px-4"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-surface-elevated border border-border rounded-2xl p-8 max-w-lg w-full mt-[20vh] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Type icon */}
            <div className="flex justify-center mb-4">
              <Icon size={32} className={iconClass} />
            </div>

            {/* Title */}
            <p className="font-display text-2xl text-white uppercase text-center tracking-wide">
              {title}
            </p>

            {/* Message body */}
            {message && (
              <p className="text-text text-sm leading-relaxed text-center mt-4">
                {message}
              </p>
            )}

            {/* CTA */}
            {linkButton}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
