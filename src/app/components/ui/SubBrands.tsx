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

      <div className="flex flex-row gap-3 w-full max-w-sm">
        {/* ── Estilo Kids ── */}
        <div className="group flex items-stretch flex-1 min-w-0 overflow-hidden rounded-xl border border-border hover:border-gold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(246,176,0,0.22)]">
          <a
            href="/kids"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Estilo Kids dance classes"
            className="relative flex-1 aspect-square overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
            style={{ background: 'radial-gradient(ellipse at 80% 80%, #3d2200 0%, #1a0e00 40%, #0A0A0A 70%)' }}
          >
            <img
              src="/estilo_bee.png"
              alt="Estilo Kids"
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </a>
          <div className="flex-shrink-0 w-8 flex items-center justify-center border-l border-border group-hover:border-gold bg-surface-card transition-colors duration-300">
            <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-gold transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* ── Euphoria Ladies ── */}
        <div className="group flex items-stretch flex-1 min-w-0 overflow-hidden rounded-xl border border-border hover:border-[#E91E8C] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(233,30,140,0.2)]">
          <a
            href="/euphoria-ladies"
            aria-label="Euphoria Ladies dance program"
            className="relative flex-1 aspect-square overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E91E8C]"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, #4a0035 0%, #2a0020 45%, #0A0A0A 85%)' }}
          >
            <img
              src="/eupLadies.png"
              alt="Euphoria Ladies"
              className="absolute inset-0 w-full h-full object-contain scale-[1.45] transition-transform duration-500 group-hover:scale-[1.52]"
            />
          </a>
          <div className="flex-shrink-0 w-8 flex items-center justify-center border-l border-border group-hover:border-[#E91E8C] bg-surface-card transition-colors duration-300">
            <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-[#E91E8C] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
