// DashboardPage — Admin home. Shows a quick summary of key entity counts
// so the admin can see the site state at a glance.

import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Layers, Star, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { getInstructors } from '../../../lib/instructorsService';
import { getStyles } from '../../../lib/stylesService';
import { getReviews } from '../../../lib/reviewsService';
import { getRecurringEntries } from '../../../lib/scheduleService';
import { getUpcomingActiveSpecialClasses } from '../../../lib/specialClassesService';

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

interface Stats {
  instructorsActive: number; instructorsTotal: number;
  stylesActive: number; stylesTotal: number;
  reviewsActive: number; reviewsTotal: number;
  recurringActive: number;
  eventsCount: number;
}

export function DashboardPage() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getInstructors(),
      getStyles(),
      getReviews(),
      getRecurringEntries(),
      getUpcomingActiveSpecialClasses(),
    ])
      .then(([instructors, styles, reviews, recurring, events]) => {
        setStats({
          instructorsActive: instructors.filter(i => i.isActive).length,
          instructorsTotal:  instructors.length,
          stylesActive:      styles.filter(s => s.isActive).length,
          stylesTotal:       styles.length,
          reviewsActive:     reviews.filter(r => r.isActive).length,
          reviewsTotal:      reviews.length,
          recurringActive:   recurring.filter(e => e.isActive).length,
          eventsCount:       events.length,
        });
      })
      .catch(err => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

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
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Loader2 size={16} className="animate-spin" style={{ color: GOLD }} />
          Loading stats…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={Users}
            label="Instructors"
            value={stats?.instructorsActive ?? 0}
            sub={`${stats?.instructorsTotal ?? 0} total`}
          />
          <StatCard
            icon={Layers}
            label="Dance Styles"
            value={stats?.stylesActive ?? 0}
            sub={`${stats?.stylesTotal ?? 0} total`}
          />
          <StatCard
            icon={Star}
            label="Reviews"
            value={stats?.reviewsActive ?? 0}
            sub={`${stats?.reviewsTotal ?? 0} total`}
          />
          <StatCard
            icon={Calendar}
            label="Recurring Classes"
            value={stats?.recurringActive ?? 0}
            sub="weekly slots"
          />
          <StatCard
            icon={Sparkles}
            label="Upcoming Events"
            value={stats?.eventsCount ?? 0}
            sub="special classes"
          />
        </div>
      )}

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
