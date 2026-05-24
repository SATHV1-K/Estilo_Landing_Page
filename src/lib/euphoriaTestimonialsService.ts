import { supabase, uploadFile, genId } from './supabase';
import type { EuphoriaTestimonial } from './types';

const TABLE = 'euphoria_testimonials';
const COLS  = 'id, dancer_name, role, quote, year, photo_url, sort_order, is_active, created_at, updated_at';

function rowToItem(row: Record<string, unknown>): EuphoriaTestimonial {
  return {
    id:          row.id          as string,
    dancerName:  (row.dancer_name as string) ?? '',
    role:        (row.role        as string) ?? '',
    quote:       (row.quote       as string) ?? '',
    year:        (row.year        as string) ?? '',
    photoUrl:    (row.photo_url   as string) ?? '',
    sortOrder:   (row.sort_order  as number)  ?? 0,
    isActive:    (row.is_active   as boolean) ?? true,
    createdAt:   (row.created_at  as string)  ?? '',
    updatedAt:   (row.updated_at  as string)  ?? '',
  };
}

export async function getEuphoriaTestimonials(): Promise<EuphoriaTestimonial[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select(COLS)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToItem);
  } catch {
    return [];
  }
}

export async function getActiveEuphoriaTestimonials(): Promise<EuphoriaTestimonial[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select(COLS)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToItem);
  } catch {
    return [];
  }
}

export async function getActiveEuphoriaTestimonialsPaginated(
  page: number,
  pageSize: number,
): Promise<{ items: EuphoriaTestimonial[]; total: number }> {
  try {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;
    const { data, error, count } = await supabase
      .from(TABLE)
      .select(COLS, { count: 'exact' })
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .range(from, to);
    if (error) throw error;
    return { items: (data ?? []).map(rowToItem), total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function saveEuphoriaTestimonial(
  data: Omit<EuphoriaTestimonial, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  photoFile?: File | null,
): Promise<EuphoriaTestimonial> {
  let photoUrl = data.photoUrl;

  if (photoFile) {
    const ext  = photoFile.name.split('.').pop() ?? 'jpg';
    const path = `euphoria/testimonials/${genId()}.${ext}`;
    photoUrl   = await uploadFile('media', path, photoFile, photoFile.type);
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    dancer_name: data.dancerName,
    role:        data.role,
    quote:       data.quote,
    year:        data.year,
    photo_url:   photoUrl,
    sort_order:  data.sortOrder,
    is_active:   data.isActive,
    updated_at:  ts,
  };
  if (isNew) row.created_at = data.createdAt ?? ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToItem(saved as Record<string, unknown>);
}

export async function deleteEuphoriaTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
