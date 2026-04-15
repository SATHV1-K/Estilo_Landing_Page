// ReviewsAdminPage — CRUD for testimonial/review cards with reorder.

import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, X, Check, Star,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  getReviews, saveReview, deleteReview, reorderReviews,
  type Review,
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

// ─── Stars Input ──────────────────────────────────────────────────────────────

function StarsInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            fill={n <= value ? GOLD : 'none'}
            stroke={n <= value ? GOLD : '#D1D5DB'}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500 self-center">{value}/5</span>
    </div>
  );
}

// ─── Review Form Panel ────────────────────────────────────────────────────────

function ReviewFormPanel({
  review,
  onSave,
  onClose,
}: {
  review: Review | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const isNew = !review;
  const [form, setForm] = useState<Omit<Review, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string }>({
    name: review?.name ?? '',
    stars: review?.stars ?? 5,
    text: review?.text ?? '',
    sortOrder: review?.sortOrder ?? 999,
    isActive: review?.isActive ?? true,
    id: review?.id,
    createdAt: review?.createdAt,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.text.trim()) e.text = 'Review text is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    saveReview(form);
    onSave();
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'New Review' : 'Edit Review'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className={S.label}>Reviewer Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className={S.input}
              placeholder="Maria G."
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={S.label}>Rating</label>
            <StarsInput value={form.stars} onChange={n => set('stars', n)} />
          </div>

          <div>
            <label className={S.label}>Review Text *</label>
            <textarea
              value={form.text}
              onChange={e => set('text', e.target.value)}
              rows={4}
              className={S.input}
              placeholder="Write the review…"
            />
            {errors.text && <p className="text-xs text-red-600 mt-1">{errors.text}</p>}
            <p className="text-[10px] text-gray-400 mt-1">{form.text.length} chars</p>
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ background: form.isActive ? GOLD : '#E5E7EB' }}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-gray-700 font-semibold">
              {form.isActive ? 'Shown in public carousel' : 'Hidden from public'}
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost}>Cancel</button>
          <button onClick={handleSubmit} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
            <Check size={15} /> {isNew ? 'Add Review' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Review Row ───────────────────────────────────────────────────────────────

function ReviewRow({
  review,
  idx,
  total,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: {
  review: Review;
  idx: number;
  total: number;
  onEdit: (r: Review) => void;
  onDelete: (id: string) => void;
  onToggleActive: (r: Review) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Reorder */}
      <div className="flex flex-col flex-shrink-0 pt-1">
        <button onClick={() => onMoveUp(review.id)} disabled={idx === 0}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronUp size={13} />
        </button>
        <button onClick={() => onMoveDown(review.id)} disabled={idx === total - 1}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Stars */}
      <div className="flex flex-shrink-0 pt-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star
            key={n}
            size={13}
            fill={n <= review.stars ? GOLD : 'none'}
            stroke={n <= review.stars ? GOLD : '#D1D5DB'}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{review.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{review.text}</p>
      </div>

      {/* Active toggle */}
      <button
        onClick={() => onToggleActive(review)}
        className="flex-shrink-0"
        title={review.isActive ? 'Click to hide' : 'Click to show'}
      >
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${review.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
          {review.isActive ? 'Active' : 'Hidden'}
        </span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(review)}
          className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`}
          title="Edit">
          <Pencil size={14} />
        </button>
        <button
          onClick={() => { if (confirm(`Delete review by "${review.name}"?`)) onDelete(review.id); }}
          className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`}
          title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── ReviewsAdminPage ─────────────────────────────────────────────────────────

export function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [panelOpen, setPanel] = useState(false);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'hidden'>('all');

  function load() { setReviews(getReviews()); }
  useEffect(load, []);

  function openNew()             { setEditing(null); setPanel(true); }
  function openEdit(r: Review)   { setEditing(r); setPanel(true); }
  function closePanel()          { setPanel(false); setEditing(null); }
  function afterSave()           { load(); closePanel(); }
  function handleDelete(id: string) { deleteReview(id); load(); }

  function handleToggleActive(r: Review) {
    saveReview({ ...r, isActive: !r.isActive });
    load();
  }

  function move(id: string, dir: 1 | -1) {
    const ids = reviews.map(r => r.id);
    const idx = ids.indexOf(id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    reorderReviews(ids);
    load();
  }

  const filtered = reviews.filter(r =>
    filterActive === 'all'
      ? true
      : filterActive === 'active'
      ? r.isActive
      : !r.isActive
  );

  const activeCount = reviews.filter(r => r.isActive).length;
  const avgStars = reviews.length
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Reviews Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage testimonials shown in the public reviews carousel.
          </p>
        </div>
        <button onClick={openNew} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Reviews', value: reviews.length },
          { label: 'Active',        value: activeCount },
          { label: 'Avg Rating',    value: avgStars },
        ].map(stat => (
          <div key={stat.label} className={`${S.card} p-4`}>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'hidden'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterActive(f)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors capitalize"
            style={filterActive === f
              ? { background: GOLD, color: '#0A0A0A', borderColor: GOLD }
              : { borderColor: '#E5E7EB', color: '#6B7280' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={S.card}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Star size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-500">
              {reviews.length === 0 ? 'No reviews yet.' : 'No reviews match the filter.'}
            </p>
          </div>
        ) : (
          filtered.map((review, idx) => (
            <ReviewRow
              key={review.id}
              review={review}
              idx={idx}
              total={filtered.length}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onMoveUp={id => move(id, -1)}
              onMoveDown={id => move(id, 1)}
            />
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Only active reviews appear in the public testimonials carousel.
      </p>

      {panelOpen && (
        <ReviewFormPanel review={editing} onSave={afterSave} onClose={closePanel} />
      )}
    </div>
  );
}
