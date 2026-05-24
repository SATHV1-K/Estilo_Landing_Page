/* Hallmark · genre: atmospheric · macrostructure: Manifesto · tone: theatrical-declaration · anchor hue: hot-pink
 * pre-emit critique: P5 H4 E5 S4 R4 V5
 */

// Euphoria Ladies — Home Page (redesigned v2 · Atmospheric / Manifesto)
// Sections: Hero · Marquee · About · Story (Timeline) · Why Join · Auditions

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  Crown, Users, Star, Heart, Zap, Trophy, Play,
  ArrowRight, CheckCircle,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useCmsContent } from '../../../lib/hooks/useCmsContent';
import { getMedia } from '../../../lib/mediaService';
import LiquidEther from '../../components/euphoria/LiquidEther';
import { useAuditionModal } from '../../components/euphoria/EuphoriaLayout';

// ─── Color tokens ─────────────────────────────────────────────────────────────
const P = '#E83A7E';
const PH = '#CE1868';
const PL = '#F075AA';
const BG = '#0A0A0A';
const SF = '#111111';
const CARD = '#181818';
const BD = '#252525';
const TXT = '#E8E8E8';
const MUT = '#909090';
const WH = '#FFFFFF';

// ─── Static content ───────────────────────────────────────────────────────────
const SPECIALTIES = [
  'Ladies Salsa', 'Bachata', 'Performance Technique',
  'Stage Presence', 'Styling & Expression', 'Acrobatics & Skills',
  'Team Discipline & Leadership',
];

const TIMELINE = [
  { year: '2018', title: 'The Beginning', description: 'Euphoria Ladies was born inside Estilo Latino Dance Company with the goal of creating elite ladies performance teams. Championship titles in Ladies Salsa and help developing Bachata World Champions followed.' },
  { year: '2019', title: 'Building the Vision', description: 'We officially began the structured training process for our ladies teams — focusing on technical excellence, performance quality, confidence development, and competition preparation.' },
  { year: '2020', title: 'The Challenge', description: 'Like many dance communities worldwide, COVID-19 forced us to temporarily pause. Yet the passion and dream behind Euphoria Ladies never disappeared.' },
  { year: '2021', title: 'The Comeback', description: 'We returned stronger than ever. New auditions, new generation. The team performed on major stages alongside El Gran Combo de Puerto Rico, Tito Nieves, and La-33 — and became champions again.' },
  { year: '2022–2025', title: 'Growth & Evolution', description: 'Teams expanded into advanced performance technique, cross-training disciplines, physical conditioning, flexibility, acrobatics, and artistic development. Each season stronger.' },
  { year: '2026', title: 'The Next Generation', description: 'Today, Euphoria Ladies continues preparing new teams ready to compete, perform, and inspire — creating yearly training cycles for women who dare to dream.' },
];

const WHY_JOIN = [
  { icon: Heart, title: 'A Family', desc: 'Join a tight-knit community of passionate women who support each other on and off the dance floor.' },
  { icon: Crown, title: 'Championship Training', desc: 'Train in a championship-level environment designed to push your limits and develop your fullest potential.' },
  { icon: Star, title: 'Professional Stage', desc: 'Perform on major stages, compete in renowned international events, and train alongside world-class artists.' },
];

const EXPERIENCE_LIST = [
  'Professional choreography', 'Stage performances & concerts',
  'Competition preparation', 'Artistic growth & expression',
  'Team bonding & sisterhood', 'Opportunities with major artists',
];

const REQUIREMENTS = [
  { label: 'Commitment', desc: 'Show up fully, every session' },
  { label: 'Discipline', desc: 'Consistent practice is non-negotiable' },
  { label: 'Passion', desc: 'Love for dance drives everything' },
  { label: 'Energy', desc: 'High-energy attitude on and off stage' },
  { label: 'Team', desc: 'Lift every dancer in the room' },
];

// ─── Hero ambient particles (fixed positions to avoid hydration drift) ────────
const HERO_PARTICLES = [
  { x: '8%', y: '25%', size: 5, opacity: 0.15, dur: 7, delay: 0 },
  { x: '15%', y: '65%', size: 3, opacity: 0.10, dur: 9, delay: 1.2 },
  { x: '25%', y: '40%', size: 6, opacity: 0.12, dur: 6, delay: 2.1 },
  { x: '38%', y: '78%', size: 8, opacity: 0.07, dur: 11, delay: 0.7 },
  { x: '55%', y: '15%', size: 4, opacity: 0.18, dur: 8, delay: 3.0 },
  { x: '65%', y: '55%', size: 10, opacity: 0.06, dur: 12, delay: 1.5 },
  { x: '75%', y: '30%', size: 3, opacity: 0.14, dur: 7, delay: 2.5 },
  { x: '85%', y: '70%', size: 6, opacity: 0.09, dur: 9, delay: 0.4 },
  { x: '90%', y: '45%', size: 4, opacity: 0.16, dur: 8, delay: 1.8 },
  { x: '48%', y: '88%', size: 7, opacity: 0.07, dur: 10, delay: 3.5 },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const SPRING = { type: 'spring', stiffness: 200, damping: 18 } as const;
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const FADE_UP = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { ...SPRING } } };
const FADE_LEFT = { hidden: { opacity: 0, x: -56 }, visible: { opacity: 1, x: 0, transition: { ...SPRING } } };
const FADE_RIGHT = { hidden: { opacity: 0, x: 56 }, visible: { opacity: 1, x: 0, transition: { ...SPRING } } };
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const STAGGER_MED = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };

