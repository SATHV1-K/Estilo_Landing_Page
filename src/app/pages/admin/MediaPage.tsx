// MediaPage — media manager with drag-drop upload, preview grid, alt text editing.
// Files are stored as base64 data URLs in localStorage via adminData.

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Trash2, Pencil, X, Check, Image as ImageIcon,
  Film, AlertCircle, RefreshCw,
} from 'lucide-react';
import {
  getAllMedia, saveMedia, deleteMedia, uploadMediaFile,
  formatBytes, type MediaFile,
} from '../../../lib/mediaService';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;  // 50 MB
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime';

const S = {
  page:    'max-w-6xl mx-auto px-4 sm:px-6 py-8',
  input:   'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
  label:   'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1',
  card:    'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
};

// ─── Upload Zone ─────────────────────────────────────────────────────────────

function UploadZone({
  onUploaded,
  slot,
}: {
  onUploaded: (file: MediaFile) => void;
  slot: string;
}) {
  const [dragging, setDragging]   = useState(false);
  const [progress, setProgress]  = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);
    const isVideo = file.type.startsWith('video/');
    const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > max) {
      setError(`File too large. Max ${isVideo ? '50 MB' : '10 MB'}.`);
      return;
    }
    setProgress(`Uploading ${file.name}…`);
    try {
      const record = await uploadMediaFile(file, slot);
      onUploaded(record);
      setProgress(null);
    } catch {
      setError('Upload failed. Please try again.');
      setProgress(null);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = '';
    }
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-amber-400 bg-amber-50'
          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={onFileChange}
      />
      {progress ? (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <RefreshCw size={16} className="animate-spin" style={{ color: GOLD }} />
          {progress}
        </div>
      ) : (
        <>
          <Upload size={28} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">
            Drag & drop or <span style={{ color: GOLD }}>browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, WebP, GIF · up to 10 MB &nbsp;|&nbsp; MP4, MOV · up to 50 MB
          </p>
        </>
      )}
      {error && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}

// ─── Slot selector ────────────────────────────────────────────────────────────

const COMMON_SLOTS = [
  'home.hero.image',
  'home.hero.video',
  'about.hero.image',
  'styles.hero.image',
  'schedule.hero.image',
  'packages.hero.image',
  'contact.hero.image',
];

function SlotSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className={S.label}>Slot (where it's used)</label>
        <input
          list="slots-list"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. home.hero.image"
          className={S.input}
        />
        <datalist id="slots-list">
          {COMMON_SLOTS.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>
    </div>
  );
}

// ─── MediaCard ────────────────────────────────────────────────────────────────

