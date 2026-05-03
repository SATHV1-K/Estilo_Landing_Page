'use client';

import { motion } from 'motion/react';

export function SubBrands() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.9, ease: 'easeOut' }}
      className="mt-6 select-none"
    >
      {/* Label */}
      <p className="font-body text-[0.6rem] text-text-dim uppercase tracking-[0.22em] mb-4">
        Also by Estilo Latino
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {/* ── Estilo Kids ── */}
        <a
          href="/kids"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Estilo Kids dance classes"
          className="group relative flex items-center gap-4 overflow-hidden bg-surface-card border border-border hover:border-gold rounded-xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(246,176,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {/* Gold left accent bar */}
          <div className="absolute left-0 inset-y-0 w-[3px] bg-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Bee in hex */}
          <div className="relative flex-shrink-0 ml-1 w-[80px] h-[80px]">
            <div
              className="absolute inset-0 bg-[#FFF8E7]"
              style={{ clipPath: 'polygon(50% 0%,96% 26%,96% 74%,50% 100%,4% 74%,4% 26%)' }}
            />
            <img
              src="/estilo_bee.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain p-2 z-10 transition-transform duration-300 group-hover:scale-110"
            />
            <svg
              width="80" height="80" viewBox="0 0 80 80"
              className="absolute inset-0 z-20 pointer-events-none"
              aria-hidden="true"
            >
              <polygon
                points="40,5 75,23 75,57 40,75 5,57 5,23"
                fill="none" stroke="#F6B000" strokeWidth="1.5"
                className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className="block font-display text-[1.25rem] text-white uppercase tracking-wide leading-none group-hover:text-gold transition-colors duration-300">
              Estilo Kids
            </span>
            <span className="block font-body text-xs text-text-muted mt-1 tracking-wide">
              For young dancers
            </span>
          </div>

          {/* Arrow */}
          <svg
            className="flex-shrink-0 w-4 h-4 text-border group-hover:text-gold group-hover:translate-x-1 transition-all duration-300"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* ── Euphoria Ladies ── */}
        <a
          href="/euphoria-ladies"
          aria-label="Euphoria Ladies dance program"
          className="group relative isolate flex items-center gap-4 overflow-hidden bg-surface-card border border-border hover:border-[#E91E8C] rounded-xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(233,30,140,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E8C]"
        >
          {/* Pink left accent bar */}
          <div className="absolute left-0 inset-y-0 w-[3px] bg-[#E91E8C] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Logo — screen blend removes the dark built-in background */}
          <div className="ml-1 flex-1 min-w-0">
            <img
              src="/euphoria_ladies.png"
              alt="Euphoria Ladies by Estilo Latino Dance Company"
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>

          {/* Arrow */}
          <svg
            className="flex-shrink-0 w-4 h-4 text-border group-hover:text-[#E91E8C] group-hover:translate-x-1 transition-all duration-300"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}
