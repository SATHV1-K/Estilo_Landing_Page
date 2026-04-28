// Estilo Kids — About Page

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useCmsContent } from '../../../lib/hooks/useCmsContent';
import { getActiveInstructors } from '../../../lib/instructorsService';
import { getMedia } from '../../../lib/mediaService';
import { KidsDoodles } from '../../components/kids/KidsDoodles';
import type { Instructor } from '../../../lib/types';

const SPRING = { type: 'spring', stiffness: 200, damping: 15 } as const;

export function KidsAboutPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [mascotUrl,   setMascotUrl]   = useState('');

  useEffect(() => {
    getActiveInstructors()
      .then(all => setInstructors(all.filter(i =>
        i.specialty.toLowerCase().includes('kid')
        || i.specialty.toLowerCase().includes('child')
        || i.specialty.toLowerCase().includes('ballet')
        || i.specialty.toLowerCase().includes('youth')
      )))
      .catch(() => {});
    getMedia('kids.mascot').then(m => { if (m?.url) setMascotUrl(m.url); }).catch(() => {});
  }, []);

  const cms = useCmsContent({
    'kids.about.heading':  'ABOUT ESTILO KIDS',
    'kids.about.story':    'Estilo Kids was born from a simple belief: every child has a natural sense of rhythm and joy. Our founder, after years of training world-class dancers, turned her passion toward nurturing the youngest talent in our community. The Estilo Bee — our beloved mascot — represents the dedication, sweetness, and tireless energy that every young dancer brings to the studio.',
    'kids.about.mission':  'Our mission is to build confidence, coordination, and creativity in every child through the joy of movement. We create a safe, encouraging space where kids can discover who they are through dance.',
    'kids.instructors.heading': 'OUR KIDS INSTRUCTORS',
  });

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 flex items-center"
        style={{ backgroundColor: '#4A6FA5', minHeight: '40vh' }}
      >
        <KidsDoodles variant="blue" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 text-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="font-display uppercase"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#FFFFFF', lineHeight: 0.95 }}
          >
            {cms['kids.about.heading']}
          </motion.h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#FFF8E7' }}>
        <KidsDoodles variant="cream" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={SPRING}
            >
              <h2
                className="font-display uppercase mb-6"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#2D3D6B' }}
              >
                Our Story
              </h2>
              <p className="font-body text-base leading-relaxed mb-5" style={{ color: '#4A5568' }}>
                {cms['kids.about.story']}
              </p>
              <h3
                className="font-display uppercase mb-3"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: '#2D3D6B' }}
              >
                Our Mission
              </h3>
              <p className="font-body text-base leading-relaxed" style={{ color: '#4A5568' }}>
                {cms['kids.about.mission']}
              </p>
            </motion.div>

            {/* Bee mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={SPRING}
              className="flex justify-center"
              style={{ animation: 'float 5s ease-in-out infinite' }}
            >
              {mascotUrl ? (
                <img
                  src={mascotUrl}
                  alt="Estilo Kids Bee Mascot"
                  className="w-64 h-64 object-contain drop-shadow-xl"
                />
              ) : (
                <div
                  className="w-56 h-56 rounded-full flex items-center justify-center text-8xl shadow-xl select-none"
                  style={{ backgroundColor: '#4A6FA5' }}
                >
                  🐝
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C360,60 1080,0 1440,60 L1440,60 L0,60 Z" fill="#4A6FA5"/>
          </svg>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#4A6FA5' }}>
        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { emoji: '🎵', label: 'Joy in Movement' },
              { emoji: '💛', label: 'Confidence Building' },
              { emoji: '🤝', label: 'Community' },
              { emoji: '⭐', label: 'Excellence' },
            ].map(({ emoji, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...SPRING, delay: i * 0.1 }}
                className="rounded-2xl p-6"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                <div className="text-4xl mb-3">{emoji}</div>
                <p className="font-body font-semibold text-sm" style={{ color: '#FFFFFF' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C480,0 960,60 1440,30 L1440,60 L0,60 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Instructors ───────────────────────────────────────── */}
      {instructors.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#FFF8E7' }}>
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={SPRING}
              className="font-display uppercase text-center mb-12"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2D3D6B' }}
            >
              {cms['kids.instructors.heading']}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {instructors.map((inst, i) => (
                <motion.div
                  key={inst.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...SPRING, delay: i * 0.1 }}
                  className="rounded-2xl overflow-hidden shadow-md text-center"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <img
                    src={inst.photo}
                    alt={inst.name}
                    className="w-full object-cover"
                    style={{ aspectRatio: '4/5' }}
                    onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                  <div className="p-5">
                    <h3 className="font-display uppercase text-xl" style={{ color: '#2D3D6B' }}>{inst.name}</h3>
                    <p className="font-body text-sm font-semibold mt-1" style={{ color: '#f0bf71' }}>{inst.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-16 text-center" style={{ backgroundColor: '#E8637A' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={SPRING}
        >
          <h2 className="font-display uppercase mb-4 text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Ready to Meet Us?
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider rounded-full px-7 py-3.5 shadow-lg transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#f0bf71', color: '#2D3D6B' }}
          >
            Get in Touch
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
