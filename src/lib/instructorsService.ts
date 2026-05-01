import { supabase, uploadFile, genId } from './supabase';
import type { Instructor } from './types';

const TABLE = 'instructors';

function rowToInstructor(row: Record<string, unknown>): Instructor {
  return {
    id:          row.id          as string,
    name:        (row.name       as string) ?? '',
    specialty:   (row.specialty  as string) ?? '',
    bio:         (row.bio        as string) ?? '',
    bioEs:       (row.bio_es     as string) ?? '',
    photo:       (row.photo_url  as string) ?? '',
    videoUrl:    (row.video_url  as string) ?? '',
    socialLinks: (row.social_links as { platform: string; url: string }[]) ?? [],
    sortOrder:   (row.sort_order  as number)  ?? 0,
    isActive:    (row.is_active   as boolean) ?? true,
  };
}

export async function getInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToInstructor);
}

export async function getActiveInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToInstructor);
}

export async function saveInstructor(
  data: Omit<Instructor, 'id'> & { id?: string },
  photoFile?: File | null,
  videoFile?: File | null,
): Promise<Instructor> {
  let photoUrl = data.photo;
  let videoUrl = data.videoUrl;

  if (photoFile) {
    const ext  = photoFile.name.split('.').pop() ?? 'jpg';
    const path = `instructors/${genId()}.${ext}`;
    try {
      photoUrl = await uploadFile('media', path, photoFile, photoFile.type);
    } catch (e) {
      throw new Error(`Photo upload failed: ${(e as Error).message}`);
    }
  }

  if (videoFile) {
    const ext  = videoFile.name.split('.').pop() ?? 'mp4';
    const path = `instructors/videos/${genId()}.${ext}`;
    try {
      videoUrl = await uploadFile('media', path, videoFile, videoFile.type);
    } catch (e) {
      throw new Error(`Video upload failed: ${(e as Error).message}`);
    }
  }

  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    name:         data.name,
    specialty:    data.specialty,
    bio:          data.bio,
    bio_es:       data.bioEs,
    photo_url:    photoUrl,
    video_url:    videoUrl,
    social_links: data.socialLinks,
    sort_order:   data.sortOrder,
    is_active:    data.isActive,
    updated_at:   ts,
  };
  if (isNew) row.created_at = ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToInstructor(saved as Record<string, unknown>);
}

export async function deleteInstructor(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderInstructors(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
