// Admin — Euphoria Ladies Testimonials manager.

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff, Loader2, X, Save } from 'lucide-react';
import {
  getEuphoriaTestimonials, saveEuphoriaTestimonial, deleteEuphoriaTestimonial,
} from '../../../../lib/euphoriaTestimonialsService';
import type { EuphoriaTestimonial } from '../../../../lib/types';

const GOLD = '#F6B000';
const PINK = '#CE1868';

const S = {
  page:  'max-w-4xl mx-auto px-4 sm:px-6 py-8',
  card:  'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#CE1868] focus:ring-2 focus:ring-[#CE1868]/10 transition-all',
};

const BLANK: Omit<EuphoriaTestimonial, 'id' | 'createdAt' | 'updatedAt'> = {
  dancerName: '', role: '', quote: '', year: '', photoUrl: '', sortOrder: 0, isActive: true,
};

// ─── Form ─────────────────────────────────────────────────────────────────────

function TestimonialForm({
  initial, onSave, onCancel, saving,
}: {
  initial: Partial<EuphoriaTestimonial>;
  onSave:  (data: Omit<EuphoriaTestimonial, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, file: File | null) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm]               = useState({ ...BLANK, ...initial });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview,     setPreview]     = useState(initial.photoUrl ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  function set(key: string, val: string | boolean | number) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function readFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.quote.trim())      { alert('Quote is required.');       return; }
    if (!form.dancerName.trim()) { alert('Dancer name is required.'); return; }
    onSave({ ...(form as typeof BLANK & { id?: string }), id: initial.id }, pendingFile);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {/* Quote */}
      <div>
        <label className={S.label}>Quote *</label>
        <textarea
          value={form.quote}
          onChange={e => set('quote', e.target.value)}
          rows={4}
          className={S.input}
          placeholder="What this experience meant to me…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={S.label}>Dancer Name *</label>
          <input
            value={form.dancerName}
            onChange={e => set('dancerName', e.target.value)}
            className={S.input}
            placeholder="Maria Rodriguez"
          />
        </div>
        <div>
          <label className={S.label}>Role / Title</label>
          <input
            value={form.role}
            onChange={e => set('role', e.target.value)}
            className={S.input}
            placeholder="Lead Performer, 2021 Team"
          />
        </div>
        <div>
          <label className={S.label}>Year</label>
          <input
            value={form.year}
            onChange={e => set('year', e.target.value)}
            className={S.input}
            placeholder="2024"
          />
        </div>
        <div>
          <label className={S.label}>Sort Order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={e => set('sortOrder', +e.target.value)}
            className={S.input}
          />
        </div>
      </div>

      {/* Photo */}
      <div>
        <label className={S.label}>Dancer Photo (optional)</label>
        {preview ? (
          <div className="relative mb-2 inline-block">
            <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-full border-2 border-gray-200" />
            <button
              type="button"
              onClick={() => { setPreview(''); set('photoUrl', ''); setPendingFile(null); }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <div
            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#CE1868] transition-colors text-gray-400 text-xs text-center mb-2"
            onClick={() => inputRef.current?.click()}
          >
            Add photo
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }}
        />
        {!preview && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-gray-500 underline"
          >
            Upload photo
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="el-t-active"
          checked={form.isActive}
          onChange={e => set('isActive', e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: PINK }}
        />
        <label htmlFor="el-t-active" className="text-sm font-semibold text-gray-700">
          Active (visible on site)
        </label>
      </div>

      <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Testimonial'}
        </button>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EuphoriaTestimonialsAdminPage() {
  const [items,   setItems]   = useState<EuphoriaTestimonial[]>([]);
  const [editing, setEditing] = useState<Partial<EuphoriaTestimonial> | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getEuphoriaTestimonials().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(
    data: Omit<EuphoriaTestimonial, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    file: File | null,
  ) {
    setSaving(true);
    try {
      await saveEuphoriaTestimonial(data, file);
      setEditing(null);
      load();
    } catch { /* noop */ } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await deleteEuphoriaTestimonial(id);
    load();
  }

  async function toggleActive(item: EuphoriaTestimonial) {
    await saveEuphoriaTestimonial({ ...item, isActive: !item.isActive });
    load();
  }

  return (
    <div className={S.page}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full inline-block" style={{ backgroundColor: PINK }} />
            Euphoria Testimonials
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} testimonial{items.length !== 1 ? 's' : ''} — shown as auto-scrolling carousel on the home page.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* DB setup notice */}
      <div className="bg-pink-50 border border-pink-200 rounded-xl px-5 py-4 mb-6">
        <p className="text-sm font-semibold text-pink-800 mb-1">Supabase Table Required</p>
        <p className="text-xs text-pink-700">
          This feature requires an <code className="bg-pink-100 px-1 rounded">euphoria_testimonials</code> table in Supabase
          with columns: id, dancer_name, role, quote, year, photo_url, sort_order, is_active, created_at, updated_at.
        </p>
      </div>

      {/* Add/edit form */}
      {editing !== null && (
        <div className={`${S.card} mb-6 p-6`}>
          <h2 className="text-base font-black text-gray-900 mb-5">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <TestimonialForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 py-12 justify-center text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-semibold">No testimonials yet.</p>
          <p className="text-sm mt-1">Add dancer stories to build trust with future members.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className={`${S.card} p-5`}>
              <div className="flex items-start gap-4">
                {/* Photo */}
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.dancerName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2"
                    style={{ borderColor: PINK }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                    style={{ backgroundColor: PINK }}
                  >
                    {item.dancerName.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">{item.dancerName}</span>
                      {item.role && <span className="text-xs text-gray-500 ml-2">{item.role}</span>}
                      {item.year && <span className="text-xs text-gray-400 ml-2">· {item.year}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleActive(item)}
                        className="p-1.5 rounded text-gray-400 hover:bg-gray-100 transition-colors"
                        title={item.isActive ? 'Hide' : 'Show'}
                      >
                        {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => setEditing(item)}
                        className="px-3 py-1 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-3">"{item.quote}"</p>
                  {!item.isActive && (
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Hidden</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
