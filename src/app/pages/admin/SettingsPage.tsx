// SettingsPage — fully editable studio settings.

import { useState, useEffect } from 'react';
import {
  Settings, MapPin, Phone, Mail, Clock, Share2,
  Search, AlignLeft, Plus, X, Check, Save, Loader2,
} from 'lucide-react';
import { getSiteSettings, saveSiteSettings } from '../../../lib/settingsService';
import type { AdminSiteSettings } from '../../../lib/adminData';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:        'max-w-3xl mx-auto px-4 sm:px-6 py-8',
  section:     'bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6',
  heading:     'flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 mb-5',
  label:       'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:       'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all',
  textarea:    'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  grid2:       'grid grid-cols-2 gap-4',
  grid3:       'grid grid-cols-3 gap-4',
};

const SOCIAL_PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Website'];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: value ? GOLD : '#E5E7EB' }}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <span className="text-sm text-gray-700 font-medium">{label}</span>
    </div>
  );
}

// ─── Section: Studio Info ─────────────────────────────────────────────────────

function StudioInfoSection({
  settings,
  onChange,
}: {
  settings: AdminSiteSettings;
  onChange: (patch: Partial<AdminSiteSettings>) => void;
}) {
  const f = (key: keyof AdminSiteSettings) => ({
    value: settings[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange({ [key]: e.target.value }),
    className: S.input,
  });

  return (
    <section className={S.section}>
      <h2 className={S.heading}><MapPin size={14} /> Studio Info</h2>
      <div className="space-y-4">
        <div className={S.grid2}>
          <div>
            <label className={S.label}>Studio Name</label>
            <input {...f('studioName')} />
          </div>
          <div>
            <label className={S.label}>Short Name</label>
            <input {...f('studioNameShort')} placeholder="e.g. Estilo Latino" />
          </div>
        </div>
        <div>
          <label className={S.label}>Tagline</label>
          <input {...f('tagline')} placeholder="e.g. Dance Academy" />
        </div>
        <div>
          <label className={S.label}>Address Line 1</label>
          <input {...f('address')} placeholder="345 Morris Ave Ste 1B" />
        </div>
        <div>
          <label className={S.label}>Address Line 2</label>
          <input {...f('addressLine2')} placeholder="Optional second line" />
        </div>
        <div className={S.grid3}>
          <div>
            <label className={S.label}>City</label>
            <input {...f('city')} />
          </div>
          <div>
            <label className={S.label}>State</label>
            <input {...f('state')} placeholder="NJ" />
          </div>
          <div>
            <label className={S.label}>ZIP</label>
            <input {...f('zip')} />
          </div>
        </div>
        <div className={S.grid3}>
          <div>
            <label className={S.label}>Phone</label>
            <input {...f('phone')} placeholder="+1 (201) 878-8977" />
          </div>
          <div>
            <label className={S.label}>WhatsApp</label>
            <input {...f('whatsapp')} placeholder="+12018788977" />
          </div>
          <div>
            <label className={S.label}>Email</label>
            <input {...f('email')} type="email" />
          </div>
        </div>
        <div>
          <label className={S.label}>Google Maps Embed URL</label>
          <input {...f('googleMapsEmbed')} placeholder="https://www.google.com/maps/embed?…" />
          <p className="text-xs text-gray-400 mt-1">
            In Google Maps → Share → Embed a map → copy the <code className="bg-gray-100 px-1 rounded">src</code> value from the iframe.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Social Links ────────────────────────────────────────────────────

function SocialLinksSection({
  links,
  onChange,
}: {
  links: AdminSiteSettings['socialLinks'];
  onChange: (links: AdminSiteSettings['socialLinks']) => void;
}) {
  function add() {
    onChange([...links, { platform: 'Instagram', url: '', label: '' }]);
  }
  function remove(i: number) {
    onChange(links.filter((_, idx) => idx !== i));
  }
  function update(i: number, field: 'platform' | 'url' | 'label', val: string) {
    onChange(links.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }

  return (
    <section className={S.section}>
      <h2 className={S.heading}><Share2 size={14} /> Social Media</h2>
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select
              value={link.platform}
              onChange={e => update(i, 'platform', e.target.value)}
              className="px-2.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 bg-white w-32 flex-shrink-0"
            >
              {SOCIAL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <input
              type="url"
              value={link.url}
              onChange={e => update(i, 'url', e.target.value)}
              placeholder="https://…"
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400"
            />
            <input
              value={link.label}
              onChange={e => update(i, 'label', e.target.value)}
              placeholder="Display label"
              className="w-32 flex-shrink-0 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors mt-1"
        >
          <Plus size={13} /> Add social link
        </button>
      </div>
    </section>
  );
}

// ─── Section: Business Hours ──────────────────────────────────────────────────

function BusinessHoursSection({
  hours,
  onChange,
}: {
  hours: AdminSiteSettings['businessHours'];
  onChange: (hours: AdminSiteSettings['businessHours']) => void;
}) {
  // Ensure all 7 days exist
  const normalized = DAYS.map(day => {
    const existing = hours.find(h => h.day.toLowerCase() === day.toLowerCase());
    return existing ?? { day, open: '', close: '', isClosed: false };
  });

  function update(i: number, field: 'open' | 'close' | 'isClosed', val: string | boolean) {
    const updated = normalized.map((h, idx) => idx === i ? { ...h, [field]: val } : h);
    onChange(updated);
  }

  return (
    <section className={S.section}>
      <h2 className={S.heading}><Clock size={14} /> Business Hours</h2>
      <div className="space-y-2">
        {normalized.map((h, i) => (
          <div key={h.day} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <span className="w-24 flex-shrink-0 text-sm font-semibold text-gray-700">{h.day}</span>

            {h.isClosed ? (
              <span className="flex-1 text-sm text-gray-400 italic">Closed</span>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={h.open}
                  onChange={e => update(i, 'open', e.target.value)}
                  placeholder="9:00 AM"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400"
                />
                <span className="text-gray-400 text-sm">–</span>
                <input
                  type="text"
                  value={h.close}
                  onChange={e => update(i, 'close', e.target.value)}
                  placeholder="10:00 PM"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={h.isClosed}
                onChange={e => update(i, 'isClosed', e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400"
              />
              Closed
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: SEO ─────────────────────────────────────────────────────────────

function SeoSection({
  settings,
  onChange,
}: {
  settings: AdminSiteSettings;
  onChange: (patch: Partial<AdminSiteSettings>) => void;
}) {
  return (
    <section className={S.section}>
      <h2 className={S.heading}><Search size={14} /> SEO Defaults</h2>
      <p className="text-xs text-gray-400 mb-4">
        Used as fallback <code className="bg-gray-100 px-1 rounded">&lt;title&gt;</code> and <code className="bg-gray-100 px-1 rounded">&lt;meta description&gt;</code> when page-specific SEO isn't set.
      </p>
      <div className="space-y-4">
        <div>
          <label className={S.label}>Meta Title</label>
          <input
            value={settings.metaTitle}
            onChange={e => onChange({ metaTitle: e.target.value })}
            className={S.input}
            placeholder="Studio Name | City, State"
          />
          <p className="text-xs text-gray-400 mt-1">Recommended: 50–60 characters</p>
        </div>
        <div>
          <label className={S.label}>Meta Description</label>
          <textarea
            rows={3}
            value={settings.metaDescription}
            onChange={e => onChange({ metaDescription: e.target.value })}
            className={S.textarea}
            placeholder="Brief description of the studio for search engines…"
          />
          <p className="text-xs text-gray-400 mt-1">Recommended: 120–160 characters</p>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Footer ─────────────────────────────────────────────────────────

function FooterSection({
  settings,
  onChange,
}: {
  settings: AdminSiteSettings;
  onChange: (patch: Partial<AdminSiteSettings>) => void;
}) {
  return (
    <section className={S.section}>
      <h2 className={S.heading}><AlignLeft size={14} /> Footer</h2>
      <div>
        <label className={S.label}>Footer Text</label>
        <textarea
          rows={2}
          value={settings.footerText}
          onChange={e => onChange({ footerText: e.target.value })}
          className={S.textarea}
          placeholder="Optional extra line shown at the bottom of the footer (copyright note, tagline, etc.)"
        />
      </div>
    </section>
  );
}

// ─── Default settings (used while Supabase loads) ────────────────────────────

const EMPTY_SETTINGS: AdminSiteSettings = {
  studioName: '', studioNameShort: '', tagline: '',
  address: '', addressLine2: '', city: '', state: '', zip: '',
  phone: '', whatsapp: '', email: '', googleMapsEmbed: '',
  socialLinks: [], businessHours: [],
  metaTitle: '', metaDescription: '', footerText: '',
};

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [settings, setSettings] = useState<AdminSiteSettings>(EMPTY_SETTINGS);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(data => { if (data) setSettings(data); })
      .catch(err => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false));
  }, []);

  function patch(update: Partial<AdminSiteSettings>) {
    setSettings(prev => ({ ...prev, ...update }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={20} style={{ color: GOLD }} />
          <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        </div>
        <p className="text-sm text-gray-500">
          Studio contact info, social links, business hours, and SEO defaults.
        </p>
      </div>

      <StudioInfoSection settings={settings} onChange={patch} />

      <SocialLinksSection
        links={settings.socialLinks}
        onChange={links => patch({ socialLinks: links })}
      />

      <BusinessHoursSection
        hours={settings.businessHours}
        onChange={hours => patch({ businessHours: hours })}
      />

      <SeoSection settings={settings} onChange={patch} />

      <FooterSection settings={settings} onChange={patch} />

      {/* Save button */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-10">
        {loading && (
          <span className="flex items-center gap-1.5 text-sm text-gray-400 font-semibold">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </span>
        )}
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-semibold">
            <Check size={14} /> Saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: GOLD, color: '#0A0A0A' }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
