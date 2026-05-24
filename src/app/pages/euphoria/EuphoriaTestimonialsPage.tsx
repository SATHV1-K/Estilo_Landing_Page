// Euphoria Ladies — Testimonials Page
// Paginated dancer voices grid, managed entirely from admin.

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { getActiveEuphoriaTestimonialsPaginated } from '../../../lib/euphoriaTestimonialsService';
import type { EuphoriaTestimonial } from '../../../lib/types';

const P    = '#E83A7E';
const BG   = '#0A0A0A';
const SF   = '#111111';
const CARD = '#181818';
const BD   = '#252525';
const MUT  = '#909090';
const WH   = '#FFFFFF';

const PAGE_SIZE = 9;

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-7 flex flex-col gap-5 animate-pulse"
      style={{ backgroundColor: CARD, border: `1px solid ${BD}` }}
    >
      <div className="h-4 rounded-full w-4/5" style={{ backgroundColor: BD }} />
      <div className="h-4 rounded-full w-full" style={{ backgroundColor: BD }} />
      <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: BD }} />
      <div className="h-px mt-1" style={{ backgroundColor: BD }} />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: BD }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 rounded-full w-2/3" style={{ backgroundColor: BD }} />
          <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: BD }} />
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────

const cardVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.5, ease: 'easeOut' } },
};

function TestimonialCard({ item, index }: { item: EuphoriaTestimonial; index: number }) {
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: (index % PAGE_SIZE) * 0.07 }}
      className="relative rounded-2xl p-7 flex flex-col group overflow-hidden"
      style={{
        backgroundColor: CARD,
        border: `1px solid ${BD}`,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,58,126,0.28)';
        (e.currentTarget as HTMLElement).style.boxShadow  = `0 8px 32px rgba(232,58,126,0.1)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = BD;
        (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
      }}
    >
      {/* Pink corner glow */}
      <div
        className="absolute top-0 right-0 w-28 h-28 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 100% 0%, rgba(232,58,126,0.12) 0%, transparent 70%)` }}
      />

      {/* Decorative quote icon */}
      <div className="mb-4">
        <Quote size={28} style={{ color: P, opacity: 0.7 }} />
      </div>

      {/* Quote */}
      <p
        className="font-body text-sm leading-relaxed flex-1 mb-6"
        style={{ color: 'rgba(232,232,232,0.9)', fontStyle: 'italic', lineHeight: 1.75 }}
      >
        "{item.quote}"
      </p>

      {/* Separator */}
      <div
        className="mb-5 h-px w-12"
        style={{ background: `linear-gradient(to right, ${P}, transparent)` }}
      />

      {/* Dancer info */}
      <div className="flex items-center gap-4">
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.dancerName}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            style={{
              border: `2px solid rgba(232,58,126,0.4)`,
              boxShadow: `0 0 12px rgba(232,58,126,0.2)`,
            }}
            loading="lazy"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{
              background: `rgba(232,58,126,0.12)`,
              border: `2px solid rgba(232,58,126,0.25)`,
            }}
          >
            <Star size={16} style={{ color: P, opacity: 0.6 }} />
          </div>
        )}
        <div className="min-w-0">
          <p
            className="font-display uppercase tracking-wide text-white truncate"
            style={{ fontSize: '1rem', lineHeight: 1.1 }}
          >
            {item.dancerName}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.role && (
              <span className="font-body text-xs font-semibold" style={{ color: P }}>
                {item.role}
              </span>
            )}
            {item.role && item.year && (
              <span style={{ color: BD, fontSize: 10 }}>·</span>
            )}
            {item.year && (
              <span className="font-body text-xs" style={{ color: MUT }}>
                {item.year}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Testimonials Page ────────────────────────────────────────────────────────

export function EuphoriaTestimonialsPage() {
  const [items,   setItems]   = useState<EuphoriaTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);

  const load = useCallback((pg: number) => {
    setLoading(true);
    getActiveEuphoriaTestimonialsPaginated(pg, PAGE_SIZE)
      .then(({ items, total }) => { setItems(items); setTotal(total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ backgroundColor: SF }}
      >
        {/* Top pink hairline */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${P}, transparent)` }}
        />

        {/* Radial pink glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(232,58,126,0.1) 0%, transparent 70%)` }}
        />

        {/* Decorative large quote mark */}
        <div
          className="absolute right-12 top-8 font-display text-[12rem] leading-none select-none pointer-events-none hidden lg:block"
          style={{ color: 'rgba(232,58,126,0.04)', lineHeight: 1 }}
          aria-hidden
        >
          "
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-6 h-px" style={{ backgroundColor: P }} />
            <span className="font-body text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: P }}>
              Real Women. Real Stories.
            </span>
            <div className="w-6 h-px" style={{ backgroundColor: P }} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display uppercase text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: 0.93 }}
          >
            DANCER{' '}
            <span style={{ color: P }}>VOICES</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="font-body text-sm mt-5 max-w-lg mx-auto"
            style={{ color: MUT }}
          >
            Hear from the women who've trained, competed, and grown with Euphoria Ladies.
          </motion.p>

          {/* Total count badge */}
          {!loading && total > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full"
              style={{ background: `rgba(232,58,126,0.1)`, border: `1px solid rgba(232,58,126,0.2)` }}
            >
              <Quote size={12} style={{ color: P }} />
              <span className="font-body text-xs font-semibold" style={{ color: P }}>
                {total} {total === 1 ? 'Voice' : 'Voices'}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-28">
            <Quote size={40} style={{ color: 'rgba(232,58,126,0.2)', margin: '0 auto 16px' }} />
            <p className="font-display uppercase text-4xl mb-3" style={{ color: BD }}>No Voices Yet</p>
            <p className="font-body text-sm" style={{ color: MUT }}>
              Dancer testimonials will appear here once published.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {items.map((item, i) => (
                <TestimonialCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Pagination ── */}
        {!loading && total > 0 && (
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ backgroundColor: CARD, border: `1px solid ${BD}`, color: WH }}
                  onMouseEnter={e => { if (page > 1) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,58,126,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

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
                          onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
    </div>
  );
}
