import { motion } from 'motion/react';

export function EuphoriaLadiesPage() {
  return (
    <section className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <img
          src="/euphoria_ladies.png"
          alt="Euphoria Ladies by Estilo Latino Dance Company"
          className="h-20 w-auto object-contain mx-auto mb-8"
        />
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-white uppercase leading-none mb-4">
          Coming Soon
        </h1>
        <p className="font-body text-text-muted text-lg">
          Something exciting is on the way. Stay tuned.
        </p>
        <a
          href="/"
          className="inline-block mt-10 font-body text-sm text-gold hover:text-gold-light underline underline-offset-4 transition-colors"
        >
          ← Back to Estilo Latino
        </a>
      </motion.div>
    </section>
  );
}
