// PackagesAdminPage — full CRUD for class packages, grouped by category.

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Check, ChevronUp, ChevronDown,
  ExternalLink, Phone, Package, Loader2,
} from 'lucide-react';
import {
  getAllPackages, savePackage, deletePackage, reorderPackages,
} from '../../../lib/packagesService';
import { getContent, setPageContent } from '../../../lib/contentService';
import type { Package as PkgType } from '../../../lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:   'max-w-5xl mx-auto px-4 sm:px-6 py-8',
  card:   'bg-white rounded-xl border border-gray-200 shadow-sm',
  label:  'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5',
  input:  'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none',
  btn: {
    gold:   'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90',
    ghost:  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors',
    danger: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors',
    icon:   'p-2 rounded-lg transition-colors',
  },
};

type Category = 'adults-salsa-bachata' | 'adults-street' | 'kids' | 'private' | 'event';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'adults-salsa-bachata', label: 'Salsa & Bachata' },
  { id: 'adults-street',        label: 'Urban / HipHop' },
  { id: 'kids',                 label: 'Kids' },
  { id: 'private',              label: 'Private & Events' },
  { id: 'event',                label: 'Special Events' },
];

const EXPIRATION_OPTIONS = [
  { value: '',  label: 'N/A' },
  { value: '1', label: '1 month' },
  { value: '2', label: '2 months' },
  { value: '3', label: '3 months' },
];

const PUNCHCARD_KEY = 'packages.punchcard.notice';
const PUNCHCARD_DEFAULT =
  'All class cards are valid only for adult Salsa & Bachata classes. Cards are non-refundable and non-transferable.';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PkgForm {
  id?: string;
  name: string;
  nameEs: string;
  category: Category;
  price: string;          // dollars as string, blank = "Call for pricing"
  classCount: string;     // blank = none
  expirationMonths: string;
  description: string;
  descriptionEs: string;
  paymentLink: string;
  isActive: boolean;
  sortOrder: number;
  currency: 'USD';
}

function emptyForm(category: Category): PkgForm {
  return {
    name: '', nameEs: '', category,
    price: '', classCount: '', expirationMonths: '',
    description: '', descriptionEs: '', paymentLink: '',
    isActive: true, sortOrder: 999, currency: 'USD',
  };
}

function pkgToForm(pkg: ReturnType<typeof getAllPackages>[number]): PkgForm {
  return {
    id: pkg.id,
    name: pkg.name,
    nameEs: pkg.nameEs,
    category: pkg.category,
    price: pkg.price !== null ? String(pkg.price / 100) : '',
    classCount: pkg.classCount ? String(pkg.classCount) : '',
    expirationMonths: pkg.expirationMonths ? String(pkg.expirationMonths) : '',
    description: pkg.description,
    descriptionEs: pkg.descriptionEs,
    paymentLink: pkg.paymentLink ?? '',
    isActive: pkg.isActive,
    sortOrder: pkg.sortOrder,
    currency: 'USD',
  };
}

function formToPkg(f: PkgForm) {
  return {
    id: f.id,
    name: f.name.trim(),
    nameEs: f.nameEs.trim(),
    category: f.category,
    price: f.price.trim() !== '' ? Math.round(parseFloat(f.price) * 100) : null,
    currency: 'USD' as const,
    classCount: f.classCount !== '' ? parseInt(f.classCount) : undefined,
    expirationMonths: f.expirationMonths !== '' ? parseInt(f.expirationMonths) : undefined,
    description: f.description.trim(),
    descriptionEs: f.descriptionEs.trim(),
    paymentLink: f.paymentLink.trim() || undefined,
    isActive: f.isActive,
    sortOrder: f.sortOrder,
  };
}

// ─── Form Panel ───────────────────────────────────────────────────────────────

