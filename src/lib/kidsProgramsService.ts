import { supabase, uploadFile, genId } from './supabase';
import type { KidsProgram } from './types';

const TABLE = 'kids_programs';

function rowToProgram(row: Record<string, unknown>): KidsProgram {
  return {
    id:            row.id             as string,
    name:          (row.name          as string) ?? '',
    nameEs:        (row.name_es       as string) ?? '',
    description:   (row.description   as string) ?? '',
    descriptionEs: (row.description_es as string) ?? '',
    ageRange:      (row.age_range     as string) ?? '5+',
    imageUrl:      (row.image_url     as string) ?? '',
    scheduleNote:  (row.schedule_note as string) ?? '',
    sortOrder:     (row.sort_order    as number)  ?? 0,
    isActive:      (row.is_active     as boolean) ?? true,
    createdAt:     (row.created_at    as string)  ?? '',
    updatedAt:     (row.updated_at    as string)  ?? '',
  };
}

export async function getKidsPrograms(): Promise<KidsProgram[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProgram);
}

export async function getActiveKidsPrograms(): Promise<KidsProgram[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProgram);
}

export async function saveKidsProgram(
  data: Omit<KidsProgram, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  imageFile?: File | null,
): Promise<KidsProgram> {
  let imageUrl = data.imageUrl;

  if (imageFile) {
    const ext  = imageFile.name.split('.').pop() ?? 'jpg';
    const path = `kids/programs/${genId()}.${ext}`;
    imageUrl   = await uploadFile('gallery', path, imageFile, imageFile.type);
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    name:          data.name,
    name_es:       data.nameEs,
    description:   data.description,
    description_es: data.descriptionEs,
    age_range:     data.ageRange,
    image_url:     imageUrl,
    schedule_note: data.scheduleNote,
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
  return rowToProgram(saved as Record<string, unknown>);
}

export async function deleteKidsProgram(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderKidsPrograms(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
