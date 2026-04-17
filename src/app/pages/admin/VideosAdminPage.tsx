// VideosAdminPage — full CRUD for the video library.
// Sources: YouTube (auto-parses ID + thumbnail), Instagram (manual thumbnail),
// Direct Upload (base64 video + optional thumbnail).

import { useState, useEffect, useRef } from 'react';
import {
  Plus, Film, Star, Check, X, Pencil, Trash2,
  ChevronUp, ChevronDown, Upload, ExternalLink,
  Eye, EyeOff, AlertTriangle,
} from 'lucide-react';
import {
  getVideos, saveVideo, deleteVideo, reorderVideos,
  type Video, type VideoSource, type VideoCategory,
} from '../../../lib/adminData';
import { parseYouTubeId, getYouTubeThumbnail } from '../../../lib/youtube';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:  'max-w-6xl mx-auto px-4 sm:px-6 py-8',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input: 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  btn: {
    gold:  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90',
    ghost: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors',
    icon:  'p-2 rounded-lg transition-colors',
  },
};

type TabKey = 'all' | 'youtube' | 'instagram' | 'upload';

const TABS: { id: TabKey; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'youtube',   label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'upload',    label: 'Uploads' },
];

const CATEGORIES: { id: VideoCategory; label: string }[] = [
  { id: 'performance',      label: 'Performance' },
  { id: 'class',            label: 'Class' },
  { id: 'student-showcase', label: 'Student Showcase' },
  { id: 'event',            label: 'Event' },
  { id: 'general',          label: 'General' },
];

const SOURCE_LABEL: Record<VideoSource, string> = {
  youtube:   'YouTube',
  instagram: 'Instagram',
  upload:    'Upload',
};

const SOURCE_COLOR: Record<VideoSource, string> = {
  youtube:   '#FF0000',
  instagram: '#E1306C',
  upload:    '#6B7280',
};

// ─── Form type ────────────────────────────────────────────────────────────────

