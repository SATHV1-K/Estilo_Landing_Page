// Public /videos page — filterable video gallery with modal player.

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Film, X } from 'lucide-react';
import { getActiveVideos, type Video, type VideoSource, type VideoCategory } from '../../lib/adminData';
import { getYouTubeThumbnail } from '../../lib/youtube';
import { useI18n } from '../../lib/i18n';
import { fadeInUp } from '../../lib/animations';

// ─── Types ────────────────────────────────────────────────────────────────────

type SourceFilter   = 'all' | VideoSource;
type CategoryFilter = 'all' | VideoCategory;

// ─── Constants ────────────────────────────────────────────────────────────────

const SOURCE_TABS: { id: SourceFilter; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'youtube',   label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'upload',    label: 'Uploads' },
];

const CATEGORY_PILLS: { id: CategoryFilter; label: string; labelEs: string }[] = [
  { id: 'all',              label: 'All',              labelEs: 'Todos' },
  { id: 'performance',      label: 'Performances',     labelEs: 'Presentaciones' },
  { id: 'class',            label: 'Classes',          labelEs: 'Clases' },
  { id: 'student-showcase', label: 'Student Showcase', labelEs: 'Exhibición' },
  { id: 'event',            label: 'Events',           labelEs: 'Eventos' },
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
  if (video.source === 'youtube' && video.youtubeId) {
    return getYouTubeThumbnail(video.youtubeId);
  }
  return '';
}

/** Falls back from maxresdefault → hqdefault on 404, then hides entirely. */
function handleThumbError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src.includes('maxresdefault')) {
    img.src = img.src.replace('maxresdefault', 'hqdefault');
  } else {
    img.style.display = 'none';
  }
}

// ─── VideoModal ───────────────────────────────────────────────────────────────

