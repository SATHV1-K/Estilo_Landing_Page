import { supabase, genId } from './supabase';
import type { SpecialClass, Reservation, SpecialCategory } from './specialClasses';

// ─── Special Classes ──────────────────────────────────────────────────────────

const SC_TABLE  = 'special_classes';
const RES_TABLE = 'reservations';

function rowToClass(row: Record<string, unknown>): SpecialClass {
  return {
    id:          row.id           as string,
    name:        (row.name        as string)  ?? '',
    description: (row.description as string)  ?? '',
    date:        (row.date        as string)  ?? '',
    endTime:     (row.end_time    as string)  ?? '',
    durationMin: (row.duration_min as number) ?? 0,
    location:    (row.location    as string)  ?? '',
    instructor:  (row.instructor  as string)  ?? '',
    category:    (row.category    as SpecialCategory) ?? 'special',
    price:       (row.price       as number)  ?? 0,
    maxCapacity: (row.max_capacity as number) ?? 20,
    isActive:    (row.is_active   as boolean) ?? true,
    paymentLink: (row.payment_link as string) ?? '',
    createdAt:   (row.created_at  as string)  ?? '',
    updatedAt:   (row.updated_at  as string)  ?? '',
  };
}

function rowToReservation(row: Record<string, unknown>): Reservation {
  return {
    id:              row.id               as string,
    specialClassId:  (row.special_class_id as string) ?? '',
    customerName:    (row.customer_name    as string) ?? '',
    customerEmail:   (row.customer_email   as string) ?? '',
    customerPhone:   (row.customer_phone   as string) ?? '',
    paymentStatus:   (row.payment_status   as Reservation['paymentStatus']) ?? 'pending',
    amount:          (row.amount           as number) ?? 0,
    createdAt:       (row.created_at       as string) ?? '',
  };
}

export async function getSpecialClasses(): Promise<SpecialClass[]> {
  const { data, error } = await supabase
    .from(SC_TABLE)
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToClass);
}

export async function getUpcomingActiveSpecialClasses(): Promise<SpecialClass[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(SC_TABLE)
    .select('*')
    .eq('is_active', true)
    .gte('date', now)
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToClass);
}

export async function saveSpecialClass(
  data: Omit<SpecialClass, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
): Promise<SpecialClass> {
  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    name:         data.name,
    description:  data.description,
    date:         data.date,
    end_time:     data.endTime,
    duration_min: data.durationMin,
    location:     data.location,
    instructor:   data.instructor,
    category:     data.category,
    price:        data.price,
    max_capacity: data.maxCapacity,
    is_active:    data.isActive,
    payment_link: data.paymentLink,
    updated_at:   ts,
  };
  if (isNew) row.created_at = ts;

  const { data: saved, error } = await supabase
    .from(SC_TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToClass(saved as Record<string, unknown>);
}

export async function deleteSpecialClass(id: string): Promise<void> {
  const { error } = await supabase.from(SC_TABLE).delete().eq('id', id);
  if (error) throw error;
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export async function getReservations(specialClassId?: string): Promise<Reservation[]> {
  let query = supabase.from(RES_TABLE).select('*').order('created_at', { ascending: false });
  if (specialClassId) query = query.eq('special_class_id', specialClassId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(rowToReservation);
}

export async function saveReservation(
  data: Omit<Reservation, 'id' | 'createdAt'> & { id?: string },
): Promise<Reservation> {
  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    special_class_id: data.specialClassId,
    customer_name:    data.customerName,
    customer_email:   data.customerEmail,
    customer_phone:   data.customerPhone,
    payment_status:   data.paymentStatus,
    amount:           data.amount,
  };
  if (isNew) row.created_at = ts;

  const { data: saved, error } = await supabase
    .from(RES_TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToReservation(saved as Record<string, unknown>);
}

export async function updateReservationStatus(
  id: string,
  status: Reservation['paymentStatus'],
): Promise<void> {
  const { error } = await supabase
    .from(RES_TABLE)
    .update({ payment_status: status })
    .eq('id', id);
  if (error) throw error;
}

export async function getActiveReservationCount(specialClassId: string): Promise<number> {
  const { count, error } = await supabase
    .from(RES_TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('special_class_id', specialClassId)
    .neq('payment_status', 'refunded');
  if (error) throw error;
  return count ?? 0;
}

export function exportReservationsCSV(reservations: Reservation[]): void {
  const header = 'Name,Email,Phone,Status,Amount,Created';
  const rows   = reservations.map(r =>
    [r.customerName, r.customerEmail, r.customerPhone, r.paymentStatus,
     (r.amount / 100).toFixed(2), r.createdAt].join(',')
  );
  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'reservations.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function formatPriceCents(cents: number): string {
  if (cents === 0) return 'FREE';
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch { return iso; }
}

export function formatTimeOnly(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch { return iso; }
}

export function calcDurationMin(start: string, end: string): number {
  try {
    return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  } catch { return 0; }
}
