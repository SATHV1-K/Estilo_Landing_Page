// AnimatedLetters - Staggered letter-by-letter reveal animation

import { motion } from 'motion/react';
import { letterStagger, letterReveal } from '../../../lib/animations';

interface AnimatedLettersProps {
  text: string;
  className?: string;
}

export function AnimatedLetters({ text, className = '' }: AnimatedLettersProps) {
  const letters = text.split('');

  return (
    <motion.h2
      variants={letterStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={`font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight inline-block ${className}`}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterReveal}
          className="inline-block"
          style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
}
