// SchedulePage — Weekly timetable grid

import { Fragment, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../lib/i18n';
import { CTAButton } from '../components/ui/CTAButton';
import { staggerFast, fadeInUp, scaleIn, clipRevealLTR, staggerContainer } from '../../lib/animations';

// ─── Data ────────────────────────────────────────────────
type Category = 'kids' | 'salsa' | 'bachata' | 'street' | 'special' | 'ballet' | 'team';

interface ClassEntry {
  day: string;
  time: string;
  name: string;
  detail: string;
  category: Category;
}

const scheduleData: ClassEntry[] = [
  { day: 'tuesday',   time: '5PM', name: 'KIDS LATIN RHYTHMS',          detail: 'Advanced | 5 Years Old and Up',                                            category: 'kids' },
  { day: 'wednesday', time: '5PM', name: 'GYMNASTICS WORKSHOP',          detail: '',                                                                         category: 'special' },
  { day: 'thursday',  time: '5PM', name: 'KIDS LATIN RHYTHMS',          detail: 'Advanced | 5 Years Old and Up',                                            category: 'kids' },
  { day: 'friday',    time: '5PM', name: 'CONTEMPORARY BALLET WORKSHOP', detail: '',                                                                         category: 'ballet' },

  { day: 'monday',    time: '6PM', name: 'KIDS LATIN RHYTHMS',          detail: 'Intermediate | 5 Years Old and Up',                                        category: 'kids' },
  { day: 'tuesday',   time: '6PM', name: 'KIDS LATIN RHYTHMS',          detail: 'Beginners | 5 Years Old and Up',                                           category: 'kids' },
  { day: 'wednesday', time: '6PM', name: 'KIDS LATIN RHYTHMS',          detail: 'Intermediate | 5 Years Old and Up',                                        category: 'kids' },
  { day: 'thursday',  time: '6PM', name: 'KIDS LATIN RHYTHMS',          detail: 'Beginners | 5 Years Old and Up',                                           category: 'kids' },
  { day: 'friday',    time: '6PM', name: 'STREET DANCE DANCE TEAM',     detail: '10 Yrs Old and Up',                                                        category: 'street' },

  { day: 'monday',    time: '7PM', name: 'SALSA FOUNDAMENTAL',          detail: 'Totally Beginners',                                                        category: 'salsa' },
  { day: 'tuesday',   time: '7PM', name: 'STREET DANCE',                detail: 'Urban | Hip Hop | Reggaeton | Dancehall — Beginners · 10 Yrs Old and Up', category: 'street' },
  { day: 'wednesday', time: '7PM', name: 'SALSA FOUNDAMENTAL',          detail: 'Beginners - Intermediate',                                                 category: 'salsa' },
  { day: 'thursday',  time: '7PM', name: 'SALSA CALEÑA',                detail: 'Beginners - Intermediate',                                                 category: 'salsa' },
  { day: 'friday',    time: '7PM', name: 'STREET DANCE',                detail: 'Urban | Hip Hop | Reggaeton | Dancehall — 10 Yrs Old and Up',              category: 'street' },

  { day: 'monday',    time: '8PM', name: 'SALSA ON 1',                  detail: 'Shines & Partnerwork — Intermediate',                                      category: 'salsa' },
  { day: 'tuesday',   time: '8PM', name: 'SALSA CALEÑA',                detail: 'Beginners - Intermediate',                                                 category: 'salsa' },
  { day: 'wednesday', time: '8PM', name: 'BACHATA',                     detail: 'Beginners - Social — Open Level',                                          category: 'bachata' },
  { day: 'thursday',  time: '8PM', name: 'SALSA CALEÑA',                detail: 'Intermediate Choreography',                                                category: 'salsa' },
  { day: 'friday',    time: '8PM', name: 'SALSA ON 1',                  detail: 'Shines & Partnerwork — Intermediate - Choreography',                       category: 'salsa' },

  { day: 'tuesday',   time: '9PM', name: 'EUPHORIA DANCE TEAM',         detail: '',                                                                         category: 'team' },
  { day: 'wednesday', time: '9PM', name: 'BACHATA',                     detail: 'Intermediate Choreography',                                                category: 'bachata' },
  { day: 'thursday',  time: '9PM', name: 'EUPHORIA DANCE TEAM',         detail: '',                                                                         category: 'team' },
];

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
type Day = typeof days[number];

const timeSlots = ['5PM', '6PM', '7PM', '8PM', '9PM'] as const;

const dayLabels: Record<Day, string> = {
  monday: 'MON', tuesday: 'TUE', wednesday: 'WED',
  thursday: 'THU', friday: 'FRI', saturday: 'SAT',
};
const dayLabelsFull: Record<Day, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
};

