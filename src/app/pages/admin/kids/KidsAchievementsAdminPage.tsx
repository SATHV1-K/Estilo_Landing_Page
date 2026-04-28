// Admin — Kids Achievements CRUD manager.

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff, Loader2, X, Save, Trophy } from 'lucide-react';
import {
  getKidsAchievements, saveKidsAchievement, deleteKidsAchievement,
} from '../../../../lib/kidsAchievementsService';
import type { KidsAchievement } from '../../../../lib/types';

const GOLD = '#F6B000';

const S = {
  page:  'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:  'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
};

const BLANK: Omit<KidsAchievement, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', titleEs: '', description: '', descriptionEs: '',
  imageUrl: '', date: '', sortOrder: 0, isActive: true,
};

// ─── Form ─────────────────────────────────────────────────────────────────────

function AchievementForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<KidsAchievement>;
  onSave: (data: Omit<KidsAchievement, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, file: File | null) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm]             = useState({ ...BLANK, ...initial });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview,     setPreview]   = useState(initial.imageUrl ?? '');
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
    if (!form.title) { alert('Title is required'); return; }
    onSave({ ...(form as typeof BLANK & { id?: string }), id: initial.id }, pendingFile);
  }

  const dateValue = form.date ? form.date.slice(0, 10) : '';

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Image */}
      <div>
        <label className={S.label}>Photo</label>
        {preview ? (
          <div className="relative mb-2">
            <img src={preview} alt="preview" className="w-full h-44 object-cover rounded-xl border border-gray-200" />
            <button type="button" onClick={() => { setPreview(''); set('imageUrl', ''); setPendingFile(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
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
            <p className="text-sm text-gray-400">Click or drag an image here</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={S.label}>Title (EN) *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} className={S.input} placeholder="1st Place — Regional Competition" required />
        </div>
        <div>
          <label className={S.label}>Title (ES)</label>
          <input value={form.titleEs} onChange={e => set('titleEs', e.target.value)} className={S.input} placeholder="1er Lugar — Competencia Regional" />
        </div>
        <div className="sm:col-span-2">
          <label className={S.label}>Description (EN)</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={S.input} placeholder="Our kids team won 1st place at the tri-state dance competition…" />
        </div>
        <div className="sm:col-span-2">
          <label className={S.label}>Description (ES)</label>
          <textarea value={form.descriptionEs} onChange={e => set('descriptionEs', e.target.value)} rows={3} className={S.input} placeholder="Nuestro equipo ganó el 1er lugar en la competencia…" />
        </div>
        <div>
          <label className={S.label}>Date</label>
          <input
            type="date"
            value={dateValue}
            onChange={e => set('date', e.target.value ? new Date(e.target.value).toISOString() : '')}
            className={S.input}
          />
        </div>
        <div>
          <label className={S.label}>Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', +e.target.value)} className={S.input} />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input type="checkbox" id="ach-active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-amber-500" />
          <label htmlFor="ach-active" className="text-sm font-semibold text-gray-700">Active (visible on site)</label>
        </div>
      </div>

      <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: GOLD, color: '#0A0A0A' }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Achievement'}
        </button>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function KidsAchievementsAdminPage() {
  const [achievements, setAchievements] = useState<KidsAchievement[]>([]);
  const [editing,      setEditing]      = useState<Partial<KidsAchievement> | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getKidsAchievements().then(setAchievements).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(
    data: Omit<KidsAchievement, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    file: File | null,
  ) {
    setSaving(true);
    try {
      await saveKidsAchievement(data, file);
      setEditing(null);
      load();
    } catch { /* noop */ } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this achievement?')) return;
    await deleteKidsAchievement(id);
    load();
  }

  async function toggleActive(a: KidsAchievement) {
    await saveKidsAchievement({ ...a, isActive: !a.isActive });
    load();
  }

  return (
    <div className={S.page}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🐝 Kids Achievements</h1>
          <p className="text-sm text-gray-500 mt-1">{achievements.length} achievement{achievements.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          <Plus size={16} /> New Achievement
        </button>
      </div>

      {editing !== null && (
        <div className={`${S.card} mb-6 p-6`}>
          <h2 className="text-base font-black text-gray-900 mb-5">{editing.id ? 'Edit Achievement' : 'New Achievement'}</h2>
          <AchievementForm
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
      ) : achievements.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No achievements yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(a => {
            const dateStr = a.date ? new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
            return (
              <div key={a.id} className={`${S.card} flex flex-col`}>
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt={a.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 flex items-center justify-center" style={{ backgroundColor: '#4A6FA5' }}>
                    <Trophy size={32} className="text-white opacity-60" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm text-gray-900 leading-snug mb-0.5">{a.title}</h3>
                  {dateStr && <p className="text-xs font-semibold mb-1" style={{ color: GOLD }}>{dateStr}</p>}
                  {a.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{a.description}</p>}
                  <div className="flex items-center gap-2 mt-auto">
                    <button onClick={() => toggleActive(a)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                      {a.isActive ? <Eye size={15} /> : <EyeOff size={15} className="text-gray-300" />}
                    </button>
                    <button onClick={() => setEditing(a)} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={15} />
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
