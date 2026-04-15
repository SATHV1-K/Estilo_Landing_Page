// SettingsPage — displays read-only site settings (contact info, hours, socials).
// Editing requires changing data.ts or wiring a settings API endpoint.

import { Settings, MapPin, Phone, Mail, Clock, Share2 } from 'lucide-react';
import { siteSettings } from '../../../lib/data';

const GOLD = '#F6B000';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-black uppercase tracking-wider text-gray-400 w-36 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={20} style={{ color: GOLD }} />
          <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        </div>
        <p className="text-sm text-gray-500">
          Studio contact info, hours, and social links.
        </p>
      </div>

      {/* Studio info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
          <MapPin size={14} /> Studio Info
        </h2>
        <Row label="Name"    value={siteSettings.studioName} />
        <Row label="Address" value={`${siteSettings.address}, ${siteSettings.city}, ${siteSettings.state} ${siteSettings.zip}`} />
        <Row label="Phone"   value={siteSettings.phone} />
        <Row label="WhatsApp" value={siteSettings.whatsapp} />
        <Row label="Email"   value={siteSettings.email} />
      </section>

      {/* Business hours */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
          <Clock size={14} /> Business Hours
        </h2>
        {siteSettings.businessHours.map((h) => (
          <div key={h.day} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0 text-sm">
            <span className="font-semibold text-gray-700">{h.day}</span>
            <span className="text-gray-500">
              {h.isClosed ? 'Closed' : `${h.open} – ${h.close}`}
            </span>
          </div>
        ))}
      </section>

      {/* Social links */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
          <Share2 size={14} /> Social Links
        </h2>
        {siteSettings.socialLinks.map((s) => (
          <div key={s.platform} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm font-bold text-gray-700">{s.platform}</span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-600 hover:underline font-medium"
            >
              {s.label}
            </a>
          </div>
        ))}
      </section>

      <p className="text-xs text-gray-400">
        To update these values, edit{' '}
        <code className="bg-gray-100 px-1 rounded">src/lib/data.ts → siteSettings</code>.
      </p>
    </div>
  );
}
