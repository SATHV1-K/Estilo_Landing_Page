// SchedulePage — Chronological date-based scrolling timeline

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { CTAButton } from '../components/ui/CTAButton';
import { scaleIn, staggerFast, fadeInUp, clipRevealLTR } from '../../lib/animations';

// ─── Types ────────────────────────────────────────────────

type Category = 'kids' | 'salsa' | 'bachata' | 'street' | 'special' | 'ballet' | 'team';
type FilterType = 'all' | 'kids' | 'salsa' | 'bachata' | 'street' | 'special';

interface WeeklyClass {
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  time: string;
  name: string;
  detail: string;
  category: Category;
  isPrivate?: boolean;
}

interface DateGroup {
  date: Date;
  classes: WeeklyClass[];
}

// ─── Weekly Pattern ───────────────────────────────────────

const weeklyPattern: WeeklyClass[] = [
  // MONDAY
  { dayOfWeek: 1, time: '6:00 PM', name: 'Kids Latin Rhythms',           detail: 'Intermediate | 5 Years Old and Up',                                        category: 'kids' },
  { dayOfWeek: 1, time: '7:00 PM', name: 'Salsa Foundamental',            detail: 'Totally Beginners',                                                         category: 'salsa' },
  { dayOfWeek: 1, time: '8:00 PM', name: 'Salsa On 1',                    detail: 'Shines & Partnerwork — Intermediate',                                        category: 'salsa' },

  // TUESDAY
  { dayOfWeek: 2, time: '5:00 PM', name: 'Kids Latin Rhythms',           detail: 'Advanced | 5 Years Old and Up',                                             category: 'kids' },
  { dayOfWeek: 2, time: '6:00 PM', name: 'Kids Latin Rhythms',           detail: 'Beginners | 5 Years Old and Up',                                            category: 'kids' },
  { dayOfWeek: 2, time: '7:00 PM', name: 'Street Dance',                  detail: 'Urban | Hip Hop | Reggaeton | Dancehall — Beginners · 10 Yrs Old and Up',  category: 'street' },
  { dayOfWeek: 2, time: '8:00 PM', name: 'Salsa Caleña',                  detail: 'Beginners - Intermediate',                                                  category: 'salsa' },
  { dayOfWeek: 2, time: '9:00 PM', name: 'Euphoria Dance Team',           detail: '',                                                                          category: 'team' },

  // WEDNESDAY
  { dayOfWeek: 3, time: '5:00 PM', name: 'Gymnastics Workshop',           detail: '',                                                                          category: 'special' },
  { dayOfWeek: 3, time: '6:00 PM', name: 'Kids Latin Rhythms',           detail: 'Intermediate | 5 Years Old and Up',                                        category: 'kids' },
  { dayOfWeek: 3, time: '7:00 PM', name: 'Salsa Foundamental',            detail: 'Beginners - Intermediate',                                                  category: 'salsa' },
  { dayOfWeek: 3, time: '8:00 PM', name: 'Bachata',                       detail: 'Beginners - Social — Open Level',                                           category: 'bachata' },
  { dayOfWeek: 3, time: '9:00 PM', name: 'Bachata',                       detail: 'Intermediate Choreography',                                                 category: 'bachata' },

  // THURSDAY
  { dayOfWeek: 4, time: '5:00 PM', name: 'Kids Latin Rhythms',           detail: 'Advanced | 5 Years Old and Up',                                             category: 'kids' },
  { dayOfWeek: 4, time: '6:00 PM', name: 'Kids Latin Rhythms',           detail: 'Beginners | 5 Years Old and Up',                                            category: 'kids' },
  { dayOfWeek: 4, time: '7:00 PM', name: 'Salsa Caleña',                  detail: 'Beginners - Intermediate',                                                  category: 'salsa' },
  { dayOfWeek: 4, time: '8:00 PM', name: 'Salsa Caleña',                  detail: 'Intermediate Choreography',                                                 category: 'salsa' },
  { dayOfWeek: 4, time: '9:00 PM', name: 'Euphoria Dance Team',           detail: '',                                                                          category: 'team' },

  // FRIDAY
  { dayOfWeek: 5, time: '5:00 PM', name: 'Contemporary Ballet Workshop',  detail: '',                                                                          category: 'ballet' },
  { dayOfWeek: 5, time: '6:00 PM', name: 'Street Dance Dance Team',       detail: '10 Yrs Old and Up',                                                         category: 'street' },
  { dayOfWeek: 5, time: '7:00 PM', name: 'Street Dance',                  detail: 'Urban | Hip Hop | Reggaeton | Dancehall — 10 Yrs Old and Up',              category: 'street' },
  { dayOfWeek: 5, time: '8:00 PM', name: 'Salsa On 1',                    detail: 'Shines & Partnerwork — Intermediate - Choreography',                       category: 'salsa' },

  // SATURDAY
  { dayOfWeek: 6, time: 'By Appointment', name: 'Private Lessons', detail: 'Available: 10AM, 11AM, 12PM, 1PM, 2PM', category: 'special', isPrivate: true },
];

