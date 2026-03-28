// AnnouncementBar - Optional top banner

import { Link } from 'react-router';
import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../../lib/i18n';
import { siteSettings } from '../../../lib/data';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const { language } = useI18n();

  if (!siteSettings.announcementBar?.isActive || !isVisible) {
    return null;
  }

  const announcement = siteSettings.announcementBar;
  const text = language === 'es' ? announcement.textEs : announcement.text;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-accent text-white overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-4 lg:px-16 py-3 flex items-center justify-between gap-4">
          {announcement.link ? (
            <Link
              to={announcement.link}
              className="text-sm font-medium text-center flex-1 hover:underline"
            >
              {text}
            </Link>
          ) : (
            <p className="text-sm font-medium text-center flex-1">{text}</p>
          )}

          <button
            onClick={() => setIsVisible(false)}
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
