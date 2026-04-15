// PackagesAdminPage — read-only view of packages with Square payment links.
// Full CRUD can be added when a backend endpoint for packages is available.

import { Package, ExternalLink, Phone } from 'lucide-react';
import { packages } from '../../../lib/data';

const GOLD = '#F6B000';

const CATEGORY_LABELS: Record<string, string> = {
  'adults-salsa-bachata': 'Salsa & Bachata',
  'adults-street': 'Urban / HipHop',
  'kids': 'Kids',
  'private': 'Privates',
  'event': 'Special Events',
};

export function PackagesAdminPage() {
  const grouped = packages.reduce<Record<string, typeof packages>>((acc, pkg) => {
    const cat = pkg.category ?? 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pkg);
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Package size={20} style={{ color: GOLD }} />
          <h1 className="text-2xl font-black text-gray-900">Packages</h1>
        </div>
        <p className="text-sm text-gray-500">
          Class packages and pricing. Payment links point to Square.
        </p>
      </div>

      {/* Package groups */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([cat, pkgs]) => (
          <div key={cat}>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
              {CATEGORY_LABELS[cat] ?? cat}
            </h2>
            <div className="space-y-2">
              {pkgs.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{pkg.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{pkg.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {pkg.price !== null ? (
                      <p className="font-black text-lg" style={{ color: GOLD }}>
                        ${(pkg.price / 100).toFixed(0)}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-gray-400">Call us</p>
                    )}
                    {pkg.classCount && (
                      <p className="text-xs text-gray-400">{pkg.classCount} classes</p>
                    )}
                  </div>

                  {pkg.paymentLink ? (
                    <a
                      href={pkg.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex-shrink-0"
                      style={{ background: `${GOLD}22`, color: '#92700B' }}
                    >
                      <ExternalLink size={12} />
                      Square
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 flex-shrink-0">
                      <Phone size={12} />
                      Contact
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        To update package prices or add new packages, edit{' '}
        <code className="bg-gray-100 px-1 rounded">src/lib/data.ts</code> and
        redeploy, or connect a packages API endpoint.
      </p>
    </div>
  );
}
