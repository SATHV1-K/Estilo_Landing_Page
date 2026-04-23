// Admin — Gallery Photos manager.

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getGalleryPhotos, saveGalleryPhoto, deleteGalleryPhoto,
  type GalleryPhoto, type PhotoCategory,
} from '../../../lib/galleryService';
import { Image as ImageIcon, Plus, Trash2, Eye, EyeOff, X, Upload, Loader2 } from 'lucide-react';

const GOLD = '#F6B000';

const S = {
  input:  'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
  label:  'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1',
  btn:    'px-4 py-2 rounded-lg text-sm font-bold transition-all',
  card:   'bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm',
};

const CATEGORIES: { id: PhotoCategory; label: string }[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'class',       label: 'Class' },
  { id: 'event',       label: 'Event' },
  { id: 'studio',      label: 'Studio' },
  { id: 'general',     label: 'General' },
];

const BLANK: Omit<GalleryPhoto, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', titleEs: '', altText: '', imageUrl: '', category: 'general', sortOrder: 0, isActive: true,
};

function formatBytes(bytes: number): string {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// ─── PhotoForm ────────────────────────────────────────────────────────────────

function PhotoForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<GalleryPhoto>;
  onSave: (data: Omit<GalleryPhoto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, file: File | null) => void;
  onCancel: () => void;
}) {
  const [form, setForm]           = useState({ ...BLANK, ...initial });
  const [fileSize, setFileSize]   = useState(0);
  const [dragOver, setDragOver]   = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function set(key: string, val: string | boolean | number) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function readFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { alert('Max file size is 10 MB'); return; }
    setPendingFile(file);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      set('imageUrl', reader.result as string);
      if (!form.altText) set('altText', file.name.replace(/\.[^.]+$/, ''));
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) { alert('Please upload an image'); return; }
    onSave({ ...(form as any), id: initial.id }, pendingFile);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Image upload */}
      <div>
        <label className={S.label}>Photo *</label>
        {form.imageUrl ? (
          <div className="relative">
            <img src={form.imageUrl} alt="preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
            <button
              type="button"
              onClick={() => { set('imageUrl', ''); setFileSize(0); setPendingFile(null); }}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow border border-gray-200 text-gray-500 hover:text-red-600"
            >
              <X size={14} />
            </button>
            {fileSize > 0 && <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">{formatBytes(fileSize)}</span>}
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg h-40 cursor-pointer transition-colors ${dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-gray-50'}`}
          >
            <Upload size={28} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click or drag & drop image</span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP · Max 10 MB</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={S.label}>Title (EN)</label>
          <input className={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Photo title" />
        </div>
        <div>
          <label className={S.label}>Title (ES)</label>
          <input className={S.input} value={form.titleEs} onChange={e => set('titleEs', e.target.value)} placeholder="Título en español" />
        </div>
      </div>

      <div>
        <label className={S.label}>Alt Text</label>
        <input className={S.input} value={form.altText} onChange={e => set('altText', e.target.value)} placeholder="Describe the photo for accessibility" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={S.label}>Category</label>
          <select className={S.input} value={form.category} onChange={e => set('category', e.target.value as PhotoCategory)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={S.label}>Sort Order</label>
          <input type="number" className={S.input} value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} min={0} />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-amber-400" />
        <span className="text-sm font-semibold text-gray-700">Active (visible on site)</span>
      </label>

      <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className={`${S.btn} bg-gray-100 text-gray-700 hover:bg-gray-200`}>Cancel</button>
        <button type="submit" className={`${S.btn} text-[#0A0A0A] font-black`} style={{ background: GOLD }}>Save Photo</button>
      </div>
    </form>
  );
}

// ─── GalleryAdminPage ─────────────────────────────────────────────────────────

export function GalleryAdminPage() {
  const [photos, setPhotos]         = useState<GalleryPhoto[]>([]);
  const [editing, setEditing]       = useState<Partial<GalleryPhoto> | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [loading, setLoading]       = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getGalleryPhotos();
      setPhotos(data);
    } catch (err) {
      console.error('Failed to load photos:', err);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  async function handleSave(data: any, file: File | null) {
    setSaving(true);
    try {
      await saveGalleryPhoto(data, file);
      await refresh();
      setEditing(null);
    } catch (err) {
      console.error('Failed to save photo:', err);
      alert('Failed to save photo. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGalleryPhoto(id);
      await refresh();
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete photo:', err);
      alert('Failed to delete photo. Please try again.');
    }
  }

  async function toggleActive(photo: GalleryPhoto) {
    try {
      await saveGalleryPhoto({ ...photo, isActive: !photo.isActive });
      await refresh();
    } catch (err) {
      console.error('Failed to update photo:', err);
    }
  }

  const activeCount = photos.filter(p => p.isActive).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gallery Photos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{photos.length} total · {activeCount} active</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-[#0A0A0A]"
          style={{ background: GOLD }}
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-xl text-center">
          <ImageIcon size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold mb-1">No photos yet</p>
          <p className="text-sm text-gray-400 mb-4">Upload your first gallery photo to get started</p>
          <button onClick={() => setEditing({})} className="px-4 py-2 rounded-lg text-sm font-bold text-[#0A0A0A]" style={{ background: GOLD }}>
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className={`${S.card} group relative`}>
              <div className="aspect-square bg-gray-100">
                <img src={photo.imageUrl} alt={photo.altText || photo.title} className="w-full h-full object-cover" />
              </div>
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setEditing(photo)}
                  className="p-2 bg-white rounded-lg shadow text-gray-700 hover:text-amber-500 transition-colors"
                  title="Edit"
                >
                  <ImageIcon size={15} />
                </button>
                <button
                  onClick={() => toggleActive(photo)}
                  className={`p-2 rounded-lg shadow transition-colors ${photo.isActive ? 'bg-white text-gray-700 hover:text-amber-500' : 'bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                  title={photo.isActive ? 'Deactivate' : 'Activate'}
                >
                  {photo.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => setDeleteId(photo.id)}
                  className="p-2 bg-white rounded-lg shadow text-gray-700 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              {/* Info */}
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-800 truncate">{photo.title || <span className="italic text-gray-400">Untitled</span>}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-gray-400 capitalize">{photo.category}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${photo.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {photo.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900">{editing.id ? 'Edit Photo' : 'Add Photo'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            {saving ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 size={28} className="animate-spin text-amber-400" />
                <p className="text-sm text-gray-500">Uploading photo…</p>
              </div>
            ) : (
              <PhotoForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">Delete Photo?</h2>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