function VideoModal({
  video,
  onClose,
  language,
}: {
  video: Video;
  onClose: () => void;
  language: 'en' | 'es';
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const title       = language === 'es' && video.titleEs ? video.titleEs : video.title;
  const description = language === 'es' && video.descriptionEs ? video.descriptionEs : video.description;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel — dialog role for screen readers */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Video player'}
        className="relative z-10 w-[92vw] max-w-4xl bg-surface-elevated rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close video"
        >
          <X size={18} />
        </button>

        {/* Player */}
        {video.source === 'youtube' && video.youtubeId ? (
          // youtube-nocookie.com for enhanced privacy (no cookies until play)
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
            className="w-full aspect-video"
            title={title}
          />
        ) : (
          // preload="metadata" loads duration/poster without buffering the full file
          <video
            src={video.videoFileUrl}
            controls
            autoPlay
            preload="metadata"
            className="w-full aspect-video bg-black"
          />
        )}

        {/* Info */}
        {(title || description) && (
          <div className="p-5">
            {title && (
              <h2 className="text-white font-bold text-lg leading-snug mb-1">{title}</h2>
            )}
            {description && (
              <p className="text-text-muted text-sm leading-relaxed">{description}</p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({
  video,
  language,
  onClick,
}: {
  video: Video;
  language: 'en' | 'es';
  onClick: () => void;
}) {
  const thumb = getThumb(video);
  const title = language === 'es' && video.titleEs ? video.titleEs : video.title;
  const description = language === 'es' && video.descriptionEs ? video.descriptionEs : video.description;

  const isInstagram = video.source === 'instagram';

  function handleClick() {
    if (isInstagram && video.externalUrl) {
      window.open(video.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      onClick();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  const categoryLabel = CATEGORY_PILLS.find(c => c.id === video.category);
  const catDisplay = categoryLabel
    ? (language === 'es' ? categoryLabel.labelEs : categoryLabel.label)
    : video.category;

  return (
    <motion.article
      variants={fadeInUp}
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true, amount: 0.2 }}
      tabIndex={0}
      role="button"
      aria-label={`${isInstagram ? 'Open on Instagram' : 'Play'}: ${title || 'Untitled video'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-gold hover:shadow-[0_0_24px_rgba(246,176,0,0.15)] transition-all cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#111111]">
        {thumb ? (
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={handleThumbError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film size={36} className="text-border-strong" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>

        {/* Source badge — top right */}
        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
          {SOURCE_LABEL[video.source]}
        </span>

        {/* Duration badge — bottom right */}
        {video.durationSec > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(video.durationSec)}
          </span>
        )}

        {/* Instagram external-link hint */}
        {isInstagram && (
          <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
            Opens Instagram
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-base line-clamp-2 leading-snug">
          {title || <span className="text-text-dim italic font-normal">Untitled</span>}
        </h3>
        {description && (
          <p className="text-text-muted text-sm line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        )}
        {catDisplay && catDisplay !== 'all' && (
          <p className="text-gold text-xs uppercase tracking-wide mt-3 font-semibold">
            {catDisplay}
          </p>
        )}
      </div>
    </motion.article>
  );
}

// ─── VideosPage ───────────────────────────────────────────────────────────────

export function VideosPage() {
  const { language } = useI18n();
  const [videos]         = useState<Video[]>(() => getActiveVideos());
  const [sourceFilter,   setSourceFilter]   = useState<SourceFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [activeModal,    setActiveModal]    = useState<Video | null>(null);

  // ── SEO: page title + JSON-LD VideoObject structured data ──────────────────
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Videos | Estilo Latino Dance Company';

    // Build VideoObject list for YouTube videos
    const youtubeVideos = videos.filter(v => v.source === 'youtube' && v.youtubeId);
    if (youtubeVideos.length > 0) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Estilo Latino Dance Videos',
        itemListElement: youtubeVideos.slice(0, 10).map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'VideoObject',
            name: v.title,
            description: v.description || v.title,
            thumbnailUrl: getYouTubeThumbnail(v.youtubeId),
            embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
            uploadDate: v.createdAt,
          },
        })),
      };
      const existing = document.getElementById('videos-jsonld');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'videos-jsonld';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      document.getElementById('videos-jsonld')?.remove();
    };
  }, [videos]);

  const filtered = videos.filter(v => {
    if (sourceFilter   !== 'all' && v.source   !== sourceFilter)   return false;
    if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
    return true;
  });

  const clearFilters = useCallback(() => {
    setSourceFilter('all');
    setCategoryFilter('all');
  }, []);

  const filterKey = `${sourceFilter}__${categoryFilter}`;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">

        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-section text-white uppercase leading-[0.95] mb-3">
            {language === 'es' ? (
              <>NUESTROS <span className="text-gold">VIDEOS</span></>
            ) : (
              <>OUR <span className="text-gold">VIDEOS</span></>
            )}
          </h1>
          <p className="text-text-muted text-sm tracking-widest uppercase">
            {language === 'es'
              ? 'Catch the rhythm — nuestros mejores momentos'
              : 'Catch the rhythm — our best moments'}
          </p>
        </motion.div>

        {/* ── Source tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-wrap gap-3 justify-center mb-5"
        >
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSourceFilter(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border transition-all ${
                sourceFilter === tab.id
                  ? 'bg-gold text-ink border-gold'
                  : 'bg-transparent text-text border-border-strong hover:border-gold hover:text-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ── Category pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {CATEGORY_PILLS.map(pill => (
            <button
              key={pill.id}
              onClick={() => setCategoryFilter(pill.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                categoryFilter === pill.id
                  ? 'bg-gold text-ink border-gold'
                  : 'bg-transparent text-text border-border-strong hover:border-gold hover:text-gold'
              }`}
            >
              {language === 'es' ? pill.labelEs : pill.label}
            </button>
          ))}
        </motion.div>

        {/* ── Grid ── */}
        {videos.length === 0 ? (
          /* No videos in DB */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Film size={48} className="text-border-strong mb-4" />
            <p className="text-text-muted text-lg">
              {language === 'es' ? 'Videos próximamente' : 'Videos coming soon'}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* Filter returns zero results */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Film size={48} className="text-border-strong mb-4" />
            <p className="text-text-muted text-lg mb-4">
              {language === 'es'
                ? 'Ningún video coincide con este filtro'
                : 'No videos match this filter'}
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gold text-ink hover:bg-gold-hover transition-colors"
            >
              {language === 'es' ? 'Limpiar filtros' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div
            key={filterKey}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                language={language}
                onClick={() => setActiveModal(video)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {activeModal && (
          <VideoModal
            key={activeModal.id}
            video={activeModal}
            onClose={() => setActiveModal(null)}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
