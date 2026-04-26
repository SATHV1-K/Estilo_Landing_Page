// StylesAdminPage — CRUD for dance style cards with reorder and slide-out form.

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Check,
  Upload, Layers, ChevronUp, ChevronDown, Loader2,
} from 'lucide-react';
import {
  getStyles, saveStyle, deleteStyle, reorderStyles,
} from '../../../lib/stylesService';
import type { DanceStyle } from '../../../lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:   'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:   'bg-white rounded-xl border border-gray-200 shadow-sm',
  label:  'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:  'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  btn: {
    gold:  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90',
    ghost: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors',
    icon:  'p-2 rounded-lg transition-colors',
  },
};

const AGE_GROUPS: DanceStyle['ageGroup'][] = ['kids', 'adults', 'all'];

// ─── Empty style ──────────────────────────────────────────────────────────────

function emptyStyle(): Omit<DanceStyle, 'id'> {
  return {
    slug: '',
    name: '',
    nameEs: '',
    tagline: 'ADULTS',
    description: '',
    descriptionEs: '',
    heroImage: '',
    cardImage: '',
    videoUrl: '',
    ageGroup: 'adults',
    sortOrder: 999,
    isActive: true,
    contactOnly: false,
  };
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Image Uploader ───────────────────────────────────────────────────────────

function ImageUploader({
  label,
  previewUrl,
  onFilePick,
  onUrlChange,
}: {
  label: string;
  previewUrl: string;
  onFilePick: (file: File) => void;
  onUrlChange: (url: string) => void;
}) {
  return (
    <div>
      <label className={S.label}>{label}</label>
      <div className="flex gap-3 items-center">
        {previewUrl && (
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 flex gap-2">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0">
            <Upload size={12} />
            Choose
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onFilePick(f); e.target.value = ''; }}
            />
          </label>
          <input
            type="text"
            value={previewUrl.startsWith('blob:') ? '' : previewUrl}
            onChange={e => onUrlChange(e.target.value)}
            placeholder="or paste URL…"
            className="flex-1 px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-amber-400 min-w-0"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Video Uploader ───────────────────────────────────────────────────────────

function VideoUploader({
  previewUrl,
  onFilePick,
  onUrlChange,
}: {
  previewUrl: string;
  onFilePick: (file: File) => void;
  onUrlChange: (url: string) => void;
}) {
  return (
    <div>
      <label className={S.label}>Style Video (plays on detail page)</label>
      <div className="space-y-2">
        {previewUrl && (
          <div className="rounded-lg overflow-hidden bg-gray-900 border border-gray-200 aspect-video">
            <video src={previewUrl} controls className="w-full h-full object-contain" />
          </div>
        )}
        <div className="flex gap-2">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0">
            <Upload size={12} />
            Upload Video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onFilePick(f); e.target.value = ''; }}
            />
          </label>
          <input
            type="text"
            value={previewUrl.startsWith('blob:') ? '' : previewUrl}
            onChange={e => onUrlChange(e.target.value)}
            placeholder="or paste video URL…"
            className="flex-1 px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-amber-400 min-w-0"
          />
          {previewUrl && (
            <button
              type="button"
              onClick={() => onUrlChange('')}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-400">MP4, WebM, MOV — shown as autoplay loop on the style detail page</p>
      </div>
    </div>
  );
}

// ─── Style Form Panel ─────────────────────────────────────────────────────────

function StyleFormPanel({
  style,
  saving,
  onSave,
  onClose,
}: {
  style: DanceStyle | null;
  saving: boolean;
  onSave: (
    data: Omit<DanceStyle, 'id'> & { id?: string },
    files: { heroFile: File | null; cardFile: File | null; videoFile: File | null },
  ) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = !style;
  const [form, setForm]       = useState<Omit<DanceStyle, 'id'> & { id?: string }>(style ?? emptyStyle());
  const [langTab, setLangTab] = useState<'en' | 'es'>('en');
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const [heroFile, setHeroFile]         = useState<File | null>(null);
  const [cardFile, setCardFile]         = useState<File | null>(null);
  const [videoFile, setVideoFile]       = useState<File | null>(null);
  const [heroPreview, setHeroPreview]   = useState(style?.heroImage ?? '');
  const [cardPreview, setCardPreview]   = useState(style?.cardImage ?? '');
  const [videoPreview, setVideoPreview] = useState(style?.videoUrl ?? '');

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'name' && isNew) next.slug = slugify(val as string);
      return next;
    });
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.slug.trim())    e.slug    = 'Slug is required';
    if (!form.tagline.trim()) e.tagline = 'Tagline is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    await onSave(form, { heroFile, cardFile, videoFile });
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'New Style' : 'Edit Style'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>Name EN *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                className={S.input} placeholder="Salsa On1" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={S.label}>Name ES</label>
              <input value={form.nameEs} onChange={e => set('nameEs', e.target.value)}
                className={S.input} placeholder="Salsa On1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>URL Slug *</label>
              <input value={form.slug} onChange={e => set('slug', e.target.value)}
                className={S.input} placeholder="salsa-on1" />
              {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
            </div>
            <div>
              <label className={S.label}>Tagline *</label>
              <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
                className={S.input} placeholder="ADULTS" />
              {errors.tagline && <p className="text-xs text-red-600 mt-1">{errors.tagline}</p>}
            </div>
          </div>

          {/* Age group */}
          <div>
            <label className={S.label}>Age Group</label>
            <div className="flex gap-2">
              {AGE_GROUPS.map(ag => (
                <button
                  key={ag}
                  type="button"
                  onClick={() => set('ageGroup', ag)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
                  style={form.ageGroup === ag
                    ? { background: GOLD, color: '#0A0A0A', borderColor: GOLD }
                    : { borderColor: '#E5E7EB', color: '#6B7280' }}
                >
                  {ag.charAt(0).toUpperCase() + ag.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description with tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Description</label>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                {(['en', 'es'] as const).map(l => (
                  <button key={l} type="button" onClick={() => setLangTab(l)}
                    className="px-3 py-1 text-xs font-bold transition-colors"
                    style={langTab === l ? { background: `${GOLD}22`, color: '#92700B' } : { color: '#9CA3AF' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={langTab === 'en' ? form.description : form.descriptionEs}
              onChange={e => langTab === 'en'
                ? set('description', e.target.value)
                : set('descriptionEs', e.target.value)
              }
              rows={4}
              className={S.input}
              placeholder={`Description in ${langTab === 'en' ? 'English' : 'Spanish'}…`}
            />
          </div>

          {/* Images */}
          <ImageUploader
            label="Card Image"
            previewUrl={cardPreview}
            onFilePick={f => { setCardFile(f); setCardPreview(URL.createObjectURL(f)); }}
            onUrlChange={url => { set('cardImage', url); setCardPreview(url); setCardFile(null); }}
          />
          <ImageUploader
            label="Hero Image (detail page fallback)"
            previewUrl={heroPreview}
            onFilePick={f => { setHeroFile(f); setHeroPreview(URL.createObjectURL(f)); }}
            onUrlChange={url => { set('heroImage', url); setHeroPreview(url); setHeroFile(null); }}
          />
          <VideoUploader
            previewUrl={videoPreview}
            onFilePick={f => { setVideoFile(f); setVideoPreview(URL.createObjectURL(f)); }}
            onUrlChange={url => { set('videoUrl', url); setVideoPreview(url); setVideoFile(null); }}
          />

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button type="button" onClick={() => set('isActive', !form.isActive)}
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                style={{ background: form.isActive ? GOLD : '#E5E7EB' }}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-gray-700 font-semibold">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button type="button" onClick={() => set('contactOnly', !form.contactOnly)}
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                style={{ background: form.contactOnly ? GOLD : '#E5E7EB' }}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.contactOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-gray-700 font-semibold">Contact Only (no price)</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost} disabled={saving}>Cancel</button>
          <button onClick={handleSubmit} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }} disabled={saving}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {isNew ? 'Add Style' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Style Row ────────────────────────────────────────────────────────────────

function StyleRow({
  style,
  idx,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  style: DanceStyle;
  idx: number;
  total: number;
  onEdit: (s: DanceStyle) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col flex-shrink-0">
        <button onClick={() => onMoveUp(style.id)} disabled={idx === 0}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronUp size={14} />
        </button>
        <button onClick={() => onMoveDown(style.id)} disabled={idx === total - 1}
          className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="w-12 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
        {style.cardImage ? (
          <img src={style.cardImage} alt={style.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers size={16} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">{style.name}</p>
          {style.nameEs && style.nameEs !== style.name && (
            <span className="text-xs text-gray-400 truncate">/ {style.nameEs}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase">{style.tagline}</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">{style.ageGroup}</span>
          {style.contactOnly && (
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 rounded-full">Contact Only</span>
          )}
        </div>
      </div>

      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${style.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
        {style.isActive ? 'Active' : 'Inactive'}
      </span>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(style)} className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`} title="Edit">
          <Pencil size={15} />
        </button>
        <button
          onClick={() => { if (confirm(`Delete style "${style.name}"?`)) onDelete(style.id); }}
          className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── StylesAdminPage ──────────────────────────────────────────────────────────

export function StylesAdminPage() {
  const [styles, setStyles]   = useState<DanceStyle[]>([]);
  const [editing, setEditing] = useState<DanceStyle | null>(null);
  const [panelOpen, setPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const refresh = useCallback(async () => {
    const data = await getStyles();
    setStyles(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  function openNew()              { setEditing(null); setPanel(true); }
  function openEdit(s: DanceStyle) { setEditing(s);  setPanel(true); }
  function closePanel()           { setPanel(false); setEditing(null); }

  async function handleSave(
    data: Omit<DanceStyle, 'id'> & { id?: string },
    files: { heroFile: File | null; cardFile: File | null; videoFile: File | null },
  ) {
    setSaving(true);
    try {
      await saveStyle(data, { heroFile: files.heroFile, cardFile: files.cardFile, videoFile: files.videoFile });
      await refresh();
      closePanel();
    } catch (err) {
      console.error('Failed to save style:', err);
      alert('Failed to save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStyle(id);
      await refresh();
    } catch (err) {
      console.error('Failed to delete style:', err);
      alert('Failed to delete. Please try again.');
    }
  }

  async function move(id: string, dir: 1 | -1) {
    const ids = styles.map(s => s.id);
    const idx = ids.indexOf(id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    await reorderStyles(ids);
    await refresh();
  }

  return (
    <div className={S.page}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Styles Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage dance style cards displayed on the public Styles page and home grid.
          </p>
        </div>
        <button onClick={openNew} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
          <Plus size={16} /> Add Style
        </button>
      </div>

      <div className={S.card}>
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 size={24} className="mx-auto mb-3 text-gray-300 animate-spin" />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        ) : styles.length === 0 ? (
          <div className="py-16 text-center">
            <Layers size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-500">No styles yet.</p>
          </div>
        ) : (
          styles.map((style, idx) => (
            <StyleRow
              key={style.id}
              style={style}
              idx={idx}
              total={styles.length}
              onEdit={openEdit}
              onDelete={handleDelete}
              onMoveUp={id => move(id, -1)}
              onMoveDown={id => move(id, 1)}
            />
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        The public styles grid and detail pages read this data. Changes are live on next page load.
      </p>

      {panelOpen && (
        <StyleFormPanel style={editing} saving={saving} onSave={handleSave} onClose={closePanel} />
      )}
    </div>
  );
}