interface VideoForm {
  id?: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  source: VideoSource;
  externalUrl: string;
  youtubeId: string;
  thumbnailUrl: string;   // existing saved data URL
  videoFileUrl: string;   // existing saved data URL (upload only)
  durationSec: string;
  category: VideoCategory;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

function emptyForm(): VideoForm {
  return {
    title: '', titleEs: '',
    description: '', descriptionEs: '',
    source: 'youtube',
    externalUrl: '', youtubeId: '',
    thumbnailUrl: '', videoFileUrl: '',
    durationSec: '',
    category: 'general',
    featured: false, isActive: true,
    sortOrder: 999,
  };
}

function videoToForm(v: Video): VideoForm {
  return {
    id: v.id,
    title: v.title, titleEs: v.titleEs,
    description: v.description, descriptionEs: v.descriptionEs,
    source: v.source,
    externalUrl: v.externalUrl, youtubeId: v.youtubeId,
    thumbnailUrl: v.thumbnailUrl, videoFileUrl: v.videoFileUrl,
    durationSec: v.durationSec ? String(v.durationSec) : '',
    category: v.category,
    featured: v.featured, isActive: v.isActive,
    sortOrder: v.sortOrder,
    createdAt: v.createdAt,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToDataUrl(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (onProgress) {
      reader.onprogress = e => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }
    reader.onload = () => { onProgress?.(100); resolve(reader.result as string); };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatDuration(sec: number): string {
  if (!sec) return '';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function categoryLabel(id: VideoCategory): string {
  return CATEGORIES.find(c => c.id === id)?.label ?? id;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? GOLD : '#E5E7EB' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

// ─── LangTabs ─────────────────────────────────────────────────────────────────

function LangTabs({ value, onChange }: { value: 'en' | 'es'; onChange: (l: 'en' | 'es') => void }) {
  return (
    <div className="flex rounded-full border border-gray-200 overflow-hidden">
      {(['en', 'es'] as const).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className="px-3 py-1 text-xs font-bold transition-colors"
          style={value === l ? { background: `${GOLD}22`, color: '#92700B' } : { color: '#9CA3AF' }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─── ThumbnailUploadZone ──────────────────────────────────────────────────────

function ThumbnailUploadZone({
  preview,
  inputRef,
  onChange,
  error,
  required,
}: {
  preview: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (file: File) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => e.target.files?.[0] && onChange(e.target.files[0])}
      />
      {preview ? (
        <div className="space-y-2">
          <img src={preview} alt="thumbnail" className="w-full aspect-video object-cover rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Upload size={12} /> Change thumbnail
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-colors"
        >
          <Upload size={20} />
          <span className="text-sm font-semibold">
            {required ? 'Upload thumbnail (required)' : 'Upload thumbnail (optional)'}
          </span>
          <span className="text-xs">JPG, PNG, WebP · Max 5 MB</span>
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

// ─── VideoFormPanel ───────────────────────────────────────────────────────────

function VideoFormPanel({
  video,
  onSave,
  onClose,
}: {
  video: VideoForm | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const isNew = !video?.id;
  const [form, setForm]                 = useState<VideoForm>(video ?? emptyForm());
  const [langTab, setLangTab]           = useState<'en' | 'es'>('en');
  const [thumbFile, setThumbFile]       = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>('');
  const [videoFile, setVideoFile]       = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [saving, setSaving]             = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const thumbRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Live YouTube ID derived from URL input
  const youtubeIdLive = form.source === 'youtube'
    ? (parseYouTubeId(form.externalUrl) ?? form.youtubeId)
    : '';

  // Effective thumbnail for preview
  const effectiveThumbnail =
    thumbPreview ||
    form.thumbnailUrl ||
    (form.source === 'youtube' && youtubeIdLive ? getYouTubeThumbnail(youtubeIdLive) : '');

  // Revoke object URL on unmount
  useEffect(() => {
    return () => { if (thumbPreview) URL.revokeObjectURL(thumbPreview); };
  }, [thumbPreview]);

  function set<K extends keyof VideoForm>(key: K, val: VideoForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function clearSourceFields() {
    setThumbFile(null);
    setThumbPreview('');
    setVideoFile(null);
    setVideoFileName('');
    setErrors({});
  }

  function handleThumbSelect(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, thumbnail: 'Thumbnail must be under 5 MB' }));
      return;
    }
    setThumbFile(file);
    const url = URL.createObjectURL(file);
    setThumbPreview(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
    setErrors(prev => ({ ...prev, thumbnail: '' }));
  }

  function handleVideoSelect(file: File) {
    if (file.size > 100 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, videoFile: 'Video must be under 100 MB' }));
      return;
    }
    setVideoFile(file);
    setVideoFileName(file.name);
    setErrors(prev => ({ ...prev, videoFile: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.source === 'youtube') {
      if (!form.externalUrl.trim()) {
        e.externalUrl = 'YouTube URL is required';
      } else if (!parseYouTubeId(form.externalUrl)) {
        e.externalUrl = 'Could not parse a valid YouTube video ID from this URL';
      }
    }
    if (form.source === 'instagram') {
      if (!form.externalUrl.trim()) e.externalUrl = 'Instagram URL is required';
      if (!form.thumbnailUrl && !thumbFile) e.thumbnail = 'A thumbnail is required for Instagram videos';
    }
    if (form.source === 'upload') {
      if (!form.videoFileUrl && !videoFile) e.videoFile = 'Please upload a video file';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      let thumbnailUrl  = form.thumbnailUrl;
      let videoFileUrl  = form.videoFileUrl;

      if (thumbFile) thumbnailUrl = await fileToDataUrl(thumbFile);
      if (videoFile) {
        setUploadProgress(0);
        videoFileUrl = await fileToDataUrl(videoFile, pct => setUploadProgress(pct));
        setUploadProgress(null);
      }

      // Parse YouTube ID
      let youtubeId = form.youtubeId;
      if (form.source === 'youtube' && form.externalUrl) {
        youtubeId = parseYouTubeId(form.externalUrl) ?? '';
      }

      // Clear source-irrelevant fields
      const externalUrlFinal  = form.source !== 'upload'  ? form.externalUrl.trim() : '';
      const videoFileUrlFinal = form.source === 'upload'  ? videoFileUrl : '';
      const youtubeIdFinal    = form.source === 'youtube' ? youtubeId : '';

      saveVideo({
        ...form,
        externalUrl:  externalUrlFinal,
        youtubeId:    youtubeIdFinal,
        thumbnailUrl,
        videoFileUrl: videoFileUrlFinal,
        durationSec:  parseInt(form.durationSec) || 0,
        createdAt:    form.createdAt,
      });
      onSave();
    } catch (err) {
      console.error('Failed to save video:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'Add Video' : 'Edit Video'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          id="video-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* ── Source ── */}
          <div>
            <label className={S.label}>Source</label>
            <select
              value={form.source}
              onChange={e => {
                set('source', e.target.value as VideoSource);
                clearSourceFields();
              }}
              className={S.input}
            >
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="upload">Direct Upload</option>
            </select>
          </div>

          {/* ──────────── YouTube fields ──────────── */}
          {form.source === 'youtube' && (
            <div className="space-y-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div>
                <label className={S.label}>YouTube URL *</label>
                <input
                  type="url"
                  value={form.externalUrl}
                  onChange={e => set('externalUrl', e.target.value)}
                  className={S.input}
                  placeholder="https://youtube.com/watch?v=… or https://youtu.be/…"
                />
                {errors.externalUrl && (
                  <p className="text-xs text-red-600 mt-1">{errors.externalUrl}</p>
                )}
                {youtubeIdLive && !errors.externalUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Video ID: <code className="font-mono">{youtubeIdLive}</code>
                  </p>
                )}
              </div>

              {/* Auto thumbnail preview */}
              {effectiveThumbnail && (
                <div>
                  <label className={S.label}>Thumbnail Preview</label>
                  <img
                    src={effectiveThumbnail}
                    alt="thumbnail"
                    className="w-full aspect-video object-cover rounded-lg"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}

              {/* Optional custom thumbnail */}
              <div>
                <label className={S.label}>Custom Thumbnail (optional)</label>
                <p className="text-xs text-gray-400 mb-2">
                  Leave blank to use the auto-fetched YouTube thumbnail.
                </p>
                <ThumbnailUploadZone
                  preview={thumbPreview}
                  inputRef={thumbRef}
                  onChange={handleThumbSelect}
                  error={errors.thumbnail}
                  required={false}
                />
              </div>
            </div>
          )}

          {/* ──────────── Instagram fields ──────────── */}
          {form.source === 'instagram' && (
            <div
              className="space-y-4 p-4 rounded-xl border"
              style={{ background: '#fdf2f8', borderColor: '#f9a8d4' }}
            >
              {/* Warning */}
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Instagram no longer allows embedding. Upload a thumbnail from your post
                  (screenshot or cover image). Visitors will see the thumbnail and clicking
                  will open Instagram in a new tab.
                </p>
              </div>

              <div>
                <label className={S.label}>Instagram URL *</label>
                <input
                  type="url"
                  value={form.externalUrl}
                  onChange={e => set('externalUrl', e.target.value)}
                  className={S.input}
                  placeholder="https://instagram.com/reel/… or https://instagram.com/p/…"
                />
                {errors.externalUrl && (
                  <p className="text-xs text-red-600 mt-1">{errors.externalUrl}</p>
                )}
              </div>

              <div>
                <label className={S.label}>Thumbnail *</label>
                <ThumbnailUploadZone
                  preview={thumbPreview || form.thumbnailUrl}
                  inputRef={thumbRef}
                  onChange={handleThumbSelect}
                  error={errors.thumbnail}
                  required
                />
              </div>
            </div>
          )}

          {/* ──────────── Direct Upload fields ──────────── */}
          {form.source === 'upload' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* Video file */}
              <div>
                <label className={S.label}>Video File *</label>
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleVideoSelect(e.target.files[0])}
                />
                {videoFileName || form.videoFileUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Film size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {videoFileName || 'Existing video file'}
                    </span>
                    <button
                      type="button"
                      onClick={() => videoRef.current?.click()}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex-shrink-0"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-colors"
                  >
                    <Upload size={20} />
                    <span className="text-sm font-semibold">Click to upload video</span>
                    <span className="text-xs">MP4, WebM, MOV · Max 100 MB</span>
                  </button>
                )}
                {errors.videoFile && (
                  <p className="text-xs text-red-600 mt-1">{errors.videoFile}</p>
                )}

                {/* Upload progress bar */}
                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold text-amber-700">
                      Uploading… {uploadProgress}%
                    </p>
                    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-150"
                        style={{ width: `${uploadProgress}%`, background: GOLD }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail (optional) */}
              <div>
                <label className={S.label}>Thumbnail (optional)</label>
                <ThumbnailUploadZone
                  preview={thumbPreview || form.thumbnailUrl}
                  inputRef={thumbRef}
                  onChange={handleThumbSelect}
                  error={errors.thumbnail}
                />
              </div>

              {/* Duration */}
              <div>
                <label className={S.label}>Duration (seconds, optional)</label>
                <input
                  type="number"
                  min="0"
                  value={form.durationSec}
                  onChange={e => set('durationSec', e.target.value)}
                  className={S.input}
                  placeholder="e.g. 154 for 2:34"
                />
              </div>
            </div>
          )}

          {/* ── Title ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Title *</label>
              <LangTabs value={langTab} onChange={setLangTab} />
            </div>
            <input
              value={langTab === 'en' ? form.title : form.titleEs}
              onChange={e =>
                langTab === 'en'
                  ? set('title', e.target.value)
                  : set('titleEs', e.target.value)
              }
              className={S.input}
              placeholder={`Title in ${langTab === 'en' ? 'English' : 'Spanish'}…`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* ── Description ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Description</label>
              <LangTabs value={langTab} onChange={setLangTab} />
            </div>
            <textarea
              rows={3}
              value={langTab === 'en' ? form.description : form.descriptionEs}
              onChange={e =>
                langTab === 'en'
                  ? set('description', e.target.value)
                  : set('descriptionEs', e.target.value)
              }
              className={S.input}
              placeholder={`Description in ${langTab === 'en' ? 'English' : 'Spanish'}…`}
            />
          </div>

          {/* ── Category ── */}
          <div>
            <label className={S.label}>Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value as VideoCategory)}
              className={S.input}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* ── Featured + Active ── */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <Toggle value={form.featured} onChange={v => set('featured', v)} />
              <div>
                <p className="text-sm font-semibold text-gray-800">Featured</p>
                <p className="text-xs text-gray-400">Show on home page video preview</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Toggle value={form.isActive} onChange={v => set('isActive', v)} />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {form.isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-xs text-gray-400">
                  {form.isActive ? 'Visible on public site' : 'Hidden from public'}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost}>
            Cancel
          </button>
          <button
            form="video-form"
            type="submit"
            disabled={saving}
            className={S.btn.gold}
            style={{ background: GOLD, color: '#0A0A0A', opacity: saving ? 0.7 : 1 }}
          >
            <Check size={15} />
            {saving ? 'Saving…' : isNew ? 'Add Video' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({
  video,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleFeatured,
  onToggleActive,
}: {
  video: Video;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleFeatured: () => void;
  onToggleActive: () => void;
}) {
  const thumbnail =
    video.thumbnailUrl ||
    (video.source === 'youtube' && video.youtubeId
      ? getYouTubeThumbnail(video.youtubeId)
      : '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">

      {/* Thumbnail */}
      <div
        className="relative aspect-video bg-gray-100 cursor-pointer group"
        onClick={onEdit}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Placeholder (shown when no thumbnail or image fails) */}
        <div className={`${thumbnail ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center`}>
          <Film size={32} className="text-gray-300" />
        </div>

        {/* Source badge */}
        <span
          className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-sm"
          style={{ background: SOURCE_COLOR[video.source] }}
        >
          {SOURCE_LABEL[video.source]}
        </span>

        {/* Featured star */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onToggleFeatured(); }}
          title={video.featured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors shadow-sm ${
            video.featured
              ? 'bg-amber-400 text-white'
              : 'bg-black/40 text-white hover:bg-amber-400'
          }`}
        >
          <Star size={11} fill={video.featured ? 'currentColor' : 'none'} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3
          className="text-sm font-bold text-gray-900 line-clamp-2 cursor-pointer leading-snug"
          onClick={onEdit}
        >
          {video.title || <span className="text-gray-400 italic font-normal">Untitled</span>}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider">
            {categoryLabel(video.category)}
          </span>
          {video.durationSec > 0 && (
            <span className="text-[10px] text-gray-400 font-mono">
              {formatDuration(video.durationSec)}
            </span>
          )}
          {video.externalUrl && video.source !== 'upload' && (
            <a
              href={video.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-[10px] text-amber-600 hover:text-amber-800 flex items-center gap-0.5 transition-colors"
            >
              <ExternalLink size={9} /> Open
            </a>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 pt-1.5 border-t border-gray-100 mt-auto">
          {/* Active badge / toggle */}
          <button
            type="button"
            onClick={onToggleActive}
            title={video.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              video.isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
            }`}
          >
            {video.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
            {video.isActive ? 'Active' : 'Off'}
          </button>

          <div className="flex-1" />

          {/* Reorder */}
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>

          {/* Edit / Delete */}
          <button
            onClick={onEdit}
            className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`}
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VideosAdminPage ──────────────────────────────────────────────────────────

export function VideosAdminPage() {
  const [videos, setVideos]       = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<VideoForm | null>(null);

  function load() { setVideos(getVideos()); }
  useEffect(load, []);

  // Filtered list for current tab
  const filteredVideos = activeTab === 'all'
    ? videos
    : videos.filter(v => v.source === (activeTab as VideoSource));

  function tabCount(tab: TabKey): number {
    if (tab === 'all') return videos.length;
    return videos.filter(v => v.source === (tab as VideoSource)).length;
  }

  function openNew()         { setEditing(null); setPanelOpen(true); }
  function openEdit(v: Video){ setEditing(videoToForm(v)); setPanelOpen(true); }
  function closePanel()      { setPanelOpen(false); setEditing(null); }
  function afterSave()       { load(); closePanel(); }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title || 'this video'}"? This cannot be undone.`)) return;
    deleteVideo(id);
    load();
  }

  function handleToggleFeatured(video: Video) {
    saveVideo({ ...video, featured: !video.featured, createdAt: video.createdAt });
    load();
  }

  function handleToggleActive(video: Video) {
    saveVideo({ ...video, isActive: !video.isActive, createdAt: video.createdAt });
    load();
  }

  function moveUp(id: string) {
    const ids = filteredVideos.map(v => v.id);
    const idx = ids.indexOf(id);
    if (idx <= 0) return;
    [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
    const filteredSet = new Set(ids);
    const otherIds = videos.filter(v => !filteredSet.has(v.id)).map(v => v.id);
    reorderVideos([...otherIds, ...ids]);
    load();
  }

  function moveDown(id: string) {
    const ids = filteredVideos.map(v => v.id);
    const idx = ids.indexOf(id);
    if (idx >= ids.length - 1) return;
    [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
    const filteredSet = new Set(ids);
    const otherIds = videos.filter(v => !filteredSet.has(v.id)).map(v => v.id);
    reorderVideos([...otherIds, ...ids]);
    load();
  }

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Film size={20} style={{ color: GOLD }} />
            <h1 className="text-xl font-black text-gray-900">Videos</h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage YouTube, Instagram, and uploaded videos for the public gallery.
          </p>
        </div>
        <button
          onClick={openNew}
          className={S.btn.gold}
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'text-[#0A0A0A]'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-amber-300'
            }`}
            style={activeTab === tab.id ? { background: GOLD } : {}}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id
                  ? 'bg-black/20 text-black'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tabCount(tab.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Grid or empty state */}
      {filteredVideos.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-gray-200">
          <Film size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm text-gray-500">
            No {activeTab === 'all' ? '' : activeTab + ' '}videos yet.
          </p>
          <button
            onClick={openNew}
            className="mt-3 flex items-center gap-2 mx-auto text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors"
          >
            <Plus size={14} /> Add one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video, idx) => (
            <VideoCard
              key={video.id}
              video={video}
              isFirst={idx === 0}
              isLast={idx === filteredVideos.length - 1}
              onEdit={() => openEdit(video)}
              onDelete={() => handleDelete(video.id, video.title)}
              onMoveUp={() => moveUp(video.id)}
              onMoveDown={() => moveDown(video.id)}
              onToggleFeatured={() => handleToggleFeatured(video)}
              onToggleActive={() => handleToggleActive(video)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Changes save immediately. Use ▲▼ to reorder within the current tab.
      </p>

      {/* Slide-out panel */}
      {panelOpen && (
        <VideoFormPanel
          video={editing}
          onSave={afterSave}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