// Category: data-viz left-border colors only — never used as UI accent
const categoryBorderClass: Record<Category, string> = {
  kids:    'border-l-amber-500',
  salsa:   'border-l-red-500',
  bachata: 'border-l-cyan-500',
  street:  'border-l-violet-500',
  ballet:  'border-l-pink-500',
  special: 'border-l-emerald-500',
  team:    'border-l-indigo-500',
};

type FilterType = 'all' | 'kids' | 'salsa' | 'bachata' | 'street' | 'special';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all',     label: 'ALL' },
  { id: 'kids',    label: 'KIDS' },
  { id: 'salsa',   label: 'SALSA' },
  { id: 'bachata', label: 'BACHATA' },
  { id: 'street',  label: 'STREET DANCE' },
  { id: 'special', label: 'SPECIAL' },
];

function matchesFilter(category: Category, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (filter === 'special') return category === 'special' || category === 'ballet' || category === 'team';
  return category === (filter as Category);
}

const PRIVATE_SLOTS = ['10AM', '11AM', '12PM', '1PM', '2PM'];

// ─── Desktop grid ─────────────────────────────────────────
// Plain (non-animated) so cells are always visible. Filter = opacity only.
function ScheduleTable({ filter }: { filter: FilterType }) {
  return (
    <div className="w-full overflow-x-auto">
      <div
        className="min-w-[700px]"
        style={{
          display: 'grid',
          gridTemplateColumns: '80px repeat(6, 1fr)',
          gap: '6px',
        }}
      >
        {/* ── Header row ── */}
        <div /> {/* empty time-label corner */}
        {days.map((day) => (
          <div key={day} className="pb-3">
            <div className="bg-black text-white text-center py-2 px-1 rounded-full font-body font-semibold text-xs tracking-widest uppercase">
              {dayLabels[day]}
            </div>
          </div>
        ))}

        {/* ── Time slot rows ── */}
        {timeSlots.map((time, timeIdx) => (
          <Fragment key={time}>
            {/* Time label */}
            <div className="flex items-start justify-end pr-2 pt-3">
              <span className="font-body font-bold text-sm text-ink">{time}</span>
            </div>

            {/* Day cells */}
            {days.map((day) => {
              // ── Saturday: black time block per row ──────────────
              if (day === 'saturday') {
                const privateTime = PRIVATE_SLOTS[timeIdx];
                return (
                  <div
                    key={`${day}-${time}`}
                    className="rounded-lg min-h-[80px] flex items-center gap-3 p-3"
                    style={{ background: '#E8E8E8' }}
                  >
                    {/* Black time badge */}
                    <div className="bg-black rounded-lg flex-shrink-0 flex items-center justify-center px-3 py-2 min-w-[56px]">
                      <span className="font-display text-white text-xl leading-none">
                        {privateTime}
                      </span>
                    </div>
                    {/* "SPOTS FOR PRIVATES" label — first row only */}
                    {timeIdx === 0 && (
                      <span className="font-body font-bold text-[11px] text-ink uppercase tracking-wide leading-tight">
                        SPOTS<br />FOR PRIVATES
                      </span>
                    )}
                  </div>
                );
              }

              const entry = scheduleData.find((e) => e.day === day && e.time === time);

              if (entry) {
                const active = matchesFilter(entry.category, filter);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`bg-white rounded-lg p-3 border-l-4 ${categoryBorderClass[entry.category]} min-h-[80px] transition-opacity duration-300`}
                    style={{ opacity: active ? 1 : 0.25 }}
                  >
                    <p className="font-body font-bold text-xs uppercase tracking-wide text-ink leading-tight">
                      {entry.name}
                    </p>
                    {entry.detail && (
                      <p className="font-body text-[10px] text-ink-soft mt-1 leading-tight">
                        {entry.detail}
                      </p>
                    )}
                  </div>
                );
              }

              // Empty weekday cell
              return (
                <div
                  key={`${day}-${time}`}
                  className="rounded-lg min-h-[80px]"
                  style={{ background: '#F0F0F0' }}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile day view ──────────────────────────────────────
function MobileDayView({ filter }: { filter: FilterType }) {
  const [activeDay, setActiveDay] = useState<Day>('monday');

  const dayClasses = scheduleData.filter(
    (e) => e.day === activeDay && matchesFilter(e.category, filter)
  );

  return (
    <div>
      {/* Day selector pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className="flex-shrink-0 px-4 py-2 rounded-full font-body font-semibold text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: activeDay === day ? '#000000' : 'white',
              color: activeDay === day ? 'white' : 'var(--ink)',
              border: activeDay === day ? 'none' : '1px solid rgba(0,0,0,0.12)',
            }}
          >
            {dayLabelsFull[day]}
          </button>
        ))}
      </div>

      {/* Day content */}
      <AnimatePresence mode="wait">
        {activeDay === 'saturday' ? (
          <motion.div
            key="saturday"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            {PRIVATE_SLOTS.map((slot, idx) => (
              <div
                key={slot}
                className="flex items-center gap-4 rounded-lg p-3"
                style={{ background: '#E8E8E8' }}
              >
                <div className="bg-black rounded-lg flex-shrink-0 flex items-center justify-center px-4 py-2 min-w-[64px]">
                  <span className="font-display text-white text-2xl leading-none">{slot}</span>
                </div>
                {idx === 0 && (
                  <span className="font-body font-bold text-xs text-ink uppercase tracking-wide leading-tight">
                    SPOTS<br />FOR PRIVATES
                  </span>
                )}
              </div>
            ))}
            <a
              href="tel:+12018788977"
              className="font-body text-xs font-medium text-center mt-1 hover:underline transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Book a private: (201) 878-8977
            </a>
          </motion.div>
        ) : (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            {dayClasses.length === 0 ? (
              <p className="font-body text-ink-soft text-center py-12">
                No classes match this filter for {dayLabelsFull[activeDay]}.
              </p>
            ) : (
              dayClasses.map((entry, i) => (
                <div
                  key={`${entry.day}-${entry.time}-${i}`}
                  className={`flex gap-4 p-4 rounded-lg bg-white border-l-4 ${categoryBorderClass[entry.category]}`}
                >
                  <div className="flex-shrink-0 w-12 text-right">
                    <span className="font-body font-bold text-sm text-ink">{entry.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body font-bold text-xs text-ink uppercase tracking-wide leading-tight mb-1">
                      {entry.name}
                    </p>
                    {entry.detail && (
                      <p className="font-body text-xs text-ink-soft leading-tight">{entry.detail}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────
export function SchedulePage() {
  const { language } = useI18n();
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    document.title = 'Class Schedule | Estilo Latino Dance Company';
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-cream">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-16">

        {/* ── Heading ── */}
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            variants={clipRevealLTR}
            className="font-display leading-[0.95] uppercase mb-4 text-ink"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {language === 'es' ? (
              <>HORARIO DE <span style={{ color: 'var(--accent)' }}>CLASES</span></>
            ) : (
              <>DANCE <span style={{ color: 'var(--accent)' }}>SCHEDULE</span></>
            )}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="font-body text-ink-soft max-w-xl mx-auto"
          >
            {language === 'es'
              ? 'Clases de Lunes a Sábado · Elizabeth, NJ'
              : 'Classes Monday through Saturday · Elizabeth, NJ'}
          </motion.p>
        </motion.div>

        {/* ── Filter pills ── */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {filters.map((f) => (
            <motion.button
              key={f.id}
              variants={scaleIn}
              onClick={() => setFilter(f.id)}
              className="px-5 py-2 rounded-full font-body font-semibold text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: filter === f.id ? 'var(--accent)' : 'white',
                color: filter === f.id ? 'white' : 'var(--ink)',
                border: filter === f.id ? 'none' : '1px solid rgba(0,0,0,0.12)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Desktop grid (static — no animation wrapper so cells are always visible) ── */}
        <div className="hidden md:block mb-16">
          <ScheduleTable filter={filter} />
        </div>

        {/* ── Mobile day view ── */}
        <div className="block md:hidden mb-16">
          <MobileDayView filter={filter} />
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center py-16 px-8 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, var(--cream-warm) 0%, var(--gradient-end) 100%)',
          }}
        >
          <h3
            className="font-display uppercase mb-4 text-ink"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 0.95 }}
          >
            {language === 'es' ? '¿Listo para Bailar?' : 'Ready to Dance?'}
          </h3>
          <p className="font-body text-ink-soft mb-8 max-w-md mx-auto">
            {language === 'es'
              ? 'Reserva tu primera clase gratis y descubre el ritmo dentro de ti.'
              : 'Book your first class free and discover the rhythm inside you.'}
          </p>
          <CTAButton to="/contact" size="lg">
            {language === 'es' ? 'Reserva Tu Clase Gratis' : 'Book Your First Class Free'}
          </CTAButton>
        </motion.div>

      </div>
    </div>
  );
}
