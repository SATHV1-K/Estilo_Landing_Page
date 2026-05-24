// Admin — Euphoria Ladies Audition Applications
// Toggle auditions active/inactive and view/manage all submissions.

import { useState, useEffect, useCallback } from 'react';
import {
  ToggleLeft, ToggleRight, Trash2, Loader2, RefreshCw,
  Users, Mail, Phone, MessageSquare, CheckCircle, Clock, PhoneCall,
} from 'lucide-react';
import {
  getAuditionApplications,
  updateApplicationStatus,
  deleteApplication,
  getAuditionsActive,
  setAuditionsActive,
} from '../../../../lib/euphoriaAuditionsService';
import type { EuphoriaAuditionApplication } from '../../../../lib/types';

const PINK = '#CE1868';

const S = {
  page:     'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:     'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-5',
  cardHead: 'px-5 py-4 border-b border-gray-100 flex items-center justify-between',
  cardBody: 'px-5 py-5',
  title:    'text-sm font-black uppercase tracking-wider text-gray-900',
  badge:    (color: string) => `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`,
};

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  new:       { label: 'New',       cls: 'bg-pink-100 text-pink-700',   icon: Clock },
  reviewed:  { label: 'Reviewed',  cls: 'bg-yellow-100 text-yellow-700', icon: CheckCircle },
  contacted: { label: 'Contacted', cls: 'bg-green-100 text-green-700',  icon: PhoneCall },
};

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// ─── Application card ─────────────────────────────────────────────────────────

function ApplicationCard({
  app,
  onStatusChange,
  onDelete,
}: {
  app: EuphoriaAuditionApplication;
  onStatusChange: (id: string, s: 'new' | 'reviewed' | 'contacted') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.new;
  const StatusIcon = cfg.icon;

  async function changeStatus(s: 'new' | 'reviewed' | 'contacted') {
    setUpdating(true);
    await onStatusChange(app.id, s).finally(() => setUpdating(false));
  }

  async function handleDelete() {
    if (!confirm(`Delete application from ${app.fullName}? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(app.id).finally(() => setDeleting(false));
  }

  return (
    <div className={['border rounded-xl overflow-hidden transition-all', app.status === 'new' ? 'border-pink-200 bg-pink-50/30' : 'border-gray-200'].join(' ')}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/60 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
          style={{ backgroundColor: PINK }}
        >
          {app.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-900 truncate">{app.fullName}</span>
            <span className={S.badge(cfg.cls)}>
              <StatusIcon size={10} /> {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1"><Mail size={10} />{app.email}</span>
            <span className="flex items-center gap-1"><Phone size={10} />{app.phone}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{formatDate(app.createdAt)}</span>
        <span className="text-gray-400 flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <Mail size={10} className="inline mr-1" />Email
              </p>
              <a href={`mailto:${app.email}`} className="text-sm text-blue-600 hover:underline break-all">{app.email}</a>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <Phone size={10} className="inline mr-1" />Phone
              </p>
              <a href={`tel:${app.phone}`} className="text-sm text-blue-600 hover:underline">{app.phone}</a>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <MessageSquare size={10} className="inline mr-1" />About Themselves
              </p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-wrap">{app.about}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Submitted</p>
              <p className="text-sm text-gray-600">{formatDate(app.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Status:</span>
              {(['new', 'reviewed', 'contacted'] as const).map(s => {
                const c = STATUS_CONFIG[s];
                const CIcon = c.icon;
                return (
                  <button
                    key={s}
                    disabled={updating || app.status === s}
                    onClick={() => changeStatus(s)}
                    className={[
                      'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all',
                      app.status === s
                        ? c.cls
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40',
                    ].join(' ')}
                  >
                    {updating && app.status !== s ? <Loader2 size={9} className="animate-spin" /> : <CIcon size={9} />}
                    {c.label}
                  </button>
                );
              })}
            </div>
            <button
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EuphoriaAuditionsAdminPage() {
  const [apps, setApps]           = useState<EuphoriaAuditionApplication[]>([]);
  const [isActive, setIsActive]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState(false);
  const [filter, setFilter]       = useState<'all' | 'new' | 'reviewed' | 'contacted'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [apps, active] = await Promise.all([
        getAuditionApplications(),
        getAuditionsActive(),
      ]);
      setApps(apps);
      setIsActive(active);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleToggle() {
    setToggling(true);
    try {
      await setAuditionsActive(!isActive);
      setIsActive(a => !a);
    } finally {
      setToggling(false);
    }
  }

  async function handleStatusChange(id: string, status: 'new' | 'reviewed' | 'contacted') {
    await updateApplicationStatus(id, status);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  async function handleDelete(id: string) {
    await deleteApplication(id);
    setApps(prev => prev.filter(a => a.id !== id));
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);
  const counts = {
    all:       apps.length,
    new:       apps.filter(a => a.status === 'new').length,
    reviewed:  apps.filter(a => a.status === 'reviewed').length,
    contacted: apps.filter(a => a.status === 'contacted').length,
  };

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full inline-block" style={{ backgroundColor: PINK }} />
            Audition Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage Euphoria Ladies audition submissions and toggle accepting applications.</p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Active status toggle card */}
      <div className={S.card}>
        <div className={S.cardHead}>
          <span className={S.title}>Audition Status</span>
          <span className="text-xs text-gray-400">Controls whether the public can submit applications</span>
        </div>
        <div className={S.cardBody}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Accept Applications
              </p>
              <p className="text-xs text-gray-500">
                {isActive
                  ? 'Auditions are OPEN — the application form is active for the public.'
                  : 'Auditions are CLOSED — visitors will see a "not accepting applications" message.'}
              </p>
            </div>
            <button
              onClick={handleToggle}
              disabled={toggling}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: isActive ? '#22C55E' : '#E5E7EB',
                color: isActive ? '#fff' : '#374151',
              }}
            >
              {toggling
                ? <Loader2 size={18} className="animate-spin" />
                : isActive
                  ? <ToggleRight size={22} />
                  : <ToggleLeft size={22} />}
              {isActive ? 'Accepting Applications' : 'Not Accepting Applications'}
            </button>
          </div>
          {isActive && (
            <div
              className="mt-4 flex items-center gap-2 text-xs rounded-lg px-4 py-2.5"
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#16A34A' }}
            >
              <CheckCircle size={13} />
              Auditions are currently open. Applications submitted by the public will appear below.
            </div>
          )}
        </div>
      </div>

      {/* Applications list */}
      <div className={S.card}>
        <div className={S.cardHead}>
          <span className={S.title} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} style={{ color: PINK }} /> Submissions
          </span>
          <span className="text-xs font-semibold" style={{ color: PINK }}>{apps.length} total</span>
        </div>

        {/* Filter pills */}
        <div className="px-5 pt-4 flex gap-2 flex-wrap">
          {(['all', 'new', 'reviewed', 'contacted'] as const).map(f => {
            const labels = { all: 'All', new: 'New', reviewed: 'Reviewed', contacted: 'Contacted' };
            const isSelected = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: isSelected ? PINK : '#F3F4F6',
                  color: isSelected ? '#fff' : '#6B7280',
                }}
              >
                {labels[f]} ({counts[f]})
              </button>
            );
          })}
        </div>

        <div className="px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading applications…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#FDF2F8' }}>
                <Users size={20} style={{ color: PINK }} />
              </div>
              <p className="text-sm font-semibold text-gray-500">No applications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                {filter === 'all'
                  ? 'Applications will appear here once the public submits them.'
                  : `No ${filter} applications.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(app => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
