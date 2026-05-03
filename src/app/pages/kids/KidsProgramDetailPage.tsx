// Kids Program Detail Page — full program info in kids theme

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, ExternalLink, X, Phone, MapPin, CheckCircle } from 'lucide-react';
import { getActiveKidsPrograms } from '../../../lib/kidsProgramsService';
import { KidsDoodles } from '../../components/kids/KidsDoodles';
import type { KidsProgram } from '../../../lib/types';

const SPRING = { type: 'spring', stiffness: 200, damping: 18 } as const;

// ─── Success Modal ─────────────────────────────────────────────────────────────

function EnrollSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={SPRING}
          className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl text-center"
          style={{ backgroundColor: '#FFF8E7' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top accent bar */}
          <div className="h-2 w-full" style={{ backgroundColor: '#f0bf71' }} />

          <div className="px-8 py-10">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(74,111,165,0.1)', color: '#4A6FA5' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(124,185,122,0.18)' }}
            >
              <CheckCircle size={42} style={{ color: '#7CB97A' }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.25 }}
            >
              <h2 className="font-display uppercase mb-2" style={{ fontSize: '2rem', color: '#2D3D6B', lineHeight: 1 }}>
                Almost there! 🐝
              </h2>
              <p className="font-body mb-6 leading-relaxed" style={{ color: '#4A6FA5', fontSize: '1rem' }}>
                Complete your payment on the page that just opened. Once done, please visit the studio or give us a call to finalize your child's enrollment!
              </p>

              <div className="rounded-2xl p-4 mb-6 text-left" style={{ backgroundColor: 'rgba(74,111,165,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Phone size={16} style={{ color: '#f0bf71', flexShrink: 0 }} />
                  <a
                    href="tel:+12018788977"
                    className="font-body font-semibold text-sm transition-colors hover:underline"
                    style={{ color: '#2D3D6B' }}
                  >
                    +1 (201) 878-8977
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} style={{ color: '#f0bf71', flexShrink: 0 }} />
                  <span className="font-body text-sm" style={{ color: '#2D3D6B' }}>
                    Come visit us at the studio
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-full font-body font-bold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: '#4A6FA5', color: '#FFFFFF', boxShadow: '0 6px 20px rgba(74,111,165,0.3)' }}
              >
                Got it!
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function KidsProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<KidsProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getActiveKidsPrograms()
      .then(progs => {
        setProgram(progs.find(p => p.id === id) ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function handleEnroll() {
    const url = program?.enrollLink || 'https://payments.estilolatinodance.com';
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowModal(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#4A6FA5' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-t-transparent"
          style={{ borderColor: '#f0bf71', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ backgroundColor: '#4A6FA5' }}>
        <span className="text-6xl">🐝</span>
        <p className="font-display text-3xl uppercase text-white">Program not found</p>
        <Link
          to="/kids"
          className="font-body font-bold uppercase tracking-wider text-sm rounded-full px-6 py-3 transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: '#f0bf71', color: '#2D3D6B' }}
        >
          ← Back to Kids
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4A6FA5' }}>
      {showModal && <EnrollSuccessModal onClose={() => setShowModal(false)} />}

      {/* ── Hero Image / Header ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <KidsDoodles variant="hero" />

        {/* Background image */}
        {program.imageUrl ? (
          <>
            <img
              src={program.imageUrl}
              alt={program.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.35 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(74,111,165,0.55) 0%, rgba(74,111,165,0.92) 70%, #4A6FA5 100%)' }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #2D3D6B 0%, #4A6FA5 60%, #5A8BBF 100%)' }}
          />
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8 pt-8 pb-16">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            onClick={() => navigate('/kids')}
            className="flex items-center gap-2 font-body font-semibold text-sm mb-10 transition-opacity hover:opacity-75"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <ArrowLeft size={16} />
            Back to Programs
          </motion.button>

          {/* Age badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 font-body font-bold uppercase text-xs tracking-wider"
            style={{ backgroundColor: '#f0bf71', color: '#2D3D6B' }}
          >
            ✦ Ages {program.ageRange}
          </motion.div>

          {/* Program name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.2 }}
            className="font-display uppercase text-white mb-4"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', lineHeight: 0.95 }}
          >
            {program.name}
          </motion.h1>

          {/* Schedule note */}
          {program.scheduleNote && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.3 }}
              className="flex items-center gap-2 font-body text-base mb-10"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              <Calendar size={16} style={{ color: '#f0bf71' }} />
              {program.scheduleNote}
            </motion.p>
          )}

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.38 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/kids"
              className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider text-sm rounded-full px-7 py-3.5 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
            >
              <Calendar size={16} />
              View Schedule
            </Link>

            <button
              onClick={handleEnroll}
              className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider text-sm rounded-full px-7 py-3.5 transition-all hover:-translate-y-1 hover:opacity-90"
              style={{ backgroundColor: '#f0bf71', color: '#2D3D6B', boxShadow: '0 8px 24px rgba(240,191,113,0.4)' }}
            >
              <ExternalLink size={16} />
              Enroll Now
            </button>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 50 }}>
          <svg viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Program Details ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16" style={{ backgroundColor: '#FFF8E7' }}>
        <KidsDoodles variant="cream" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Description */}
            <div className="lg:col-span-2">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={SPRING}
                className="font-display uppercase mb-5"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#2D3D6B' }}
              >
                About This Program
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...SPRING, delay: 0.1 }}
                className="font-body leading-relaxed text-base"
                style={{ color: '#4A6FA5', fontSize: '1.05rem' }}
              >
                {program.description || 'A fun, engaging program designed to help your child discover the joy of dance while building confidence, coordination, and lifelong friendships.'}
              </motion.p>
            </div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="rounded-2xl p-6 shadow-lg"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <h3 className="font-display uppercase mb-4 text-xl" style={{ color: '#2D3D6B' }}>Quick Info</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">👶</span>
                  <div>
                    <p className="font-body font-bold text-xs uppercase tracking-wider mb-0.5" style={{ color: '#7A8BBF' }}>Age Range</p>
                    <p className="font-body font-semibold text-sm" style={{ color: '#2D3D6B' }}>{program.ageRange}</p>
                  </div>
                </div>

                {program.scheduleNote && (
                  <div className="flex items-start gap-3">
                    <Calendar size={22} style={{ color: '#f0bf71', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="font-body font-bold text-xs uppercase tracking-wider mb-0.5" style={{ color: '#7A8BBF' }}>Schedule</p>
                      <p className="font-body font-semibold text-sm" style={{ color: '#2D3D6B' }}>{program.scheduleNote}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4" style={{ borderColor: '#E2E8F0' }}>
                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 rounded-full font-body font-bold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: '#f0bf71', color: '#2D3D6B', boxShadow: '0 6px 18px rgba(240,191,113,0.3)' }}
                  >
                    Enroll Now ✦
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 50 }}>
          <svg viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C360,50 1080,0 1440,50 L1440,50 L0,50 Z" fill="#4A6FA5"/>
          </svg>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16" style={{ backgroundColor: '#4A6FA5' }}>
        <KidsDoodles variant="blue" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
            className="font-display uppercase text-white mb-6"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', lineHeight: 1.05 }}
          >
            Questions? We'd love to help! 🌟
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="tel:+12018788977"
              className="inline-flex items-center justify-center gap-2 font-body font-bold uppercase tracking-wider text-sm rounded-full px-7 py-3.5 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: '#f0bf71', color: '#2D3D6B', boxShadow: '0 6px 18px rgba(240,191,113,0.3)' }}
            >
              <Phone size={15} /> Call Us
            </a>
            <Link
              to="/kids"
              className="inline-flex items-center justify-center gap-2 font-body font-bold uppercase tracking-wider text-sm rounded-full px-7 py-3.5 transition-all hover:-translate-y-0.5"
              style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#FFFFFF' }}
            >
              ← All Programs
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
