import { supabase, uploadFile, genId, compressImage } from './supabase';
import type { EuphoriaGalleryItem, EuphoriaGalleryCategory } from './types';

const TABLE = 'euphoria_gallery_items';
const COLS  = 'id, title, type, url, thumbnail_url, youtube_id, category, sort_order, is_active, created_at, updated_at';

function rowToItem(row: Record<string, unknown>): EuphoriaGalleryItem {
  return {
    id:           row.id             as string,
    title:        (row.title         as string) ?? '',
    type:         (row.type          as 'photo' | 'video') ?? 'photo',
    url:          (row.url           as string) ?? '',
    thumbnailUrl: (row.thumbnail_url as string) ?? '',
    youtubeId:    (row.youtube_id    as string) ?? '',
    category:     (row.category      as EuphoriaGalleryCategory) ?? 'general',
    sortOrder:    (row.sort_order    as number)  ?? 0,
    isActive:     (row.is_active     as boolean) ?? true,
    createdAt:    (row.created_at    as string)  ?? '',
    updatedAt:    (row.updated_at    as string)  ?? '',
  };
}

export async function getEuphoriaGalleryItems(): Promise<EuphoriaGalleryItem[]> {
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

export async function getActiveEuphoriaGalleryItems(): Promise<EuphoriaGalleryItem[]> {
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

export async function getActiveEuphoriaGalleryItemsPaginated(
  page: number,
  pageSize: number,
  category?: EuphoriaGalleryCategory,
): Promise<{ items: EuphoriaGalleryItem[]; total: number }> {
  try {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from(TABLE)
      .select(COLS, { count: 'exact' })
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .range(from, to);

    if (category) query = query.eq('category', category);

    const { data, error, count } = await query;
    if (error) throw error;
    return { items: (data ?? []).map(rowToItem), total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function saveEuphoriaGalleryItem(
  data: Omit<EuphoriaGalleryItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  imageFile?: File | null,
): Promise<EuphoriaGalleryItem> {
  let url = data.url;

  if (imageFile) {
    const compressed = await compressImage(imageFile);
    const path = `euphoria/gallery/${genId()}.webp`;
    url        = await uploadFile('gallery', path, compressed, 'image/webp');
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    title:         data.title,
    type:          data.type,
    url,
    thumbnail_url: data.thumbnailUrl,
    youtube_id:    data.youtubeId,
    category:      data.category,
    sort_order:    data.sortOrder,
    is_active:     data.isActive,
    updated_at:    ts,
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

export async function deleteEuphoriaGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderEuphoriaGalleryItems(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
