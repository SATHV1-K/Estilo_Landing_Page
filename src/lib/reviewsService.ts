import { supabase, genId } from './supabase';
import type { Review } from './adminData';

const TABLE = 'reviews';

function rowToReview(row: Record<string, unknown>): Review {
  return {
    id:        row.id         as string,
    name:      (row.name      as string)  ?? '',
    stars:     (row.stars     as number)  ?? 5,
    text:      (row.text      as string)  ?? '',
    sortOrder: (row.sort_order as number) ?? 0,
    isActive:  (row.is_active  as boolean) ?? true,
    createdAt: (row.created_at as string)  ?? '',
    updatedAt: (row.updated_at as string)  ?? '',
  };
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToReview);
}

export async function getActiveReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToReview);
}

export async function saveReview(
  data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
): Promise<Review> {
  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    name:       data.name,
    stars:      data.stars,
    text:       data.text,
    sort_order: data.sortOrder,
    is_active:  data.isActive,
    updated_at: ts,
  };
  if (isNew) row.created_at = data.createdAt ?? ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToReview(saved as Record<string, unknown>);
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderReviews(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
