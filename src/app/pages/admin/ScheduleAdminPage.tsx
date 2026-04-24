// ScheduleAdminPage — CRUD for recurring weekly schedule entries.
// Separate from Special Classes (handled by AdminPage → /admin/special-classes).

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Check, Calendar,
  ChevronUp, ChevronDown, RotateCcw, Loader2,
} from 'lucide-react';
import {
  getRecurringEntries, saveRecurringEntry, deleteRecurringEntry, resetRecurringToDefault,
  getOverviewEntries, saveOverviewEntry, deleteOverviewEntry, resetOverviewToDefault,
} from '../../../lib/scheduleService';
import { SEED_RECURRING, type RecurringEntry, type RecurringDay, type RecurringCategory } from '../../../lib/adminData';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const DAYS: RecurringDay[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

const DAY_LABELS: Record<RecurringDay, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

const CATEGORIES: RecurringCategory[] = [
  'kids', 'salsa', 'bachata', 'street', 'ballet', 'team', 'special',
];

const CATEGORY_COLORS: Record<RecurringCategory, string> = {
  kids:    'bg-purple-100 text-purple-700',
  salsa:   'bg-orange-100 text-orange-700',
  bachata: 'bg-red-100 text-red-700',
  street:  'bg-blue-100 text-blue-700',
  ballet:  'bg-pink-100 text-pink-700',
  team:    'bg-green-100 text-green-700',
  special: 'bg-amber-100 text-amber-700',
};

const S = {
  page:  'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:  'bg-white rounded-xl border border-gray-200 shadow-sm',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
  btn: {
    gold:  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90',
    ghost: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors',
    icon:  'p-2 rounded-lg transition-colors',
  },
};

// ─── Empty entry ──────────────────────────────────────────────────────────────

function emptyEntry(): Omit<RecurringEntry, 'id' | 'updatedAt'> {
  return {
    dayOfWeek: 'monday',
    startTime: '18:00',
    endTime: '19:00',
    className: '',
    detail: '',
    category: 'salsa',
    location: 'Main Studio',
    isActive: true,
    sortOrder: 999,
  };
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ─── Entry Form Panel ─────────────────────────────────────────────────────────

function EntryFormPanel({
  entry,
  saving,
  onSave,
  onClose,
  saveEntry = saveRecurringEntry,
}: {
  entry: RecurringEntry | null;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
  saveEntry?: (data: Omit<RecurringEntry, 'id' | 'updatedAt'> & { id?: string }) => Promise<RecurringEntry>;
}) {
  const isNew = !entry;
  const [form, setForm] = useState<Omit<RecurringEntry, 'id' | 'updatedAt'> & { id?: string }>(
    entry ?? emptyEntry()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.className.trim()) e.className = 'Class name is required';
    if (!form.startTime)        e.startTime = 'Start time is required';
    if (!form.endTime)          e.endTime   = 'End time is required';
    if (form.startTime >= form.endTime) e.endTime = 'End must be after start';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    await saveEntry(form);
    onSave();
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'New Recurring Class' : 'Edit Class'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Day + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>Day of Week</label>
              <select value={form.dayOfWeek} onChange={e => set('dayOfWeek', e.target.value as RecurringDay)}
                className={S.input + ' bg-white'}>
                {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
              </select>
            </div>
            <div>
              <label className={S.label}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value as RecurringCategory)}
                className={S.input + ' bg-white'}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>Start Time *</label>
              <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
                className={S.input} />
              {errors.startTime && <p className="text-xs text-red-600 mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className={S.label}>End Time *</label>
              <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
                className={S.input} />
              {errors.endTime && <p className="text-xs text-red-600 mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Class name */}
          <div>
            <label className={S.label}>Class Name *</label>
            <input value={form.className} onChange={e => set('className', e.target.value)}
              className={S.input} placeholder="e.g. Salsa On1" />
            {errors.className && <p className="text-xs text-red-600 mt-1">{errors.className}</p>}
          </div>

          {/* Detail */}
          <div>
            <label className={S.label}>Level / Detail</label>
            <input value={form.detail} onChange={e => set('detail', e.target.value)}
              className={S.input} placeholder="e.g. Beginner / Open Level" />
          </div>

          {/* Location */}
          <div>
            <label className={S.label}>Location</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              className={S.input} placeholder="Main Studio" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button type="button" onClick={() => set('isActive', !form.isActive)}
              className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ background: form.isActive ? GOLD : '#E5E7EB' }}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-gray-700 font-semibold">
              {form.isActive ? 'Active — shown on schedule' : 'Inactive — hidden'}
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost} disabled={saving}>Cancel</button>
          <button onClick={handleSubmit} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }} disabled={saving}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {isNew ? 'Add Class' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Entry Row ────────────────────────────────────────────────────────────────

function EntryRow({
  entry,
  idx,
  groupTotal,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  entry: RecurringEntry;
  idx: number;
  groupTotal: number;
  onEdit: (e: RecurringEntry) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Reorder */}
      <div className="flex flex-col flex-shrink-0">
        <button onClick={() => onMoveUp(entry.id)} disabled={idx === 0}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronUp size={13} />
        </button>
        <button onClick={() => onMoveDown(entry.id)} disabled={idx === groupTotal - 1}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Time */}
      <div className="w-28 flex-shrink-0 text-xs text-gray-500 font-mono">
        {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
      </div>

      {/* Name + detail */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{entry.className}</p>
        {entry.detail && <p className="text-xs text-gray-400 truncate">{entry.detail}</p>}
      </div>

      {/* Category badge */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[entry.category]}`}>
        {entry.category}
      </span>

      {/* Location */}
      <span className="text-xs text-gray-400 hidden sm:block flex-shrink-0 max-w-[100px] truncate">
        {entry.location}
      </span>

      {/* Status */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${entry.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
        {entry.isActive ? 'On' : 'Off'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(entry)} className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`}>
          <Pencil size={14} />
        </button>
        <button
          onClick={() => { if (confirm(`Delete "${entry.className}"?`)) onDelete(entry.id); }}
          className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Shared day entries list ──────────────────────────────────────────────────

function DayEntriesList({
  entries,
  filterDay,
  onOpenNew,
  onOpenEdit,
  onDelete,
  onMove,
}: {
  entries: RecurringEntry[];
  filterDay: RecurringDay | 'all';
  onOpenNew: (day?: RecurringDay) => void;
  onOpenEdit: (e: RecurringEntry) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: 1 | -1) => void;
}) {
  const grouped: Record<RecurringDay, RecurringEntry[]> = {} as any;
  DAYS.forEach(d => {
    grouped[d] = entries.filter(e => e.dayOfWeek === d).sort((a, b) => a.sortOrder - b.sortOrder);
  });
  const visibleDays = filterDay === 'all' ? DAYS : [filterDay];

  return (
    <>
      {visibleDays.map(day => {
        const dayEntries = grouped[day];
        if (dayEntries.length === 0 && filterDay !== 'all') return null;
        return (
          <div key={day} className={`${S.card} mb-4`}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={15} style={{ color: GOLD }} />
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                  {DAY_LABELS[day]}
                </h3>
                <span className="text-xs text-gray-400">({dayEntries.length} classes)</span>
              </div>
              <button
                onClick={() => onOpenNew(day)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {dayEntries.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No classes on {DAY_LABELS[day]}.{' '}
                <button className="text-amber-600 hover:underline font-semibold" onClick={() => onOpenNew(day)}>
                  Add one
                </button>
              </div>
            ) : (
              dayEntries.map((entry, idx) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  idx={idx}
                  groupTotal={dayEntries.length}
                  onEdit={onOpenEdit}
                  onDelete={onDelete}
                  onMoveUp={id => onMove(id, -1)}
                  onMoveDown={id => onMove(id, 1)}
                />
              ))
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── ScheduleAdminPage ────────────────────────────────────────────────────────

export function ScheduleAdminPage() {
  const [activeTab, setActiveTab]   = useState<'detailed' | 'overview'>('detailed');
  const [detailSaving, setDetailSaving]   = useState(false);
  const [overviewSaving, setOverviewSaving] = useState(false);

  // ── Detailed schedule state ──
  const [entries, setEntries] = useState<RecurringEntry[]>([]);
  const [detailEditing, setDetailEditing] = useState<RecurringEntry | null>(null);
  const [detailPanelOpen, setDetailPanel] = useState(false);
  const [detailFilterDay, setDetailFilterDay] = useState<RecurringDay | 'all'>('all');
  const [detailLoading, setDetailLoading] = useState(true);

  const loadDetailed = useCallback(async () => {
    const data = await getRecurringEntries();
    setEntries(data);
  }, []);

  useEffect(() => { loadDetailed().finally(() => setDetailLoading(false)); }, [loadDetailed]);

  function detailOpenNew(day?: RecurringDay) {
    setDetailEditing(day ? { dayOfWeek: day } as any : null);
    setDetailPanel(true);
  }
  function detailOpenEdit(e: RecurringEntry) { setDetailEditing(e); setDetailPanel(true); }
  function detailClosePanel() { setDetailPanel(false); setDetailEditing(null); }
  async function detailAfterSave() { await loadDetailed(); detailClosePanel(); }
  async function detailHandleDelete(id: string) {
    try { await deleteRecurringEntry(id); await loadDetailed(); }
    catch (err) { console.error('Failed to delete entry:', err); alert('Failed to delete. Please try again.'); }
  }
  async function detailMoveInGroup(id: string, dir: 1 | -1) {
    const entry = entries.find(e => e.id === id)!;
    const group = entries.filter(e => e.dayOfWeek === entry.dayOfWeek).sort((a, b) => a.sortOrder - b.sortOrder);
    const gi = group.findIndex(e => e.id === id);
    const ni = gi + dir;
    if (ni < 0 || ni >= group.length) return;
    const other = group[ni];
    await saveRecurringEntry({ ...entry, sortOrder: other.sortOrder });
    await saveRecurringEntry({ ...other, sortOrder: entry.sortOrder });
    await loadDetailed();
  }

  // ── Overview state ──
  const [overviewEntries, setOverviewEntries] = useState<RecurringEntry[]>([]);
  const [overviewEditing, setOverviewEditing] = useState<RecurringEntry | null>(null);
  const [overviewPanelOpen, setOverviewPanel] = useState(false);
  const [overviewFilterDay, setOverviewFilterDay] = useState<RecurringDay | 'all'>('all');
  const [overviewLoading, setOverviewLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    const data = await getOverviewEntries();
    setOverviewEntries(data);
  }, []);

  useEffect(() => { loadOverview().finally(() => setOverviewLoading(false)); }, [loadOverview]);

  function overviewOpenNew(day?: RecurringDay) {
    setOverviewEditing(day ? { dayOfWeek: day } as any : null);
    setOverviewPanel(true);
  }
  function overviewOpenEdit(e: RecurringEntry) { setOverviewEditing(e); setOverviewPanel(true); }
  function overviewClosePanel() { setOverviewPanel(false); setOverviewEditing(null); }
  async function overviewAfterSave() { await loadOverview(); overviewClosePanel(); }
  async function overviewHandleDelete(id: string) {
    try { await deleteOverviewEntry(id); await loadOverview(); }
    catch (err) { console.error('Failed to delete entry:', err); alert('Failed to delete. Please try again.'); }
  }
  async function overviewMoveInGroup(id: string, dir: 1 | -1) {
    const entry = overviewEntries.find(e => e.id === id)!;
    const group = overviewEntries.filter(e => e.dayOfWeek === entry.dayOfWeek).sort((a, b) => a.sortOrder - b.sortOrder);
    const gi = group.findIndex(e => e.id === id);
    const ni = gi + dir;
    if (ni < 0 || ni >= group.length) return;
    const other = group[ni];
    await saveOverviewEntry({ ...entry, sortOrder: other.sortOrder });
    await saveOverviewEntry({ ...other, sortOrder: entry.sortOrder });
    await loadOverview();
  }

  // ── Day filter pills (shared component) ──
  function DayFilter({ value, onChange }: { value: RecurringDay | 'all'; onChange: (v: RecurringDay | 'all') => void }) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => onChange('all')}
          className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
          style={value === 'all' ? { background: GOLD, color: '#0A0A0A', borderColor: GOLD } : { borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          All Days
        </button>
        {DAYS.map(d => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
            style={value === d ? { background: GOLD, color: '#0A0A0A', borderColor: GOLD } : { borderColor: '#E5E7EB', color: '#6B7280' }}
          >
            {DAY_LABELS[d]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={S.page}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Schedule Manager</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage the Detailed Schedule timeline and the Schedule Overview grid independently.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-8 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('detailed')}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={activeTab === 'detailed'
            ? { background: '#ffffff', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
            : { color: '#6B7280' }}
        >
          Detailed Schedule
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={activeTab === 'overview'
            ? { background: '#ffffff', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
            : { color: '#6B7280' }}
        >
          Schedule Overview
        </button>
      </div>

      {/* ── Detailed Schedule tab ── */}
      {activeTab === 'detailed' && (
        <>
          <div className="flex items-center justify-between mb-4 gap-4">
            <p className="text-sm text-gray-500">
              These classes feed the date-by-date timeline on the public schedule page.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={async () => {
                  if (confirm('Reset all recurring classes to the default schedule? This will replace all current entries.')) {
                    try { await resetRecurringToDefault(SEED_RECURRING); await loadDetailed(); }
                    catch (err) { console.error('Reset failed:', err); alert('Reset failed. Please try again.'); }
                  }
                }}
                className={S.btn.ghost}
              >
                <RotateCcw size={14} /> Reset to Default
              </button>
              <button onClick={() => detailOpenNew()} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
                <Plus size={16} /> Add Class
              </button>
            </div>
          </div>

          <DayFilter value={detailFilterDay} onChange={setDetailFilterDay} />

          {detailLoading ? (
            <div className="py-16 text-center">
              <Loader2 size={24} className="mx-auto mb-3 text-gray-300 animate-spin" />
              <p className="text-sm text-gray-400">Loading schedule…</p>
            </div>
          ) : (
            <DayEntriesList
              entries={entries}
              filterDay={detailFilterDay}
              onOpenNew={detailOpenNew}
              onOpenEdit={detailOpenEdit}
              onDelete={detailHandleDelete}
              onMove={detailMoveInGroup}
            />
          )}

          <p className="text-xs text-gray-400 mt-2">
            Changes here appear in the Detailed Schedule timeline alongside special events.
          </p>

          {detailPanelOpen && (
            <EntryFormPanel
              entry={detailEditing?.id ? detailEditing : null}
              saving={detailSaving}
              onSave={detailAfterSave}
              onClose={detailClosePanel}
              saveEntry={async (data) => {
                setDetailSaving(true);
                try { return await saveRecurringEntry(data); }
                finally { setDetailSaving(false); }
              }}
            />
          )}
        </>
      )}

      {/* ── Schedule Overview tab ── */}
      {activeTab === 'overview' && (
        <>
          {/* Info banner */}
          <div
            className="rounded-lg px-4 py-3 mb-6 flex items-start gap-3"
            style={{ background: 'rgba(246,176,0,0.08)', border: '1px solid rgba(246,176,0,0.25)' }}
          >
            <span style={{ color: GOLD, fontSize: 18, lineHeight: 1.4 }}>⊞</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Schedule Overview Grid</p>
              <p className="text-xs text-gray-500 mt-0.5">
                These entries control the visual grid at the top of the public Schedule page.
                They are independent from the Detailed Schedule — changes here only affect the overview grid.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 gap-4">
            <p className="text-sm text-gray-500">
              {overviewEntries.filter(e => e.isActive).length} active entries displayed in the overview grid.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={async () => {
                  if (confirm('Reset the Schedule Overview to the default classes? This will replace all current overview entries.')) {
                    try { await resetOverviewToDefault(SEED_RECURRING); await loadOverview(); }
                    catch (err) { console.error('Reset failed:', err); alert('Reset failed. Please try again.'); }
                  }
                }}
                className={S.btn.ghost}
              >
                <RotateCcw size={14} /> Reset to Default
              </button>
              <button onClick={() => overviewOpenNew()} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
                <Plus size={16} /> Add Entry
              </button>
            </div>
          </div>

          <DayFilter value={overviewFilterDay} onChange={setOverviewFilterDay} />

          {overviewLoading ? (
            <div className="py-16 text-center">
              <Loader2 size={24} className="mx-auto mb-3 text-gray-300 animate-spin" />
              <p className="text-sm text-gray-400">Loading schedule…</p>
            </div>
          ) : (
            <DayEntriesList
              entries={overviewEntries}
              filterDay={overviewFilterDay}
              onOpenNew={overviewOpenNew}
              onOpenEdit={overviewOpenEdit}
              onDelete={overviewHandleDelete}
              onMove={overviewMoveInGroup}
            />
          )}

          <p className="text-xs text-gray-400 mt-2">
            Only active entries are shown in the public Schedule Overview grid. Inactive entries are hidden.
          </p>

          {overviewPanelOpen && (
            <EntryFormPanel
              entry={overviewEditing?.id ? overviewEditing : null}
              saving={overviewSaving}
              onSave={overviewAfterSave}
              onClose={overviewClosePanel}
              saveEntry={async (data) => {
                setOverviewSaving(true);
                try { return await saveOverviewEntry(data); }
                finally { setOverviewSaving(false); }
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
