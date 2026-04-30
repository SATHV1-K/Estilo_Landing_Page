// Admin — Kids Programs CRUD manager.

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff, Loader2, X, Save } from 'lucide-react';
import {
  getKidsPrograms, saveKidsProgram, deleteKidsProgram,
} from '../../../../lib/kidsProgramsService';
import type { KidsProgram } from '../../../../lib/types';

const GOLD = '#F6B000';

const S = {
  page:   'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:   'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
  label:  'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:  'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
};

const BLANK: Omit<KidsProgram, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', nameEs: '', description: '', descriptionEs: '',
  ageRange: '5+', imageUrl: '', scheduleNote: '', enrollLink: '', sortOrder: 0, isActive: true,
};

// ─── Form ─────────────────────────────────────────────────────────────────────

function ProgramForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<KidsProgram>;
  onSave: (data: Omit<KidsProgram, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, file: File | null) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...BLANK, ...initial });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial.imageUrl ?? '');
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
    if (!form.name) { alert('Program name is required'); return; }
    onSave({ ...(form as typeof BLANK & { id?: string }), id: initial.id }, pendingFile);
  }

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
          <label className={S.label}>Name (EN) *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} className={S.input} placeholder="Kids Latin Rhythms" required />
        </div>
        <div>
          <label className={S.label}>Name (ES)</label>
          <input value={form.nameEs} onChange={e => set('nameEs', e.target.value)} className={S.input} placeholder="Ritmos Latinos para Niños" />
        </div>
        <div>
          <label className={S.label}>Age Range</label>
          <input value={form.ageRange} onChange={e => set('ageRange', e.target.value)} className={S.input} placeholder="5–10, 5+, etc." />
        </div>
        <div>
          <label className={S.label}>Schedule Note</label>
          <input value={form.scheduleNote} onChange={e => set('scheduleNote', e.target.value)} className={S.input} placeholder="Mon & Wed 6–7 PM" />
        </div>
        <div className="sm:col-span-2">
          <label className={S.label}>Enroll Link (Square / Payment URL)</label>
          <input
            value={form.enrollLink}
            onChange={e => set('enrollLink', e.target.value)}
            className={S.input}
            placeholder="https://square.link/u/..."
            type="url"
          />
          <p className="text-xs text-gray-400 mt-1">Paste your Square payment link here. Families will be sent to this URL when they click "Enroll Now".</p>
        </div>
        <div className="sm:col-span-2">
          <label className={S.label}>Description (EN)</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={S.input} placeholder="Describe the program…" />
        </div>
        <div className="sm:col-span-2">
          <label className={S.label}>Description (ES)</label>
          <textarea value={form.descriptionEs} onChange={e => set('descriptionEs', e.target.value)} rows={3} className={S.input} placeholder="Descripción del programa…" />
        </div>
        <div>
          <label className={S.label}>Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', +e.target.value)} className={S.input} />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input type="checkbox" id="prog-active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-amber-500" />
          <label htmlFor="prog-active" className="text-sm font-semibold text-gray-700">Active (visible on site)</label>
        </div>
      </div>

      <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: GOLD, color: '#0A0A0A' }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Program'}
        </button>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function KidsProgramsAdminPage() {
  const [programs, setPrograms] = useState<KidsProgram[]>([]);
  const [editing,  setEditing]  = useState<Partial<KidsProgram> | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getKidsPrograms().then(setPrograms).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(
    data: Omit<KidsProgram, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    file: File | null,
  ) {
    setSaving(true);
    try {
      await saveKidsProgram(data, file);
      setEditing(null);
      load();
    } catch { /* noop */ } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this program?')) return;
    await deleteKidsProgram(id);
    load();
  }

  async function toggleActive(p: KidsProgram) {
    await saveKidsProgram({ ...p, isActive: !p.isActive });
    load();
  }

  return (
    <div className={S.page}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🐝 Kids Programs</h1>
          <p className="text-sm text-gray-500 mt-1">{programs.length} program{programs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          <Plus size={16} /> New Program
        </button>
      </div>

      {/* Form panel */}
      {editing !== null && (
        <div className={`${S.card} mb-6 p-6`}>
          <h2 className="text-base font-black text-gray-900 mb-5">{editing.id ? 'Edit Program' : 'New Program'}</h2>
          <ProgramForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-3 py-12 justify-center text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎵</p>
          <p className="font-semibold">No programs yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map(p => (
            <div key={p.id} className={`${S.card} flex flex-col`}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 flex items-center justify-center text-4xl" style={{ backgroundColor: '#4A6FA5' }}>🎵</div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-sm text-gray-900 leading-snug mb-0.5">{p.name}</h3>
                <p className="text-xs text-gray-400 mb-1">Ages {p.ageRange}</p>
                {p.scheduleNote && <p className="text-xs text-gray-400 mb-2">{p.scheduleNote}</p>}
                <div className="flex items-center gap-2 mt-auto">
                  <button onClick={() => toggleActive(p)} title={p.isActive ? 'Hide' : 'Show'}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                    {p.isActive ? <Eye size={15} /> : <EyeOff size={15} className="text-gray-300" />}
                  </button>
                  <button onClick={() => setEditing(p)} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
