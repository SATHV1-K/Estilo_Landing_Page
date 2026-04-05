// CTAButton - Purple pill button with arrow circle

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CTAButton({
  to,
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: CTAButtonProps) {
  const baseClasses =
    'inline-flex items-center gap-3 font-bold uppercase tracking-wider transition-all duration-200 group';

  const variantClasses = {
    primary:
      'bg-gold hover:bg-gold-hover text-ink shadow-lg hover:shadow-xl',
    secondary:
      'bg-gold-light hover:bg-gold text-ink shadow-lg hover:shadow-xl',
    outline:
      'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-ink',
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-xs rounded-lg',
    md: 'px-6 py-3.5 text-sm rounded-lg',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      <motion.div
        className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full"
        whileHover={{ rotate: 45 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight size={14} />
      </motion.div>
    </>
  );

  if (to) {
    return (
      <Link to={to}>
        <motion.div
          className={classes}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <motion.div
          className={classes}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
        </motion.div>
      </a>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
