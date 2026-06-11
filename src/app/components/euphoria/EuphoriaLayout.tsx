// EuphoriaLayout — uses the main Estilo Latino Header for brand continuity.
// A dark context strip with pink accents sits below the main header for Euphoria nav.
// EuphoriaAuditionContext is still provided here so child pages can open the modal.

import { useState, useEffect, useContext, createContext } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { EuphoriaAuditionModal } from './EuphoriaAuditionModal';
import { getAuditionsActive } from '../../../lib/euphoriaAuditionsService';
import { Header } from '../layout/Header';

const EL_PINK = '#E83A7E';
const EL_BG = '#0A0A0A';
const EL_SURFACE = '#111111';
const EL_BORDER = '#252525';

const HASH_SECTION_IDS = ['about', 'story', 'auditions'] as const;

const NAV = [
  { to: '/euphoria-ladies',               label: 'Home',         end: true,  hash: false },
  { to: '/euphoria-ladies#about',         label: 'About',        end: false, hash: true  },
  { to: '/euphoria-ladies#story',         label: 'Our Story',    end: false, hash: true  },
  { to: '/euphoria-ladies#auditions',     label: 'Auditions',    end: false, hash: true  },
  { to: '/euphoria-ladies/gallery',       label: 'Gallery',      end: false, hash: false },
  { to: '/euphoria-ladies/testimonials',  label: 'Voices',       end: false, hash: false },
];

// ─── Audition modal context ───────────────────────────────────────────────────

interface AuditionContextValue {
  openAuditionModal: () => void;
}

export const EuphoriaAuditionContext = createContext<AuditionContextValue>({
  openAuditionModal: () => {},
});

export function useAuditionModal() {
  return useContext(EuphoriaAuditionContext);
}

// ─── Euphoria Context Strip ───────────────────────────────────────────────────
// Fixed bar positioned directly below the main header (top: 128px = h-32).
// Dark background with pink accent carries Euphoria-specific nav + auditions CTA.

