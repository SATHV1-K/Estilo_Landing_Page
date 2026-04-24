import { supabase, genId } from './supabase';
import type { RecurringEntry, RecurringDay, RecurringCategory } from './adminData';

function rowToEntry(row: Record<string, unknown>): RecurringEntry {
  return {
    id:         row.id          as string,
    dayOfWeek:  (row.day_of_week as RecurringDay)      ?? 'monday',
    startTime:  (row.start_time  as string)             ?? '',
    endTime:    (row.end_time    as string)             ?? '',
    className:  (row.class_name  as string)             ?? '',
    detail:     (row.detail      as string)             ?? '',
    category:   (row.category    as RecurringCategory)  ?? 'special',
    location:   (row.location    as string)             ?? '',
    isActive:   (row.is_active   as boolean)            ?? true,
    sortOrder:  (row.sort_order  as number)             ?? 0,
    updatedAt:  (row.updated_at  as string)             ?? '',
  };
}

function entryToRow(data: Omit<RecurringEntry, 'updatedAt'> & { id?: string }): Record<string, unknown> {
  const ts = new Date().toISOString();
  return {
    id:          data.id ?? genId(),
    day_of_week: data.dayOfWeek,
    start_time:  data.startTime,
    end_time:    data.endTime,
    class_name:  data.className,
    detail:      data.detail,
    category:    data.category,
    location:    data.location,
    is_active:   data.isActive,
    sort_order:  data.sortOrder,
    updated_at:  ts,
  };
}

// ─── Recurring Schedule ────────────────────────────────────────────────────────

const RECURRING = 'recurring_schedule';

export async function getRecurringEntries(): Promise<RecurringEntry[]> {
  const { data, error } = await supabase
    .from(RECURRING)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEntry);
}

export async function saveRecurringEntry(
  data: Omit<RecurringEntry, 'updatedAt'> & { id?: string },
): Promise<RecurringEntry> {
  const row = entryToRow(data);
  const { data: saved, error } = await supabase
    .from(RECURRING)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToEntry(saved as Record<string, unknown>);
}

export async function deleteRecurringEntry(id: string): Promise<void> {
  const { error } = await supabase.from(RECURRING).delete().eq('id', id);
  if (error) throw error;
}

export async function resetRecurringToDefault(seeds: Omit<RecurringEntry, 'id' | 'updatedAt'>[]): Promise<void> {
  await supabase.from(RECURRING).delete().neq('id', '');
  const rows = seeds.map((e, i) => entryToRow({ ...e, id: genId(), sortOrder: e.sortOrder ?? i + 1 }));
  const { error } = await supabase.from(RECURRING).insert(rows);
  if (error) throw error;
}

// ─── Overview Schedule ─────────────────────────────────────────────────────────

const OVERVIEW = 'overview_schedule';

export async function getOverviewEntries(): Promise<RecurringEntry[]> {
  const { data, error } = await supabase
    .from(OVERVIEW)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEntry);
}

export async function saveOverviewEntry(
  data: Omit<RecurringEntry, 'updatedAt'> & { id?: string },
): Promise<RecurringEntry> {
  const row = entryToRow(data);
  const { data: saved, error } = await supabase
    .from(OVERVIEW)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToEntry(saved as Record<string, unknown>);
}

export async function deleteOverviewEntry(id: string): Promise<void> {
  const { error } = await supabase.from(OVERVIEW).delete().eq('id', id);
  if (error) throw error;
}

export async function resetOverviewToDefault(seeds: Omit<RecurringEntry, 'id' | 'updatedAt'>[]): Promise<void> {
  await supabase.from(OVERVIEW).delete().neq('id', '');
  const rows = seeds.map((e, i) => entryToRow({ ...e, id: genId(), sortOrder: e.sortOrder ?? i + 1 }));
  const { error } = await supabase.from(OVERVIEW).insert(rows);
  if (error) throw error;
}
