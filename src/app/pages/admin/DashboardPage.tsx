// DashboardPage — Admin home. Shows a quick summary of key entity counts
// so the admin can see the site state at a glance.

import { LayoutDashboard, Users, Layers, Star, Calendar, Sparkles } from 'lucide-react';
import { getInstructors, getStyles, getReviews, getRecurringEntries } from '../../../lib/adminData';
import { getUpcomingActiveSpecialClasses } from '../../../lib/specialClasses';

const GOLD = '#F6B000';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
}

function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${GOLD}22` }}
      >
        <Icon size={22} style={{ color: GOLD }} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const instructors   = getInstructors();
  const styles        = getStyles();
  const reviews       = getReviews();
  const recurring     = getRecurringEntries();
  const specialEvents = getUpcomingActiveSpecialClasses();

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <LayoutDashboard size={20} style={{ color: GOLD }} />
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        </div>
        <p className="text-sm text-gray-500">
          Estilo Latino Dance Company — site overview
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={Users}
          label="Instructors"
          value={instructors.filter((i) => i.isActive).length}
          sub={`${instructors.length} total`}
        />
        <StatCard
          icon={Layers}
          label="Dance Styles"
          value={styles.filter((s) => s.isActive).length}
          sub={`${styles.length} total`}
        />
        <StatCard
          icon={Star}
          label="Reviews"
          value={reviews.filter((r) => r.isActive).length}
          sub={`${reviews.length} total`}
        />
        <StatCard
          icon={Calendar}
          label="Recurring Classes"
          value={recurring.filter((e) => e.isActive).length}
          sub="weekly slots"
        />
        <StatCard
          icon={Sparkles}
          label="Upcoming Events"
          value={specialEvents.length}
          sub="special classes"
        />
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Edit homepage text',   href: '/admin/content' },
            { label: 'Upload hero image',    href: '/admin/media' },
            { label: 'Add / edit instructor', href: '/admin/instructors' },
            { label: 'Update class schedule', href: '/admin/schedule' },
            { label: 'Create special event', href: '/admin/special-classes' },
            { label: 'Manage reviews',       href: '/admin/reviews' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:border-amber-400 hover:text-amber-700 transition-colors"
            >
              {label}
              <span className="text-gray-400 group-hover:text-amber-500">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
