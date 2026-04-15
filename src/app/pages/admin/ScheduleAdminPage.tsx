// ScheduleAdminPage — CRUD for recurring weekly schedule entries.
// Separate from Special Classes (handled by AdminPage → /admin/special-classes).

import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, X, Check, Calendar,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  getRecurringEntries, saveRecurringEntry, deleteRecurringEntry,
  type RecurringEntry, type RecurringDay, type RecurringCategory,
} from '../../../lib/adminData';

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
  onSave,
  onClose,
}: {
  entry: RecurringEntry | null;
  onSave: () => void;
  onClose: () => void;
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

  function handleSubmit() {
    if (!validate()) return;
    saveRecurringEntry(form);
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
          <button type="button" onClick={onClose} className={S.btn.ghost}>Cancel</button>
          <button onClick={handleSubmit} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
            <Check size={15} /> {isNew ? 'Add Class' : 'Save Changes'}
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

// ─── ScheduleAdminPage ────────────────────────────────────────────────────────

export function ScheduleAdminPage() {
  const [entries, setEntries] = useState<RecurringEntry[]>([]);
  const [editing, setEditing] = useState<RecurringEntry | null>(null);
  const [panelOpen, setPanel] = useState(false);
  const [filterDay, setFilterDay] = useState<RecurringDay | 'all'>('all');

  function load() { setEntries(getRecurringEntries()); }
  useEffect(load, []);

  function openNew()               { setEditing(null); setPanel(true); }
  function openEdit(e: RecurringEntry) { setEditing(e); setPanel(true); }
  function closePanel()            { setPanel(false); setEditing(null); }
  function afterSave()             { load(); closePanel(); }
  function handleDelete(id: string) { deleteRecurringEntry(id); load(); }

  function moveInGroup(id: string, dir: 1 | -1) {
    const all = [...entries];
    const idx = all.findIndex(e => e.id === id);
    const entry = all[idx];
    const groupItems = all
      .filter(e => e.dayOfWeek === entry.dayOfWeek)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const groupIdx = groupItems.findIndex(e => e.id === id);
    const newGroupIdx = groupIdx + dir;
    if (newGroupIdx < 0 || newGroupIdx >= groupItems.length) return;
    // Swap sort orders
    const other = groupItems[newGroupIdx];
    const tmpOrder = entry.sortOrder;
    saveRecurringEntry({ ...entry, sortOrder: other.sortOrder });
    saveRecurringEntry({ ...other, sortOrder: tmpOrder });
    load();
  }

  // Group by day
  const grouped: Record<RecurringDay, RecurringEntry[]> = {} as any;
  DAYS.forEach(d => {
    grouped[d] = entries
      .filter(e => e.dayOfWeek === d)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  const visibleDays = filterDay === 'all' ? DAYS : [filterDay];

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Schedule Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage recurring weekly classes. These appear on the public schedule timeline.
          </p>
        </div>
        <button onClick={openNew} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
          <Plus size={16} /> Add Class
        </button>
      </div>

      {/* Day filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterDay('all')}
          className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
          style={filterDay === 'all'
            ? { background: GOLD, color: '#0A0A0A', borderColor: GOLD }
            : { borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          All Days
        </button>
        {DAYS.map(d => (
          <button
            key={d}
            onClick={() => setFilterDay(d)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
            style={filterDay === d
              ? { background: GOLD, color: '#0A0A0A', borderColor: GOLD }
              : { borderColor: '#E5E7EB', color: '#6B7280' }}
          >
            {DAY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Days */}
      {visibleDays.map(day => {
        const dayEntries = grouped[day];
        if (dayEntries.length === 0 && filterDay !== 'all') return null;
        return (
          <div key={day} className={`${S.card} mb-4`}>
            {/* Day header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={15} style={{ color: GOLD }} />
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                  {DAY_LABELS[day]}
                </h3>
                <span className="text-xs text-gray-400">({dayEntries.length} classes)</span>
              </div>
              <button
                onClick={() => { setEditing({ dayOfWeek: day } as any); setPanel(true); }}
                className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {dayEntries.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No classes on {DAY_LABELS[day]}.{' '}
                <button className="text-amber-600 hover:underline font-semibold"
                  onClick={() => { setEditing({ dayOfWeek: day } as any); setPanel(true); }}>
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
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onMoveUp={id => moveInGroup(id, -1)}
                  onMoveDown={id => moveInGroup(id, 1)}
                />
              ))
            )}
          </div>
        );
      })}

      <p className="text-xs text-gray-400 mt-2">
        These recurring classes feed into the public schedule timeline alongside special events.
      </p>

      {panelOpen && (
        <EntryFormPanel
          entry={editing?.id ? editing : null}
          onSave={afterSave}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
