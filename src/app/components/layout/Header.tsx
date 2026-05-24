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
  const { language } = useI18n();
  const location = useLocation();

  const navItems = [
    { path: '/', label: translations.nav.home[language] },
    { path: '/schedule', label: translations.nav.schedule[language] },
    { path: '/styles', label: translations.nav.styles[language] },
    { path: '/gallery', label: translations.nav.gallery[language] },
    { path: '/packages', label: translations.nav.packages[language] },
    { path: '/instructors', label: translations.nav.instructors[language] },
    { path: '/about', label: translations.nav.about[language] },
    { path: '/contact', label: translations.nav.contact[language] },
  ];

  const isKidsActive = location.pathname.startsWith('/kids');
  const isLadiesActive = location.pathname.startsWith('/euphoria-ladies');

  return (
    <motion.header
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border"
      style={{ boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
        <div className="flex items-center justify-between h-32">
          {/* Logo — container clips the whitespace borders in the PNG */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-start"
            style={{ height: '108px', overflow: 'hidden' }}
            onClick={() => {
              if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo.png"
              alt="Estilo Latino Dance Company"
              style={{
                height: '250px',
                width: 'auto',
                marginTop: '-70px',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavPill
                key={item.path}
                to={item.path}
                active={location.pathname === item.path}
                onClick={item.path === '/' && location.pathname === '/'
                  ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
                  : undefined}
              >
                {item.label}
              </NavPill>
            ))}

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-3 flex-shrink-0" />

            {/* Sub-brand pills */}
            <div className="flex items-center gap-3">
              <Link
                to="/kids"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isKidsActive ? 'bg-[#4A6FA5] text-white' : 'text-[#F6B000] border border-[#F6B000]/40 hover:bg-[#F6B000]/10'}`}
              >
                🐝 Kids
              </Link>
              <Link
                to="/euphoria-ladies"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isLadiesActive ? 'bg-[#CE1868] text-white' : 'text-[#CE1868] border border-[#CE1868]/40 hover:bg-[#CE1868]/10'}`}
              >
                💃 Ladies
              </Link>
            </div>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-5 ml-4">
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
                  className={`px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname === item.path
                    ? 'bg-gold text-ink'
                    : 'bg-surface text-text hover:bg-surface-elevated'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/kids"
                className={`px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${isKidsActive ? 'bg-[#4A6FA5] text-white' : 'bg-surface text-[#F6B000] hover:bg-surface-elevated'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                🐝 Estilo Kids
              </Link>
              <Link
                to="/euphoria-ladies"
                className={`px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${isLadiesActive ? 'bg-[#CE1868] text-white' : 'bg-surface text-[#CE1868] hover:bg-surface-elevated'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                💃 Euphoria Ladies
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
