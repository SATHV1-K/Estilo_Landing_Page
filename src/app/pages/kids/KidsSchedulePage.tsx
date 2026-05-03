// KidsSchedulePage — Schedule overview grid in kids blue theme.
// Data sourced from the same Supabase table as the main site, so admin changes reflect here automatically.

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { getOverviewEntries } from '../../../lib/scheduleService';

// ─── Theme ────────────────────────────────────────────────────────────────────

const KIDS_DARK  = '#2D3D6B';
const KIDS_CREAM = '#FFF8E7';
const KIDS_GOLD  = '#f0bf71';
const KIDS_CARD  = 'rgba(255,255,255,0.12)';
const KIDS_EMPTY = 'rgba(0,0,0,0.15)';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'kids' | 'salsa' | 'bachata' | 'street' | 'ballet' | 'team' | 'special';

interface WeeklyClass {
  dayOfWeek: number;
  time: string;
  name: string;
  detail: string;
  category: Category;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAME_TO_NUM: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function to12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

function parseTime12h(time: string): number {
  const [timePart, meridiem] = time.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  const hours = meridiem === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
  return hours * 60 + m;
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK: WeeklyClass[] = [
  { dayOfWeek: 1, time: '6:00 PM', name: 'Kids Latin Rhythms', detail: 'Intermediate | 5 Years Old and Up', category: 'kids' },
  { dayOfWeek: 1, time: '7:00 PM', name: 'Salsa Foundamental', detail: 'Totally Beginners', category: 'salsa' },
  { dayOfWeek: 1, time: '8:00 PM', name: 'Salsa On 1', detail: 'Shines & Partnerwork — Intermediate', category: 'salsa' },
  { dayOfWeek: 2, time: '5:00 PM', name: 'Kids Latin Rhythms', detail: 'Advanced | 5 Years Old and Up', category: 'kids' },
  { dayOfWeek: 2, time: '6:00 PM', name: 'Kids Latin Rhythms', detail: 'Beginners | 5 Years Old and Up', category: 'kids' },
  { dayOfWeek: 2, time: '7:00 PM', name: 'Street Dance', detail: 'Urban | Hip Hop | Reggaeton | Dancehall — Beginners · 10 Yrs Old and Up', category: 'street' },
  { dayOfWeek: 2, time: '8:00 PM', name: 'Salsa Caleña', detail: 'Beginners - Intermediate', category: 'salsa' },
  { dayOfWeek: 2, time: '9:00 PM', name: 'Euphoria Dance Team', detail: '', category: 'team' },
  { dayOfWeek: 3, time: '5:00 PM', name: 'Gymnastics Workshop', detail: '', category: 'special' },
  { dayOfWeek: 3, time: '6:00 PM', name: 'Kids Latin Rhythms', detail: 'Intermediate | 5 Years Old and Up', category: 'kids' },
  { dayOfWeek: 3, time: '7:00 PM', name: 'Salsa Foundamental', detail: 'Beginners - Intermediate', category: 'salsa' },
  { dayOfWeek: 3, time: '8:00 PM', name: 'Bachata', detail: 'Beginners - Social — Open Level', category: 'bachata' },
  { dayOfWeek: 3, time: '9:00 PM', name: 'Bachata', detail: 'Intermediate Choreography', category: 'bachata' },
  { dayOfWeek: 4, time: '5:00 PM', name: 'Kids Latin Rhythms', detail: 'Advanced | 5 Years Old and Up', category: 'kids' },
  { dayOfWeek: 4, time: '6:00 PM', name: 'Kids Latin Rhythms', detail: 'Beginners | 5 Years Old and Up', category: 'kids' },
  { dayOfWeek: 4, time: '7:00 PM', name: 'Salsa Caleña', detail: 'Beginners - Intermediate', category: 'salsa' },
  { dayOfWeek: 4, time: '8:00 PM', name: 'Salsa Caleña', detail: 'Intermediate Choreography', category: 'salsa' },
  { dayOfWeek: 4, time: '9:00 PM', name: 'Euphoria Dance Team', detail: '', category: 'team' },
  { dayOfWeek: 5, time: '5:00 PM', name: 'Contemporary Ballet Workshop', detail: '', category: 'ballet' },
  { dayOfWeek: 5, time: '6:00 PM', name: 'Street Dance Dance Team', detail: '10 Yrs Old and Up', category: 'street' },
  { dayOfWeek: 5, time: '7:00 PM', name: 'Street Dance', detail: 'Urban | Hip Hop | Reggaeton | Dancehall — 10 Yrs Old and Up', category: 'street' },
  { dayOfWeek: 5, time: '8:00 PM', name: 'Salsa On 1', detail: 'Shines & Partnerwork — Intermediate - Choreography', category: 'salsa' },
  { dayOfWeek: 6, time: 'By Appointment', name: 'Private Lessons', detail: 'Available: 10AM, 11AM, 12PM, 1PM, 2PM', category: 'special' },
];

// ─── Category colors ──────────────────────────────────────────────────────────

const categoryColors: Record<Category, string> = {
  kids:    KIDS_GOLD,
  salsa:   '#EF4444',
  bachata: '#06B6D4',
  street:  '#8B5CF6',
  ballet:  '#EC4899',
  special: '#10B981',
  team:    '#6366F1',
};

// ─── Schedule Overview Grid ───────────────────────────────────────────────────

const WEEKDAYS = [
  { dow: 1, label: 'MONDAY' },
  { dow: 2, label: 'TUESDAY' },
  { dow: 3, label: 'WEDNESDAY' },
  { dow: 4, label: 'THURSDAY' },
  { dow: 5, label: 'FRIDAY' },
];

const SAT_TIME_LABELS = ['10AM', '11AM', '12PM', '1PM', '2PM'];
const CELL_H = 'h-[90px]';

function KidsOverviewGrid({ pattern }: { pattern: WeeklyClass[] }) {
  const lookup: Record<number, Record<string, WeeklyClass>> = {};
  pattern.forEach(cls => {
    if (!lookup[cls.dayOfWeek]) lookup[cls.dayOfWeek] = {};
    lookup[cls.dayOfWeek][cls.time] = cls;
  });

  const gridTimes = Array.from(
    new Set(pattern.filter(c => c.dayOfWeek >= 1 && c.dayOfWeek <= 5).map(c => c.time))
  ).sort((a, b) => parseTime12h(a) - parseTime12h(b));

  const colTemplate = '64px repeat(5, minmax(0,1fr)) minmax(0,1fr)';

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' as const }}>
      <div style={{ minWidth: '860px' }}>

        {/* Header row */}
        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: colTemplate }}>
          <div />
          {WEEKDAYS.map(d => (
            <div
              key={d.dow}
              className="font-body font-bold text-xs uppercase tracking-wide text-center py-2 rounded-full"
              style={{ background: KIDS_GOLD, color: KIDS_DARK }}
            >
              {d.label}
            </div>
          ))}
          <div
            className="font-body font-bold text-xs uppercase tracking-wide text-center py-2 rounded-full"
            style={{ background: KIDS_GOLD, color: KIDS_DARK }}
          >
            SATURDAY
          </div>
        </div>

