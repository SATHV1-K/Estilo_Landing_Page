// Public /gallery page — tabbed: Our Photos | Our Videos.

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Film, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getActiveVideos, type Video, type VideoSource, type VideoCategory,
  getActiveGalleryPhotos, type GalleryPhoto, type PhotoCategory,
} from '../../lib/adminData';
import { getYouTubeThumbnail } from '../../lib/youtube';
import { useI18n } from '../../lib/i18n';
import { fadeInUp } from '../../lib/animations';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab            = 'photos' | 'videos';
type SourceFilter   = 'all' | VideoSource;
type VideoCatFilter = 'all' | VideoCategory;
type PhotoCatFilter = 'all' | PhotoCategory;

// ─── Constants ────────────────────────────────────────────────────────────────

const VIDEO_SOURCE_TABS: { id: SourceFilter; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'youtube',   label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'upload',    label: 'Uploads' },
];

const VIDEO_CAT_PILLS: { id: VideoCatFilter; label: string; labelEs: string }[] = [
  { id: 'all',              label: 'All',              labelEs: 'Todos' },
  { id: 'performance',      label: 'Performances',     labelEs: 'Presentaciones' },
  { id: 'class',            label: 'Classes',          labelEs: 'Clases' },
  { id: 'student-showcase', label: 'Student Showcase', labelEs: 'Exhibición' },
  { id: 'event',            label: 'Events',           labelEs: 'Eventos' },
];

const PHOTO_CAT_PILLS: { id: PhotoCatFilter; label: string; labelEs: string }[] = [
  { id: 'all',         label: 'All',          labelEs: 'Todos' },
  { id: 'performance', label: 'Performances', labelEs: 'Presentaciones' },
  { id: 'class',       label: 'Classes',      labelEs: 'Clases' },
  { id: 'event',       label: 'Events',       labelEs: 'Eventos' },
  { id: 'studio',      label: 'Studio',       labelEs: 'Estudio' },
  { id: 'general',     label: 'General',      labelEs: 'General' },
];

const SOURCE_LABEL: Record<VideoSource, string> = {
  youtube:   'YouTube',
  instagram: 'Instagram',
  upload:    'Studio',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getThumb(video: Video): string {
  if (video.thumbnailUrl) return video.thumbnailUrl;
  if (video.source === 'youtube' && video.youtubeId) return getYouTubeThumbnail(video.youtubeId);
  return '';
}

function handleThumbError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src.includes('maxresdefault')) {
    img.src = img.src.replace('maxresdefault', 'hqdefault');
  } else {
    img.style.display = 'none';
  }
}

// ─── VideoModal ───────────────────────────────────────────────────────────────

