// Admin — Kids Gallery manager (photos + YouTube videos).

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff, Loader2, X, Save, Play } from 'lucide-react';
import {
  getKidsGalleryItems, saveKidsGalleryItem, deleteKidsGalleryItem,
} from '../../../../lib/kidsGalleryService';
import type { KidsGalleryItem, KidsGalleryCategory } from '../../../../lib/types';

const GOLD = '#F6B000';

const S = {
  page:  'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:  'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
};

const CATEGORIES: { id: KidsGalleryCategory; label: string }[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'class',       label: 'Class' },
  { id: 'event',       label: 'Event' },
  { id: 'general',     label: 'General' },
];

const BLANK: Omit<KidsGalleryItem, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', titleEs: '', type: 'photo', url: '', thumbnailUrl: '',
  youtubeId: '', category: 'general', sortOrder: 0, isActive: true,
};

// ─── Form ─────────────────────────────────────────────────────────────────────

function GalleryItemForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<KidsGalleryItem>;
  onSave: (data: Omit<KidsGalleryItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, file: File | null) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm]             = useState({ ...BLANK, ...initial });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview,     setPreview]   = useState(initial.url ?? '');
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
    if (form.type === 'photo' && !form.url && !pendingFile) { alert('Please upload a photo'); return; }
    if (form.type === 'video' && !form.youtubeId) { alert('YouTube ID is required for videos'); return; }
    onSave({ ...(form as typeof BLANK & { id?: string }), id: initial.id }, form.type === 'photo' ? pendingFile : null);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Type toggle */}
      <div>
        <label className={S.label}>Type</label>
        <div className="flex gap-2">
          {(['photo', 'video'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => set('type', t)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={form.type === t ? { background: GOLD, color: '#0A0A0A' } : { background: '#F3F4F6', color: '#6B7280' }}
            >
              {t === 'photo' ? '📷 Photo' : '🎬 Video'}
            </button>
          ))}
        </div>
      </div>

      {form.type === 'photo' ? (
        <div>
          <label className={S.label}>Photo *</label>
          {preview ? (
            <div className="relative mb-2">
              <img src={preview} alt="preview" className="w-full h-44 object-cover rounded-xl border border-gray-200" />
              <button type="button" onClick={() => { setPreview(''); set('url', ''); setPendingFile(null); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) readFile(f); }}
              onDragOver={e => e.preventDefault()}
            >
              <p className="text-sm text-gray-400">Click or drag photo here</p>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
        </div>
      ) : (
        <div>
          <label className={S.label}>YouTube Video ID *</label>
          <input
            value={form.youtubeId}
            onChange={e => set('youtubeId', e.target.value)}
            className={S.input}
            placeholder="e.g. dQw4w9WgXcQ (from youtube.com/watch?v=…)"
          />
          {form.youtubeId && (
            <img
              src={`https://img.youtube.com/vi/${form.youtubeId}/hqdefault.jpg`}
              alt="YouTube thumbnail"
              className="mt-2 w-44 h-28 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={S.label}>Title (EN)</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} className={S.input} placeholder="Class showcase 2024" />
        </div>
        <div>
          <label className={S.label}>Title (ES)</label>
          <input value={form.titleEs} onChange={e => set('titleEs', e.target.value)} className={S.input} placeholder="Presentación de clase 2024" />
        </div>
        <div>
          <label className={S.label}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={S.input}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={S.label}>Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', +e.target.value)} className={S.input} />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input type="checkbox" id="gi-active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-amber-500" />
          <label htmlFor="gi-active" className="text-sm font-semibold text-gray-700">Active (visible on site)</label>
        </div>
      </div>

      <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: GOLD, color: '#0A0A0A' }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Item'}
        </button>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function KidsGalleryAdminPage() {
  const [items,   setItems]   = useState<KidsGalleryItem[]>([]);
  const [editing, setEditing] = useState<Partial<KidsGalleryItem> | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<'all' | 'photo' | 'video'>('all');

  const load = useCallback(() => {
    setLoading(true);
    getKidsGalleryItems().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const shown = filter === 'all' ? items : items.filter(i => i.type === filter);

  async function handleSave(
    data: Omit<KidsGalleryItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    file: File | null,
  ) {
    setSaving(true);
    try {
      await saveKidsGalleryItem(data, file);
      setEditing(null);
      load();
    } catch { /* noop */ } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    await deleteKidsGalleryItem(id);
    load();
  }

  async function toggleActive(item: KidsGalleryItem) {
    await saveKidsGalleryItem({ ...item, isActive: !item.isActive });
    load();
  }

  return (
    <div className={S.page}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🐝 Kids Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {editing !== null && (
        <div className={`${S.card} mb-6 p-6`}>
          <h2 className="text-base font-black text-gray-900 mb-5">{editing.id ? 'Edit Item' : 'New Item'}</h2>
          <GalleryItemForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'photo', 'video'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            style={filter === f ? { background: GOLD, color: '#0A0A0A' } : { background: '#F3F4F6', color: '#6B7280' }}
          >
            {f === 'all' ? 'All' : f === 'photo' ? '📷 Photos' : '🎬 Videos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-12 justify-center text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📷</p>
          <p className="font-semibold">No items yet. Add some above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {shown.map(item => {
            const thumb = item.type === 'photo' ? item.url
              : item.thumbnailUrl || (item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '');
            return (
              <div key={item.id} className={`${S.card} group`}>
                <div className="relative w-full h-36 bg-gray-100">
                  {thumb ? (
                    <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl" style={{ backgroundColor: '#4A6FA5' }}>
                      {item.type === 'photo' ? '📷' : '🎬'}
                    </div>
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={20} className="text-white" fill="white" />
                    </div>
                  )}
                  {!item.isActive && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  {item.title && <p className="text-xs font-bold text-gray-700 truncate mb-2">{item.title}</p>}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => toggleActive(item)} className="p-1 rounded text-gray-400 hover:bg-gray-100 transition-colors">
                      {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => setEditing(item)} className="flex-1 py-1 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
