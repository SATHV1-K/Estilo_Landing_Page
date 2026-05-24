import { supabase, uploadFile, genId } from './supabase';
import type { KidsAchievement } from './types';

const TABLE = 'kids_achievements';
const COLS  = 'id, title, title_es, description, description_es, image_url, date, sort_order, is_active, created_at, updated_at';

function rowToAchievement(row: Record<string, unknown>): KidsAchievement {
  return {
    id:            row.id             as string,
    title:         (row.title         as string) ?? '',
    titleEs:       (row.title_es      as string) ?? '',
    description:   (row.description   as string) ?? '',
    descriptionEs: (row.description_es as string) ?? '',
    imageUrl:      (row.image_url     as string) ?? '',
    date:          (row.date          as string) ?? '',
    sortOrder:     (row.sort_order    as number)  ?? 0,
    isActive:      (row.is_active     as boolean) ?? true,
    createdAt:     (row.created_at    as string)  ?? '',
    updatedAt:     (row.updated_at    as string)  ?? '',
  };
}

export async function getKidsAchievements(): Promise<KidsAchievement[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLS)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToAchievement);
}

export async function getActiveKidsAchievements(): Promise<KidsAchievement[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToAchievement);
}

export async function getActiveKidsAchievementsPaginated(
  page: number,
  pageSize: number,
): Promise<{ items: KidsAchievement[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from(TABLE)
    .select(COLS, { count: 'exact' })
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .range(from, to);
  if (error) throw error;
  return { items: (data ?? []).map(rowToAchievement), total: count ?? 0 };
}

export async function saveKidsAchievement(
  data: Omit<KidsAchievement, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  imageFile?: File | null,
): Promise<KidsAchievement> {
  let imageUrl = data.imageUrl;

  if (imageFile) {
    const ext  = imageFile.name.split('.').pop() ?? 'jpg';
    const path = `kids/achievements/${genId()}.${ext}`;
    imageUrl   = await uploadFile('gallery', path, imageFile, imageFile.type);
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    title:          data.title,
    title_es:       data.titleEs,
    description:    data.description,
    description_es: data.descriptionEs,
    image_url:      imageUrl,
    date:           data.date || null,
    sort_order:     data.sortOrder,
    is_active:      data.isActive,
    updated_at:     ts,
  };
  if (isNew) row.created_at = data.createdAt ?? ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select(COLS)
    .single();
  if (error) throw error;
  return rowToAchievement(saved as Record<string, unknown>);
}

export async function deleteKidsAchievement(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderKidsAchievements(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
