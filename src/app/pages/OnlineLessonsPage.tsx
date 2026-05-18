import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft, Wifi, Clock, Globe } from 'lucide-react';
import { LatinBadge } from '../components/ui/LatinBadge';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const features = [
  { icon: Wifi,  label: 'Live Streaming',     desc: 'Real-time classes with your instructor' },
  { icon: Clock, label: 'On-Demand',           desc: 'Watch recorded sessions at your pace' },
  { icon: Globe, label: 'Anywhere in the World', desc: 'Baila desde donde estés' },
];

export function OnlineLessonsPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Decorative top bar */}
      <div className="h-1 bg-gold w-full" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(246,176,0,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Spinning badge — decorative */}
        <div className="mb-8 opacity-60 scale-75">
          <LatinBadge />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl mx-auto"
        >
          {/* Label */}
          <motion.p
            variants={fadeUp}
            className="font-body text-gold uppercase tracking-[0.3em] text-sm font-bold mb-4"
          >
            Online Lessons
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(4rem,10vw,7rem)] leading-[0.9] text-white uppercase mb-6"
          >
            COMING
            <br />
            <span className="text-gold">SOON</span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="h-px bg-border-strong max-w-xs mx-auto mb-8"
          />

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="font-body text-text text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed mb-12 max-w-lg mx-auto"
          >
            We&apos;re building something special — live and on-demand dance classes you can
            take from anywhere in the world. Stay tuned and be the first to know when we launch.
          </motion.p>

          {/* Feature cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
          >
            {features.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                variants={fadeIn}
                className="bg-surface-card border border-border rounded-xl p-5 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-gold" />
                </div>
                <p className="font-display text-white uppercase text-lg leading-tight mb-1">
                  {label}
                </p>
                <p className="font-body text-text-muted text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Back button */}
          <motion.div variants={fadeUp}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-body font-semibold text-gold border border-gold/40 rounded-full px-6 py-3 hover:bg-gold/10 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gold bar */}
      <div className="h-1 bg-gold w-full" />
    </div>
  );
}
