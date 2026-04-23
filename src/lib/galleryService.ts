import { supabase, uploadFile, genId } from './supabase';
import type { GalleryPhoto, PhotoCategory } from './adminData';

const TABLE = 'gallery_photos';

function rowToPhoto(row: Record<string, unknown>): GalleryPhoto {
  return {
    id:        row.id        as string,
    title:     (row.title    as string) ?? '',
    titleEs:   (row.title_es as string) ?? '',
    altText:   (row.alt_text as string) ?? '',
    imageUrl:  (row.image_url as string) ?? '',
    category:  (row.category  as PhotoCategory) ?? 'general',
    sortOrder: (row.sort_order as number)  ?? 0,
    isActive:  (row.is_active  as boolean) ?? true,
    createdAt: (row.created_at as string)  ?? '',
    updatedAt: (row.updated_at as string)  ?? '',
  };
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToPhoto);
}

export async function getActiveGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToPhoto);
}

export async function saveGalleryPhoto(
  data: Omit<GalleryPhoto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  imageFile?: File | null,
): Promise<GalleryPhoto> {
  let imageUrl = data.imageUrl;

  if (imageFile) {
    const ext  = imageFile.name.split('.').pop() ?? 'jpg';
    const path = `photos/${genId()}.${ext}`;
    imageUrl   = await uploadFile('gallery', path, imageFile, imageFile.type);
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    title:       data.title,
    title_es:    data.titleEs,
    alt_text:    data.altText,
    image_url:   imageUrl,
    category:    data.category,
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
  return rowToPhoto(saved as Record<string, unknown>);
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderGalleryPhotos(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