// ─── Ghost watermark ──────────────────────────────────────────────────────────
function GhostWord({ word, opacity = 0.05 }: { word: string; opacity?: number }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
      aria-hidden
    >
      <span
        className="font-display uppercase whitespace-nowrap"
        style={{
          fontSize: 'clamp(5rem, 22vw, 20rem)',
          color: 'transparent',
          WebkitTextStroke: `1px rgba(232,58,126,${opacity})`,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        {word}
      </span>
    </div>
  );
}

// ─── Diagonal section divider ─────────────────────────────────────────────────
function DiagDivider({ from, to, dir = 'br' }: { from: string; to: string; dir?: 'br' | 'bl' }) {
  return (
    <div
      aria-hidden
      style={{
        height: 56,
        background: dir === 'br'
          ? `linear-gradient(to bottom right, ${from} 49.8%, ${to} 49.8%)`
          : `linear-gradient(to bottom left,  ${from} 49.8%, ${to} 49.8%)`,
        marginTop: '-1px',
      }}
    />
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value }: { value: string }) {
  const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const extras = value.replace(/\d/g, '');
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired.current) {
        fired.current = true;
        const start = Date.now();
        const dur = 1800;
        const tick = () => {
          const t = Math.min((Date.now() - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(ease * num));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [num]);

  return <span ref={ref}>{count}{extras}</span>;
}

// ─── Video modal ──────────────────────────────────────────────────────────────
function VideoModal({ youtubeId, onClose }: { youtubeId: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.93)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white z-10"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        onClick={onClose}
        aria-label="Close"
      >
        <ArrowRight size={18} className="rotate-45" />
      </button>
      <div
        className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Euphoria Ladies Video"
        />
      </div>
    </motion.div>
  );
}

// ─── Traveling border (SVG dash that animates around card edges) ──────────────
function TravelingBorder({
  color = P,
  duration = 4,
  dashLength = 80,
  strokeWidth = 1.5,
  borderRadius = 16,
  delay = 0,
}: {
  color?: string;
  duration?: number;
  dashLength?: number;
  strokeWidth?: number;
  borderRadius?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDim({ w: width, h: height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { w, h } = dim;
  const r = Math.min(borderRadius, w / 2, h / 2);
  const perimeter = w > 0 ? 2 * (w + h) - (8 - 2 * Math.PI) * r : 1200;
  const gap = Math.max(1, perimeter - dashLength);
  const half = strokeWidth / 2;

  if (w === 0) return <div ref={ref} className="absolute inset-0 pointer-events-none" />;

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <motion.rect
          x={half}
          y={half}
          width={w - strokeWidth}
          height={h - strokeWidth}
          rx={Math.max(0, r - half)}
          ry={Math.max(0, r - half)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gap}`}
          animate={{ strokeDashoffset: [0, -perimeter] }}
          transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
        />
      </svg>
    </div>
  );
}

// ─── Section heading — slide-up reveal ───────────────────────────────────────
function SectionHeading({ eyebrow, headline }: { eyebrow: string; headline: string }) {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <div className="w-8 h-px" style={{ backgroundColor: P }} />
        <span className="font-body text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: P }}>
          {eyebrow}
        </span>
        <div className="w-8 h-px" style={{ backgroundColor: P }} />
      </motion.div>
      {/* Overflow hidden so h2 rises from below the mask */}
      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          initial={{ y: '105%', opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.95, ease: EASE_EXPO, delay: 0.08 }}
          className="font-display uppercase text-white overflow-wrap-anywhere min-w-0"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 0.93 }}
        >
          {headline}
        </motion.h2>
      </div>
    </div>
  );
}

// ─── EuphoriaHomePage ─────────────────────────────────────────────────────────
export function EuphoriaHomePage() {
  const { openAuditionModal } = useAuditionModal();
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const timelineSwipeStartX = useRef<number | null>(null);

  // Parallax refs
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ['0%', '22%']);
  const heroTextY = useTransform(heroScroll, [0, 1], ['0%', '10%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const cms = useCmsContent({
    'euphoria.hero.headline': 'EUPHORIA LADIES',
    'euphoria.hero.tagline': 'Train. Perform. Compete. Become Extraordinary.',
    'euphoria.hero.description': 'A high-performance ladies training team developed through Estilo Latino Dance Company — building dancers, champions, performers, and confident women since 2018.',
    'euphoria.hero.cta1.label': 'Join Our Auditions',
    'euphoria.hero.cta1.link': '#auditions',
    'euphoria.hero.cta2.label': 'Start Your Journey',
    'euphoria.hero.cta2.link': '#about',
    'euphoria.hero.cta3.youtube': '',
    'euphoria.about.heading': 'ABOUT EUPHORIA LADIES',
    'euphoria.about.description': 'Euphoria Ladies is a professional ladies training program created through Estilo Latino Dance Company in 2018 with one vision: to empower women through world-class dance training, performance experience, and competitive excellence.',
    'euphoria.about.stat1.value': '30+',
    'euphoria.about.stat1.label': 'Champions Trained',
    'euphoria.about.stat2.value': '8+',
    'euphoria.about.stat2.label': 'Years of Excellence',
    'euphoria.about.stat3.value': '100+',
    'euphoria.about.stat3.label': 'Dancers Developed',
    'euphoria.story.heading': 'THE JOURNEY OF EUPHORIA LADIES',
    'euphoria.auditions.heading': 'AUDITION FOR THE NEXT SEASON',
    'euphoria.auditions.subtitle': 'We Are Looking For Passionate Women',
    'euphoria.auditions.description': 'Ready to grow, train hard, and become part of something bigger. No matter your level — what we value is commitment, discipline, passion, energy, and team mentality.',
    'euphoria.auditions.cta.label': 'Apply for Auditions Now',
    'euphoria.auditions.cta.link': '/contact',
  });

  useEffect(() => {
    getMedia('euphoria.hero.video').then(m => { if (m?.url) setHeroVideoUrl(m.url); }).catch(() => { });
    getMedia('euphoria.hero.image').then(m => { if (m?.url) setHeroImageUrl(m.url); }).catch(() => { });
  }, []);

  const hasMedia = !!(heroVideoUrl || heroImageUrl);

  return (
    <div style={{ backgroundColor: BG, color: TXT, overflowX: 'hidden' }}>

      {/* ══════════════════════════ HERO ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="top"
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '100svh', backgroundColor: BG }}
      >
        {/* ── Static video background — no parallax transform to avoid compositor jank ── */}
        {heroVideoUrl && (
          <video
            autoPlay muted loop playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideoUrl}
            style={{ zIndex: 0 }}
          />
        )}

        {/* ── Parallax background layer (lightweight overlays + image/fallback only) ── */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-[1]">
          {hasMedia ? (
            <>
              {!heroVideoUrl && (
                <img
                  src={heroImageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-hidden
                />
              )}
              <div
                className="absolute inset-0 lg:hidden"
                style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.78) 60%, rgba(10,10,10,0.55) 100%)' }}
              />
              <div
                className="absolute inset-0 hidden lg:block"
                style={{ backgroundColor: BG, clipPath: 'polygon(0 0, 48% 0, 53% 100%, 0 100%)' }}
              />
            </>
          ) : (
            <>
              {/* Atmospheric fallback: two large pink bloom orbs */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 600, height: 600,
                  left: '-10%', bottom: '-15%',
                  background: `radial-gradient(circle, rgba(232,58,126,0.22) 0%, transparent 70%)`,
                  filter: 'blur(60px)',
                  animation: 'euphoria-orb-drift 18s ease-in-out infinite',
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 400, height: 400,
                  right: '5%', top: '10%',
                  background: `radial-gradient(circle, rgba(232,58,126,0.10) 0%, transparent 70%)`,
                  filter: 'blur(80px)',
                  animation: 'euphoria-orb-drift 24s ease-in-out 4s infinite reverse',
                }}
              />
              {/* Diagonal accent stripe */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 49.5%, rgba(232,58,126,0.05) 49.5%, rgba(232,58,126,0.05) 50.5%, transparent 50.5%)',
                }}
              />
            </>
          )}
        </motion.div>

        {/* ── LiquidEther — disabled when video is present (WebGL + video compete for GPU) ── */}
        {!heroVideoUrl && (
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{ clipPath: 'polygon(0 0, 48% 0, 53% 100%, 0 100%)' }}
          >
            <LiquidEther
              colors={['#5227FF', '#FF9FFC', '#B497CF']}
              mouseForce={20}
              cursorSize={120}
              isViscous
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo
              autoSpeed={0.6}
              autoIntensity={4.0}
              takeoverDuration={0.25}
              autoResumeDelay={0}
              autoRampDuration={0.4}
              disableMouseInteraction
              style={{ width: '100%', height: '100%' }}
            />
            {/* Subtle readability overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(10,10,10,0.25)' }}
            />
          </div>
        )}

        {/* ── Grid overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: `linear-gradient(rgba(232,58,126,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(232,58,126,0.025) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── Grain texture overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* ── Hero content (parallax text layer) ── */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-5 lg:px-16 w-full py-20 lg:py-28"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">

            {/* Left: text */}
            <div className="space-y-7">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-px flex-shrink-0" style={{ backgroundColor: P }} />
                <span className="font-body text-xs uppercase tracking-[0.22em] font-semibold" style={{ color: P }}>
                  Estilo Latino Dance Company
                </span>
              </motion.div>

              {/* Headline — word-by-word slide-up with flowing gradient sweep */}
              <h1
                className="font-display uppercase overflow-wrap-anywhere min-w-0"
                style={{
                  fontSize: 'clamp(4rem, 13vw, 9rem)',
                  lineHeight: 0.86,
                  letterSpacing: '-0.025em',
                  background: 'linear-gradient(90deg, #FFFFFF 15%, #F075AA 35%, #E83A7E 50%, #F075AA 65%, #FFFFFF 85%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'euphoria-gradient-sweep 5s linear infinite',
                }}
              >
                {cms['euphoria.hero.headline'].split(' ').map((word, i) => (
                  <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
                    <motion.span
                      initial={{ y: '115%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.88, delay: 0.08 + i * 0.2, ease: EASE_EXPO }}
                      style={{ display: 'block' }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.52, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <div className="w-4 h-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: P }} />
                <p
                  className="font-body font-semibold uppercase overflow-wrap-anywhere min-w-0"
                  style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.78rem)', color: PL, letterSpacing: '0.18em' }}
                >
                  {cms['euphoria.hero.tagline']}
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.68, ease: 'easeOut' }}
                className="font-body leading-relaxed max-w-lg"
                style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', color: 'rgba(255,255,255,0.68)' }}
              >
                {cms['euphoria.hero.description']}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.84, ease: 'easeOut' }}
                className="flex flex-wrap items-center gap-4"
              >
                <button
                  type="button"
                  onClick={openAuditionModal}
                  className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider px-8 py-4 rounded-full text-white transition-all duration-200 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: P,
                    boxShadow: `0 8px 36px rgba(232,58,126,0.5)`,
                    outlineColor: P,
                    fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = PH;
                    el.style.boxShadow = `0 14px 48px rgba(232,58,126,0.6)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = P;
                    el.style.boxShadow = `0 8px 36px rgba(232,58,126,0.5)`;
                  }}
                >
                  {cms['euphoria.hero.cta1.label']} <ArrowRight size={15} />
                </button>

                <a
                  href="#about"
                  onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-1.5"
                  style={{
                    border: `2px solid rgba(232,58,126,0.45)`,
                    color: WH,
                    backgroundColor: 'rgba(232,58,126,0.07)',
                    fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = P;
                    el.style.backgroundColor = 'rgba(232,58,126,0.16)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(232,58,126,0.45)';
                    el.style.backgroundColor = 'rgba(232,58,126,0.07)';
                  }}
                >
                  {cms['euphoria.hero.cta2.label']}
                </a>

                {cms['euphoria.hero.cta3.youtube'] && (
                  <button
                    onClick={() => setActiveVideo(cms['euphoria.hero.cta3.youtube'])}
                    className="inline-flex items-center gap-2 font-body font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <Play size={13} fill="white" style={{ marginLeft: 2 }} />
                    </span>
                    Watch Our Team
                  </button>
                )}
              </motion.div>
            </div>

            {/* Right: decorative panel (no-media fallback) */}
            {!hasMedia && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: EASE_EXPO }}
                className="hidden lg:flex flex-col items-center justify-center gap-8"
              >
                <div className="relative">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-full"
                    style={{
                      background: `radial-gradient(circle, rgba(232,58,126,0.25) 0%, transparent 70%)`,
                      transform: 'scale(2)',
                      animation: 'euphoria-glow-pulse 4s ease-in-out infinite',
                    }}
                  />
                  <div
                    className="w-56 h-56 rounded-full flex items-center justify-center"
                    style={{
                      border: `1px solid rgba(232,58,126,0.22)`,
                      background: `radial-gradient(circle, rgba(232,58,126,0.09) 0%, transparent 70%)`,
                    }}
                  >
                    <img src="/eupLadies.png" alt="" className="w-44 h-44 object-contain" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {[
                    [cms['euphoria.about.stat1.value'], cms['euphoria.about.stat1.label']],
                    [cms['euphoria.about.stat2.value'], cms['euphoria.about.stat2.label']],
                    [cms['euphoria.about.stat3.value'], cms['euphoria.about.stat3.label']],
                  ].map(([v, l]) => (
                    <div
                      key={l}
                      className="text-center p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(232,58,126,0.07)', border: `1px solid rgba(232,58,126,0.14)` }}
                    >
                      <div className="font-display text-3xl" style={{ color: P }}>{v}</div>
                      <div className="font-body text-[10px] uppercase tracking-wider mt-0.5" style={{ color: MUT }}>{l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </motion.div>
      </section>

      {/* ══════════════════════ DOUBLE MARQUEE ══════════════════════════════════ */}
      <div
        className="w-full overflow-hidden py-3"
        style={{ backgroundColor: P }}
        aria-hidden="true"
      >
        {/* Row 1 — right → left */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, '-25%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className="font-display uppercase flex-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: WH, paddingRight: '5rem', letterSpacing: '0.02em' }}
            >
              ★ TRAIN ★ PERFORM ★ COMPETE ★ BECOME EXTRAORDINARY ★
            </span>
          ))}
        </motion.div>
        {/* Row 2 — left → right */}
        <motion.div
          className="flex whitespace-nowrap mt-1"
          animate={{ x: ['-25%', 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className="font-display uppercase flex-none"
              style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: 'rgba(255,255,255,0.5)', paddingRight: '5rem', letterSpacing: '0.04em' }}
            >
              ★ CHAMPIONS ★ SISTERHOOD ★ PASSION ★ EXCELLENCE ★ DISCIPLINE ★
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════ ABOUT ═══════════════════════════════════════════ */}
      <section
        id="about"
        className="relative py-28 overflow-hidden"
        style={{ backgroundColor: BG }}
      >
        {/* Ghost watermark */}
        <GhostWord word="EUPHORIA" opacity={0.04} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8">
          {/* About section — "WHO WE ARE" as large display title */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: EASE_EXPO }}
              className="font-display uppercase"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', lineHeight: 0.9, color: WH, letterSpacing: '-0.02em' }}
            >
              WHO WE <span style={{ color: P }}>ARE</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center justify-center gap-3 mt-5"
            >
              <div className="w-8 h-px" style={{ backgroundColor: P }} />
              <span className="font-body text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: P }}>
                {cms['euphoria.about.heading']}
              </span>
              <div className="w-8 h-px" style={{ backgroundColor: P }} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left: description + specialties */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={STAGGER}
            >
              <motion.p
                variants={FADE_UP}
                className="font-body leading-relaxed mb-8"
                style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', color: 'rgba(255,255,255,0.68)' }}
              >
                {cms['euphoria.about.description']}
              </motion.p>
              <motion.p variants={FADE_UP} className="font-body font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: WH }}>
                Our teams specialize in:
              </motion.p>
              <motion.div variants={STAGGER} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SPECIALTIES.map((spec, si) => (
                  <motion.div
                    key={spec}
                    variants={FADE_UP}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 relative overflow-hidden"
                    style={{ backgroundColor: 'rgba(232,58,126,0.07)', border: `1px solid rgba(232,58,126,0.08)` }}
                    whileHover={{ borderColor: 'rgba(232,58,126,0.30)', transition: { duration: 0.15 } }}
                  >
                    <TravelingBorder dashLength={45} borderRadius={8} duration={3.5} strokeWidth={1} delay={si * 0.45} />
                    <CheckCircle size={14} style={{ color: P, flexShrink: 0 }} />
                    <span className="font-body text-sm font-medium" style={{ color: TXT }}>{spec}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: achievement card — slides from right */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.12 }}
            >
              <div
                className="relative rounded-2xl overflow-hidden p-8"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${BD}`,
                  boxShadow: `0 0 100px rgba(232,58,126,0.07)`,
                }}
              >
                <TravelingBorder dashLength={100} borderRadius={16} duration={5} />
                <p className="font-display text-5xl uppercase mb-1" style={{ color: P }}>Since 2018</p>
                <p className="font-body text-sm mb-8" style={{ color: MUT }}>Developing elite women through the power of dance</p>
                <div className="space-y-4">
                  {[
                    { icon: Trophy, text: 'International Competition Champions' },
                    { icon: Users, text: 'Performed with World-Class Artists' },
                    { icon: Zap, text: 'High-Performance Training Program' },
                    { icon: Star, text: 'Complete Artistic Development' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(232,58,126,0.1)' }}
                      >
                        <Icon size={15} style={{ color: P }} />
                      </div>
                      <span className="font-body text-sm" style={{ color: TXT }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats row — cinematic scale + counter */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={STAGGER_MED}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {[
              { key: 'euphoria.about.stat1.value', labelKey: 'euphoria.about.stat1.label' },
              { key: 'euphoria.about.stat2.value', labelKey: 'euphoria.about.stat2.label' },
              { key: 'euphoria.about.stat3.value', labelKey: 'euphoria.about.stat3.label' },
            ].map(({ key, labelKey }, si) => (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.92 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
                }}
                className="text-center rounded-2xl py-10 px-6 relative overflow-hidden cursor-default"
                style={{ backgroundColor: CARD, border: `1px solid ${BD}` }}
                whileHover={{ borderColor: 'rgba(232,58,126,0.38)', boxShadow: `0 20px 50px rgba(232,58,126,0.09)`, transition: { duration: 0.2 } }}
              >
                <TravelingBorder dashLength={70} borderRadius={16} duration={4} delay={si * 1.3} />
                <div className="font-display text-6xl mb-2" style={{ color: P }}>
                  <Counter value={cms[key]} />
                </div>
                <div className="font-body font-semibold text-xs uppercase tracking-wider" style={{ color: MUT }}>
                  {cms[labelKey]}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Diagonal transition: BG → SF ── */}
      <DiagDivider from={BG} to={SF} dir="br" />

      {/* ══════════════════════ STORY / TIMELINE ════════════════════════════════ */}
      <section
        id="story"
        className="relative py-28 overflow-hidden"
        style={{ backgroundColor: SF }}
      >
        <GhostWord word="STORY" opacity={0.04} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8">

          {/* Big display title */}
          <div className="text-center mb-4">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: EASE_EXPO }}
              className="font-display uppercase"
              style={{
                fontSize: 'clamp(3.5rem, 9vw, 7rem)',
                lineHeight: 0.9,
                color: WH,
                letterSpacing: '-0.02em',
              }}
            >
              OUR <span style={{ color: P }}>STORY</span>
            </motion.h2>
          </div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center gap-3 mb-16"
          >
            <div className="w-8 h-px" style={{ backgroundColor: P }} />
            <span className="font-body text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: P }}>
              Our Journey
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: P }} />
          </motion.div>

          {/* ── Horizontal interactive timeline ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.25 }}
          >
            {/* Year rail with progress track */}
            <div className="relative mb-10 px-2">
              {/* Background track line */}
              <div
                className="absolute h-px"
                style={{
                  backgroundColor: BD,
                  top: 20,
                  left: `calc(${100 / TIMELINE.length / 2}%)`,
                  right: `calc(${100 / TIMELINE.length / 2}%)`,
                }}
              />
              {/* Animated progress fill */}
              <motion.div
                className="absolute h-px"
                style={{
                  backgroundColor: P,
                  top: 20,
                  left: `calc(${100 / TIMELINE.length / 2}%)`,
                  boxShadow: `0 0 8px rgba(232,58,126,0.6)`,
                }}
                animate={{
                  width: activeTimelineIndex === 0
                    ? '0%'
                    : `calc(${(activeTimelineIndex / (TIMELINE.length - 1)) * (100 - 100 / TIMELINE.length)}%)`,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />

              {/* Year buttons row */}
              <div className="flex justify-between items-start">
                {TIMELINE.map((entry, i) => {
                  const isActive = i === activeTimelineIndex;
                  const isPast = i < activeTimelineIndex;
                  return (
                    <button
                      key={entry.year}
                      onClick={() => setActiveTimelineIndex(i)}
                      className="flex flex-col items-center gap-2 group focus-visible:outline-none"
                      style={{ width: `${100 / TIMELINE.length}%` }}
                    >
                      {/* Dot + pulse ring */}
                      <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
                        {isActive && (
                          <motion.div
                            className="absolute rounded-full pointer-events-none"
                            style={{ width: 36, height: 36, backgroundColor: 'rgba(232,58,126,0.15)' }}
                            animate={{ scale: [1, 1.7, 1], opacity: [0.7, 0, 0.7] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        )}
                        <motion.div
                          className="rounded-full relative z-10 cursor-pointer"
                          animate={{
                            width: isActive ? 16 : 10,
                            height: isActive ? 16 : 10,
                            backgroundColor: isActive || isPast ? P : '#333',
                            boxShadow: isActive
                              ? `0 0 0 4px rgba(232,58,126,0.22), 0 0 20px rgba(232,58,126,0.55)`
                              : 'none',
                          }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          whileHover={{ scale: 1.3 }}
                        />
                      </div>
                      {/* Year label */}
                      <motion.span
                        animate={{ color: isActive ? P : isPast ? PL : MUT }}
                        transition={{ duration: 0.25 }}
                        className="font-display text-center leading-tight hidden sm:block"
                        style={{ fontSize: 'clamp(0.55rem, 1.2vw, 0.85rem)', fontWeight: isActive ? 700 : 400 }}
                      >
                        {entry.year}
                      </motion.span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active card — AnimatePresence for smooth cross-fade + slide */}
            <div
              onTouchStart={e => { timelineSwipeStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (timelineSwipeStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - timelineSwipeStartX.current;
                if (Math.abs(dx) > 50) {
                  if (dx < 0) setActiveTimelineIndex(prev => Math.min(TIMELINE.length - 1, prev + 1));
                  else setActiveTimelineIndex(prev => Math.max(0, prev - 1));
                }
                timelineSwipeStartX.current = null;
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTimelineIndex}
                  initial={{ opacity: 0, x: 48, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -48, scale: 0.97 }}
                  transition={{ duration: 0.42, ease: EASE_EXPO }}
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid rgba(232,58,126,0.2)`,
                    minHeight: 220,
                    boxShadow: `0 0 60px rgba(232,58,126,0.06)`,
                  }}
                >
                  {/* Traveling border — loops continuously around card edges */}
                  <TravelingBorder
                    color={P}
                    dashLength={120}
                    strokeWidth={1.5}
                    borderRadius={16}
                    duration={4.5}
                  />
                  {/* Top gradient accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(to right, transparent, ${P} 30%, ${P} 70%, transparent)` }}
                  />
                  {/* Bottom progress bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1"
                    style={{ backgroundColor: P, opacity: 0.65 }}
                    animate={{ width: `${((activeTimelineIndex + 1) / TIMELINE.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  {/* Ghost year watermark — size scales down for long year ranges */}
                  <div
                    className="absolute right-6 bottom-0 pointer-events-none select-none"
                    style={{
                      fontSize: TIMELINE[activeTimelineIndex].year.length > 5
                        ? 'clamp(4rem, 11vw, 9rem)'
                        : 'clamp(6rem, 18vw, 15rem)',
                      fontFamily: '"Bebas Neue", sans-serif',
                      color: 'rgba(232,58,126,0.13)',
                      WebkitTextStroke: '2px rgba(232,58,126,0.35)',
                      letterSpacing: '-0.04em',
                      lineHeight: 0.85,
                    }}
                    aria-hidden
                  >
                    {TIMELINE[activeTimelineIndex].year}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-14">
                      {/* Year + counter */}
                      <div className="flex-shrink-0">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.75 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.08, ease: EASE_EXPO }}
                          className="font-display leading-none"
                          style={{
                            fontSize: TIMELINE[activeTimelineIndex].year.length > 5
                              ? 'clamp(2rem, 4vw, 3.8rem)'
                              : 'clamp(3.5rem, 7vw, 6.5rem)',
                            color: P,
                            lineHeight: 1,
                          }}
                        >
                          {TIMELINE[activeTimelineIndex].year}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.22 }}
                          className="font-body text-xs uppercase tracking-widest mt-2"
                          style={{ color: MUT }}
                        >
                          {activeTimelineIndex + 1} / {TIMELINE.length}
                        </motion.div>
                      </div>

                      {/* Divider */}
                      <div
                        className="hidden md:block w-px self-stretch"
                        style={{ backgroundColor: 'rgba(232,58,126,0.15)' }}
                      />

                      {/* Title + description */}
                      <div className="flex-1">
                        <motion.h3
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1, ease: EASE_EXPO }}
                          className="font-display uppercase text-white mb-4"
                          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', lineHeight: 1.0 }}
                        >
                          {TIMELINE[activeTimelineIndex].title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.18, ease: EASE_EXPO }}
                          className="font-body leading-relaxed"
                          style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1.05rem)', color: 'rgba(255,255,255,0.6)' }}
                        >
                          {TIMELINE[activeTimelineIndex].description}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-6">
              <motion.button
                onClick={() => setActiveTimelineIndex(prev => Math.max(0, prev - 1))}
                disabled={activeTimelineIndex === 0}
                whileHover={activeTimelineIndex > 0 ? { x: -3 } : {}}
                whileTap={activeTimelineIndex > 0 ? { scale: 0.95 } : {}}
                className="flex items-center gap-2 font-body font-bold text-sm uppercase tracking-wider rounded-full px-5 py-2.5 transition-colors duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                style={{
                  color: WH,
                  backgroundColor: 'rgba(232,58,126,0.1)',
                  border: `1px solid rgba(232,58,126,0.22)`,
                }}
              >
                <ChevronLeft size={16} /> Prev
              </motion.button>

              {/* Pill progress indicators */}
              <div className="flex gap-1.5 items-center">
                {TIMELINE.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveTimelineIndex(i)}
                    animate={{
                      width: i === activeTimelineIndex ? 22 : 6,
                      backgroundColor: i === activeTimelineIndex
                        ? P
                        : i < activeTimelineIndex
                          ? 'rgba(232,58,126,0.4)'
                          : BD,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="rounded-full flex-shrink-0"
                    style={{ height: 6 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={() => setActiveTimelineIndex(prev => Math.min(TIMELINE.length - 1, prev + 1))}
                disabled={activeTimelineIndex === TIMELINE.length - 1}
                whileHover={activeTimelineIndex < TIMELINE.length - 1 ? { x: 3 } : {}}
                whileTap={activeTimelineIndex < TIMELINE.length - 1 ? { scale: 0.95 } : {}}
                className="flex items-center gap-2 font-body font-bold text-sm uppercase tracking-wider rounded-full px-5 py-2.5 transition-colors duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                style={{
                  color: WH,
                  backgroundColor: 'rgba(232,58,126,0.1)',
                  border: `1px solid rgba(232,58,126,0.22)`,
                }}
              >
                Next <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Diagonal transition: SF → BG ── */}
      <DiagDivider from={SF} to={BG} dir="bl" />

      {/* ══════════════════════ WHY JOIN ════════════════════════════════════════ */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ backgroundColor: BG }}
      >
        <GhostWord word="SISTERHOOD" opacity={0.04} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8">

          {/* Big display title */}
          <div className="text-center mb-4">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: EASE_EXPO }}
              className="font-display uppercase"
              style={{
                fontSize: 'clamp(3.5rem, 9vw, 7rem)',
                lineHeight: 0.9,
                color: WH,
                letterSpacing: '-0.02em',
              }}
            >
              WHY <span style={{ color: P }}>JOIN</span>
            </motion.h2>
          </div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center gap-3 mb-16"
          >
            <div className="w-8 h-px" style={{ backgroundColor: P }} />
            <span className="font-body text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: P }}>
              More Than a Dance Team
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: P }} />
          </motion.div>

          {/* Benefit cards — each has its own whileInView so the observer is independent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {WHY_JOIN.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: idx === 0 ? -56 : idx === 2 ? 56 : 0, y: idx === 1 ? 36 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...SPRING, delay: idx * 0.15 }}
                className="rounded-2xl p-8 text-center relative overflow-hidden cursor-default"
                style={{ backgroundColor: CARD, border: `1px solid ${BD}` }}
                whileHover={{ y: -10, borderColor: 'rgba(232,58,126,0.42)', boxShadow: `0 24px 60px rgba(232,58,126,0.11)`, transition: { duration: 0.22 } }}
              >
                <TravelingBorder color={P} dashLength={80} strokeWidth={1.5} borderRadius={16} duration={5} delay={idx * 1.65} />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-200"
                  style={{ backgroundColor: 'rgba(232,58,126,0.1)', border: `1px solid rgba(232,58,126,0.15)` }}
                >
                  <Icon size={26} style={{ color: P }} />
                </div>
                <h3 className="font-display uppercase text-2xl text-white mb-3">{title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: MUT }}>{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Experience list */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: EASE_EXPO }}
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              backgroundColor: CARD,
              border: `1px solid ${BD}`,
              background: `linear-gradient(135deg, ${CARD} 0%, rgba(232,58,126,0.04) 100%)`,
            }}
          >
            <TravelingBorder color={P} dashLength={140} strokeWidth={1.5} borderRadius={16} duration={6} delay={0} />
            <h3 className="font-display uppercase text-3xl text-white mb-8 text-center">What You'll Experience</h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={STAGGER}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {EXPERIENCE_LIST.map(item => (
                <motion.div key={item} variants={FADE_UP} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: P }} />
                  <span className="font-body text-sm" style={{ color: TXT }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Diagonal transition: BG → P (hot-pink auditions section) ── */}
      <DiagDivider from={BG} to={P} dir="br" />

      {/* ══════════════════════ AUDITIONS ═══════════════════════════════════════ */}
      <section
        id="auditions"
        className="relative overflow-hidden pt-4 pb-28"
        style={{ backgroundColor: P }}
      >
        {/* Floating white particles on pink bg */}
        {HERO_PARTICLES.slice(0, 7).map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: p.size * 1.5,
              height: p.size * 1.5,
              left: p.x,
              top: p.y,
              backgroundColor: WH,
              opacity: p.opacity * 0.45,
              animation: `euphoria-float ${p.dur + 2}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8">

          {/* Big display title */}
          <div className="text-center mb-4">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: EASE_EXPO }}
              className="font-display uppercase"
              style={{
                fontSize: 'clamp(3.5rem, 9vw, 7rem)',
                lineHeight: 0.9,
                color: WH,
                letterSpacing: '-0.02em',
              }}
            >
              AUDITIONS
            </motion.h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={STAGGER}
            className="text-center mb-14"
          >
            <motion.div variants={FADE_UP} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.45)' }} />
              <span className="font-body text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Be Part of Something Bigger
              </span>
              <div className="w-6 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.45)' }} />
            </motion.div>
            <div style={{ overflow: 'hidden' }}>
              <motion.h2
                initial={{ y: '105%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.95, ease: EASE_EXPO, delay: 0.1 }}
                className="font-display uppercase text-white overflow-wrap-anywhere min-w-0"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 0.93 }}
              >
                {cms['euphoria.auditions.heading']}
              </motion.h2>
            </div>
            <motion.p
              variants={FADE_UP}
              className="font-body text-lg mt-5 max-w-xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              {cms['euphoria.auditions.description']}
            </motion.p>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={STAGGER}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-14"
          >
            {REQUIREMENTS.map(({ label, desc }) => (
              <motion.div
                key={label}
                variants={FADE_UP}
                className="rounded-xl p-5 text-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.14)' }}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.32)', transition: { duration: 0.15 } }}
              >
                <p className="font-display uppercase text-xl text-white mb-1">{label}</p>
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.62)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              type="button"
              onClick={openAuditionModal}
              className="inline-flex items-center gap-2 font-body font-bold uppercase tracking-wider px-10 py-5 rounded-full text-white transition-all hover:-translate-y-1.5 hover:shadow-2xl"
              style={{ backgroundColor: BG, boxShadow: '0 8px 36px rgba(0,0,0,0.55)', fontSize: '0.8rem' }}
            >
              {cms['euphoria.auditions.cta.label']} <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* Video modal */}
      {activeVideo && (
        <VideoModal youtubeId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
