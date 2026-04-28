// Estilo Kids — Gallery Page (Photos + Videos)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';
import { useCmsContent } from '../../../lib/hooks/useCmsContent';
import { getActiveKidsGalleryItems } from '../../../lib/kidsGalleryService';
import { KidsDoodles } from '../../components/kids/KidsDoodles';
import type { KidsGalleryItem } from '../../../lib/types';

const SPRING = { type: 'spring', stiffness: 200, damping: 15 } as const;

type Tab = 'photos' | 'videos';

function PhotoItem({ item, onClick }: { item: KidsGalleryItem; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={SPRING}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View ${item.title || 'photo'}`}
    >
      <img
        src={item.url}
        alt={item.title || 'Kids gallery photo'}
        className="w-full h-56 object-cover"
        loading="lazy"
      />
      {item.title && (
        <div className="px-3 py-2" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="font-body text-sm font-semibold" style={{ color: '#2D3D6B' }}>{item.title}</p>
        </div>
      )}
    </motion.div>
  );
}

function VideoItem({ item }: { item: KidsGalleryItem }) {
  const [playing, setPlaying] = useState(false);
  const thumb = item.thumbnailUrl || (item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '');

  if (playing && item.youtubeId) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: '#000' }}>
        <div className="relative" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {item.title && (
          <div className="px-3 py-2">
            <p className="font-body text-sm font-semibold text-white">{item.title}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={SPRING}
      className="rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
      onClick={() => setPlaying(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setPlaying(true)}
      aria-label={`Play ${item.title || 'video'}`}
    >
      <div className="relative w-full h-56">
        {thumb ? (
          <img src={thumb} alt={item.title || 'Video thumbnail'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#4A6FA5' }} />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#f0bf71' }}
          >
            <Play size={22} style={{ color: '#2D3D6B' }} className="ml-1" fill="#2D3D6B" />
          </div>
        </div>
      </div>
      {item.title && (
        <div className="px-3 py-2" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="font-body text-sm font-semibold" style={{ color: '#2D3D6B' }}>{item.title}</p>
        </div>
      )}
    </motion.div>
  );
}

export function KidsGalleryPage() {
  const [items,   setItems]   = useState<KidsGalleryItem[]>([]);
  const [tab,     setTab]     = useState<Tab>('photos');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<KidsGalleryItem | null>(null);

  useEffect(() => {
    getActiveKidsGalleryItems()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const photos = items.filter(i => i.type === 'photo');
  const videos = items.filter(i => i.type === 'video');
  const shown  = tab === 'photos' ? photos : videos;

  const cms = useCmsContent({
    'kids.gallery.heading': 'OUR GALLERY',
    'kids.gallery.subtitle': 'Memories from our classes, performances, and events.',
  });

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 flex items-center"
        style={{ backgroundColor: '#4A6FA5', minHeight: '38vh' }}
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
            {cms['kids.gallery.heading']}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.3 }}
            className="font-body text-lg"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {cms['kids.gallery.subtitle']}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Tabs + Grid ───────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: '#FFF8E7' }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          {/* Tab bar */}
          <div className="flex gap-2 justify-center mb-10">
            {(['photos', 'videos'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-6 py-2.5 rounded-full font-body font-bold text-sm uppercase tracking-wider transition-all"
                style={
                  tab === t
                    ? { backgroundColor: '#4A6FA5', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(74,111,165,0.35)' }
                    : { backgroundColor: '#FFFFFF', color: '#7A8BBF', border: '2px solid #CBD5E0' }
                }
              >
                {t === 'photos' ? `📷 Photos` : `🎬 Videos`}
                {t === 'photos' && photos.length > 0 && ` (${photos.length})`}
                {t === 'videos' && videos.length > 0 && ` (${videos.length})`}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl h-56 animate-pulse" style={{ backgroundColor: '#E2E8F0' }} />
              ))}
            </div>
          ) : shown.length > 0 ? (
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {shown.map(item =>
                item.type === 'photo' ? (
                  <PhotoItem key={item.id} item={item} onClick={() => setLightbox(item)} />
                ) : (
                  <VideoItem key={item.id} item={item} />
                ),
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">{tab === 'photos' ? '📷' : '🎬'}</div>
              <p className="font-body text-lg" style={{ color: '#7A8BBF' }}>
                No {tab} yet — check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Photo Lightbox ────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={SPRING}
              src={lightbox.url}
              alt={lightbox.title || 'Gallery photo'}
              className="rounded-2xl shadow-2xl"
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
