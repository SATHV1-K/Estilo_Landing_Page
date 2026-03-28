// InstructorCard - Instructor photo card with name and specialty

import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { cardReveal } from '../../../lib/animations';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Instructor } from '../../../lib/types';

interface InstructorCardProps {
  instructor: Instructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <motion.div
      variants={cardReveal}
      className="group relative bg-white rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      {/* Photo */}
      <div className="relative h-80 overflow-hidden bg-photo-blue">
        <motion.div
          whileHover={{ scale: 1.05, filter: 'brightness(1.05)' }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={instructor.photo}
            alt={instructor.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Social Links Overlay */}
        {instructor.socialLinks.length > 0 && (
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
        <h3 className="font-display text-2xl uppercase tracking-tight mb-2">
          {instructor.name}
        </h3>
        <p className="text-accent font-semibold text-sm uppercase tracking-wider">
          {instructor.specialty}
        </p>
      </div>
    </motion.div>
  );
}