function EuphoriaContextStrip({ onJoinAuditions }: { onJoinAuditions: () => void }) {
  const [activeHash, setActiveHash] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/euphoria-ladies') {
      setActiveHash('');
      return;
    }
    const handleScroll = () => {
      const offset = 200; // accounts for taller combined header+strip
      let current = '';
      for (const id of HASH_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          current = `/euphoria-ladies#${id}`;
        }
      }
      setActiveHash(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  function scrollToSection(anchor: string) {
    if (location.pathname === '/euphoria-ladies') {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/euphoria-ladies', { state: { scrollTo: anchor } });
    }
  }

  function isNavActive(to: string, hash: boolean, end: boolean): boolean {
    if (hash) return activeHash === to;
    if (end) return location.pathname === '/euphoria-ladies' && !activeHash;
    return location.pathname === to;
  }

  function navCls(active: boolean) {
    return [
      'px-3.5 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0',
      active
        ? 'bg-white'
        : 'text-white/80 hover:text-white hover:bg-white/15',
    ].join(' ');
  }

  return (
    <div
      className="fixed left-0 right-0 z-40 flex items-center overflow-hidden"
      style={{
        top: '128px',
        height: '56px',
        backgroundColor: EL_PINK,
        boxShadow: '0 2px 12px rgba(232,58,126,0.35)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full flex items-center gap-1 overflow-x-auto">
        <span className="font-display text-xs text-white/70 uppercase tracking-widest mr-3 whitespace-nowrap flex-shrink-0 hidden sm:inline">
          💃 Euphoria Ladies
        </span>
        <div className="w-px h-4 bg-white/30 mr-2 flex-shrink-0 hidden sm:block" />

        {NAV.map(({ to, label, end, hash }) => {
          const active = isNavActive(to, hash, end);
          return hash ? (
            <a
              key={to}
              href={to}
              onClick={e => { e.preventDefault(); scrollToSection(to.split('#')[1]); }}
              className={navCls(active)}
              style={active ? { color: EL_PINK } : {}}
            >
              {label}
            </a>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={() => navCls(active)}
              style={() => active ? { color: EL_PINK } : {}}
            >
              {label}
            </NavLink>
          );
        })}

        {/* Join Auditions CTA — desktop only, pinned to right */}
        <button
          type="button"
          onClick={onJoinAuditions}
          className="hidden md:inline-flex items-center gap-1.5 ml-auto px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: '#ffffff',
            color: EL_PINK,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)'; }}
        >
          Join Auditions
        </button>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function EuphoriaFooter() {
  return (
    <footer style={{ backgroundColor: EL_SURFACE }}>
      {/* Pink gradient top border */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent 0%, ${EL_PINK} 25%, ${EL_PINK} 75%, transparent 100%)` }} />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <img
              src="/eupLadies.png"
              alt="Euphoria Ladies"
              className="h-54 w-auto object-contain mb-3"
              style={{ filter: 'drop-shadow(0 0 8px rgba(232,58,126,0.15))' }}
            />
            <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              A high-performance ladies training team.
              Building dancers, champions, performers, and confident women since 2018.
            </p>
            {/* Prominent parent brand link */}
            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Part of
              </p>
              <Link
                to="/"
                className="font-display text-lg uppercase tracking-wide transition-opacity hover:opacity-75"
                style={{ color: EL_PINK }}
              >
                Estilo Latino Dance Company →
              </Link>
            </div>
          </div>

          {/* Quick links + Contact */}
          <div>
            <h3 className="font-display text-sm tracking-wider text-white uppercase mb-5">Quick Links</h3>
            <div className="flex flex-col gap-2.5 mb-6">
              {NAV.map(({ to, label, hash }) => (
                hash ? (
                  <a
                    key={to}
                    href={to}
                    className="font-body text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={to}
                    to={to}
                    className="font-body text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-display text-sm tracking-wider text-white uppercase mb-5">Connect</h3>
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="tel:+12018788977"
                className="flex items-center gap-2.5 font-body text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <Phone size={13} style={{ color: EL_PINK, flexShrink: 0 }} />
                +1 (201) 878-8977
              </a>
              <a
                href="mailto:info@EstiloLatinoDance.com"
                className="flex items-center gap-2.5 font-body text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <Mail size={13} style={{ color: EL_PINK, flexShrink: 0 }} />
                info@EstiloLatinoDance.com
              </a>
              <span className="flex items-start gap-2.5 font-body text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: EL_PINK }} />
                345 Morris Ave Ste 1B, Elizabeth, NJ 07208
              </span>
            </div>
            <div className="flex gap-2.5">
              {[
                { icon: Instagram, href: 'https://instagram.com/estilolatinodance', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/estilolatinodance', label: 'Facebook' },
                { icon: Youtube, href: 'https://youtube.com/@estilolatinodance', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(232,58,126,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                    border: `1px solid rgba(232,58,126,0.18)`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = EL_PINK;
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                    (e.currentTarget as HTMLElement).style.borderColor = EL_PINK;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(232,58,126,0.1)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,58,126,0.18)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs"
          style={{ borderTop: `1px solid ${EL_BORDER}`, color: 'rgba(255,255,255,0.2)' }}
        >
          <span className="font-body">© {new Date().getFullYear()} Euphoria Ladies by Estilo Latino Dance Company. All rights reserved.</span>
          <div className="flex gap-4 font-body">
            <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/40 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── EuphoriaLayout ───────────────────────────────────────────────────────────

const EUPHORIA_TITLES: Record<string, string> = {
  '/euphoria-ladies':               'Euphoria Ladies | Estilo Latino Dance Company',
  '/euphoria-ladies/gallery':       'Gallery | Euphoria Ladies',
  '/euphoria-ladies/testimonials':  'Dancer Voices | Euphoria Ladies',
};

export function EuphoriaLayout() {
  const location = useLocation();
  const [modalOpen, setModalOpen]       = useState(false);
  const [isActive, setIsActive]         = useState(false);
  const [activeLoaded, setActiveLoaded] = useState(false);

  useEffect(() => {
    const title = EUPHORIA_TITLES[location.pathname];
    if (title) document.title = title;
  }, [location.pathname]);

  useEffect(() => {
    getAuditionsActive()
      .then(v => setIsActive(v))
      .catch(() => setIsActive(false))
      .finally(() => setActiveLoaded(true));
  }, []);

  function handleOpenModal() {
    getAuditionsActive()
      .then(v => setIsActive(v))
      .catch(() => {})
      .finally(() => setModalOpen(true));
  }

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location.state]);

  return (
    <EuphoriaAuditionContext.Provider value={{ openAuditionModal: handleOpenModal }}>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: EL_BG, color: '#E8E8E8', overflowX: 'clip' }}
      >
        {/* Main Estilo Latino header — same chrome as the main site */}
        <Header />
        {/* Dark context strip for Euphoria-specific navigation, sits below main header */}
        <EuphoriaContextStrip onJoinAuditions={handleOpenModal} />
        {/* pt-[184px] = h-32 main header (128px) + 56px context strip */}
        <main className="flex-1 pt-[184px]">
          <Outlet />
        </main>
        <EuphoriaFooter />

        {activeLoaded && (
          <EuphoriaAuditionModal
            isOpen={modalOpen}
            isActive={isActive}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </EuphoriaAuditionContext.Provider>
  );
}
