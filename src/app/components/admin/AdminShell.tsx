// AdminShell — sidebar layout wrapper for all admin pages.
// Handles authentication gate; all admin routes render inside this shell.

import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  LayoutDashboard, Sparkles, FileText, Image, Users,
  Layers, Calendar, Star, LogOut, Menu, X, ChevronRight,
  Package, Settings,
} from 'lucide-react';
import { isAdminLoggedIn, adminLogin, adminLogout } from '../../../lib/specialClasses';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
};

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/admin',                 label: 'Dashboard',       icon: LayoutDashboard, exact: true },
  { to: '/admin/content',         label: 'Content',         icon: FileText },
  { to: '/admin/media',           label: 'Media',           icon: Image },
  { to: '/admin/instructors',     label: 'Instructors',     icon: Users },
  { to: '/admin/styles',          label: 'Styles',          icon: Layers },
  { to: '/admin/schedule',        label: 'Schedule',        icon: Calendar },
  { to: '/admin/special-classes', label: 'Special Classes', icon: Sparkles },
  { to: '/admin/reviews',         label: 'Reviews',         icon: Star },
  { to: '/admin/packages',        label: 'Packages',        icon: Package },
  { to: '/admin/settings',        label: 'Settings',        icon: Settings },
] as const;

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (adminLogin(pw)) {
      onLogin();
    } else {
      setError('Incorrect password. Try again.');
      setPw('');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-10 w-full max-w-sm">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6"
          style={{ background: GOLD }}
        >
          <Sparkles size={28} color="#0A0A0A" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 text-center mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Estilo Latino Dance Company</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className={S.label}>Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              className={S.input}
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
            style={{ background: GOLD, color: '#0A0A0A' }}
          >
            Sign In →
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-6">
          Password set in <code className="bg-gray-100 px-1 rounded">src/lib/specialClasses.ts</code>
        </p>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  onLogout,
  onClose,
}: {
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: GOLD }}
          >
            <Sparkles size={16} color="#0A0A0A" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 leading-none">Admin</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">Estilo Latino</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, ...rest }) => {
          const exact = (rest as { exact?: boolean }).exact ?? false;
          return (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors mb-0.5',
                  isActive
                    ? 'border-l-2 border-[#F6B000] bg-[#F6B000]/10 text-[#F6B000] rounded-r-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={isActive ? '' : 'text-gray-500'}
                    style={isActive ? { color: GOLD } : {}}
                  />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} style={{ color: GOLD }} />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} className="text-gray-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── AdminShell ───────────────────────────────────────────────────────────────

export function AdminShell() {
  const [authed,       setAuthed]      = useState(isAdminLoggedIn);
  const [mobileSidebarOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Keep auth state in sync across tabs
  useEffect(() => {
    const handler = () => setAuthed(isAdminLoggedIn());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  function handleLogout() {
    adminLogout();
    setAuthed(false);
    navigate('/admin');
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-56 lg:hidden">
            <Sidebar onLogout={handleLogout} onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-56 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: GOLD }}
          >
            <Sparkles size={14} color="#0A0A0A" />
          </div>
          <span className="text-sm font-black text-gray-900">Admin Panel</span>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
