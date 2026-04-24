import { supabase, uploadFile, genId } from './supabase';
import type { DanceStyle } from './types';

const TABLE = 'dance_styles';

function rowToStyle(row: Record<string, unknown>): DanceStyle {
  return {
    id:            row.id             as string,
    slug:          (row.slug          as string) ?? '',
    name:          (row.name          as string) ?? '',
    nameEs:        (row.name_es       as string) ?? '',
    tagline:       (row.tagline       as string) ?? '',
    description:   (row.description   as string) ?? '',
    descriptionEs: (row.description_es as string) ?? '',
    heroImage:     (row.hero_image    as string) ?? '',
    cardImage:     (row.card_image    as string) ?? '',
    ageGroup:      (row.age_group     as DanceStyle['ageGroup']) ?? 'all',
    sortOrder:     (row.sort_order    as number)  ?? 0,
    isActive:      (row.is_active     as boolean) ?? true,
    contactOnly:   (row.contact_only  as boolean) ?? false,
  };
}

export async function getStyles(): Promise<DanceStyle[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToStyle);
}

export async function getActiveStyles(): Promise<DanceStyle[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToStyle);
}

export async function saveStyle(
  data: Omit<DanceStyle, 'id'> & { id?: string },
  files?: { heroFile?: File | null; cardFile?: File | null },
): Promise<DanceStyle> {
  let heroImage = data.heroImage;
  let cardImage = data.cardImage;

  if (files?.heroFile) {
    const ext  = files.heroFile.name.split('.').pop() ?? 'jpg';
    const path = `styles/${genId()}-hero.${ext}`;
    heroImage  = await uploadFile('media', path, files.heroFile, files.heroFile.type);
  }
  if (files?.cardFile) {
    const ext  = files.cardFile.name.split('.').pop() ?? 'jpg';
    const path = `styles/${genId()}-card.${ext}`;
    cardImage  = await uploadFile('media', path, files.cardFile, files.cardFile.type);
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    slug:           data.slug,
    name:           data.name,
    name_es:        data.nameEs,
    tagline:        data.tagline,
    description:    data.description,
    description_es: data.descriptionEs,
    hero_image:     heroImage,
    card_image:     cardImage,
    age_group:      data.ageGroup,
    sort_order:     data.sortOrder,
    is_active:      data.isActive,
    contact_only:   data.contactOnly ?? false,
    updated_at:     ts,
  };
  if (isNew) row.created_at = ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToStyle(saved as Record<string, unknown>);
}

export async function deleteStyle(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderStyles(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
