// AnimatedLetters - Staggered letter-by-letter reveal animation

import { motion } from 'motion/react';
import { letterStagger, letterReveal } from '../../../lib/animations';

interface AnimatedLettersProps {
  text: string;
  accent?: string; // renders in gold after the main text
  className?: string;
}

export function AnimatedLetters({ text, accent, className = '' }: AnimatedLettersProps) {
  const whiteLetters = text.split('');
  const goldLetters = accent ? accent.split('') : [];
  const allLetters = [...whiteLetters, ...goldLetters];
  const whiteCount = whiteLetters.length;

  return (
    <motion.h2
      variants={letterStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={`font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight inline-block ${className}`}
    >
      {allLetters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterReveal}
          className={`inline-block ${index >= whiteCount ? 'text-gold' : ''}`}
          style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
}
