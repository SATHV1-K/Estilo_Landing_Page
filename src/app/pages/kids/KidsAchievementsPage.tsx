// Estilo Kids — Achievements Page

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCmsContent } from '../../../lib/hooks/useCmsContent';
import { getActiveKidsAchievements } from '../../../lib/kidsAchievementsService';
import { KidsDoodles } from '../../components/kids/KidsDoodles';
import type { KidsAchievement } from '../../../lib/types';

const SPRING = { type: 'spring', stiffness: 200, damping: 15 } as const;

function AchievementCard({ achievement, index }: { achievement: KidsAchievement; index: number }) {
  const [lightbox, setLightbox] = useState(false);

  const dateStr = achievement.date
    ? new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: (index % 4) * 0.1 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={() => achievement.imageUrl && setLightbox(true)}
        role="button"
        aria-label={`View ${achievement.title}`}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && achievement.imageUrl && setLightbox(true)}
      >
        {achievement.imageUrl ? (
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-52 object-cover"
          />
        ) : (
          <div
            className="w-full h-52 flex items-center justify-center text-5xl"
            style={{ backgroundColor: '#4A6FA5' }}
          >
            🏆
          </div>
        )}
        <div className="p-5">
          <h3 className="font-body font-bold text-base leading-snug mb-1" style={{ color: '#2D3D6B' }}>
            {achievement.title}
          </h3>
          {dateStr && (
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#f0bf71' }}>
              {dateStr}
            </p>
          )}
          {achievement.description && (
            <p className="text-sm leading-relaxed" style={{ color: '#7A8BBF' }}>
              {achievement.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            onClick={() => setLightbox(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={SPRING}
              src={achievement.imageUrl}
              alt={achievement.title}
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function KidsAchievementsPage() {
  const [achievements, setAchievements] = useState<KidsAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveKidsAchievements()
      .then(setAchievements)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cms = useCmsContent({
    'kids.achievements.page.heading': 'OUR LITTLE STARS',
    'kids.achievements.page.subtitle': 'Celebrating the incredible wins, performances, and milestones of our young dancers.',
  });

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 flex items-center"
        style={{ backgroundColor: '#4A6FA5', minHeight: '40vh' }}
      >
        <KidsDoodles variant="blue" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 text-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="font-display uppercase mb-4"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#FFFFFF', lineHeight: 0.95 }}
          >
            {cms['kids.achievements.page.heading']}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.3 }}
            className="font-body text-lg max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {cms['kids.achievements.page.subtitle']}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#FFF8E7' }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="w-full h-52" style={{ backgroundColor: '#E2E8F0' }} />
                  <div className="p-5">
                    <div className="h-4 rounded mb-2" style={{ backgroundColor: '#E2E8F0' }} />
                    <div className="h-3 w-20 rounded" style={{ backgroundColor: '#E2E8F0' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((a, i) => (
                <AchievementCard key={a.id} achievement={a} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏆</div>
              <p className="font-body text-lg" style={{ color: '#7A8BBF' }}>
                Achievements coming soon — check back after our next competition!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
