// AnnouncementBar — shows the first active alert from adminData.
// Falls back to nothing if no active alerts exist.

import { Link } from 'react-router';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../../lib/i18n';
import type { Alert } from '../../../lib/adminData';
import { getActiveAlerts } from '../../../lib/alertsService';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const { language } = useI18n();

  useEffect(() => {
    getActiveAlerts().then((alerts) => setAlert(alerts[0] ?? null)).catch(console.error);
  }, []);

  if (!alert || dismissed) return null;

  const text = language === 'es' && alert.titleEs ? alert.titleEs : alert.title;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gold text-ink overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-4 lg:px-16 py-3 flex items-center justify-between gap-4">
          {alert.link ? (
            alert.link.startsWith('http') ? (
              <a
                href={alert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-center flex-1 hover:underline"
              >
                {text}
              </a>
            ) : (
              <Link
                to={alert.link}
                className="text-sm font-medium text-center flex-1 hover:underline"
              >
                {text}
              </Link>
            )
          ) : (
            <p className="text-sm font-medium text-center flex-1">{text}</p>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close announcement"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
