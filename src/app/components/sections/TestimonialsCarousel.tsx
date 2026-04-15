// TestimonialsCarousel — reads reviews from adminData (localStorage).
// Seed data includes all 15 real Google reviews so the carousel is
// populated from the moment the page loads.

import { motion } from 'motion/react';
import { fadeInUp } from '../../../lib/animations';
import { getReviews, type Review } from '../../../lib/adminData';

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={i < stars ? 'text-gold' : 'text-border-strong'}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initial = review.name.charAt(0).toUpperCase();

  return (
    <div className="bg-surface-card border border-border rounded-xl p-6 w-[340px] flex-shrink-0">
      <StarRating stars={review.stars} />
      <p className="text-text text-sm leading-relaxed line-clamp-3 mb-4">
        <span className="text-gold font-bold mr-0.5">"</span>
        {review.text}
        <span className="text-gold font-bold ml-0.5">"</span>
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-sm flex-shrink-0"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{review.name}</p>
          <p className="text-text-dim text-xs">via Google</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
  const reviews = getReviews().filter((r) => r.isActive);
  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-24 bg-bg overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16 mb-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="text-center"
        >
          <h2 className="font-display text-section text-white uppercase">
            WHAT OUR STUDENTS SAY
          </h2>
          <p className="text-gold text-sm tracking-wide uppercase text-center mt-2">
            5.0 ★ from 84+ Google Reviews
          </p>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
        }}
      >
        {/* Carousel — CSS scroll only, pauses on hover */}
        <div className="testimonials-outer overflow-hidden">
          <div className="testimonials-track flex gap-6 animate-scroll-testimonials hover:[animation-play-state:paused]">
            {doubled.map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>

        {/* Reduced-motion fallback: static grid (hidden by default, shown via CSS) */}
        <div className="testimonials-grid hidden px-4 lg:px-16 max-w-[1440px] mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
