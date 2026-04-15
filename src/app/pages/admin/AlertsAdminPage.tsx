// AlertsAdminPage — manage site-wide announcement alerts.
// The active alert with the lowest sortOrder is shown in the AnnouncementBar.

import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, X, Check,
  ChevronUp, ChevronDown, Bell, Info,
  AlertTriangle, Sparkles,
} from 'lucide-react';
import {
  getAlerts, saveAlert, deleteAlert, reorderAlerts,
  type Alert,
} from '../../../lib/adminData';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:  'max-w-4xl mx-auto px-4 sm:px-6 py-8',
  card:  'bg-white rounded-xl border border-gray-200 shadow-sm',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  btn: {
    gold:  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90',
    ghost: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors',
    icon:  'p-2 rounded-lg transition-colors',
  },
};

const ALERT_TYPES: { value: Alert['type']; label: string; color: string; Icon: React.ElementType }[] = [
  { value: 'info',    label: 'Info',    color: '#3B82F6', Icon: Info          },
  { value: 'warning', label: 'Warning', color: '#F59E0B', Icon: AlertTriangle },
  { value: 'promo',   label: 'Promo',   color: '#F6B000', Icon: Sparkles      },
];

function alertTypeConfig(type: Alert['type']) {
  return ALERT_TYPES.find(t => t.value === type) ?? ALERT_TYPES[0];
}

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyAlert(): Omit<Alert, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: '', titleEs: '',
    message: '', messageEs: '',
    type: 'info',
    link: '', linkLabel: '',
    startDate: '', endDate: '',
    isActive: true,
    sortOrder: 999,
  };
}

type AlertForm = Omit<Alert, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string };

// ─── Form Panel ───────────────────────────────────────────────────────────────

