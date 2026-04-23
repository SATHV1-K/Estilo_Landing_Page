import { supabase, uploadFile, genId } from './supabase';
import type { Video, VideoSource, VideoCategory } from './adminData';

const TABLE = 'videos';

function rowToVideo(row: Record<string, unknown>): Video {
  return {
    id:            row.id              as string,
    title:         (row.title          as string) ?? '',
    titleEs:       (row.title_es       as string) ?? '',
    description:   (row.description    as string) ?? '',
    descriptionEs: (row.description_es as string) ?? '',
    source:        (row.source         as VideoSource),
    externalUrl:   (row.external_url   as string) ?? '',
    youtubeId:     (row.youtube_id     as string) ?? '',
    thumbnailUrl:  (row.thumbnail_url  as string) ?? '',
    videoFileUrl:  (row.video_file_url as string) ?? '',
    durationSec:   (row.duration_sec   as number) ?? 0,
    category:      (row.category       as VideoCategory) ?? 'general',
    featured:      (row.featured       as boolean) ?? false,
    sortOrder:     (row.sort_order     as number)  ?? 0,
    isActive:      (row.is_active      as boolean) ?? true,
    createdAt:     (row.created_at     as string)  ?? '',
    updatedAt:     (row.updated_at     as string)  ?? '',
  };
}

export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToVideo);
}

export async function getActiveVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToVideo);
}

export async function saveVideo(
  data: Omit<Video, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string },
  options?: {
    thumbnailFile?: File | null;
    videoFile?:     File | null;
    onProgress?:    (pct: number) => void;
  },
): Promise<Video> {
  let thumbnailUrl  = data.thumbnailUrl;
  let videoFileUrl  = data.videoFileUrl;

  if (options?.thumbnailFile) {
    const ext  = options.thumbnailFile.name.split('.').pop() ?? 'jpg';
    const path = `thumbnails/${genId()}.${ext}`;
    thumbnailUrl = await uploadFile('media', path, options.thumbnailFile, options.thumbnailFile.type);
  }

  if (options?.videoFile) {
    const ext  = options.videoFile.name.split('.').pop() ?? 'mp4';
    const path = `videos/${genId()}.${ext}`;
    options.onProgress?.(10);
    videoFileUrl = await uploadFile('media', path, options.videoFile, options.videoFile.type);
    options.onProgress?.(100);
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
    source:         data.source,
    external_url:   data.externalUrl,
    youtube_id:     data.youtubeId,
    thumbnail_url:  thumbnailUrl,
    video_file_url: videoFileUrl,
    duration_sec:   data.durationSec,
    category:       data.category,
    featured:       data.featured,
    sort_order:     data.sortOrder,
    is_active:      data.isActive,
    updated_at:     ts,
  };
  if (isNew) row.created_at = data.createdAt ?? ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToVideo(saved as Record<string, unknown>);
}

export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderVideos(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
