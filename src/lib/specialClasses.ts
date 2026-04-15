// Special Classes — localStorage-based data management
//
// Since this is a frontend-only Vite app, all data is stored in localStorage.
// Admin password: "EstiloLatino2024" — change ADMIN_PASSWORD below to update it.

export type SpecialCategory = 'special' | 'salsa' | 'bachata' | 'street' | 'ballet' | 'kids';

export interface SpecialClass {
  id: string;
  name: string;
  description: string;
  date: string;         // ISO datetime for start: "2026-04-20T19:00:00"
  endTime: string;      // ISO datetime for end:   "2026-04-20T20:30:00"
  durationMin: number;  // auto-calculated from date/endTime
  location: string;
  instructor: string;
  category: SpecialCategory;
  price: number;        // stored in cents (0 = free event)
  maxCapacity: number;
  isActive: boolean;
  paymentLink: string;  // Square payment link URL (empty string if free)
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  specialClassId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentStatus: 'pending' | 'completed' | 'refunded';
  amount: number;       // cents
  createdAt: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const SC_KEY   = 'estilo_special_classes';
const RES_KEY  = 'estilo_reservations';
const AUTH_KEY = 'estilo_admin_auth';

// Change this to your preferred admin password:
const ADMIN_PASSWORD = 'EstiloLatino2024';

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── SpecialClass CRUD ────────────────────────────────────────────────────────

export function getSpecialClasses(): SpecialClass[] {
  try {
    const raw = localStorage.getItem(SC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSpecialClass(
  data: Omit<SpecialClass, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): SpecialClass {
  const classes = getSpecialClasses();
  const now = new Date().toISOString();

  if (data.id) {
    const idx = classes.findIndex(c => c.id === data.id);
    const updated: SpecialClass = { ...(data as SpecialClass), updatedAt: now };
    if (idx >= 0) classes[idx] = updated;
    else classes.push(updated);
    localStorage.setItem(SC_KEY, JSON.stringify(classes));
    return updated;
  } else {
    const cls: SpecialClass = { ...data, id: genId(), createdAt: now, updatedAt: now };
    classes.push(cls);
    localStorage.setItem(SC_KEY, JSON.stringify(classes));
    return cls;
  }
}

export function deleteSpecialClass(id: string): void {
  const classes = getSpecialClasses().filter(c => c.id !== id);
  localStorage.setItem(SC_KEY, JSON.stringify(classes));
  // Cascade-delete reservations for this class
  const reservations = getAllReservations().filter(r => r.specialClassId !== id);
  localStorage.setItem(RES_KEY, JSON.stringify(reservations));
}

// ─── Reservation CRUD ─────────────────────────────────────────────────────────

export function getAllReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(RES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getReservations(specialClassId: string): Reservation[] {
  return getAllReservations().filter(r => r.specialClassId === specialClassId);
}

export function addReservation(
  data: Omit<Reservation, 'id' | 'createdAt'>
): Reservation {
  const all = getAllReservations();
  const res: Reservation = { ...data, id: genId(), createdAt: new Date().toISOString() };
  all.push(res);
  localStorage.setItem(RES_KEY, JSON.stringify(all));
  return res;
}

export function updateReservationStatus(
  id: string,
  status: Reservation['paymentStatus']
): void {
  const all = getAllReservations();
  const idx = all.findIndex(r => r.id === id);
  if (idx >= 0) {
    all[idx].paymentStatus = status;
    localStorage.setItem(RES_KEY, JSON.stringify(all));
  }
}

/** Count of non-refunded reservations (occupies a spot). */
export function getActiveReservationCount(specialClassId: string): number {
  return getReservations(specialClassId).filter(r => r.paymentStatus !== 'refunded').length;
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function formatPriceCents(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(0)}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function formatDateOnly(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTimeOnly(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/** Returns active special classes with a future start date, sorted ascending. */
export function getUpcomingActiveSpecialClasses(): SpecialClass[] {
  const now = new Date();
  return getSpecialClasses()
    .filter(c => c.isActive && new Date(c.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** CSV export helper — triggers browser download. */
export function exportReservationsCSV(reservations: Reservation[], className: string): void {
  const header = 'Name,Email,Phone,Status,Amount,Date\n';
  const rows = reservations
    .map(r =>
      `"${r.customerName}","${r.customerEmail}","${r.customerPhone}","${r.paymentStatus}","${formatPriceCents(r.amount)}","${new Date(r.createdAt).toLocaleString()}"`
    )
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reservations-${className.replace(/\s+/g, '-').toLowerCase()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Calculate duration in minutes between two ISO datetime strings. */
export function calcDurationMin(startIso: string, endIso: string): number {
  const diff = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(0, Math.round(diff / 60000));
}
