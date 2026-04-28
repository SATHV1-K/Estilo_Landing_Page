import { supabase, uploadFile, genId } from './supabase';
import type { KidsGalleryItem, KidsGalleryCategory } from './types';

const TABLE = 'kids_gallery_items';

function rowToItem(row: Record<string, unknown>): KidsGalleryItem {
  return {
    id:           row.id            as string,
    title:        (row.title        as string) ?? '',
    titleEs:      (row.title_es     as string) ?? '',
    type:         (row.type         as 'photo' | 'video') ?? 'photo',
    url:          (row.url          as string) ?? '',
    thumbnailUrl: (row.thumbnail_url as string) ?? '',
    youtubeId:    (row.youtube_id   as string) ?? '',
    category:     (row.category     as KidsGalleryCategory) ?? 'general',
    sortOrder:    (row.sort_order   as number)  ?? 0,
    isActive:     (row.is_active    as boolean) ?? true,
    createdAt:    (row.created_at   as string)  ?? '',
    updatedAt:    (row.updated_at   as string)  ?? '',
  };
}

export async function getKidsGalleryItems(): Promise<KidsGalleryItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToItem);
}

export async function getActiveKidsGalleryItems(): Promise<KidsGalleryItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToItem);
}

export async function saveKidsGalleryItem(
  data: Omit<KidsGalleryItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  imageFile?: File | null,
): Promise<KidsGalleryItem> {
  let url = data.url;

  if (imageFile) {
    const ext  = imageFile.name.split('.').pop() ?? 'jpg';
    const path = `kids/gallery/${genId()}.${ext}`;
    url        = await uploadFile('gallery', path, imageFile, imageFile.type);
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    title:         data.title,
    title_es:      data.titleEs,
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

export async function deleteKidsGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderKidsGalleryItems(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
