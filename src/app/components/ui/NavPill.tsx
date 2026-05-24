// NavPill - Black pill navigation link component

import { Link } from 'react-router';
import { motion } from 'motion/react';

interface NavPillProps {
  to: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function NavPill({ to, active = false, onClick, children }: NavPillProps) {
  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        className={`px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
          active
            ? 'bg-gold text-ink'
            : 'bg-transparent text-text hover:bg-white/10 hover:text-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    </Link>
  );
}
