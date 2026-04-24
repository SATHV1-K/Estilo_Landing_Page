// InstructorsAdminPage — CRUD for instructor profiles with slide-out form panel.

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, GripVertical, X, Check,
  Upload, User, Link as LinkIcon, ChevronDown, ChevronUp, Loader2,
} from 'lucide-react';
import {
  getInstructors, saveInstructor, deleteInstructor, reorderInstructors,
} from '../../../lib/instructorsService';
import type { Instructor } from '../../../lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:    'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:    'bg-white rounded-xl border border-gray-200 shadow-sm',
  label:   'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:   'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  btn: {
    gold:   'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90',
    ghost:  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors',
    danger: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors',
    icon:   'p-2 rounded-lg transition-colors',
  },
};

const SOCIAL_PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Website'];

// ─── Empty instructor ─────────────────────────────────────────────────────────

function emptyInstructor(): Omit<Instructor, 'id'> {
  return {
    name: '',
    specialty: '',
    bio: '',
    bioEs: '',
    photo: '',
    socialLinks: [],
    sortOrder: 999,
    isActive: true,
  };
}

// ─── Photo Uploader ───────────────────────────────────────────────────────────

function PhotoUploader({
  previewUrl,
  onFilePick,
  onUrlChange,
}: {
  previewUrl: string;
  onFilePick: (file: File) => void;
  onUrlChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    onFilePick(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
        {previewUrl ? (
          <img src={previewUrl} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={28} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Upload size={13} />
          Choose Photo
        </button>
        <input
          type="text"
          value={previewUrl.startsWith('blob:') ? '' : previewUrl}
          onChange={e => onUrlChange(e.target.value)}
          placeholder="or paste image URL…"
          className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-amber-400 w-48"
        />
      </div>
    </div>
  );
}

// ─── Social Links Editor ──────────────────────────────────────────────────────

function SocialLinksEditor({
  links,
  onChange,
}: {
  links: { platform: string; url: string }[];
  onChange: (links: { platform: string; url: string }[]) => void;
}) {
  function add() {
    onChange([...links, { platform: 'Instagram', url: '' }]);
  }
  function remove(i: number) {
    onChange(links.filter((_, idx) => idx !== i));
  }
  function update(i: number, field: 'platform' | 'url', val: string) {
    const updated = links.map((l, idx) => idx === i ? { ...l, [field]: val } : l);
    onChange(updated);
  }

  return (
    <div>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select
              value={link.platform}
              onChange={e => update(i, 'platform', e.target.value)}
              className="px-2.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 bg-white w-32 flex-shrink-0"
            >
              {SOCIAL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <input
              type="url"
              value={link.url}
              onChange={e => update(i, 'url', e.target.value)}
              placeholder="https://…"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <Plus size={13} /> Add social link
      </button>
    </div>
  );
}

// ─── Instructor Form Panel ────────────────────────────────────────────────────

interface FormPanelProps {
  instructor: Instructor | null;
  saving: boolean;
  onSave: (data: Omit<Instructor, 'id'> & { id?: string }, photoFile: File | null) => Promise<void>;
  onClose: () => void;
}

function InstructorFormPanel({ instructor, saving, onSave, onClose }: FormPanelProps) {
  const isNew = !instructor;
  const [form, setForm]           = useState<Omit<Instructor, 'id'> & { id?: string }>(instructor ?? emptyInstructor());
  const [langTab, setLangTab]     = useState<'en' | 'es'>('en');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]     = useState(instructor?.photo ?? '');

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function handleFilePick(file: File) {
    setPendingPhoto(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleUrlChange(url: string) {
    set('photo', url);
    setPreviewUrl(url);
    setPendingPhoto(null);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim())      e.name      = 'Name is required';
    if (!form.specialty.trim()) e.specialty = 'Specialty is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form, pendingPhoto);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'New Instructor' : 'Edit Instructor'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} id="instructor-form" className="flex-1 overflow-y-auto px-6 py-5">
          {/* Photo */}
          <div className="mb-5">
            <label className={S.label}>Photo</label>
            <PhotoUploader
              previewUrl={previewUrl}
              onFilePick={handleFilePick}
              onUrlChange={handleUrlChange}
            />
          </div>

          {/* Name & specialty */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={S.label}>Name *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={S.input}
                placeholder="Instructor Name"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={S.label}>Specialty *</label>
              <input
                value={form.specialty}
                onChange={e => set('specialty', e.target.value)}
                className={S.input}
                placeholder="e.g. Salsa, Bachata"
              />
              {errors.specialty && <p className="text-xs text-red-600 mt-1">{errors.specialty}</p>}
            </div>
          </div>

          {/* Bio with EN/ES tabs */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Bio</label>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                {(['en', 'es'] as const).map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLangTab(l)}
                    className="px-3 py-1 text-xs font-bold transition-colors"
                    style={langTab === l ? { background: `${GOLD}22`, color: '#92700B' } : { color: '#9CA3AF' }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={langTab === 'en' ? form.bio : form.bioEs}
              onChange={e =>
                langTab === 'en'
                  ? set('bio', e.target.value)
                  : set('bioEs', e.target.value)
              }
              rows={4}
              className={S.input}
              placeholder={`Bio in ${langTab === 'en' ? 'English' : 'Spanish'}…`}
            />
          </div>

          {/* Social links */}
          <div className="mb-4">
            <label className={S.label}>Social Links</label>
            <SocialLinksEditor
              links={form.socialLinks}
              onChange={links => set('socialLinks', links)}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.isActive ? '' : 'bg-gray-200'}`}
              style={form.isActive ? { background: GOLD } : {}}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
            <span className="text-sm text-gray-700 font-semibold">
              {form.isActive ? 'Active — shown on public site' : 'Inactive — hidden from public'}
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost} disabled={saving}>
            Cancel
          </button>
          <button
            type="submit"
            form="instructor-form"
            className={S.btn.gold}
            style={{ background: GOLD, color: '#0A0A0A' }}
            disabled={saving}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {isNew ? 'Add Instructor' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Instructor Row ───────────────────────────────────────────────────────────

function InstructorRow({
  instructor,
  onEdit,
  onDelete,
  dragHandleProps,
}: {
  instructor: Instructor;
  onEdit: (i: Instructor) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div {...dragHandleProps} className="cursor-grab text-gray-300 hover:text-gray-500 flex-shrink-0">
        <GripVertical size={18} />
      </div>

      {/* Photo */}
      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
        {instructor.photo ? (
          <img src={instructor.photo} alt={instructor.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={18} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{instructor.name}</p>
        <p className="text-xs text-gray-500 truncate" style={{ color: GOLD }}>{instructor.specialty}</p>
      </div>

      {/* Status badge */}
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
          instructor.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {instructor.isActive ? 'Active' : 'Inactive'}
      </span>

      {/* Social count */}
      {instructor.socialLinks.length > 0 && (
        <span className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
          <LinkIcon size={11} /> {instructor.socialLinks.length}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(instructor)}
          className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`}
          title="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete instructor "${instructor.name}"?`)) onDelete(instructor.id);
          }}
          className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── InstructorsAdminPage ─────────────────────────────────────────────────────

export function InstructorsAdminPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [editing, setEditing]         = useState<Instructor | null>(null);
  const [panelOpen, setPanelOpen]     = useState(false);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);

  const refresh = useCallback(async () => {
    const data = await getInstructors();
    setInstructors(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  function openNew()              { setEditing(null); setPanelOpen(true); }
  function openEdit(i: Instructor) { setEditing(i);  setPanelOpen(true); }
  function closePanel()           { setPanelOpen(false); setEditing(null); }

  async function handleSave(data: Omit<Instructor, 'id'> & { id?: string }, photoFile: File | null) {
    setSaving(true);
    try {
      await saveInstructor(data, photoFile ?? undefined);
      await refresh();
      closePanel();
    } catch (err) {
      console.error('Failed to save instructor:', err);
      alert('Failed to save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteInstructor(id);
      await refresh();
    } catch (err) {
      console.error('Failed to delete instructor:', err);
      alert('Failed to delete. Please try again.');
    }
  }

  async function moveUp(id: string) {
    const ids = instructors.map(i => i.id);
    const idx = ids.indexOf(id);
    if (idx > 0) {
      [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
      await reorderInstructors(ids);
      await refresh();
    }
  }

  async function moveDown(id: string) {
    const ids = instructors.map(i => i.id);
    const idx = ids.indexOf(id);
    if (idx < ids.length - 1) {
      [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
      await reorderInstructors(ids);
      await refresh();
    }
  }

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Instructors</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage instructor profiles shown on the public site.
          </p>
        </div>
        <button
          onClick={openNew}
          className={S.btn.gold}
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          <Plus size={16} /> Add Instructor
        </button>
      </div>

      {/* List */}
      <div className={S.card}>
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 size={24} className="mx-auto mb-3 text-gray-300 animate-spin" />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="py-16 text-center">
            <User size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-500">No instructors yet.</p>
          </div>
        ) : (
          instructors.map((inst, idx) => (
            <div key={inst.id} className="flex items-stretch">
              <div className="flex flex-col justify-center border-r border-gray-100 px-1">
                <button
                  onClick={() => moveUp(inst.id)}
                  disabled={idx === 0}
                  className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveDown(inst.id)}
                  disabled={idx === instructors.length - 1}
                  className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex-1">
                <InstructorRow
                  instructor={inst}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info note */}
      <p className="text-xs text-gray-400 mt-4">
        The public instructor grid reads this data. Changes take effect immediately on reload.
      </p>

      {/* Slide-out panel */}
      {panelOpen && (
        <InstructorFormPanel
          instructor={editing}
          saving={saving}
          onSave={handleSave}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