function PackageFormPanel({
  pkg,
  defaultCategory,
  saving,
  onSave,
  onClose,
}: {
  pkg: PkgForm | null;
  defaultCategory: Category;
  saving: boolean;
  onSave: (data: PkgType) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = !pkg?.id;
  const [form, setForm] = useState<PkgForm>(pkg ?? emptyForm(defaultCategory));
  const [langTab, setLangTab] = useState<'en' | 'es'>('en');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof PkgForm>(key: K, val: PkgForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.price !== '' && isNaN(parseFloat(form.price))) e.price = 'Enter a valid number';
    if (form.classCount !== '' && isNaN(parseInt(form.classCount))) e.classCount = 'Enter a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formToPkg(form));
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {isNew ? 'New Package' : 'Edit Package'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form id="pkg-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Name with EN/ES tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Name *</label>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                {(['en', 'es'] as const).map(l => (
                  <button key={l} type="button" onClick={() => setLangTab(l)}
                    className="px-3 py-1 text-xs font-bold transition-colors"
                    style={langTab === l ? { background: `${GOLD}22`, color: '#92700B' } : { color: '#9CA3AF' }}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <input
              value={langTab === 'en' ? form.name : form.nameEs}
              onChange={e => langTab === 'en' ? set('name', e.target.value) : set('nameEs', e.target.value)}
              className={S.input}
              placeholder={`Package name in ${langTab === 'en' ? 'English' : 'Spanish'}…`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className={S.label}>Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value as Category)}
              className={S.input}
            >
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* Price + Class Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={S.label}>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                className={S.input}
                placeholder="Leave blank = Call for pricing"
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className={S.label}>Class Count</label>
              <input
                type="number"
                min="1"
                value={form.classCount}
                onChange={e => set('classCount', e.target.value)}
                className={S.input}
                placeholder="e.g. 4, 8, 12"
              />
              {errors.classCount && <p className="text-xs text-red-600 mt-1">{errors.classCount}</p>}
            </div>
          </div>

          {/* Expiration */}
          <div>
            <label className={S.label}>Expiration</label>
            <select
              value={form.expirationMonths}
              onChange={e => set('expirationMonths', e.target.value)}
              className={S.input}
            >
              {EXPIRATION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Description with EN/ES tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={S.label} style={{ marginBottom: 0 }}>Description</label>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                {(['en', 'es'] as const).map(l => (
                  <button key={l} type="button" onClick={() => setLangTab(l)}
                    className="px-3 py-1 text-xs font-bold transition-colors"
                    style={langTab === l ? { background: `${GOLD}22`, color: '#92700B' } : { color: '#9CA3AF' }}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              value={langTab === 'en' ? form.description : form.descriptionEs}
              onChange={e => langTab === 'en' ? set('description', e.target.value) : set('descriptionEs', e.target.value)}
              className={S.input}
              placeholder={`Description in ${langTab === 'en' ? 'English' : 'Spanish'}…`}
            />
          </div>

          {/* Square Payment Link */}
          <div>
            <label className={S.label}>Square Payment Link</label>
            <input
              type="url"
              value={form.paymentLink}
              onChange={e => set('paymentLink', e.target.value)}
              className={S.input}
              placeholder="https://square.link/u/…"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ background: form.isActive ? GOLD : '#E5E7EB' }}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-gray-700 font-semibold">
              {form.isActive ? 'Active — shown on public site' : 'Inactive — hidden from public'}
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className={S.btn.ghost} disabled={saving}>Cancel</button>
          <button
            form="pkg-form"
            type="submit"
            className={S.btn.gold}
            style={{ background: GOLD, color: '#0A0A0A' }}
            disabled={saving}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {isNew ? 'Add Package' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Package Row ──────────────────────────────────────────────────────────────

function PackageRow({
  pkg,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  pkg: PkgType;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Up/down */}
      <div className="flex flex-col justify-center border-r border-gray-100 px-1 self-stretch">
        <button onClick={onMoveUp} disabled={isFirst} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronUp size={14} />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20">
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center gap-4 px-4 py-3 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{pkg.name}</p>
          {pkg.description && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{pkg.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          {pkg.price !== null ? (
            <p className="font-black text-base" style={{ color: GOLD }}>
              ${(pkg.price / 100).toFixed(0)}
            </p>
          ) : (
            <p className="text-xs font-semibold text-gray-400">Call us</p>
          )}
          {pkg.classCount && (
            <p className="text-xs text-gray-400">{pkg.classCount} classes</p>
          )}
        </div>

        {/* Payment link badge */}
        {pkg.paymentLink ? (
          <a href={pkg.paymentLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
            style={{ background: `${GOLD}22`, color: '#92700B' }}
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={11} /> Square
          </a>
        ) : (
          <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 flex-shrink-0">
            <Phone size={11} /> Contact
          </span>
        )}

        {/* Status */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
          {pkg.isActive ? 'Active' : 'Off'}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit} className={`${S.btn.icon} text-gray-400 hover:text-gray-700 hover:bg-gray-100`} title="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={onDelete} className={`${S.btn.icon} text-gray-400 hover:text-red-600 hover:bg-red-50`} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PackagesAdminPage ────────────────────────────────────────────────────────

export function PackagesAdminPage() {
  const [allPkgs, setAllPkgs]       = useState<PkgType[]>([]);
  const [activeTab, setActiveTab]   = useState<Category>('adults-salsa-bachata');
  const [editing, setEditing]       = useState<PkgForm | null>(null);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [punchcard, setPunchcard]   = useState('');
  const [punchSaved, setPunchSaved] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  const refresh = useCallback(async () => {
    const [pkgs, punch] = await Promise.all([
      getAllPackages(),
      getContent(PUNCHCARD_KEY, PUNCHCARD_DEFAULT),
    ]);
    setAllPkgs(pkgs);
    setPunchcard(punch);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const tabPkgs = allPkgs.filter(p => p.category === activeTab);

  function openNew()          { setEditing(null); setPanelOpen(true); }
  function openEdit(pkg: PkgType) { setEditing(pkgToForm(pkg)); setPanelOpen(true); }
  function closePanel()       { setPanelOpen(false); setEditing(null); }

  async function handleSave(data: PkgType) {
    setSaving(true);
    try {
      await savePackage(data);
      await refresh();
      closePanel();
    } catch (err) {
      console.error('Failed to save package:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete package "${name}"? This cannot be undone.`)) return;
    try {
      await deletePackage(id);
      await refresh();
    } catch (err) {
      console.error('Failed to delete package:', err);
      alert('Failed to delete. Please try again.');
    }
  }

  async function moveUp(id: string) {
    const ids = tabPkgs.map(p => p.id);
    const idx = ids.indexOf(id);
    if (idx > 0) {
      [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
      const otherIds = allPkgs.filter(p => p.category !== activeTab).map(p => p.id);
      await reorderPackages([...otherIds, ...ids]);
      await refresh();
    }
  }

  async function moveDown(id: string) {
    const ids = tabPkgs.map(p => p.id);
    const idx = ids.indexOf(id);
    if (idx < ids.length - 1) {
      [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
      const otherIds = allPkgs.filter(p => p.category !== activeTab).map(p => p.id);
      await reorderPackages([...otherIds, ...ids]);
      await refresh();
    }
  }

  async function savePunchcard() {
    await setPageContent({ [PUNCHCARD_KEY]: punchcard });
    setPunchSaved(true);
    setTimeout(() => setPunchSaved(false), 2000);
  }

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Package size={20} style={{ color: GOLD }} />
            <h1 className="text-xl font-black text-gray-900">Packages</h1>
          </div>
          <p className="text-sm text-gray-500">Manage class packages and pricing shown on the public site.</p>
        </div>
        <button onClick={openNew} className={S.btn.gold} style={{ background: GOLD, color: '#0A0A0A' }}>
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === cat.id
                ? 'text-[#0A0A0A]'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-amber-300'
            }`}
            style={activeTab === cat.id ? { background: GOLD } : {}}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Punch card notice (salsa-bachata tab only) */}
      {activeTab === 'adults-salsa-bachata' && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <label className="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">
            Punch Card System Notice
          </label>
          <p className="text-xs text-amber-600 mb-3">
            This text appears at the top of the Salsa &amp; Bachata tab on the public packages page.
          </p>
          <textarea
            rows={3}
            value={punchcard}
            onChange={e => setPunchcard(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none bg-white"
          />
          <button
            onClick={savePunchcard}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: punchSaved ? '#22C55E' : GOLD, color: '#0A0A0A' }}
          >
            <Check size={13} />
            {punchSaved ? 'Saved!' : 'Save Notice'}
          </button>
        </div>
      )}

      {/* Package list */}
      <div className={S.card}>
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 size={24} className="mx-auto mb-3 text-gray-300 animate-spin" />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        ) : tabPkgs.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-500">No packages in this category yet.</p>
            <button
              onClick={openNew}
              className="mt-3 flex items-center gap-2 mx-auto text-sm font-semibold text-amber-600 hover:text-amber-800"
            >
              <Plus size={14} /> Add one
            </button>
          </div>
        ) : (
          tabPkgs.map((pkg, idx) => (
            <PackageRow
              key={pkg.id}
              pkg={pkg}
              isFirst={idx === 0}
              isLast={idx === tabPkgs.length - 1}
              onEdit={() => openEdit(pkg)}
              onDelete={() => handleDelete(pkg.id, pkg.name)}
              onMoveUp={() => moveUp(pkg.id)}
              onMoveDown={() => moveDown(pkg.id)}
            />
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Changes are saved immediately and reflected on the public packages page.
      </p>

      {/* Slide-out panel */}
      {panelOpen && (
        <PackageFormPanel
          pkg={editing}
          defaultCategory={activeTab}
          saving={saving}
          onSave={handleSave}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