function VideoModal({ video, onClose, language }: { video: Video; onClose: () => void; language: 'en' | 'es' }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const title       = language === 'es' && video.titleEs ? video.titleEs : video.title;
  const description = language === 'es' && video.descriptionEs ? video.descriptionEs : video.description;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog" aria-modal="true" aria-label={title || 'Video player'}
        className="relative z-10 w-[92vw] max-w-4xl bg-surface-elevated rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors" aria-label="Close video">
          <X size={18} />
        </button>
        {video.source === 'youtube' && video.youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen" allowFullScreen loading="lazy"
            className="w-full aspect-video" title={title}
          />
        ) : (
          <video src={video.videoFileUrl} controls autoPlay preload="metadata" className="w-full aspect-video bg-black" />
        )}
        {(title || description) && (
          <div className="p-5">
            {title && <h2 className="text-white font-bold text-lg leading-snug mb-1">{title}</h2>}
            {description && <p className="text-text-muted text-sm leading-relaxed">{description}</p>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── PhotoLightbox ────────────────────────────────────────────────────────────

function PhotoLightbox({
  photos,
  startIndex,
  onClose,
  language,
}: {
  photos: GalleryPhoto[];
  startIndex: number;
  onClose: () => void;
  language: 'en' | 'es';
}) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % photos.length);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, photos.length]);

  const photo = photos[current];
  const title = language === 'es' && photo.titleEs ? photo.titleEs : photo.title;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors" aria-label="Close">
        <X size={22} />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + photos.length) % photos.length); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-gold hover:text-ink transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % photos.length); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-gold hover:text-ink transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Image */}
      <div className="relative z-10 max-w-5xl max-h-[90vh] w-full mx-4 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.id}
            src={photo.imageUrl}
            alt={photo.altText || title}
            className="max-h-[80vh] max-w-full object-contain rounded-xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
        {title && (
          <p className="mt-3 text-white text-sm font-semibold text-center px-4">{title}</p>
        )}
        {photos.length > 1 && (
          <p className="text-text-muted text-xs mt-1">{current + 1} / {photos.length}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ video, language, onClick }: { video: Video; language: 'en' | 'es'; onClick: () => void }) {
  const thumb = getThumb(video);
  const title = language === 'es' && video.titleEs ? video.titleEs : video.title;
  const description = language === 'es' && video.descriptionEs ? video.descriptionEs : video.description;
  const isInstagram = video.source === 'instagram';

  function handleClick() {
    if (isInstagram && video.externalUrl) window.open(video.externalUrl, '_blank', 'noopener,noreferrer');
    else onClick();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
  }

  const categoryLabel = VIDEO_CAT_PILLS.find(c => c.id === video.category);
  const catDisplay = categoryLabel ? (language === 'es' ? categoryLabel.labelEs : categoryLabel.label) : video.category;

  return (
    <motion.article
      variants={fadeInUp} whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }}
      tabIndex={0} role="button"
      aria-label={`${isInstagram ? 'Open on Instagram' : 'Play'}: ${title || 'Untitled video'}`}
      onClick={handleClick} onKeyDown={handleKeyDown}
      className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-gold hover:shadow-[0_0_24px_rgba(246,176,0,0.15)] transition-all cursor-pointer group"
    >
      <div className="relative aspect-video bg-[#111111]">
        {thumb ? (
          <img src={thumb} alt={title} loading="lazy" className="w-full h-full object-cover" onError={handleThumbError} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><Film size={36} className="text-border-strong" /></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>
        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
          {SOURCE_LABEL[video.source]}
        </span>
        {video.durationSec > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(video.durationSec)}
          </span>
        )}
        {isInstagram && (
          <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">Opens Instagram</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-base line-clamp-2 leading-snug">
          {title || <span className="text-text-dim italic font-normal">Untitled</span>}
        </h3>
        {description && <p className="text-text-muted text-sm line-clamp-2 mt-1 leading-relaxed">{description}</p>}
        {catDisplay && catDisplay !== 'all' && <p className="text-gold text-xs uppercase tracking-wide mt-3 font-semibold">{catDisplay}</p>}
      </div>
    </motion.article>
  );
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────

function PhotoCard({ photo, language, onClick }: { photo: GalleryPhoto; language: 'en' | 'es'; onClick: () => void }) {
  const title = language === 'es' && photo.titleEs ? photo.titleEs : photo.title;
  const catLabel = PHOTO_CAT_PILLS.find(c => c.id === photo.category);
  const catDisplay = catLabel ? (language === 'es' ? catLabel.labelEs : catLabel.label) : photo.category;

  return (
    <motion.article
      variants={fadeInUp} whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }}
      tabIndex={0} role="button" aria-label={`View photo: ${title || 'Gallery photo'}`}
      onClick={onClick} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-gold hover:shadow-[0_0_24px_rgba(246,176,0,0.15)] transition-all cursor-pointer group"
    >
      <div className="relative aspect-square bg-[#111111]">
        <img
          src={photo.imageUrl}
          alt={photo.altText || title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-lg">
            <ImageIcon size={20} />
          </div>
        </div>
      </div>
      {(title || (catDisplay && catDisplay !== 'all')) && (
        <div className="p-3">
          {title && <h3 className="text-white font-bold text-sm line-clamp-1">{title}</h3>}
          {catDisplay && catDisplay !== 'all' && <p className="text-gold text-xs uppercase tracking-wide mt-1 font-semibold">{catDisplay}</p>}
        </div>
      )}
    </motion.article>
  );
}

// ─── GalleryPage ──────────────────────────────────────────────────────────────

