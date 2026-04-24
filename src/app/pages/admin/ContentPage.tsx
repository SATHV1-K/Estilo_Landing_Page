// ContentPage — page-by-page site content editor with EN/ES tabs.
// Stores values in localStorage via adminData.setPageContent().

import { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, Loader } from 'lucide-react';
import { getAllContent, setPageContent } from '../../../lib/contentService';

// ─── Styles ───────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:      'max-w-4xl mx-auto px-4 sm:px-6 py-8',
  card:      'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6',
  cardHead:  'px-5 py-4 border-b border-gray-100 flex items-center justify-between',
  cardBody:  'px-5 py-5',
  sectionTitle: 'text-sm font-black uppercase tracking-wider text-gray-900',
  label:     'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:     'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  tab:       (active: boolean) =>
    `px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
      active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
    }`,
  pageTab:   (active: boolean) =>
    `px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
      active
        ? 'text-gray-900 border-amber-400'
        : 'text-gray-500 hover:text-gray-700 border-transparent'
    }`,
  saveBtn:   'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90',
};

// ─── Content schema ───────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'url';

interface ContentField {
  key: string;          // the en key (without _es suffix)
  label: string;
  type: FieldType;
  bilingual?: boolean;  // whether field has _es variant
  rows?: number;
}

interface ContentSection {
  id: string;
  title: string;
  fields: ContentField[];
}

interface PageSchema {
  id: string;
  label: string;
  sections: ContentSection[];
}

