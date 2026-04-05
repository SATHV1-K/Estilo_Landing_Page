// CTABanner - Call-to-action banner section

import { motion } from 'motion/react';
import { fadeInUp } from '../../../lib/animations';
import { useScrollReveal } from '../../../lib/hooks/useScrollReveal';
import { CTAButton } from '../ui/CTAButton';

interface CTABannerProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaLink: string;
}

export function CTABanner({
  title,
  subtitle,
  ctaLabel,
  ctaLink,
}: CTABannerProps) {
  const { ref, isInView } = useScrollReveal({ amount: 0.5 });

  return (
    <section className="py-24 bg-surface text-white">
      <motion.div
        ref={ref as any}
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-[1440px] mx-auto px-4 lg:px-16 text-center"
      >
        <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] mb-6">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <CTAButton to={ctaLink} size="lg">
          {ctaLabel}
        </CTAButton>
      </motion.div>
    </section>
  );
}
