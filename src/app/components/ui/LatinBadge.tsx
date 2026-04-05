// LatinBadge - Rotating circular badge with Latin instrument

import { motion } from 'motion/react';

export function LatinBadge() {
  return (
    <motion.div
      className="w-32 h-32 rounded-full bg-gold flex items-center justify-center shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* Rotating ring */}
      <motion.div
        className="absolute inset-0 border-4 border-white/30 border-dashed rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Center Icon - Conga Drum */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-16 h-16 text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 10h24v4H20zM18 14h28v36a6 6 0 01-6 6H24a6 6 0 01-6-6V14z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M18 20h28M18 28h28M18 36h28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="32"
          cy="12"
          r="12"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 bg-white rounded-full"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: [0, 0.2, 0], scale: [1, 1.5, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
