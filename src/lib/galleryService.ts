import { supabase, uploadFile, genId, compressImage } from './supabase';
import type { GalleryPhoto, PhotoCategory } from './adminData';

const TABLE = 'gallery_photos';
const COLS  = 'id, title, title_es, alt_text, image_url, category, sort_order, is_active, created_at, updated_at';

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
    .select(COLS)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToPhoto);
}

export async function getActiveGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToPhoto);
}

export async function getActiveGalleryPhotosPaginated(
  page: number,
  pageSize: number,
  category?: PhotoCategory,
): Promise<{ photos: GalleryPhoto[]; total: number }> {
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
  return { photos: (data ?? []).map(rowToPhoto), total: count ?? 0 };
}

export async function saveGalleryPhoto(
  data: Omit<GalleryPhoto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  imageFile?: File | null,
): Promise<GalleryPhoto> {
  let imageUrl = data.imageUrl;

  if (imageFile) {
    const compressed = await compressImage(imageFile);
    const path = `photos/${genId()}.webp`;
    imageUrl   = await uploadFile('gallery', path, compressed, 'image/webp');
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
