// MarqueeTicker - Infinite scrolling marquee banner

import { motion } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';

interface MarqueeTickerProps {
  items?: string[];
  separator?: 'sparkle' | 'star' | 'music-note';
  speed?: number;
  direction?: 'left' | 'right';
}

export function MarqueeTicker({
  items = ['BAILA', 'DANCE', 'SALSA', 'BACHATA'],
  separator = 'star',
  speed = 30,
  direction = 'left',
}: MarqueeTickerProps) {
  const SeparatorIcon = separator === 'sparkle' ? Sparkles : Star;

  // Duplicate items to create seamless loop
  const allItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-black py-6 overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: direction === 'left' ? [0, '-33.333%'] : ['-33.333%', 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {allItems.map((item, index) => (
          <div key={index} className="flex items-center gap-12 flex-shrink-0">
            <span className="text-white font-display text-5xl lg:text-6xl tracking-tighter">
              {item}
            </span>
            <motion.div
              animate={{
                scale: [0.9, 1.1, 0.9],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
            >
              <SeparatorIcon className="text-accent-warm" size={32} />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