        {/* Time rows */}
        {gridTimes.map((time, rowIdx) => {
          const satSlot = SAT_TIME_LABELS[rowIdx];
          return (
            <div key={time} className="grid gap-2 mb-2" style={{ gridTemplateColumns: colTemplate }}>

              {/* Time label */}
              <div className={`${CELL_H} flex items-center justify-center`}>
                <span
                  className="font-body font-bold text-xs uppercase w-full text-center px-2 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.15)', color: KIDS_CREAM, border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  {time.replace(':00 ', '')}
                </span>
              </div>

              {/* Mon–Fri cells */}
              {WEEKDAYS.map(d => {
                const cls = lookup[d.dow]?.[time];
                if (!cls) {
                  return <div key={d.dow} className={`${CELL_H} rounded-lg`} style={{ background: KIDS_EMPTY }} />;
                }
                const isKids = cls.category === 'kids';
                const color = categoryColors[cls.category];
                return (
                  <div
                    key={d.dow}
                    className={`${CELL_H} rounded-lg p-2.5 overflow-hidden relative`}
                    style={{
                      background: isKids ? 'rgba(240,191,113,0.22)' : KIDS_CARD,
                      borderLeft: `4px solid ${color}`,
                      outline: isKids ? '1px solid rgba(240,191,113,0.45)' : undefined,
                    }}
                  >
                    {isKids && (
                      <span className="absolute top-1 right-1.5 text-[11px] leading-none">🐝</span>
                    )}
                    <p
                      className="font-body font-bold text-[11px] uppercase leading-tight"
                      style={{ color: isKids ? KIDS_GOLD : KIDS_CREAM }}
                    >
                      {cls.name}
                    </p>
                    {cls.detail && (
                      <p
                        className="font-body text-[10px] mt-1 leading-tight"
                        style={{
                          color: 'rgba(255,255,255,0.55)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        } as object}
                      >
                        {cls.detail}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Saturday column */}
              {satSlot ? (
                <div
                  className={`${CELL_H} rounded-lg p-2 flex flex-col justify-between`}
                  style={{ background: KIDS_CARD, borderLeft: `4px solid ${categoryColors.special}` }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="font-body font-bold rounded-full px-2 py-0.5"
                      style={{ background: KIDS_GOLD, color: KIDS_DARK, fontSize: '11px' }}
                    >
                      {satSlot}
                    </span>
                    <p className="font-body text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Private
                    </p>
                  </div>
                  <Link
                    to="/packages?tab=private"
                    className="font-body font-bold text-center rounded px-1.5 py-1 transition-all duration-200 block text-[10px]"
                    style={{ background: KIDS_GOLD, color: KIDS_DARK }}
                  >
                    Book
                  </Link>
                </div>
              ) : (
                <div className={`${CELL_H} rounded-lg`} style={{ background: KIDS_EMPTY }} />
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function KidsSchedulePage() {
  const [overviewPattern, setOverviewPattern] = useState<WeeklyClass[]>(FALLBACK);

  useEffect(() => {
    document.title = 'Kids Schedule | Estilo Kids';

    getOverviewEntries().then(entries => {
      const weekly = entries
        .filter(e => e.isActive)
        .map(e => ({
          dayOfWeek: DAY_NAME_TO_NUM[e.dayOfWeek] ?? 0,
          time:      to12h(e.startTime),
          name:      e.className,
          detail:    e.detail,
          category:  e.category as Category,
        }));
      if (weekly.length > 0) setOverviewPattern(weekly);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pb-24">

      {/* ── Page heading ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl mb-3">🐝</div>
          <h1
            className="font-display leading-[0.95] uppercase mb-3"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: KIDS_CREAM }}
          >
            KIDS <span style={{ color: KIDS_GOLD }}>SCHEDULE</span>
          </h1>
          <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Classes Monday through Saturday · Elizabeth, NJ
          </p>
        </motion.div>
      </div>

      {/* ── Schedule Overview Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-10 pb-16"
      >
        {/* Legend */}
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ background: 'rgba(240,191,113,0.22)', outline: '1px solid rgba(240,191,113,0.45)', borderLeft: `4px solid ${KIDS_GOLD}` }}
            />
            <span className="font-body text-xs font-bold" style={{ color: KIDS_GOLD }}>🐝 Kids Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: KIDS_CARD }} />
            <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Adult Classes</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <KidsOverviewGrid pattern={overviewPattern} />
        </div>
      </motion.div>

    </div>
  );
}
