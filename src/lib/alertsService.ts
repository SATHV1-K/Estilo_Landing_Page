import { supabase, genId } from './supabase';
import type { Alert } from './adminData';

const TABLE = 'alerts';

function rowToAlert(row: Record<string, unknown>): Alert {
  return {
    id:        row.id         as string,
    title:     (row.title     as string)  ?? '',
    titleEs:   (row.title_es  as string)  ?? '',
    message:   (row.message   as string)  ?? '',
    messageEs: (row.message_es as string) ?? '',
    type:      (row.type      as Alert['type']) ?? 'info',
    link:      (row.link      as string)  || undefined,
    linkLabel: (row.link_label as string) || undefined,
    startDate: (row.start_date as string) || undefined,
    endDate:   (row.end_date   as string) || undefined,
    isActive:  (row.is_active  as boolean) ?? true,
    sortOrder: (row.sort_order as number)  ?? 0,
    createdAt: (row.created_at as string)  ?? '',
    updatedAt: (row.updated_at as string)  ?? '',
  };
}

export async function getAlerts(): Promise<Alert[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToAlert);
}

export async function getActiveAlerts(): Promise<Alert[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? [])
    .map(rowToAlert)
    .filter(a => {
      if (a.startDate && a.startDate > today) return false;
      if (a.endDate   && a.endDate   < today) return false;
      return true;
    });
}

export async function saveAlert(
  data: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
): Promise<Alert> {
  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    title:      data.title,
    title_es:   data.titleEs,
    message:    data.message,
    message_es: data.messageEs,
    type:       data.type,
    link:       data.link       ?? '',
    link_label: data.linkLabel  ?? '',
    start_date: data.startDate  ?? null,
    end_date:   data.endDate    ?? null,
    is_active:  data.isActive,
    sort_order: data.sortOrder,
    updated_at: ts,
  };
  if (isNew) row.created_at = data.createdAt ?? ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToAlert(saved as Record<string, unknown>);
}

export async function deleteAlert(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderAlerts(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
