// AdminPage — Special Classes admin panel (light theme per CLAUDE.md)
// Access: /admin  ·  Password: "EstiloLatino2024" (change in src/lib/specialClasses.ts)

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Eye, Download, ChevronLeft, X, Sparkles,
} from 'lucide-react';
import type { SpecialClass, Reservation, SpecialCategory } from '../../lib/specialClasses';
import {
  getSpecialClasses,
  saveSpecialClass,
  deleteSpecialClass,
  getReservations,
  updateReservationStatus,
  exportReservationsCSV,
  getActiveReservationCount,
  formatPriceCents,
  formatDateTime,
  formatTimeOnly,
  calcDurationMin,
} from '../../lib/specialClasses';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoToDateInput(iso: string): string {
  return iso.slice(0, 10); // "2026-04-20"
}
function isoToTimeInput(iso: string): string {
  return iso.slice(11, 16); // "19:00"
}
function toIsoString(dateInput: string, timeInput: string): string {
  return `${dateInput}T${timeInput}:00`;
}
function classStatus(cls: SpecialClass): 'active' | 'past' | 'inactive' {
  if (!cls.isActive) return 'inactive';
  if (new Date(cls.date) < new Date()) return 'past';
  return 'active';
}
function totalRevenue(reservations: Reservation[]): number {
  return reservations
    .filter(r => r.paymentStatus === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  description: string;
  dateInput: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
  category: SpecialCategory;
  priceInput: string;
  maxCapacity: string;
  isActive: boolean;
  paymentLink: string;
}

const DEFAULT_FORM: FormData = {
  name: '',
  description: '',
  dateInput: '',
  startTime: '',
  endTime: '',
  location: 'Main Studio',
  instructor: '',
  category: 'special',
  priceInput: '',
  maxCapacity: '30',
  isActive: true,
  paymentLink: '',
};

function classToForm(cls: SpecialClass): FormData {
  return {
    name:         cls.name,
    description:  cls.description,
    dateInput:    isoToDateInput(cls.date),
    startTime:    isoToTimeInput(cls.date),
    endTime:      isoToTimeInput(cls.endTime),
    location:     cls.location,
    instructor:   cls.instructor,
    category:     cls.category,
    priceInput:   cls.price === 0 ? '0' : (cls.price / 100).toFixed(0),
    maxCapacity:  String(cls.maxCapacity),
    isActive:     cls.isActive,
    paymentLink:  cls.paymentLink,
  };
}

// ─── Styles (light-theme admin) ───────────────────────────────────────────────

const S = {
  page:       'min-h-screen bg-gray-50',
  header:     'bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20',
  container:  'max-w-6xl mx-auto px-4 sm:px-6 py-8',
  card:       'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
  th:         'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200',
  td:         'px-4 py-4 text-sm text-gray-800 border-b border-gray-100',
  badge: {
    active:   'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700',
    past:     'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500',
    inactive: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-600',
    pending:  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700',
    completed:'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700',
    refunded: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500',
  },
  btn: {
    gold:   'px-4 py-2 rounded-lg text-sm font-bold transition-colors text-white',
    ghost:  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
    danger: 'px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors',
  },
  input:    'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
  label:    'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  formGrid: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
};

const GOLD = '#F6B000';

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReturnType<typeof classStatus> }) {
  const labels = { active: 'Active', past: 'Past', inactive: 'Inactive' };
  return <span className={S.badge[status]}>{labels[status]}</span>;
}

