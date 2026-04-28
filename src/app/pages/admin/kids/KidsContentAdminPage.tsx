// Admin — Kids Content editor (text fields for kids pages).

import { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, Loader } from 'lucide-react';
import { getAllContent, setPageContent } from '../../../../lib/contentService';
import { uploadMediaFile, getMedia } from '../../../../lib/mediaService';

const GOLD = '#F6B000';

const S = {
  page:     'max-w-4xl mx-auto px-4 sm:px-6 py-8',
  card:     'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6',
  cardHead: 'px-5 py-4 border-b border-gray-100 flex items-center justify-between',
  cardBody: 'px-5 py-5',
  title:    'text-sm font-black uppercase tracking-wider text-gray-900',
  label:    'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:    'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  pageTab:  (a: boolean) => `px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${a ? 'text-gray-900 border-amber-400' : 'text-gray-500 hover:text-gray-700 border-transparent'}`,
  saveBtn:  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90',
};

type FieldType = 'text' | 'textarea' | 'url';

interface Field {
  key: string;
  label: string;
  type: FieldType;
  rows?: number;
}

interface Section {
  id: string;
  title: string;
  fields: Field[];
}

interface PageTab {
  id: string;
  label: string;
  sections: Section[];
}

const SCHEMA: PageTab[] = [
  {
    id: 'home',
    label: 'Home',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        fields: [
          { key: 'kids.hero.headline',  label: 'Headline',  type: 'textarea', rows: 2 },
          { key: 'kids.hero.subtitle',  label: 'Subtitle',  type: 'text' },
          { key: 'kids.hero.cta.label', label: 'CTA Label', type: 'text' },
          { key: 'kids.hero.cta.link',  label: 'CTA Link',  type: 'url' },
        ],
      },
      {
        id: 'programs',
        title: 'Programs Section',
        fields: [
          { key: 'kids.programs.heading', label: 'Section Heading', type: 'text' },
        ],
      },
      {
        id: 'benefits',
        title: 'Why Dance Section',
        fields: [
          { key: 'kids.benefits.heading', label: 'Section Heading', type: 'text' },
        ],
      },
      {
        id: 'achievements',
        title: 'Achievements Preview',
        fields: [
          { key: 'kids.achievements.heading',      label: 'Section Heading',  type: 'text' },
          { key: 'kids.achievements.stat1',        label: 'Stat 1 Number',    type: 'text' },
          { key: 'kids.achievements.stat1label',   label: 'Stat 1 Label',     type: 'text' },
          { key: 'kids.achievements.stat2',        label: 'Stat 2 Number',    type: 'text' },
          { key: 'kids.achievements.stat2label',   label: 'Stat 2 Label',     type: 'text' },
          { key: 'kids.achievements.stat3',        label: 'Stat 3 Number',    type: 'text' },
          { key: 'kids.achievements.stat3label',   label: 'Stat 3 Label',     type: 'text' },
        ],
      },
      {
        id: 'cta',
        title: 'CTA Banner',
        fields: [
          { key: 'kids.cta.heading',  label: 'Heading',       type: 'text' },
          { key: 'kids.cta.subtitle', label: 'Subtitle',      type: 'text' },
          { key: 'kids.cta.phone',    label: 'Phone Number',  type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    sections: [
      {
        id: 'about_hero',
        title: 'Page Heading',
        fields: [
          { key: 'kids.about.heading', label: 'Page Heading', type: 'text' },
        ],
      },
      {
        id: 'story',
        title: 'Story & Mission',
        fields: [
          { key: 'kids.about.story',   label: 'Our Story',    type: 'textarea', rows: 5 },
          { key: 'kids.about.mission', label: 'Our Mission',  type: 'textarea', rows: 4 },
          { key: 'kids.instructors.heading', label: 'Instructors Heading', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'gallery',
    label: 'Gallery',
    sections: [
      {
        id: 'gallery_hero',
        title: 'Gallery Page',
        fields: [
          { key: 'kids.gallery.heading',  label: 'Page Heading', type: 'text' },
          { key: 'kids.gallery.subtitle', label: 'Subtitle',     type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'achievements_page',
    label: 'Achievements',
    sections: [
      {
        id: 'ach_hero',
        title: 'Achievements Page',
        fields: [
          { key: 'kids.achievements.page.heading',  label: 'Page Heading', type: 'text' },
          { key: 'kids.achievements.page.subtitle', label: 'Subtitle',     type: 'text' },
        ],
      },
    ],
  },
];

export function KidsContentAdminPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [values,    setValues]    = useState<Record<string, string>>({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [mascotUrl, setMascotUrl] = useState('');
  const [mascotUploading, setMascotUploading] = useState(false);

  useEffect(() => {
    getAllContent().then(rows => {
      const m: Record<string, string> = {};
      rows.forEach(r => { if (r.key.startsWith('kids.')) m[r.key] = r.value; });
      setValues(m);
    }).catch(() => {});
    getMedia('kids.mascot').then(m => { if (m?.url) setMascotUrl(m.url); }).catch(() => {});
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

  async function uploadMascot(file: File) {
    setMascotUploading(true);
    try {
      const m = await uploadMediaFile(file, 'kids.mascot', 'Estilo Kids Bee Mascot');
      setMascotUrl(m.url);
    } catch { /* noop */ } finally {
      setMascotUploading(false);
    }
  }

  const page = SCHEMA.find(p => p.id === activeTab) ?? SCHEMA[0];

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🐝 Kids Content</h1>
          <p className="text-sm text-gray-500 mt-1">Edit text content for the Estilo Kids mini-site.</p>
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

      {/* Mascot upload */}
      <div className={S.card}>
        <div className={S.cardHead}>
          <span className={S.title}>🐝 Bee Mascot Image</span>
          <span className="text-xs text-gray-400">Displayed on hero, about, and navigation</span>
        </div>
        <div className={S.cardBody}>
          <div className="flex items-center gap-5">
            {mascotUrl ? (
              <img src={mascotUrl} alt="Bee mascot" className="w-20 h-20 object-contain rounded-xl border border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-3xl text-gray-400">🐝</div>
            )}
            <div>
              <label className={S.label}>Upload Mascot Image</label>
              <input
                type="file"
                accept="image/*"
                disabled={mascotUploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadMascot(f); }}
                className="block text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              {mascotUploading && <p className="text-xs text-amber-600 mt-1">Uploading…</p>}
            </div>
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
