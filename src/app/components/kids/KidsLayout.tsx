// KidsLayout — separate blue-theme layout for all /kids/* pages.
// Has its own header and footer; completely independent of the main dark Layout.

import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KidsPageBackground } from './KidsDoodles';

const KIDS_BG    = '#4A6FA5';
const KIDS_TEXT  = '#2D3D6B';
const KIDS_CREAM = '#FFF8E7';

const NAV = [
  { to: '/kids',              label: 'Home',         end: true },
  { to: '/kids/about',        label: 'About',        end: false },
  { to: '/kids/schedule',     label: 'Schedule',     end: false },
  { to: '/kids/achievements', label: 'Achievements', end: false },
  { to: '/kids/gallery',      label: 'Gallery',      end: false },
];

// ─── Kids Header ─────────────────────────────────────────────────────────────

function KidsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: KIDS_BG, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-24 py-4">
          {/* Logo */}
          <Link to="/kids" className="flex items-center flex-shrink-0 group">
            <img
              src="/estilo_bee.png"
              alt="Estilo Kids"
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors',
                    isActive
                      ? 'text-kids-text font-bold'
                      : 'text-white/80 hover:text-kids-yellow',
                  ].join(' ')
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: '#f0bf71' } : {}
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Main site link */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              Main Site →
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <div className="flex flex-col gap-1.5">
                {NAV.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        'px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider w-full',
                        isActive
                          ? 'text-kids-text'
                          : 'text-white/80',
                      ].join(' ')
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { backgroundColor: '#f0bf71' }
                        : { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-white/50 text-center mt-1"
                  style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                >
                  ← Back to Main Site
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ─── Kids Footer ─────────────────────────────────────────────────────────────

function KidsFooter() {
  return (
    <footer style={{ backgroundColor: KIDS_TEXT }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-3">
              <img src="/estilo_bee.png" alt="Estilo Kids" className="h-28 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Part of Estilo Latino Dance Company. Nurturing young dancers with joy, rhythm, and passion.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ color: '#f0bf71' }}
            >
              Main Site →
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-base tracking-wider text-white uppercase mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+12018788977"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <Phone size={14} /> +1 (201) 878-8977
              </a>
              <a
                href="mailto:info@EstiloLatinoDance.com"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <Mail size={14} /> info@EstiloLatinoDance.com
              </a>
              <span className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                345 Morris Ave Ste 1B, Elizabeth, NJ 07208
              </span>
            </div>
          </div>

          {/* Quick links + social */}
          <div>
            <h3 className="font-display text-base tracking-wider text-white uppercase mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 mb-5">
              {NAV.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/estilolatinodance"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/estilolatinodance"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-xs text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
        >
          © {new Date().getFullYear()} Estilo Latino Dance Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── KidsLayout ───────────────────────────────────────────────────────────────

export function KidsLayout() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: KIDS_BG, isolation: 'isolate' }}>
      <KidsPageBackground />
      <KidsHeader />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <KidsFooter />
    </div>
  );
}