function PayStatusBadge({ status }: { status: Reservation['paymentStatus'] }) {
  return <span className={S.badge[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-gray-800 tabular-nums w-14">{value}/{max}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 min-w-[60px]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: GOLD }}
        />
      </div>
    </div>
  );
}

// ─── Add/Edit Form Modal ──────────────────────────────────────────────────────

interface ClassFormProps {
  editing: SpecialClass | null; // null = creating new
  onSave: () => void;
  onCancel: () => void;
}

function ClassFormModal({ editing, onSave, onCancel }: ClassFormProps) {
  const [form, setForm]     = useState<FormData>(editing ? classToForm(editing) : DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  // Auto-calc duration label
  const duration = (form.dateInput && form.startTime && form.endTime)
    ? calcDurationMin(
        toIsoString(form.dateInput, form.startTime),
        toIsoString(form.dateInput, form.endTime)
      )
    : null;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim())      e.name      = 'Required';
    if (!form.dateInput)        e.dateInput = 'Required';
    if (!form.startTime)        e.startTime = 'Required';
    if (!form.endTime)          e.endTime   = 'Required';
    if (form.priceInput === '') e.priceInput = 'Required (use 0 for free)';
    else if (isNaN(parseFloat(form.priceInput)) || parseFloat(form.priceInput) < 0)
      e.priceInput = 'Must be a non-negative number';
    if (!form.maxCapacity || parseInt(form.maxCapacity) < 1)
      e.maxCapacity = 'Must be at least 1';
    if (form.startTime && form.endTime && form.dateInput && duration !== null && duration <= 0)
      e.endTime = 'End time must be after start time';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    const startIso = toIsoString(form.dateInput, form.startTime);
    const endIso   = toIsoString(form.dateInput, form.endTime);
    const priceCents = Math.round(parseFloat(form.priceInput) * 100);
    const dur = calcDurationMin(startIso, endIso);

    saveSpecialClass({
      ...(editing?.id ? { id: editing.id } : {}),
      name:        form.name.trim(),
      description: form.description.trim(),
      date:        startIso,
      endTime:     endIso,
      durationMin: dur,
      location:    form.location.trim() || 'Main Studio',
      instructor:  form.instructor.trim(),
      category:    form.category,
      price:       priceCents,
      maxCapacity: parseInt(form.maxCapacity),
      isActive:    form.isActive,
      paymentLink: form.paymentLink.trim(),
    });
    onSave();
  }

  const categories: { value: SpecialCategory; label: string }[] = [
    { value: 'special',  label: 'Special / Workshop' },
    { value: 'salsa',    label: 'Salsa' },
    { value: 'bachata',  label: 'Bachata' },
    { value: 'street',   label: 'Street Dance' },
    { value: 'ballet',   label: 'Ballet' },
    { value: 'kids',     label: 'Kids' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-black text-gray-900">
            {editing ? 'Edit Special Class' : 'Add Special Class'}
          </h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Class Name */}
          <div>
            <label className={S.label}>Class Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Valentine's Bachata Workshop"
              className={S.input}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={S.label}>Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief description for customers…"
              rows={2}
              className={S.input + ' resize-none'}
            />
          </div>

          {/* Date + Times */}
          <div className={S.formGrid}>
            <div>
              <label className={S.label}>Date *</label>
              <input
                type="date"
                value={form.dateInput}
                onChange={e => set('dateInput', e.target.value)}
                className={S.input}
              />
              {errors.dateInput && <p className="text-xs text-red-500 mt-1">{errors.dateInput}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={S.label}>Start Time *</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => set('startTime', e.target.value)}
                  className={S.input}
                />
                {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <label className={S.label}>
                  End Time *
                  {duration !== null && duration > 0 && (
                    <span className="normal-case font-normal text-gray-400 ml-1">({duration} min)</span>
                  )}
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => set('endTime', e.target.value)}
                  className={S.input}
                />
                {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
              </div>
            </div>
          </div>

          {/* Location + Instructor */}
          <div className={S.formGrid}>
            <div>
              <label className={S.label}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="Main Studio"
                className={S.input}
              />
            </div>
            <div>
              <label className={S.label}>Instructor</label>
              <input
                type="text"
                value={form.instructor}
                onChange={e => set('instructor', e.target.value)}
                placeholder="Instructor name"
                className={S.input}
              />
            </div>
          </div>

          {/* Category + Price + Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={S.label}>Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value as SpecialCategory)}
                className={S.input}
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={S.label}>Price ($) * <span className="font-normal normal-case text-gray-400">0 = free</span></label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.priceInput}
                onChange={e => set('priceInput', e.target.value)}
                placeholder="25"
                className={S.input}
              />
              {errors.priceInput && <p className="text-xs text-red-500 mt-1">{errors.priceInput}</p>}
            </div>
            <div>
              <label className={S.label}>Max Capacity *</label>
              <input
                type="number"
                min="1"
                value={form.maxCapacity}
                onChange={e => set('maxCapacity', e.target.value)}
                className={S.input}
              />
              {errors.maxCapacity && <p className="text-xs text-red-500 mt-1">{errors.maxCapacity}</p>}
            </div>
          </div>

          {/* Payment Link */}
          <div>
            <label className={S.label}>Square Payment Link</label>
            <input
              type="url"
              value={form.paymentLink}
              onChange={e => set('paymentLink', e.target.value)}
              placeholder="https://square.link/u/… (leave empty if free)"
              className={S.input}
            />
            <p className="text-xs text-gray-400 mt-1">
              Customers will be redirected here after filling the reservation form. Check your Square dashboard to verify payments.
            </p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.isActive}
              onClick={() => set('isActive', !form.isActive)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ background: form.isActive ? GOLD : '#D1D5DB' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: form.isActive ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {form.isActive ? 'Active — visible on schedule' : 'Inactive — hidden from schedule'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-black transition-all hover:opacity-90"
            style={{ background: GOLD }}
          >
            {editing ? 'Save Changes' : 'Create Class'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reservation Viewer ───────────────────────────────────────────────────────

function ReservationViewer({
  specialClass,
  onBack,
}: {
  specialClass: SpecialClass;
  onBack: () => void;
}) {
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    getReservations(specialClass.id)
  );

  function refresh() {
    setReservations(getReservations(specialClass.id));
  }

  function changeStatus(id: string, status: Reservation['paymentStatus']) {
    updateReservationStatus(id, status);
    refresh();
  }

  const reserved  = reservations.filter(r => r.paymentStatus !== 'refunded').length;
  const revenue   = totalRevenue(reservations);

  return (
    <div>
      {/* Back + header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Back to Classes
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{specialClass.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatDateTime(specialClass.date)} · {reserved}/{specialClass.maxCapacity} reserved
              {revenue > 0 && (
                <span className="ml-3 font-semibold" style={{ color: '#16a34a' }}>
                  Total collected: {formatPriceCents(revenue)}
                </span>
              )}
            </p>
          </div>
          {reservations.length > 0 && (
            <button
              onClick={() => exportReservationsCSV(reservations, specialClass.name)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={15} /> Download CSV
            </button>
          )}
        </div>
      </div>

      <div className={S.card}>
        {reservations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm font-medium">No reservations yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className={S.th}>#</th>
                  <th className={S.th}>Name</th>
                  <th className={S.th}>Email</th>
                  <th className={S.th}>Phone</th>
                  <th className={S.th}>Amount</th>
                  <th className={S.th}>Status</th>
                  <th className={S.th}>Date</th>
                  <th className={S.th}>Update</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r, i) => (
                  <tr key={r.id}>
                    <td className={S.td + ' text-gray-400'}>{i + 1}</td>
                    <td className={S.td + ' font-semibold'}>{r.customerName}</td>
                    <td className={S.td}>{r.customerEmail}</td>
                    <td className={S.td + ' text-gray-500'}>{r.customerPhone || '—'}</td>
                    <td className={S.td + ' font-semibold'}>{formatPriceCents(r.amount)}</td>
                    <td className={S.td}><PayStatusBadge status={r.paymentStatus} /></td>
                    <td className={S.td + ' text-gray-500 text-xs'}>
                      {new Date(r.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
                      })}
                    </td>
                    <td className={S.td}>
                      <select
                        value={r.paymentStatus}
                        onChange={e => changeStatus(r.id, e.target.value as Reservation['paymentStatus'])}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400 bg-white text-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Classes List ─────────────────────────────────────────────────────────────

function ClassesList({
  onEdit,
  onViewReservations,
  refreshKey,
}: {
  onEdit: (cls: SpecialClass) => void;
  onViewReservations: (cls: SpecialClass) => void;
  refreshKey: number;
}) {
  const [classes, setClasses] = useState<SpecialClass[]>([]);

  const loadClasses = useCallback(() => {
    const all = getSpecialClasses().sort((a, b) => {
      // Upcoming first, past at bottom
      const aFuture = new Date(a.date) >= new Date();
      const bFuture = new Date(b.date) >= new Date();
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      if (aFuture) return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setClasses(all);
  }, []);

  useEffect(() => { loadClasses(); }, [loadClasses, refreshKey]);

  function handleDelete(cls: SpecialClass) {
    const reserved = getActiveReservationCount(cls.id);
    const msg = reserved > 0
      ? `Delete "${cls.name}"? This will also delete ${reserved} reservation(s). This cannot be undone.`
      : `Delete "${cls.name}"? This cannot be undone.`;
    if (!window.confirm(msg)) return;
    deleteSpecialClass(cls.id);
    loadClasses();
  }

  if (classes.length === 0) {
    return (
      <div className={S.card + ' py-20 text-center'}>
        <Sparkles size={32} className="mx-auto mb-3 text-gray-300" />
        <p className="text-gray-400 font-medium mb-1">No special classes yet</p>
        <p className="text-sm text-gray-300">Click "Add Class" to create your first event.</p>
      </div>
    );
  }

  return (
    <div className={S.card}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className={S.th}>Date & Time</th>
              <th className={S.th}>Class Name</th>
              <th className={S.th}>Price</th>
              <th className={S.th}>Reserved / Capacity</th>
              <th className={S.th}>Status</th>
              <th className={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => {
              const reserved = getActiveReservationCount(cls.id);
              const status   = classStatus(cls);
              return (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className={S.td}>
                    <div className="text-sm font-semibold text-gray-800">
                      {new Date(cls.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {formatTimeOnly(cls.date)}
                      {cls.durationMin > 0 && ` · ${cls.durationMin} min`}
                    </div>
                  </td>
                  <td className={S.td}>
                    <div className="font-semibold text-gray-900">{cls.name}</div>
                    {cls.instructor && (
                      <div className="text-xs text-gray-400 mt-0.5">👤 {cls.instructor}</div>
                    )}
                    {cls.location && (
                      <div className="text-xs text-gray-400">📍 {cls.location}</div>
                    )}
                  </td>
                  <td className={S.td + ' font-bold'} style={{ color: cls.price === 0 ? '#16a34a' : '#111' }}>
                    {formatPriceCents(cls.price)}
                  </td>
                  <td className={S.td}>
                    <ProgressBar value={reserved} max={cls.maxCapacity} />
                  </td>
                  <td className={S.td}><StatusBadge status={status} /></td>
                  <td className={S.td}>
                    <div className="flex items-center gap-1 flex-nowrap">
                      <button
                        onClick={() => onEdit(cls)}
                        className={S.btn.ghost + ' text-gray-600 hover:bg-gray-100 flex items-center gap-1'}
                        title="Edit"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => onViewReservations(cls)}
                        className={S.btn.ghost + ' text-blue-600 hover:bg-blue-50 flex items-center gap-1'}
                        title="View Reservations"
                      >
                        <Eye size={13} /> Reservations
                      </button>
                      <button
                        onClick={() => handleDelete(cls)}
                        className={S.btn.danger + ' flex items-center gap-1'}
                        title="Delete"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SpecialClassesPage ───────────────────────────────────────────────────────
// Rendered inside AdminShell at /admin/special-classes.
// Auth is handled by AdminShell; this component only renders the content.

type AdminView = 'list' | 'form' | 'reservations';

export function SpecialClassesPage() {
  const [view, setView]             = useState<AdminView>('list');
  const [editing, setEditing]       = useState<SpecialClass | null>(null);
  const [viewing, setViewing]       = useState<SpecialClass | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function refresh() { setRefreshKey(k => k + 1); }

  function openNew() { setEditing(null); setView('form'); }
  function openEdit(cls: SpecialClass) { setEditing(cls); setView('form'); }
  function openReservations(cls: SpecialClass) { setViewing(cls); setView('reservations'); }
  function afterSave() { refresh(); setView('list'); setEditing(null); }
  function cancelForm() { setView('list'); setEditing(null); }
  function backToList() { setView('list'); setViewing(null); }

  return (
    <div className={S.page}>
      <main className={S.container}>
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: GOLD }} />
            <h1 className="text-xl font-black text-gray-900">Special Classes</h1>
            {view !== 'list' && (
              <span className="text-gray-400">
                {' '}/ {view === 'form' ? (editing ? 'Edit' : 'New') : 'Reservations'}
              </span>
            )}
          </div>
          {view === 'list' && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
              style={{ background: GOLD, color: '#0A0A0A' }}
            >
              <Plus size={16} /> Add Class
            </button>
          )}
        </div>

        {view === 'list' && (
          <ClassesList
            onEdit={openEdit}
            onViewReservations={openReservations}
            refreshKey={refreshKey}
          />
        )}

        {view === 'reservations' && viewing && (
          <ReservationViewer specialClass={viewing} onBack={backToList} />
        )}
      </main>

      {view === 'form' && (
        <ClassFormModal editing={editing} onSave={afterSave} onCancel={cancelForm} />
      )}
    </div>
  );
}

// Keep AdminPage exported for any lingering direct references.
export { SpecialClassesPage as AdminPage };
