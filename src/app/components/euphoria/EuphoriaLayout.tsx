// EuphoriaLayout — dark layout for all /euphoria-ladies/* pages.
// Primary accent: #E83A7E (hot pink). Black (#0A0A0A) background.
// Provides EuphoriaAuditionContext so any child can call openAuditionModal().

import { useState, useEffect, useContext, createContext } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EuphoriaAuditionModal } from './EuphoriaAuditionModal';
import { getAuditionsActive } from '../../../lib/euphoriaAuditionsService';

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

// ─── Header ───────────────────────────────────────────────────────────────────

function EuphoriaHeader({ onJoinAuditions }: { onJoinAuditions: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/euphoria-ladies') {
      setActiveHash('');
      return;
    }
    const handleScroll = () => {
      const offset = 120;
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

  useEffect(() => { setOpen(false); }, [location]);

  function scrollToSection(anchor: string) {
    if (location.pathname === '/euphoria-ladies') {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/euphoria-ladies', { state: { scrollTo: anchor } });
    }
  }

  function isActive(to: string, hash: boolean, end: boolean): boolean {
    if (hash) return activeHash === to;
    if (end) return location.pathname === '/euphoria-ladies' && !activeHash;
    return location.pathname === to;
  }

  function navCls(active: boolean) {
    return [
      'px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap',
      active
        ? 'text-white'
        : 'text-white/60 hover:text-white hover:bg-white/8',
    ].join(' ');
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? `1px solid rgba(232,58,126,0.15)`
          : '1px solid transparent',
        boxShadow: scrolled ? `0 1px 0 rgba(232,58,126,0.08)` : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/euphoria-ladies" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="/eupLadies.png"
              alt="Euphoria Ladies"
              className="h-54 w-auto object-contain transition-all duration-300 group-hover:opacity-90"
              style={{ filter: 'drop-shadow(0 0 8px rgba(232,58,126,0.2))' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, end, hash }) => {
              const active = isActive(to, hash, end);
              return hash ? (
                <a
                  key={to}
                  href={to}
                  onClick={e => { e.preventDefault(); scrollToSection(to.split('#')[1]); }}
                  className={navCls(active)}
                  style={active ? { backgroundColor: EL_PINK } : {}}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => {
                    if (location.pathname === '/euphoria-ladies') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={() => navCls(active)}
                  style={() => active ? { backgroundColor: EL_PINK } : {}}
                >
                  {label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Join Auditions CTA — opens modal */}
            <button
              type="button"
              onClick={onJoinAuditions}
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: EL_PINK,
                boxShadow: `0 4px 20px rgba(232,58,126,0.35)`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(232,58,126,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,58,126,0.35)'; }}
            >
              Join Auditions
            </button>

            {/* Main site link */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors"
            >
              Main Site <ArrowUpRight size={10} />
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-white/60 hover:text-white transition-colors"
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
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden pb-5 overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 pt-2">
                {NAV.map(({ to, label, end, hash }) => {
                  const active = isActive(to, hash, end);
                  return hash ? (
                    <a
                      key={to}
                      href={to}
                      onClick={e => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToSection(to.split('#')[1]), 100); }}
                      className="px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
                      style={{
                        backgroundColor: active ? EL_PINK : 'rgba(255,255,255,0.06)',
                        color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                      }}
                    >
                      {label}
                    </a>
                  ) : (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
                      style={() => ({
                        backgroundColor: active ? EL_PINK : 'rgba(255,255,255,0.06)',
                        color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                      })}
                    >
                      {label}
                    </NavLink>
                  );
                })}
                {/* Mobile Join Auditions — opens modal */}
                <button
                  type="button"
                  onClick={() => { setOpen(false); onJoinAuditions(); }}
                  className="px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white text-center mt-1"
                  style={{ backgroundColor: EL_PINK, boxShadow: '0 4px 20px rgba(232,58,126,0.3)' }}
                >
                  Join Auditions
                </button>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-white/35 text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
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
              A high-performance ladies training team by Estilo Latino Dance Company.
              Building dancers, champions, performers, and confident women since 2018.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-80"
              style={{ color: EL_PINK }}
            >
              Estilo Latino Dance Company <ArrowUpRight size={12} />
            </Link>
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
  const [modalOpen, setModalOpen]     = useState(false);
  const [isActive, setIsActive]       = useState(false);
  const [activeLoaded, setActiveLoaded] = useState(false);

  useEffect(() => {
    const title = EUPHORIA_TITLES[location.pathname];
    if (title) document.title = title;
  }, [location.pathname]);

  // Load auditions active status once
  useEffect(() => {
    getAuditionsActive()
      .then(v => setIsActive(v))
      .catch(() => setIsActive(false))
      .finally(() => setActiveLoaded(true));
  }, []);

  // Re-fetch active status whenever modal opens to stay in sync
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
        <EuphoriaHeader onJoinAuditions={handleOpenModal} />
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
        <EuphoriaFooter />

        {/* Audition modal — rendered at layout level so it's available on all sub-pages */}
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