const categoryColors: Record<Category, string> = {
  kids:    '#F59E0B',
  salsa:   '#EF4444',
  bachata: '#06B6D4',
  street:  '#8B5CF6',
  ballet:  '#EC4899',
  special: '#10B981',
  team:    '#6366F1',
};

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_ABBR   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const PRIVATE_SLOTS = ['10AM','11AM','12PM','1PM','2PM'];

const filters: { id: FilterType; label: string }[] = [
  { id: 'all',     label: 'ALL' },
  { id: 'kids',    label: 'KIDS' },
  { id: 'salsa',   label: 'SALSA' },
  { id: 'bachata', label: 'BACHATA' },
  { id: 'street',  label: 'STREET DANCE' },
  { id: 'special', label: 'SPECIAL' },
];

// ─── Helpers ──────────────────────────────────────────────

function matchesFilter(category: Category, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (filter === 'special') return category === 'special' || category === 'ballet' || category === 'team';
  return category === (filter as Category);
}

function generateSchedule(startDate: Date, totalDays: number): DateGroup[] {
  const entries: DateGroup[] = [];
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dow = date.getDay();
    const dayClasses = weeklyPattern.filter(c => c.dayOfWeek === dow);
    if (dayClasses.length > 0) {
      entries.push({ date, classes: dayClasses });
    }
  }
  return entries;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

// ─── Animation variants ───────────────────────────────────

const groupVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const entryListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const entryVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

// ─── Payment links ────────────────────────────────────────

const paymentLinks: Record<string, string> = {
  kids:    'https://square.link/u/9GoE8ILA?src=sheet',
  salsa:   'https://square.link/u/zYAZzk20?src=sheet',
  bachata: 'https://square.link/u/JnmrkHBX?src=sheet',
  street:  'https://square.link/u/eJjcA1AE?src=sheet',
  ballet:  'https://square.link/u/eJjcA1AE?src=sheet',
  special: 'https://square.link/u/eJjcA1AE?src=sheet',
  team:    'https://square.link/u/eJjcA1AE?src=sheet',
};

// ─── Sub-components ───────────────────────────────────────

function SaturdayEntry() {
  const color = categoryColors.special;
  return (
    <motion.div variants={entryVariants} className="flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 14 }}>
        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-[5px]" style={{ background: color }} />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-body font-medium text-sm flex-shrink-0 w-16" style={{ color: 'var(--text-muted)' }}>
            By Appt
          </span>
          <span className="font-body font-bold text-base leading-snug" style={{ color: 'var(--white)' }}>
            Private Lessons
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2 pl-[76px]">
          {PRIVATE_SLOTS.map((slot) => (
            <span
              key={slot}
              className="font-body font-bold rounded-full px-2.5 py-0.5"
              style={{ background: 'var(--gold)', color: 'var(--ink)', fontSize: '11px' }}
            >
              {slot}
            </span>
          ))}
        </div>
        <p className="mt-2 pl-[76px]">
          <a
            href="tel:+12018788977"
            className="font-body text-xs font-medium hover:underline transition-colors"
            style={{ color: 'var(--gold)' }}
          >
            📞 (201) 878-8977
          </a>
        </p>
      </div>
    </motion.div>
  );
}

function PayButton({ href, fullWidth }: { href: string; fullWidth?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'font-body font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap',
        fullWidth ? 'block w-full text-center' : 'block',
      ].join(' ')}
      style={{
        background: 'rgba(246,176,0,0.1)',
        border: '1px solid var(--gold)',
        color: 'var(--gold)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'var(--gold)';
        el.style.color = 'var(--ink)';
        el.style.boxShadow = '0 0 16px rgba(246,176,0,0.25)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'rgba(246,176,0,0.1)';
        el.style.color = 'var(--gold)';
        el.style.boxShadow = '';
      }}
    >
      Pay →
    </a>
  );
}

