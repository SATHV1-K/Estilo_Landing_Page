// Euphoria Ladies — Gallery Page
// Server-side paginated gallery with category filters and lightbox

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveEuphoriaGalleryItemsPaginated } from '../../../lib/euphoriaGalleryService';
import type { EuphoriaGalleryItem, EuphoriaGalleryCategory } from '../../../lib/types';

const P       = '#E83A7E';
const BG      = '#0A0A0A';
const SF      = '#111111';
const CARD    = '#181818';
const BD      = '#252525';
const MUT     = '#909090';
const WH      = '#FFFFFF';

const PAGE_SIZE = 20;

type FilterKey = 'all' | EuphoriaGalleryCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: 'All'         },
  { key: 'competition', label: 'Competition' },
  { key: 'performance', label: 'Performance' },
  { key: 'training',    label: 'Training'    },
  { key: 'backstage',   label: 'Backstage'   },
  { key: 'general',     label: 'General'     },
];

// ─── Modals ───────────────────────────────────────────────────────────────────

function VideoModal({ youtubeId, onClose }: { youtubeId: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white transition-colors z-10"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <div
        className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Euphoria Ladies Video"
        />
      </div>
    </motion.div>
  );
}

function PhotoModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white transition-colors z-10"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] object-contain rounded-xl"
        onClick={e => e.stopPropagation()}
      />
    </motion.div>
  );
}

// ─── Gallery Page ─────────────────────────────────────────────────────────────

export function EuphoriaGalleryPage() {
  const [items,       setItems]       = useState<EuphoriaGalleryItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<FilterKey>('all');
  const [page,        setPage]        = useState(1);
  const [total,       setTotal]       = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<{ src: string; alt: string } | null>(null);

  const load = useCallback((pg: number, cat: FilterKey) => {
    setLoading(true);
    getActiveEuphoriaGalleryItemsPaginated(
      pg,
      PAGE_SIZE,
      cat === 'all' ? undefined : cat as EuphoriaGalleryCategory,
    )
      .then(({ items, total }) => { setItems(items); setTotal(total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page, filter); }, [load, page, filter]);

  const handleFilterChange = (f: FilterKey) => {
    setFilter(f);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Page header */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ backgroundColor: SF }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${P}, transparent)` }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(232,58,126,0.1) 0%, transparent 70%)` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-6 h-px" style={{ backgroundColor: P }} />
            <span className="font-body text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: P }}>
              Experience Euphoria
            </span>
            <div className="w-6 h-px" style={{ backgroundColor: P }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display uppercase text-white overflow-wrap-anywhere min-w-0"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: 0.93 }}
          >
            GALLERY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-sm mt-4 max-w-lg mx-auto"
            style={{ color: MUT }}
          >
            Competition victories, stage performances, backstage moments, and the journey that defines Euphoria Ladies.
          </motion.p>
        </div>
      </section>

      {/* Filter tabs */}
      <div
        className="sticky top-20 z-20 py-3.5 overflow-x-auto scrollbar-hide"
        style={{ backgroundColor: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(16px)', borderBottom: `1px solid rgba(232,58,126,0.12)` }}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 w-max mx-auto">
            <SlidersHorizontal size={14} className="flex-shrink-0" style={{ color: MUT }} />
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0"
                style={
                  filter === f.key
                    ? { backgroundColor: P, color: WH, boxShadow: `0 4px 16px rgba(232,58,126,0.35)` }
                    : { backgroundColor: CARD, color: MUT, border: `1px solid ${BD}` }
                }
                onMouseEnter={e => {
                  if (filter !== f.key) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,58,126,0.4)';
                    (e.currentTarget as HTMLElement).style.color = P;
                  }
                }}
                onMouseLeave={e => {
                  if (filter !== f.key) {
                    (e.currentTarget as HTMLElement).style.borderColor = BD;
                    (e.currentTarget as HTMLElement).style.color = MUT;
                  }
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-14">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl animate-pulse"
                style={{ backgroundColor: CARD }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display uppercase text-4xl mb-3" style={{ color: BD }}>No Items Yet</p>
            <p className="font-body text-sm" style={{ color: MUT }}>
              {filter !== 'all' ? 'No items in this category.' : 'Gallery content coming soon.'}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <AnimatePresence mode="popLayout">
              {items.map(item => {
                const thumb = item.type === 'photo'
                  ? item.url
                  : item.thumbnailUrl || (item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '');

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                    style={{ backgroundColor: CARD }}
                    onClick={() => {
                      if (item.type === 'video' && item.youtubeId) setActiveVideo(item.youtubeId);
                      else if (item.type === 'photo' && item.url) setActivePhoto({ src: item.url, alt: item.title || 'Gallery' });
                    }}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title || 'Gallery'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: SF }}>
                        <Play size={28} style={{ color: P, opacity: 0.35 }} />
                      </div>
                    )}

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(232,58,126,0.28)' }}
                    >
                      {item.type === 'video' ? (
                        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                          <Play size={18} fill={P} style={{ marginLeft: 2, color: P }} />
                        </div>
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
                        >
                          <X size={14} className="rotate-45" style={{ color: WH }} />
                        </div>
                      )}
                    </div>

                    {item.title && (
                      <div
                        className="absolute bottom-0 left-0 right-0 px-3 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}
                      >
                        <p className="font-body text-xs font-bold text-white truncate">{item.title}</p>
                      </div>
                    )}

                    {item.type === 'video' && (
                      <div
                        className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: P, color: WH }}
                      >
                        Video
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            {/* Count info */}
            <p className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total} items
            </p>

            {/* Page controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ backgroundColor: CARD, border: `1px solid ${BD}`, color: WH }}
                  onMouseEnter={e => { if (page > 1) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,58,126,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page number pills */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce<(number | 'ellipsis')[]>((acc, n, idx, arr) => {
                      if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, i) =>
                      n === 'ellipsis' ? (
                        <span key={`e${i}`} className="font-body text-xs px-1" style={{ color: MUT }}>…</span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className="w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all duration-200"
                          style={
                            page === n
                              ? { backgroundColor: P, color: WH, boxShadow: `0 4px 12px rgba(232,58,126,0.35)` }
                              : { backgroundColor: CARD, color: MUT, border: `1px solid ${BD}` }
                          }
                        >
                          {n}
                        </button>
                      )
                    )
                  }
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ backgroundColor: CARD, border: `1px solid ${BD}`, color: WH }}
                  onMouseEnter={e => { if (page < totalPages) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,58,126,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; }}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeVideo && <VideoModal youtubeId={activeVideo} onClose={() => setActiveVideo(null)} />}
        {activePhoto && <PhotoModal src={activePhoto.src} alt={activePhoto.alt} onClose={() => setActivePhoto(null)} />}
      </AnimatePresence>
    </div>
  );
}