export function GalleryPage() {
  const { language } = useI18n();
  const [tab, setTab]                       = useState<Tab>('photos');
  const [videos]                            = useState<Video[]>(() => getActiveVideos());
  const [photos]                            = useState<GalleryPhoto[]>(() => getActiveGalleryPhotos());
  const [sourceFilter, setSourceFilter]     = useState<SourceFilter>('all');
  const [videoCat, setVideoCat]             = useState<VideoCatFilter>('all');
  const [photoCat, setPhotoCat]             = useState<PhotoCatFilter>('all');
  const [activeModal, setActiveModal]       = useState<Video | null>(null);
  const [lightboxIdx, setLightboxIdx]       = useState<number | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Gallery | Estilo Latino Dance Company';
    return () => { document.title = prev; };
  }, []);

  const filteredVideos = videos.filter(v => {
    if (sourceFilter !== 'all' && v.source !== sourceFilter) return false;
    if (videoCat !== 'all' && v.category !== videoCat) return false;
    return true;
  });

  const filteredPhotos = photos.filter(p => photoCat === 'all' || p.category === photoCat);

  const clearVideoFilters = useCallback(() => { setSourceFilter('all'); setVideoCat('all'); }, []);
  const clearPhotoFilters = useCallback(() => { setPhotoCat('all'); }, []);

  const visiblePhotos = filteredPhotos;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">

        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-section text-white uppercase leading-[0.95] mb-3">
            {language === 'es'
              ? <><span className="text-gold">NUESTRA</span> GALERÍA</>
              : <>OUR <span className="text-gold">GALLERY</span></>}
          </h1>
          <p className="text-text-muted text-sm tracking-widest uppercase">
            {language === 'es' ? 'Momentos que inspiran' : 'Moments that inspire'}
          </p>
        </motion.div>

        {/* ── Main tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="flex gap-2 justify-center mb-10"
        >
          {([
            { id: 'photos', label: language === 'es' ? 'Nuestras Fotos' : 'Our Photos' },
            { id: 'videos', label: language === 'es' ? 'Nuestros Videos' : 'Our Videos' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider border-2 transition-all ${
                tab === t.id
                  ? 'bg-gold text-ink border-gold'
                  : 'bg-transparent text-text border-border-strong hover:border-gold hover:text-gold'
              }`}
            >
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* ── PHOTOS TAB ── */}
        {tab === 'photos' && (
          <>
            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-wrap gap-2 justify-center mb-10"
            >
              {PHOTO_CAT_PILLS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setPhotoCat(pill.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                    photoCat === pill.id
                      ? 'bg-gold text-ink border-gold'
                      : 'bg-transparent text-text border-border-strong hover:border-gold hover:text-gold'
                  }`}
                >
                  {language === 'es' ? pill.labelEs : pill.label}
                </button>
              ))}
            </motion.div>

            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ImageIcon size={48} className="text-border-strong mb-4" />
                <p className="text-text-muted text-lg">
                  {language === 'es' ? 'Fotos próximamente' : 'Photos coming soon'}
                </p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ImageIcon size={48} className="text-border-strong mb-4" />
                <p className="text-text-muted text-lg mb-4">
                  {language === 'es' ? 'Ninguna foto coincide con este filtro' : 'No photos match this filter'}
                </p>
                <button onClick={clearPhotoFilters} className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gold text-ink hover:bg-gold-hover transition-colors">
                  {language === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {visiblePhotos.map((photo, idx) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    language={language}
                    onClick={() => setLightboxIdx(idx)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── VIDEOS TAB ── */}
        {tab === 'videos' && (
          <>
            {/* Source tabs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-wrap gap-3 justify-center mb-5"
            >
              {VIDEO_SOURCE_TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSourceFilter(t.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border transition-all ${
                    sourceFilter === t.id
                      ? 'bg-gold text-ink border-gold'
                      : 'bg-transparent text-text border-border-strong hover:border-gold hover:text-gold'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </motion.div>

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
              className="flex flex-wrap gap-2 justify-center mb-12"
            >
              {VIDEO_CAT_PILLS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setVideoCat(pill.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                    videoCat === pill.id
                      ? 'bg-gold text-ink border-gold'
                      : 'bg-transparent text-text border-border-strong hover:border-gold hover:text-gold'
                  }`}
                >
                  {language === 'es' ? pill.labelEs : pill.label}
                </button>
              ))}
            </motion.div>

            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Film size={48} className="text-border-strong mb-4" />
                <p className="text-text-muted text-lg">{language === 'es' ? 'Videos próximamente' : 'Videos coming soon'}</p>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Film size={48} className="text-border-strong mb-4" />
                <p className="text-text-muted text-lg mb-4">
                  {language === 'es' ? 'Ningún video coincide con este filtro' : 'No videos match this filter'}
                </p>
                <button onClick={clearVideoFilters} className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gold text-ink hover:bg-gold-hover transition-colors">
                  {language === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                </button>
              </div>
            ) : (
              <div key={`${sourceFilter}__${videoCat}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                  <VideoCard key={video.id} video={video} language={language} onClick={() => setActiveModal(video)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {activeModal && (
          <VideoModal key={activeModal.id} video={activeModal} onClose={() => setActiveModal(null)} language={language} />
        )}
      </AnimatePresence>

      {/* ── Photo Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <PhotoLightbox
            key="lightbox"
            photos={visiblePhotos}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