function ClassEntryRow({ cls, isLast }: { cls: WeeklyClass; isLast: boolean }) {
  const color = categoryColors[cls.category];
  const payLink = paymentLinks[cls.category];
  return (
    <motion.div variants={entryVariants} className="flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 14 }}>
        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-[5px]" style={{ background: color }} />
        {!isLast && (
          <div className="w-[3px] flex-1 mt-1 min-h-[36px]" style={{ background: color, opacity: 0.3 }} />
        )}
      </div>
      <div className="flex-1 pb-5 flex flex-col sm:flex-row sm:items-center gap-x-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-body font-medium text-sm flex-shrink-0 w-16" style={{ color: 'var(--text-muted)' }}>
              {cls.time}
            </span>
            <span className="font-body font-bold text-base leading-snug" style={{ color: 'var(--white)' }}>
              {cls.name}
            </span>
          </div>
          {cls.detail && (
            <p className="font-body text-sm mt-0.5 pl-[76px] leading-snug" style={{ color: 'var(--text-muted)' }}>
              {cls.detail}
            </p>
          )}
          <p className="font-body text-xs mt-1 pl-[76px] flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
            <Clock size={11} style={{ flexShrink: 0 }} />
            <span>1 hour</span>
            <span>·</span>
            <MapPin size={11} style={{ flexShrink: 0 }} />
            <span>Main Studio</span>
          </p>
          {payLink && (
            <div className="sm:hidden mt-2 pl-[76px]">
              <PayButton href={payLink} fullWidth />
            </div>
          )}
        </div>
        {payLink && (
          <div className="hidden sm:block flex-shrink-0">
            <PayButton href={payLink} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DateGroupRow({
  group,
  isToday,
  filter,
}: {
  group: DateGroup;
  isToday: boolean;
  filter: FilterType;
}) {
  const d = group.date;
  const month = MONTH_ABBR[d.getMonth()];
  const dayNum = d.getDate();
  const dayName = DAY_ABBR[d.getDay()];
  const isSat = d.getDay() === 6;

  // For Saturday, only show if 'all' or 'special'
  const satVisible = isSat && matchesFilter('special', filter);
  const filtered = isSat
    ? []
    : group.classes.filter(c => matchesFilter(c.category, filter));

  if (isSat && !satVisible) return null;
  if (!isSat && filtered.length === 0) return null;

  return (
    <motion.div
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={[
        'flex gap-5 sm:gap-8 py-8 border-b last:border-0',
        isToday ? 'rounded-xl px-4 -mx-4' : '',
      ].join(' ')}
      style={{
        borderColor: 'var(--border)',
        background: isToday ? 'rgba(246,176,0,0.04)' : 'transparent',
      }}
    >
      {/* ── Date column ── */}
      <div className="flex-shrink-0 pt-0.5" style={{ width: 'clamp(72px, 15vw, 100px)' }}>
        <div className="sticky top-24 flex flex-col items-center text-center">
          {/* Month badge */}
          <span
            className="font-body font-bold text-xs uppercase tracking-wide rounded-full px-3 py-0.5 mb-1"
            style={{ background: 'rgba(246,176,0,0.15)', color: 'var(--gold)' }}
          >
            {month}
          </span>
          {/* Date number */}
          <span
            className="font-display uppercase leading-none"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', color: 'var(--white)' }}
          >
            {dayNum}
          </span>
          {/* Day abbr */}
          <span
            className="font-body text-[11px] uppercase tracking-widest mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            {dayName}
          </span>
          {/* TODAY badge */}
          {isToday && (
            <span
              className="font-body text-[11px] font-bold uppercase tracking-wide mt-1"
              style={{ color: 'var(--gold)' }}
            >
              TODAY
            </span>
          )}
        </div>
      </div>

      {/* ── Entry list ── */}
      <motion.div
        className="flex-1 min-w-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={entryListVariants}
      >
        {isSat ? (
          <SaturdayEntry />
        ) : (
          filtered.map((cls, idx) => (
            <ClassEntryRow
              key={`${cls.dayOfWeek}-${cls.time}-${idx}`}
              cls={cls}
              isLast={idx === filtered.length - 1}
            />
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────

const DAYS_PER_CHUNK = 21;
const MAX_DAYS = 63;

export function SchedulePage() {
  const { language } = useI18n();
  const [filter, setFilter] = useState<FilterType>('all');
  const [daysToShow, setDaysToShow] = useState(DAYS_PER_CHUNK);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allGroups = generateSchedule(today, daysToShow);
  const visibleGroups = allGroups; // filtering is applied inside DateGroupRow

  useEffect(() => {
    document.title = 'Class Schedule | Estilo Latino Dance Company';
  }, []);

  const canLoadMore = daysToShow < MAX_DAYS;

  return (
    <div className="min-h-screen pt-28 pb-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h1
            variants={clipRevealLTR}
            className="font-display leading-[0.95] uppercase mb-3"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)' }}
          >
            {language === 'es' ? (
              <>HORARIO DE <span style={{ color: 'var(--gold)' }}>CLASES</span></>
            ) : (
              <>DANCE <span style={{ color: 'var(--gold)' }}>SCHEDULE</span></>
            )}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="font-body text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {language === 'es'
              ? 'Clases de Lunes a Sábado · Elizabeth, NJ'
              : 'Classes Monday through Saturday · Elizabeth, NJ'}
          </motion.p>
        </motion.div>

        {/* ── Notice banner ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-lg p-4 mb-6 text-center"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}
        >
          <p
            className="font-body font-bold text-sm uppercase tracking-wide"
            style={{ color: 'var(--text)' }}
          >
            Students must register for each class and check in at the front desk prior to class!
          </p>
          <p
            className="font-body text-xs mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            New cycles start every 3 months: January, April, July, October.
          </p>
        </motion.div>

        {/* ── Payment links ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-lg p-4 mb-8"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}
        >
          <p
            className="font-body text-xs uppercase tracking-wide mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Links to pay:
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5">
            <span className="font-body text-sm" style={{ color: 'var(--text)' }}>
              Salsa:{' '}
              <a
                href="https://square.link/u/qjShNEK8?src=sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors font-bold"
                style={{ color: 'var(--gold)' }}
              >
                12 Class Punchcard $195
              </a>
              {' · '}
              <a
                href="https://square.link/u/FNs6RSaO?src=sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors font-bold"
                style={{ color: 'var(--gold)' }}
              >
                Single Class $25
              </a>
            </span>
            <span className="font-body text-sm" style={{ color: 'var(--text)' }}>
              Bachata:{' '}
              <a
                href="https://square.link/u/JnmrkHBX?src=sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors font-bold"
                style={{ color: 'var(--gold)' }}
              >
                8 Class Card $150
              </a>
            </span>
          </div>
        </motion.div>

        {/* ── Filter pills ── */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex gap-2 mb-10"
          style={{ overflowX: 'auto', scrollbarWidth: 'none', flexWrap: 'nowrap', paddingBottom: '4px' }}
        >
          {filters.map((f) => (
            <motion.button
              key={f.id}
              variants={scaleIn}
              onClick={() => setFilter(f.id)}
              className="flex-shrink-0 px-5 py-2 rounded-full font-body font-semibold text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: filter === f.id ? 'var(--gold)' : 'transparent',
                color: filter === f.id ? 'var(--ink)' : 'var(--text)',
                border: filter === f.id ? '2px solid transparent' : '1px solid var(--border-strong)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Timeline ── */}
        <div>
          {visibleGroups.map((group, idx) => (
            <DateGroupRow
              key={`${group.date.toISOString()}-${idx}`}
              group={group}
              isToday={isSameDay(group.date, today)}
              filter={filter}
            />
          ))}
        </div>

        {/* ── Show more button ── */}
        {canLoadMore ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setDaysToShow(d => Math.min(d + DAYS_PER_CHUNK, MAX_DAYS))}
              className="w-full sm:w-auto font-body font-bold uppercase tracking-wide px-8 py-3 rounded-lg text-sm transition-all duration-200"
              style={{
                background: 'var(--gold)',
                color: 'var(--ink)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-hover)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)';
                (e.currentTarget as HTMLButtonElement).style.transform = '';
              }}
            >
              Show 3 More Weeks
            </button>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center font-body text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            That&apos;s the full schedule for the next 2 months.
          </motion.p>
        )}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mt-16 py-16 px-8 rounded-lg"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}
        >
          <h3
            className="font-display uppercase mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 0.95, color: 'var(--white)' }}
          >
            {language === 'es' ? '¿Listo para Bailar?' : 'Ready to Dance?'}
          </h3>
          <p
            className="font-body mb-8 max-w-md mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
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