function MediaCard({
  file,
  onDelete,
  onUpdate,
}: {
  file: MediaFile;
  onDelete: (id: string) => void;
  onUpdate: (file: MediaFile) => void;
}) {
  const [editing, setEditing]   = useState(false);
  const [altText, setAltText]   = useState(file.altText);
  const [slot, setSlot]         = useState(file.slot);
  const [editSaving, setEditSaving] = useState(false);
  const isVideo = file.mimeType.startsWith('video/');

  async function saveEdits() {
    setEditSaving(true);
    try {
      const updated = await saveMedia({ ...file, altText, slot });
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error('Failed to save media:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Film size={32} className="text-gray-400" />
          </div>
        ) : (
          <img
            src={file.url}
            alt={file.altText || file.filename}
            className="w-full h-full object-cover"
          />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => setEditing(true)}
            className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this media file?')) onDelete(file.id);
            }}
            className="p-2 bg-white/90 rounded-lg text-red-600 hover:bg-white transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-bold text-gray-800 truncate" title={file.filename}>
          {file.filename}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full truncate max-w-[120px]"
            style={{ background: `${GOLD}22`, color: '#92700B' }}
            title={file.slot}
          >
            {file.slot || 'no slot'}
          </span>
          <span className="text-[10px] text-gray-400 ml-auto">{formatBytes(file.fileSize)}</span>
        </div>
        {file.width && (
          <p className="text-[10px] text-gray-400 mt-0.5">{file.width} × {file.height}px</p>
        )}
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="border-t border-gray-100 px-3 py-3 bg-gray-50">
          <div className="mb-2">
            <label className={S.label}>Alt Text</label>
            <input
              value={altText}
              onChange={e => setAltText(e.target.value)}
              className={S.input}
              placeholder="Describe the image…"
            />
          </div>
          <SlotSelector value={slot} onChange={setSlot} />
          <div className="flex gap-2 mt-2">
            <button
              onClick={saveEdits}
              disabled={editSaving}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors text-gray-900 disabled:opacity-60"
              style={{ background: GOLD }}
            >
              {editSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
              {editSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              disabled={editSaving}
              onClick={() => { setEditing(false); setAltText(file.altText); setSlot(file.slot); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40"
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MediaPage ────────────────────────────────────────────────────────────────

export function MediaPage() {
  const [files, setFiles]     = useState<MediaFile[]>([]);
  const [slot, setSlot]       = useState('home.hero.video');
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);

  const refreshFiles = useCallback(async () => {
    const data = await getAllMedia();
    setFiles(data);
  }, []);

  useEffect(() => { refreshFiles().finally(() => setLoading(false)); }, [refreshFiles]);

  function handleUploaded(_file: MediaFile) {
    refreshFiles().catch(console.error);
  }

  async function handleDelete(id: string) {
    try { await deleteMedia(id); await refreshFiles(); }
    catch (err) { console.error('Failed to delete:', err); alert('Delete failed. Please try again.'); }
  }

  function handleUpdate(updated: MediaFile) {
    setFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
  }

  const filtered = files.filter(f =>
    !filter ||
    f.filename.toLowerCase().includes(filter.toLowerCase()) ||
    f.slot.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Media Manager</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Upload and manage images and videos. Files are stored in Supabase Storage.
        </p>
      </div>

      {/* Upload zone */}
      <div className={`${S.card} p-5 mb-6`}>
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">
          Upload New File
        </h2>
        <div className="mb-4">
          <SlotSelector value={slot} onChange={setSlot} />
        </div>
        <UploadZone slot={slot} onUploaded={handleUploaded} />
        <p className="text-xs text-gray-400 mt-3">
          <span className="font-semibold">Note:</span> Images up to 10 MB and videos up to 50 MB are supported.
        </p>

        {/* Hero video requirements — shown when home.hero.video slot is selected */}
        {slot === 'home.hero.video' && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-amber-700 mb-2">
              Hero Video Requirements
            </p>
            <ul className="space-y-1 text-xs text-gray-700">
              <li><span className="font-semibold">Format:</span> MP4 (H.264 codec) — widest browser support</li>
              <li><span className="font-semibold">Dimensions:</span> 1920 × 1080 px (Full HD) — minimum 1280 × 720 px</li>
              <li><span className="font-semibold">Aspect ratio:</span> 16:9</li>
              <li><span className="font-semibold">Duration:</span> ~10 seconds for a clean seamless loop</li>
              <li><span className="font-semibold">File size:</span> 5 – 20 MB recommended (max 50 MB)</li>
              <li><span className="font-semibold">Frame rate:</span> 24 – 30 fps</li>
              <li><span className="font-semibold">Audio:</span> Not needed — video plays muted on all browsers</li>
              <li><span className="font-semibold">Color space:</span> sRGB / Rec. 709</li>
            </ul>
            <p className="mt-2 text-[11px] text-gray-500">
              Tip: Export from Premiere / DaVinci at H.264, CRF 23, Faststart enabled. Smaller files stream faster on mobile.
            </p>
          </div>
        )}
      </div>

      {/* Library */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-700">
          Media Library ({filtered.length})
        </h2>
        <input
          type="search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter by name or slot…"
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 w-56"
        />
      </div>

      {loading ? (
        <div className={`${S.card} p-12 text-center`}>
          <RefreshCw size={24} className="mx-auto mb-3 text-gray-300 animate-spin" />
          <p className="text-sm text-gray-400">Loading media library…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${S.card} p-12 text-center`}>
          <ImageIcon size={32} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-semibold text-gray-500">No media uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Use the upload zone above to add files.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(file => (
            <MediaCard
              key={file.id}
              file={file}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
