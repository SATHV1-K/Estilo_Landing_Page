// KidsLayout — uses the main Estilo Latino Header for brand continuity.
// A fixed blue context strip below the main header carries Kids-specific nav.

import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { KidsPageBackground } from './KidsDoodles';
import { Header } from '../layout/Header';

const KIDS_BG      = '#4A6FA5';
const KIDS_TEXT    = '#2D3D6B';
const KIDS_NAV_BG  = 'rgb(240,191,113)';
const KIDS_NAV_INK = '#2D1A00';

const NAV = [
  { to: '/kids',              label: 'Home',         end: true },
  { to: '/kids/about',        label: 'About',        end: false },
  { to: '/kids/schedule',     label: 'Schedule',     end: false },
  { to: '/kids/achievements', label: 'Achievements', end: false },
  { to: '/kids/gallery',      label: 'Gallery',      end: false },
];

// ─── Kids Context Strip ───────────────────────────────────────────────────────
// Fixed bar positioned directly below the main header (top: 128px = h-32).
// Carries Kids-specific sub-navigation so the main header stays clean.

function KidsContextStrip() {
  return (
    <div
      className="fixed left-0 right-0 z-40 flex items-center overflow-hidden"
      style={{ top: '128px', height: '56px', backgroundColor: KIDS_NAV_BG, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full flex items-center gap-1 overflow-x-auto">
        <span
          className="font-display text-xs uppercase tracking-widest mr-3 whitespace-nowrap flex-shrink-0 hidden sm:inline"
          style={{ color: `${KIDS_NAV_INK}99` }}
        >
          🐝 Estilo Kids
        </span>
        <div className="w-px h-4 mr-2 flex-shrink-0 hidden sm:block" style={{ backgroundColor: `${KIDS_NAV_INK}30` }} />
        {NAV.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => [
              'px-3.5 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex-shrink-0',
              isActive
                ? 'bg-white/40 text-[#2D1A00]'
                : 'hover:bg-white/20',
            ].join(' ')}
            style={({ isActive }) => ({ color: isActive ? KIDS_NAV_INK : `${KIDS_NAV_INK}BB` })}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
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
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Nurturing young dancers with joy, rhythm, and passion.
            </p>
            {/* Prominent parent brand link */}
            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Part of
              </p>
              <Link
                to="/"
                className="font-display text-lg uppercase tracking-wide transition-opacity hover:opacity-75"
                style={{ color: '#f0bf71' }}
              >
                Estilo Latino Dance Company →
              </Link>
            </div>
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

const KIDS_TITLES: Record<string, string> = {
  '/kids':              'Estilo Kids | Latin Rhythms for Kids',
  '/kids/about':        'About | Estilo Kids',
  '/kids/schedule':     'Schedule | Estilo Kids',
  '/kids/achievements': 'Achievements | Estilo Kids',
  '/kids/gallery':      'Gallery | Estilo Kids',
};

export function KidsLayout() {
  const location = useLocation();

  useEffect(() => {
    const title = KIDS_TITLES[location.pathname];
    if (title) document.title = title;
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: KIDS_BG, isolation: 'isolate' }}>
      <KidsPageBackground />
      {/* Main Estilo Latino header — same chrome as the main site */}
      <Header />
      {/* Blue context strip for Kids-specific navigation, sits below main header */}
      <KidsContextStrip />
      {/* pt-[184px] = h-32 main header (128px) + 56px context strip */}
      <main className="flex-1 pt-[184px]">
        <Outlet />
      </main>
      <KidsFooter />
    </div>
  );
}