function AlertFormPanel({
  alert,
  onSave,
  onClose,
}: {
  alert: Alert | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const isNew = !alert;
  const [form, setForm] = useState<AlertForm>(
    alert
      ? { ...alert }
      : emptyAlert()
  );
  const [langTab, setLangTab] = useState<'en' | 'es'>('en');
  const [errors, setErrors]   = useState<Record<string, string>>({});

  function set<K extends keyof AlertForm>(key: K, val: AlertForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    saveAlert(form);
    onSave();
  }

  const typeConf = alertTypeConfig(form.type);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'New Alert' : 'Edit Alert'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form id="alert-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Title + Message with EN/ES tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Announcement Text *</label>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                {(['en', 'es'] as const).map(l => (
                  <button key={l} type="button" onClick={() => setLangTab(l)}
                    className="px-3 py-1 text-xs font-bold transition-colors"
                    style={langTab === l ? { background: `${GOLD}22`, color: '#92700B' } : { color: '#9CA3AF' }}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <textarea
              rows={2}
              value={langTab === 'en' ? form.title : form.titleEs}
              onChange={e => langTab === 'en' ? set('title', e.target.value) : set('titleEs', e.target.value)}
              className={S.input}
              placeholder={`Headline shown in announcement bar & popup title (${langTab === 'en' ? 'English' : 'Spanish'})…`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Message body */}
          <div>
            <label className={S.label}>
              Popup Message Body
              <span className="ml-1.5 font-normal normal-case text-gray-400">(optional — shown below title in popup)</span>
            </label>
            <textarea
              rows={3}
              value={langTab === 'en' ? form.message : form.messageEs}
              onChange={e => langTab === 'en' ? set('message', e.target.value) : set('messageEs', e.target.value)}
              className={S.input}
              placeholder={`Longer description shown in the popup modal (${langTab === 'en' ? 'English' : 'Spanish'})…`}
            />
          </div>

          {/* Type */}
          <div>
            <label className={S.label}>Type</label>
            <div className="grid grid-cols-3 gap-2">
              {ALERT_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set('type', t.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                    form.type === t.value ? 'border-current' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                  style={form.type === t.value ? { color: t.color, background: `${t.color}10` } : {}}
                >
                  <t.Icon size={18} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>Link URL</label>
              <input
                type="text"
                value={form.link ?? ''}
                onChange={e => set('link', e.target.value)}
                className={S.input}
                placeholder="/packages or https://…"
              />
            </div>
            <div>
              <label className={S.label}>Link Label</label>
              <input
                type="text"
                value={form.linkLabel ?? ''}
                onChange={e => set('linkLabel', e.target.value)}
                className={S.input}
                placeholder="e.g. Learn More"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>Start Date</label>
              <input
                type="date"
                value={form.startDate ?? ''}
                onChange={e => set('startDate', e.target.value)}
                className={S.input}
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank to show immediately</p>
            </div>
            <div>
              <label className={S.label}>End Date</label>
              <input
                type="date"
                value={form.endDate ?? ''}
                onChange={e => set('endDate', e.target.value)}
                className={S.input}
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank for no expiration</p>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ background: form.isActive ? GOLD : '#E5E7EB' }}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-gray-700 font-semibold">
              {form.isActive ? 'Active — shown as popup & in announcement bar' : 'Inactive — hidden from site'}
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost}>Cancel</button>
          <button
            form="alert-form"
            type="submit"
            className={S.btn.gold}
            style={{ background: GOLD, color: '#0A0A0A' }}
          >
            <Check size={15} />
            {isNew ? 'Add Alert' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Alert Row ────────────────────────────────────────────────────────────────

function AlertRow({
  alert,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  alert: Alert;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const typeConf = alertTypeConfig(alert.type);

  return (
    <div className="flex items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Up/down */}
      <div className="flex flex-col justify-center border-r border-gray-100 px-1 self-stretch">
        <button onClick={onMoveUp} disabled={isFirst} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronUp size={14} />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Type icon */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${typeConf.color}18` }}>
          <typeConf.Icon size={15} style={{ color: typeConf.color }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-3">
        <p className="text-sm font-semibold text-gray-900 truncate">{alert.title}</p>
        <div className="flex items-center gap-3 mt-0.5">
          {alert.link && (
            <span className="text-xs text-gray-400 truncate">→ {alert.link}</span>
          )}
          {(alert.startDate || alert.endDate) && (
            <span className="text-xs text-gray-400">
              {alert.startDate && `From ${alert.startDate}`}
              {alert.startDate && alert.endDate && ' '}
              {alert.endDate && `Until ${alert.endDate}`}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mr-2 ${alert.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
        {alert.isActive ? 'Active' : 'Off'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 pr-3 flex-shrink-0">
        <button onClick={onEdit} className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`} title="Edit">
          <Pencil size={15} />
        </button>
        <button onClick={onDelete} className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`} title="Delete">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── AlertsAdminPage ──────────────────────────────────────────────────────────

export function AlertsAdminPage() {
  const [alerts, setAlerts]     = useState<Alert[]>([]);
  const [editing, setEditing]   = useState<Alert | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  function load() { setAlerts(getAlerts()); }
  useEffect(load, []);

  function openNew()         { setEditing(null); setPanelOpen(true); }
  function openEdit(a: Alert) { setEditing(a); setPanelOpen(true); }
  function closePanel()      { setPanelOpen(false); setEditing(null); }
  function afterSave()       { load(); closePanel(); }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete alert "${title}"?`)) return;
    deleteAlert(id);
    load();
  }

  function moveUp(id: string) {
    const ids = alerts.map(a => a.id);
    const idx = ids.indexOf(id);
    if (idx > 0) {
      [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
      reorderAlerts(ids);
      load();
    }
  }

  function moveDown(id: string) {
    const ids = alerts.map(a => a.id);
    const idx = ids.indexOf(id);
    if (idx < ids.length - 1) {
      [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
      reorderAlerts(ids);
      load();
    }
  }

  const activeCount = alerts.filter(a => a.isActive).length;

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Bell size={20} style={{ color: GOLD }} />
            <h1 className="text-xl font-black text-gray-900">Alerts</h1>
          </div>
          <p className="text-sm text-gray-500">
            Site-wide announcement alerts displayed in the top bar.{' '}
            {activeCount > 0
              ? `The first active alert is currently showing on the site.`
              : 'No active alerts — the announcement bar is hidden.'}
          </p>
        </div>
        <button onClick={openNew} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
          <Plus size={16} /> Add Alert
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <p>
          Alerts are shown in priority order (top = highest priority). Only the most recent active alert
          within its date range is displayed — as a popup modal when visitors arrive and in the announcement bar.{' '}
          {activeCount > 1 && (
            <strong>Warning: {activeCount} alerts are active — only the first will be shown to visitors.</strong>
          )}
        </p>
      </div>

      {/* Alert list */}
      <div className={S.card}>
        {alerts.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-500">No alerts yet.</p>
            <button
              onClick={openNew}
              className="mt-3 flex items-center gap-2 mx-auto text-sm font-semibold text-amber-600 hover:text-amber-800"
            >
              <Plus size={14} /> Create your first alert
            </button>
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isFirst={idx === 0}
              isLast={idx === alerts.length - 1}
              onEdit={() => openEdit(alert)}
              onDelete={() => handleDelete(alert.id, alert.title)}
              onMoveUp={() => moveUp(alert.id)}
              onMoveDown={() => moveDown(alert.id)}
            />
          ))
        )}
      </div>

      {/* Slide-out panel */}
      {panelOpen && (
        <AlertFormPanel
          alert={editing}
          onSave={afterSave}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
