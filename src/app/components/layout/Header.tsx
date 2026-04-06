// Header Component with Navigation

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useI18n, translations } from '../../../lib/i18n';
import { fadeInDown } from '../../../lib/animations';
import { LanguageToggle } from '../ui/LanguageToggle';
import { NavPill } from '../ui/NavPill';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useI18n();
  const location = useLocation();

  const navItems = [
    { path: '/', label: translations.nav.home[language] },
    { path: '/schedule', label: translations.nav.schedule[language] },
    { path: '/styles', label: translations.nav.styles[language] },
    { path: '/packages', label: translations.nav.packages[language] },
    { path: '/instructors', label: translations.nav.instructors[language] },
    { path: '/about', label: translations.nav.about[language] },
    { path: '/contact', label: translations.nav.contact[language] },
  ];

  return (
    <motion.header
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border"
      style={{ boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Estilo Latino Dance Company"
              style={{
                width: '130px',
                height: '60px',
                objectFit: 'cover',
                objectPosition: 'center 48%',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavPill
                key={item.path}
                to={item.path}
                active={location.pathname === item.path}
              >
                {item.label}
              </NavPill>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            
            <button
              className="lg:hidden p-2 text-text hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pb-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gold text-ink'
                      : 'bg-surface text-text hover:bg-surface-elevated'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
