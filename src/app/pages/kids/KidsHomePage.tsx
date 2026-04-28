// Estilo Kids — Home Page

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Star, Heart, Users } from 'lucide-react';
import { useCmsContent } from '../../../lib/hooks/useCmsContent';
import { getActiveKidsPrograms } from '../../../lib/kidsProgramsService';
import { getActiveKidsAchievements } from '../../../lib/kidsAchievementsService';
import { getMedia } from '../../../lib/mediaService';
import { KidsDoodles } from '../../components/kids/KidsDoodles';
import type { KidsProgram, KidsAchievement } from '../../../lib/types';

const SPRING = { type: 'spring', stiffness: 200, damping: 15 } as const;

const BENEFITS = [
  { icon: Star,  title: 'Builds Confidence',     desc: 'Every step forward on the dance floor is a step forward in life. Kids develop self-esteem through performance and mastery.' },
  { icon: Users, title: 'Develops Coordination', desc: 'Dancing sharpens motor skills, balance, and spatial awareness — building a healthy, agile body.' },
  { icon: Heart, title: 'Makes Friends',          desc: 'Our classes create a warm, welcoming community where kids connect, collaborate, and grow together.' },
];

export function KidsHomePage() {
  const [programs,     setPrograms]     = useState<KidsProgram[]>([]);
  const [achievements, setAchievements] = useState<KidsAchievement[]>([]);
  const [mascotUrl,    setMascotUrl]    = useState('');

  useEffect(() => {
    getActiveKidsPrograms().then(setPrograms).catch(() => {});
    getActiveKidsAchievements().then(setAchievements).catch(() => {});
    getMedia('kids.mascot').then(m => { if (m?.url) setMascotUrl(m.url); }).catch(() => {});
  }, []);

  const cms = useCmsContent({
    'kids.hero.headline':         'WHERE A LITTLE BEE FLIES, A GREAT ARTIST BLOOMS',
    'kids.hero.subtitle':         'We transform talent into passion',
    'kids.hero.cta.label':        'ENROLL YOUR CHILD',
    'kids.hero.cta.link':         '/contact',
    'kids.programs.heading':      'OUR PROGRAMS',
    'kids.benefits.heading':      'WHY DANCE IS GREAT FOR KIDS',
    'kids.achievements.heading':  'OUR LITTLE STARS',
    'kids.achievements.stat1':    '20+',
    'kids.achievements.stat1label': 'Champions Trained',
    'kids.achievements.stat2':    '10+',
    'kids.achievements.stat2label': 'Years Teaching Kids',
    'kids.achievements.stat3':    '200+',
    'kids.achievements.stat3label': 'Happy Families',
    'kids.cta.heading':           'READY TO JOIN THE HIVE?',
    'kids.cta.subtitle':          'Book a free trial class for your child',
    'kids.cta.phone':             '+1 (201) 878-8977',
  });

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <KidsDoodles variant="hero" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.1 }}
                className="font-display uppercase leading-none mb-5"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#FFFFFF', lineHeight: 0.95 }}
              >
                {cms['kids.hero.headline']}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.3 }}
                className="font-body italic mb-8"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: '#FFF8E7', lineHeight: 1.5 }}
              >
                {cms['kids.hero.subtitle']}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.5 }}
              >
                <Link
                  to={cms['kids.hero.cta.link'] || '/contact'}
                  className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider rounded-full px-8 py-4 text-lg shadow-lg transition-all hover:-translate-y-1"
                  style={{
                    backgroundColor: '#f0bf71',
                    color: '#2D3D6B',
                    boxShadow: '0 8px 24px rgba(240,191,113,0.35)',
                  }}
                >
                  {cms['kids.hero.cta.label']}
                </Link>
              </motion.div>
            </div>

            {/* Bee mascot / image */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ ...SPRING, delay: 0.4 }}
              className="flex justify-center lg:justify-end"
              style={{ animation: 'float 5s ease-in-out infinite' }}
            >
              {mascotUrl ? (
                <img
                  src={mascotUrl}
                  alt="Estilo Kids Bee Mascot"
                  className="w-64 h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
                />
              ) : (
                <div
                  className="w-64 h-64 lg:w-72 lg:h-72 rounded-full flex items-center justify-center font-display text-9xl select-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                >
                  🐝
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Programs ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#FFF8E7' }}>
        <KidsDoodles variant="cream" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
            className="font-display uppercase text-center mb-12"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#2D3D6B' }}
          >
            {cms['kids.programs.heading']}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...SPRING, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {prog.imageUrl ? (
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-44 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: '#4A6FA5' }}
                  >
                    🎵
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-body font-bold text-base mb-1 leading-snug" style={{ color: '#2D3D6B' }}>
                    {prog.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7A8BBF' }}>
                    Ages {prog.ageRange}
                  </p>
                  {prog.scheduleNote && (
                    <p className="text-xs" style={{ color: '#7A8BBF' }}>{prog.scheduleNote}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {programs.length === 0 && Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-md animate-pulse"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="w-full h-44" style={{ backgroundColor: '#E2E8F0' }} />
                <div className="p-4">
                  <div className="h-4 rounded mb-2" style={{ backgroundColor: '#E2E8F0' }} />
                  <div className="h-3 w-16 rounded" style={{ backgroundColor: '#E2E8F0' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C360,60 1080,0 1440,60 L1440,60 L0,60 Z" fill="#4A6FA5"/>
          </svg>
        </div>
      </section>

      {/* ── Why Dance ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24">
        <KidsDoodles variant="blue" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
            className="font-display uppercase text-center mb-14"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFFFFF' }}
          >
            {cms['kids.benefits.heading']}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...SPRING, delay: i * 0.12 }}
                className="rounded-2xl p-7 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(240,191,113,0.2)' }}
                >
                  <Icon size={26} style={{ color: '#f0bf71' }} />
                </div>
                <h3 className="font-body font-bold text-lg mb-2" style={{ color: '#FFFFFF' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* ── Achievements Stats ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#FFF8E7' }}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
            className="font-display uppercase text-center mb-12"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#2D3D6B' }}
          >
            {cms['kids.achievements.heading']}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { value: cms['kids.achievements.stat1'], label: cms['kids.achievements.stat1label'] },
              { value: cms['kids.achievements.stat2'], label: cms['kids.achievements.stat2label'] },
              { value: cms['kids.achievements.stat3'], label: cms['kids.achievements.stat3label'] },
            ].map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...SPRING, delay: i * 0.1 }}
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(45,61,107,0.08)' }}
              >
                <div className="font-display text-5xl mb-1" style={{ color: '#f0bf71' }}>{value}</div>
                <div className="font-body font-semibold text-sm uppercase tracking-wider" style={{ color: '#7A8BBF' }}>{label}</div>
              </motion.div>
            ))}
          </div>

          {achievements.length > 0 && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {achievements.slice(0, 6).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...SPRING, delay: i * 0.08 }}
                    className="w-56 rounded-2xl overflow-hidden shadow-md flex-shrink-0"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {a.imageUrl && (
                      <img src={a.imageUrl} alt={a.title} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-3">
                      <p className="font-body font-bold text-sm" style={{ color: '#2D3D6B' }}>{a.title}</p>
                      {a.date && (
                        <p className="text-xs mt-0.5" style={{ color: '#7A8BBF' }}>
                          {new Date(a.date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/kids/achievements"
              className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider text-sm rounded-full px-6 py-3 transition-all hover:-translate-y-0.5"
              style={{ border: '2px solid #4A6FA5', color: '#4A6FA5' }}
            >
              See All Achievements →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C480,60 960,0 1440,60 L1440,60 L0,60 Z" fill="#E8637A"/>
          </svg>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#E8637A' }}>
        <KidsDoodles variant="pink" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
            className="font-display uppercase mb-4"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: '#FFFFFF', lineHeight: 1 }}
          >
            {cms['kids.cta.heading']}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="font-body text-lg mb-8"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {cms['kids.cta.subtitle']}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...SPRING, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider rounded-full px-8 py-4 text-lg shadow-lg transition-all hover:-translate-y-1"
              style={{ backgroundColor: '#f0bf71', color: '#2D3D6B', boxShadow: '0 8px 24px rgba(240,191,113,0.35)' }}
            >
              Book a Free Trial Class
            </Link>
            <a
              href={`tel:${cms['kids.cta.phone']}`}
              className="font-body font-semibold text-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              📞 {cms['kids.cta.phone']}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
