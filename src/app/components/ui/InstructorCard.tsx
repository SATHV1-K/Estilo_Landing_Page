'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { cardReveal } from '../../../lib/animations';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useI18n } from '../../../lib/i18n';
import { Instructor } from '../../../lib/types';

interface InstructorCardProps {
  instructor: Instructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  const { language } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoActive, setVideoActive] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const description = language === 'es' && instructor.bioEs ? instructor.bioEs : instructor.bio;

  function startVideo() {
    if (!instructor.videoUrl) return;
    setVideoActive(true);
    videoRef.current?.play().catch(() => {});
  }

  function stopVideo() {
    setVideoActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function handleTouchStart() {
    holdTimer.current = setTimeout(startVideo, 350);
  }

  function handleTouchEnd() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    stopVideo();
  }

  return (
    <motion.div
      variants={cardReveal}
      className="group relative bg-surface-card rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
      whileHover={{ y: -4 }}
      onMouseEnter={startVideo}
      onMouseLeave={stopVideo}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden bg-photo-blue">
        <motion.div
          whileHover={{ scale: videoActive ? 1 : 1.05, filter: videoActive ? 'none' : 'brightness(1.05)' }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={instructor.photo}
            alt={instructor.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Video overlay — shown on hover (desktop) or hold (mobile) */}
        {instructor.videoUrl && (
          <video
            ref={videoRef}
            src={instructor.videoUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              videoActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Social Links Overlay — hidden while video plays */}
        {instructor.socialLinks.length > 0 && !videoActive && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="flex gap-4">
              {instructor.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  aria-label={link.platform}
                >
                  <Instagram size={20} className="text-white" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="font-display text-2xl uppercase tracking-tight mb-1">
          {instructor.name}
        </h3>
        <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
          {instructor.specialty}
        </p>
        {description && (
          <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