const SCHEMA: PageSchema[] = [
  {
    id: 'home',
    label: 'Home',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        fields: [
          { key: 'home.hero.headline',    label: 'Headline',    type: 'text',     bilingual: true },
          { key: 'home.hero.subheadline', label: 'Subheadline', type: 'textarea', bilingual: true, rows: 2 },
          { key: 'home.hero.cta_label',   label: 'CTA Label',   type: 'text',     bilingual: true },
          { key: 'home.hero.cta_link',    label: 'CTA Link',    type: 'url' },
        ],
      },
      {
        id: 'marquee',
        title: 'Marquee Ticker',
        fields: [
          { key: 'home.marquee.text', label: 'Marquee Text', type: 'text' },
        ],
      },
      {
        id: 'styles',
        title: 'Styles Section',
        fields: [
          { key: 'home.styles.heading',    label: 'Heading',    type: 'text', bilingual: true },
          { key: 'home.styles.subheading', label: 'Subheading', type: 'text', bilingual: true },
        ],
      },
      {
        id: 'instructors',
        title: 'Instructors Section',
        fields: [
          { key: 'home.instructors.heading', label: 'Heading', type: 'text', bilingual: true },
        ],
      },
      {
        id: 'cta_banner',
        title: 'CTA Banner',
        fields: [
          { key: 'home.cta_banner.heading',   label: 'Heading',   type: 'text',     bilingual: true },
          { key: 'home.cta_banner.body',      label: 'Body Text', type: 'textarea', bilingual: true, rows: 2 },
          { key: 'home.cta_banner.cta_label', label: 'Button Label', type: 'text', bilingual: true },
          { key: 'home.cta_banner.cta_link',  label: 'Button Link',  type: 'url' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    sections: [
      {
        id: 'main',
        title: 'About Page',
        fields: [
          { key: 'about.heading',  label: 'Heading',  type: 'text',     bilingual: true },
          { key: 'about.body',     label: 'Body Text',type: 'textarea', bilingual: true, rows: 4 },
          { key: 'about.mission',  label: 'Mission Statement', type: 'textarea', bilingual: true, rows: 2 },
        ],
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    sections: [
      {
        id: 'main',
        title: 'Contact Page',
        fields: [
          { key: 'contact.heading',    label: 'Heading',    type: 'text',     bilingual: true },
          { key: 'contact.subheading', label: 'Subheading', type: 'textarea', bilingual: true, rows: 2 },
        ],
      },
    ],
  },
  {
    id: 'packages',
    label: 'Packages',
    sections: [
      {
        id: 'main',
        title: 'Packages Page',
        fields: [
          { key: 'packages.heading',    label: 'Heading',    type: 'text', bilingual: true },
          { key: 'packages.subheading', label: 'Subheading', type: 'text', bilingual: true },
        ],
      },
    ],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    sections: [
      {
        id: 'main',
        title: 'Schedule Page',
        fields: [
          { key: 'schedule.heading', label: 'Heading', type: 'text', bilingual: true },
        ],
      },
    ],
  },
  {
    id: 'styles',
    label: 'Styles',
    sections: [
      {
        id: 'main',
        title: 'Styles Page',
        fields: [
          { key: 'styles.heading',    label: 'Heading',    type: 'text', bilingual: true },
          { key: 'styles.subheading', label: 'Subheading', type: 'text', bilingual: true },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SaveState = 'idle' | 'saving' | 'saved';

// ─── BilingualField ───────────────────────────────────────────────────────────

interface BilingualFieldProps {
  field: ContentField;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  lang: 'en' | 'es';
}

function FieldInput({
  fieldKey,
  type,
  rows,
  value,
  onChange,
}: {
  fieldKey: string;
  type: FieldType;
  rows?: number;
  value: string;
  onChange: (val: string) => void;
}) {
  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows ?? 3}
        className={S.input}
        placeholder={`Enter ${fieldKey.split('.').pop()?.replace(/_/g, ' ')}…`}
      />
    );
  }
  return (
    <input
      type={type === 'url' ? 'text' : 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={S.input}
      placeholder={type === 'url' ? '/path or https://…' : `Enter value…`}
    />
  );
}

// ─── SectionEditor ───────────────────────────────────────────────────────────

function SectionEditor({
  section,
  values,
  onChange,
}: {
  section: ContentSection;
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <div className={S.card}>
      <div className={S.cardHead}>
        <span className={S.sectionTitle}>{section.title}</span>
        {/* Lang tabs — only show if any field is bilingual */}
        {section.fields.some(f => f.bilingual) && (
          <div className="flex rounded-full border border-gray-200 overflow-hidden">
            <button
              onClick={() => setLang('en')}
              className={S.tab(lang === 'en')}
              style={lang === 'en' ? { background: `${GOLD}22`, color: '#92700B' } : {}}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={S.tab(lang === 'es')}
              style={lang === 'es' ? { background: `${GOLD}22`, color: '#92700B' } : {}}
            >
              ES
            </button>
          </div>
        )}
      </div>
      <div className={S.cardBody}>
        <div className="grid gap-4">
          {section.fields.map(field => {
            const activeKey =
              field.bilingual && lang === 'es'
                ? `${field.key}_es`
                : field.key;
            return (
              <div key={field.key}>
                <label className={S.label}>
                  {field.label}
                  {field.bilingual && (
                    <span className="ml-2 text-gray-300 font-normal normal-case">
                      ({lang === 'en' ? 'English' : 'Spanish'})
                    </span>
                  )}
                </label>
                <FieldInput
                  fieldKey={activeKey}
                  type={field.type}
                  rows={field.rows}
                  value={values[activeKey] ?? ''}
                  onChange={val => onChange(activeKey, val)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ContentPage ─────────────────────────────────────────────────────────────

export function ContentPage() {
  const [activePage, setActivePage] = useState<string>(SCHEMA[0].id);
  const [values, setValues]         = useState<Record<string, string>>({});
  const [saveState, setSaveState]   = useState<SaveState>('idle');

  useEffect(() => {
    getAllContent()
      .then(all => {
        const map: Record<string, string> = {};
        for (const item of all) map[item.key] = item.value;
        setValues(map);
      })
      .catch(err => console.error('Failed to load content:', err));
  }, []);

  function handleChange(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setSaveState('saving');
    try {
      await setPageContent(values);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      console.error('Failed to save content:', err);
      alert('Failed to save. Please try again.');
      setSaveState('idle');
    }
  }

  const currentSchema = SCHEMA.find(p => p.id === activePage)!;

  return (
    <div className={S.page}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Content Editor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit text content for each page (EN/ES)</p>
        </div>
        <button
          onClick={handleSave}
          className={S.saveBtn}
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          {saveState === 'saving' ? (
            <Loader size={16} className="animate-spin" />
          ) : saveState === 'saved' ? (
            <CheckCircle size={16} />
          ) : (
            <Save size={16} />
          )}
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved!' : 'Save All'}
        </button>
      </div>

      {/* Page tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-100 px-2">
          {SCHEMA.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={S.pageTab(activePage === page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections for active page */}
      {currentSchema.sections.map(section => (
        <SectionEditor
          key={section.id}
          section={section}
          values={values}
          onChange={handleChange}
        />
      ))}

      {/* Bottom save */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSave}
          className={S.saveBtn}
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          {saveState === 'saving' ? (
            <Loader size={16} className="animate-spin" />
          ) : saveState === 'saved' ? (
            <CheckCircle size={16} />
          ) : (
            <Save size={16} />
          )}
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? '✓ Saved' : 'Save All'}
        </button>
      </div>
    </div>
  );
}
