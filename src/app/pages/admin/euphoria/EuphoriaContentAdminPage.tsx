// Admin — Euphoria Ladies content editor.
// Manages all CMS text fields and hero media (image + video) for the Euphoria mini-site.

import { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, Loader, Upload, X } from 'lucide-react';
import { getAllContent, setPageContent } from '../../../../lib/contentService';
import { uploadMediaFile, getMedia } from '../../../../lib/mediaService';

const PINK = '#CE1868';
const GOLD = '#F6B000';

const S = {
  page:     'max-w-4xl mx-auto px-4 sm:px-6 py-8',
  card:     'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6',
  cardHead: 'px-5 py-4 border-b border-gray-100 flex items-center justify-between',
  cardBody: 'px-5 py-5',
  title:    'text-sm font-black uppercase tracking-wider text-gray-900',
  label:    'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:    'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-[#CE1868] focus:ring-2 focus:ring-[#CE1868]/10 transition-all resize-none',
  pageTab:  (a: boolean) => `px-4 py-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${a ? 'text-gray-900 border-[#CE1868]' : 'text-gray-500 hover:text-gray-700 border-transparent'}`,
  saveBtn:  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90',
};

type FieldType = 'text' | 'textarea' | 'url';
interface Field   { key: string; label: string; type: FieldType; rows?: number }
interface Section { id: string; title: string; fields: Field[] }
interface PageTab { id: string; label: string; sections: Section[] }

const SCHEMA: PageTab[] = [
  {
    id: 'hero', label: 'Hero',
    sections: [
      {
        id: 'hero_text', title: 'Hero Text',
        fields: [
          { key: 'euphoria.hero.headline',    label: 'Headline (e.g. EUPHORIA LADIES)', type: 'text' },
          { key: 'euphoria.hero.tagline',     label: 'Tagline (ALL CAPS, short)',        type: 'text' },
          { key: 'euphoria.hero.description', label: 'Description Paragraph',            type: 'textarea', rows: 3 },
        ],
      },
      {
        id: 'hero_ctas', title: 'CTA Buttons',
        fields: [
          { key: 'euphoria.hero.cta1.label',   label: 'Primary CTA Label',       type: 'text' },
          { key: 'euphoria.hero.cta1.link',    label: 'Primary CTA Link',        type: 'text' },
          { key: 'euphoria.hero.cta2.label',   label: 'Secondary CTA Label',     type: 'text' },
          { key: 'euphoria.hero.cta2.link',    label: 'Secondary CTA Link',      type: 'text' },
          { key: 'euphoria.hero.cta3.youtube', label: 'Watch Team YouTube ID',   type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'about', label: 'About & Stats',
    sections: [
      {
        id: 'about_text', title: 'About Section',
        fields: [
          { key: 'euphoria.about.heading',     label: 'Section Heading',    type: 'text' },
          { key: 'euphoria.about.description', label: 'About Description',  type: 'textarea', rows: 4 },
        ],
      },
      {
        id: 'stats', title: 'Statistics (animated counters)',
        fields: [
          { key: 'euphoria.about.stat1.value', label: 'Stat 1 — Value (e.g. 30+)', type: 'text' },
          { key: 'euphoria.about.stat1.label', label: 'Stat 1 — Label',            type: 'text' },
          { key: 'euphoria.about.stat2.value', label: 'Stat 2 — Value',            type: 'text' },
          { key: 'euphoria.about.stat2.label', label: 'Stat 2 — Label',            type: 'text' },
          { key: 'euphoria.about.stat3.value', label: 'Stat 3 — Value',            type: 'text' },
          { key: 'euphoria.about.stat3.label', label: 'Stat 3 — Label',            type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'story', label: 'Timeline',
    sections: [
      {
        id: 'story_head', title: 'Section Heading',
        fields: [
          { key: 'euphoria.story.heading', label: 'Timeline Section Heading', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'auditions', label: 'Auditions',
    sections: [
      {
        id: 'aud_text', title: 'Auditions Section',
        fields: [
          { key: 'euphoria.auditions.heading',     label: 'Heading',      type: 'text' },
          { key: 'euphoria.auditions.subtitle',    label: 'Subtitle',     type: 'text' },
          { key: 'euphoria.auditions.description', label: 'Description',  type: 'textarea', rows: 3 },
          { key: 'euphoria.auditions.cta.label',   label: 'CTA Label',    type: 'text' },
          { key: 'euphoria.auditions.cta.link',    label: 'CTA Link',     type: 'url'  },
        ],
      },
      {
        id: 'aud_contact', title: 'Contact Info',
        fields: [
          { key: 'euphoria.auditions.phone',     label: 'Phone',     type: 'text' },
          { key: 'euphoria.auditions.email',     label: 'Email',     type: 'text' },
          { key: 'euphoria.auditions.instagram', label: 'Instagram', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'sections', label: 'Section Labels',
    sections: [
      {
        id: 'section_labels', title: 'Section Headings',
        fields: [
          { key: 'euphoria.gallery.heading',      label: 'Gallery Heading',      type: 'text' },
          { key: 'euphoria.gallery.subtitle',     label: 'Gallery Subtitle',     type: 'text' },
          { key: 'euphoria.testimonials.heading', label: 'Testimonials Heading', type: 'text' },
          { key: 'euphoria.cta.heading',          label: 'Final CTA Heading',    type: 'textarea', rows: 2 },
          { key: 'euphoria.cta.subtitle',         label: 'Final CTA Subtitle',   type: 'text' },
        ],
      },
    ],
  },
];

// ─── Media upload card ─────────────────────────────────────────────────────────

function MediaUploadCard({
  slot,
  label,
  accept,
  hint,
}: {
  slot: string;
  label: string;
  accept: string;
  hint: string;
}) {
  const [url,        setUrl]        = useState('');
  const [uploading,  setUploading]  = useState(false);
  const isVideo = accept.includes('video');

  useEffect(() => {
    getMedia(slot).then(m => { if (m?.url) setUrl(m.url); }).catch(() => {});
  }, [slot]);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const m = await uploadMediaFile(file, slot, label);
      setUrl(m.url);
    } catch { /* noop */ } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className={S.label}>{label}</label>
      <p className="text-[11px] text-gray-400 mb-2">{hint}</p>
      {url ? (
        <div className="relative mb-2 rounded-xl overflow-hidden border border-gray-200" style={{ maxHeight: 180 }}>
          {isVideo ? (
            <video src={url} controls className="w-full h-40 object-cover bg-black" />
          ) : (
            <img src={url} alt={label} className="w-full h-40 object-cover" />
          )}
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ) : null}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80"
          style={{ backgroundColor: url ? '#F3F4F6' : PINK, color: url ? '#374151' : '#fff' }}
        >
          {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : url ? 'Replace File' : `Upload ${isVideo ? 'Video' : 'Image'}`}
        </span>
      </label>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EuphoriaContentAdminPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [values,    setValues]    = useState<Record<string, string>>({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    getAllContent().then(rows => {
      const m: Record<string, string> = {};
      rows.forEach(r => { if (r.key.startsWith('euphoria.')) m[r.key] = r.value; });
      setValues(m);
    }).catch(() => {});
  }, []);

  function set(key: string, val: string) {
    setValues(v => ({ ...v, [key]: val }));
  }

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await setPageContent(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* noop */ } finally {
      setSaving(false);
    }
  }, [values]);

  const page = SCHEMA.find(p => p.id === activeTab) ?? SCHEMA[0];

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full inline-block" style={{ backgroundColor: PINK }} />
            Euphoria Content
          </h1>
          <p className="text-sm text-gray-500 mt-1">Edit all text content for the Euphoria Ladies mini-site.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={S.saveBtn}
          style={{ background: saved ? '#22C55E' : GOLD, color: '#0A0A0A' }}
        >
          {saving ? <Loader size={16} className="animate-spin" />
           : saved  ? <CheckCircle size={16} />
           : <Save size={16} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Hero Media card */}
      <div className={S.card}>
        <div className={S.cardHead}>
          <span className={S.title}>Hero Media</span>
          <span className="text-xs text-gray-400">Video takes priority over image when both are set</span>
        </div>
        <div className={S.cardBody}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MediaUploadCard
              slot="euphoria.hero.video"
              label="Background Video"
              accept="video/mp4,video/quicktime,video/webm"
              hint="Upload a video file (MP4, MOV, WebM) up to 20 MB. It will autoplay muted behind the hero."
            />
            <MediaUploadCard
              slot="euphoria.hero.image"
              label="Background Image (fallback)"
              accept="image/*"
              hint="Shown when no video is uploaded. Full-width hero image."
            />
          </div>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6 overflow-x-auto">
        {SCHEMA.map(p => (
          <button key={p.id} onClick={() => setActiveTab(p.id)} className={S.pageTab(activeTab === p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      {page.sections.map(sec => (
        <div key={sec.id} className={S.card}>
          <div className={S.cardHead}>
            <span className={S.title}>{sec.title}</span>
          </div>
          <div className={S.cardBody}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sec.fields.map(field => (
                <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className={S.label}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={values[field.key] ?? ''}
                      onChange={e => set(field.key, e.target.value)}
                      rows={field.rows ?? 3}
                      className={S.input}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                    />
                  ) : (
                    <input
                      type={field.type === 'url' ? 'url' : 'text'}
                      value={values[field.key] ?? ''}
                      onChange={e => set(field.key, e.target.value)}
                      className={S.input}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                    />
                  )}
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">{field.key}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
