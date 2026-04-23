// FeaturedVideosSection — home page preview of up to 4 featured videos.
// Shows heading + horizontal card row + "VIEW ALL VIDEOS" CTA.
// Hidden entirely if no featured videos are active.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Film, X } from 'lucide-react';
import { getActiveVideos, type Video, type VideoSource } from '../../../lib/videosService';
import { getYouTubeThumbnail } from '../../../lib/youtube';
import { useI18n } from '../../../lib/i18n';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { CTAButton } from '../ui/CTAButton';

// ─── Constants ────────────────────────────────────────────────────────────────

const SOURCE_LABEL: Record<VideoSource, string> = {
  youtube:   'YouTube',
  instagram: 'Instagram',
  upload:    'Studio',
};

const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
  performance:      { en: 'Performances',     es: 'Presentaciones' },
  class:            { en: 'Classes',          es: 'Clases' },
  'student-showcase': { en: 'Student Showcase', es: 'Exhibición' },
  event:            { en: 'Events',           es: 'Eventos' },
  general:          { en: 'General',          es: 'General' },
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — dialog role for screen readers */}
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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close video"
        >
          <X size={18} />
        </button>

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

// ─── FeaturedVideoCard ────────────────────────────────────────────────────────

function FeaturedVideoCard({
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
  const catLabel = CATEGORY_LABELS[video.category];
  const catDisplay = catLabel ? (language === 'es' ? catLabel.es : catLabel.en) : null;

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

  return (
    <motion.article
      variants={fadeInUp}
      tabIndex={0}
      role="button"
      aria-label={`${isInstagram ? 'Open on Instagram' : 'Play'}: ${title || 'Untitled video'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-gold hover:shadow-[0_0_24px_rgba(246,176,0,0.15)] transition-all cursor-pointer group
                 snap-center min-w-[76vw] sm:min-w-0 flex-shrink-0 sm:flex-shrink"
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

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={20} fill="currentColor" className="ml-0.5" />
          </div>
        </div>

        {/* Source badge */}
        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
          {SOURCE_LABEL[video.source]}
        </span>

        {/* Duration badge */}
        {video.durationSec > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(video.durationSec)}
          </span>
        )}

        {/* Instagram hint */}
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
        {catDisplay && (
          <p className="text-gold text-xs uppercase tracking-wide mt-3 font-semibold">
            {catDisplay}
          </p>
        )}
      </div>
    </motion.article>
  );
}

// ─── FeaturedVideosSection ────────────────────────────────────────────────────

export function FeaturedVideosSection() {
  const { language } = useI18n();
  const [activeModal, setActiveModal] = useState<Video | null>(null);
  const [featured, setFeatured]       = useState<Video[]>([]);

  useEffect(() => {
    getActiveVideos()
      .then(videos => {
        setFeatured(
          videos
            .filter(v => v.featured)
            .sort((a, b) => {
              if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, 4),
        );
      })
      .catch(console.error);
  }, []);

  // Hide the entire section when there are no featured videos
  if (featured.length === 0) return null;

  const isEs = language === 'es';

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">

        {/* ── Heading ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-section text-white uppercase leading-[0.95]">
            {isEs ? (
              <>MÍRANOS <span className="text-gold">BAILAR</span></>
            ) : (
              <>WATCH US <span className="text-gold">MOVE</span></>
            )}
          </h2>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-text-muted text-sm tracking-widest uppercase text-center mb-12"
        >
          {isEs ? 'EL ESTUDIO EN ACCIÓN' : 'SEE THE STUDIO IN ACTION'}
        </motion.p>

        {/* ── Cards ── */}
        {/* Mobile: horizontal scroll row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4
                     sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4"
        >
          {featured.map(video => (
            <FeaturedVideoCard
              key={video.id}
              video={video}
              language={language}
              onClick={() => setActiveModal(video)}
            />
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-center mt-10"
        >
          <CTAButton to="/gallery" size="md">
            {isEs ? 'VER TODA LA GALERÍA' : 'VIEW FULL GALLERY'}
          </CTAButton>
        </motion.div>
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
    </section>
  );
}
