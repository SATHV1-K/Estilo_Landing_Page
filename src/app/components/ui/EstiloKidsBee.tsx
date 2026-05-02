'use client';

import { motion } from 'motion/react';

const SPARKLES = [
  { cx: 22,  cy: 14,  r: 3.5, delay: 0.0 },
  { cx: 8,   cy: 50,  r: 2.8, delay: 0.5 },
  { cx: 20,  cy: 88,  r: 3.2, delay: 1.0 },
  { cx: 90,  cy: 10,  r: 2.8, delay: 0.3 },
  { cx: 100, cy: 86,  r: 3.5, delay: 0.8 },
];

/*
  LAYOUT (container 300 × 140):
  ┌─────────────────────────────────────────────┐
  │  [hex bee]   ESTILO KIDS          (top: 4)  │
  │  left:0      For our youngest…    (top:~28) │
  │  top:10                                     │
  │              ↙ arrow starts (185,52)        │
  │           waves down to (112, 108)          │
  └─────────────────────────────────────────────┘

  Text occupies x:136–300, y:4–44.
  Arrow lives entirely below y:52 — zero overlap.
  Wave uses two chained cubics with big vertical swings.
*/
export function EstiloKidsBee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.9, ease: 'easeOut' }}
      className="relative mt-3 select-none"
      style={{ width: 300, height: 140 }}
    >

      {/* ── BEE in hexagonal cell ── */}
      <a
        href="/kids"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Estilo Kids classes"
        className="absolute group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        style={{ left: 0, top: 10, width: 112, height: 104 }}
      >
        {/* Ambient glow */}
        <motion.div
          animate={{ opacity: [0.18, 0.42, 0.18], scale: [0.9, 1.08, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gold blur-2xl pointer-events-none"
        />

        {/* Outer pulse ring + sparkle stars */}
        <svg
          width="112" height="104" viewBox="0 0 112 104"
          className="absolute inset-0 pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          <motion.polygon
            points="56,3 105,29 105,75 56,101 7,75 7,29"
            fill="none" stroke="#F6B000" strokeWidth="1"
            animate={{ strokeOpacity: [0.12, 0.45, 0.12] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {SPARKLES.map((s, i) => (
            <motion.path
              key={i}
              d={`M${s.cx},${s.cy-s.r} L${s.cx+s.r*.38},${s.cy-s.r*.38} L${s.cx+s.r},${s.cy} L${s.cx+s.r*.38},${s.cy+s.r*.38} L${s.cx},${s.cy+s.r} L${s.cx-s.r*.38},${s.cy+s.r*.38} L${s.cx-s.r},${s.cy} L${s.cx-s.r*.38},${s.cy-s.r*.38}Z`}
              fill="#F6B000"
              animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
              style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
            />
          ))}
        </svg>

        {/* Hex clip: warm cream fill + shimmer */}
        <div
          className="absolute overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.06]"
          style={{ inset: 8, clipPath: 'polygon(50% 0%,96% 26%,96% 74%,50% 100%,4% 74%,4% 26%)' }}
        >
          <div className="absolute inset-0 bg-[#FFF8E7]" />
          <motion.div
            animate={{ x: ['-130%', '230%'] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-2/5 bg-gradient-to-r from-transparent via-gold/30 to-transparent -skew-x-12 pointer-events-none"
          />
          <motion.img
            src="/estilo_bee.png"
            alt="Estilo Kids"
            className="relative z-10 mx-auto object-contain"
            style={{ width: 66, height: 66, marginTop: 8 }}
            animate={{
              y:      [0, -5, -2, -8, -1, 0],
              rotate: [-1.5, 2, -0.8, 3, -2, -1.5],
              scale:  [1, 1.02, 1, 1.04, 1.01, 1],
            }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', times: [0,0.2,0.4,0.6,0.8,1] }}
          />
        </div>

        {/* Gold hex border */}
        <svg
          width="112" height="104" viewBox="0 0 112 104"
          className="absolute inset-0 pointer-events-none transition-all duration-300 group-hover:[filter:drop-shadow(0_0_10px_rgba(246,176,0,0.7))]"
          aria-hidden="true"
        >
          <polygon points="56,12 100,34 100,70 56,92 12,70 12,34" fill="none" stroke="#F6B000" strokeWidth="2.5" />
        </svg>

        {/* Badge */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-gold text-ink font-body font-bold uppercase tracking-wider rounded-full z-20 shadow-md whitespace-nowrap"
          style={{ top: 2, fontSize: '0.48rem', padding: '2px 7px' }}
        >★ KIDS ★</div>
      </a>

      {/* ── LABEL — top right, y:4–44 ── */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="absolute"
        style={{ left: 136, top: 4 }}
      >
        <span className="font-display text-[1.35rem] tracking-[0.12em] text-gold uppercase leading-none">
          Estilo Kids
        </span>
        <span className="block font-body text-[0.62rem] text-text-muted tracking-wide mt-1">
          For our young dancers ✦
        </span>
      </motion.div>

      {/* ── LOOPING BEE FLIGHT PATH ──
          Mimics a bee's looping flight trail: starts below the label text,
          sweeps right into a big arc, crosses back over itself to form a
          visible loop, then spirals inward and runs left into the bee hex.

          Free canvas: x:120–300, y:45–140 (below text, right of hex).
          Loop centre ≈ (215, 90).  Crossing happens near (195, 58).
      ── */}
      <svg
        width="300" height="140" viewBox="0 0 300 140"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <motion.path
          d="M 185 46 C 255 42, 288 92, 262 118 C 236 142, 164 142, 146 110 C 128 80, 170 48, 202 58 C 222 64, 208 94, 182 96 C 156 98, 122 88, 112 76"
          stroke="#F6B000"
          strokeWidth="2.6"
          strokeDasharray="7 5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.0, delay: 1.45, ease: 'easeOut' }}
        />
      </svg>

    </motion.div>
  );
}
