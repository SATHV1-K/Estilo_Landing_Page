import { supabase, uploadFile, genId } from './supabase';
import type { MediaFile } from './adminData';

const TABLE  = 'media_files';
const BUCKET = 'media';

function rowToMedia(row: Record<string, unknown>): MediaFile {
  return {
    id:         row.id          as string,
    slot:       (row.slot       as string) ?? '',
    url:        (row.url        as string) ?? '',
    filename:   (row.filename   as string) ?? '',
    fileSize:   (row.file_size  as number) ?? 0,
    mimeType:   (row.mime_type  as string) ?? '',
    altText:    (row.alt_text   as string) ?? '',
    width:      (row.width      as number | undefined),
    height:     (row.height     as number | undefined),
    uploadedAt: (row.uploaded_at as string) ?? '',
  };
}

export async function getAllMedia(): Promise<MediaFile[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToMedia);
}

export async function getMedia(slot: string): Promise<MediaFile | undefined> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slot', slot)
    .order('uploaded_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data && data.length > 0 ? rowToMedia(data[0] as Record<string, unknown>) : undefined;
}

export async function uploadMediaFile(
  file: File,
  slot: string,
  altText = '',
): Promise<MediaFile> {
  const ext  = file.name.split('.').pop() ?? 'bin';
  const path = `site/${genId()}.${ext}`;
  const url  = await uploadFile(BUCKET, path, file, file.type);

  let width: number | undefined;
  let height: number | undefined;

  if (file.type.startsWith('image/')) {
    try {
      const bitmap = await createImageBitmap(file);
      width  = bitmap.width;
      height = bitmap.height;
      bitmap.close();
    } catch { /* ignore */ }
  }

  const id  = genId();
  const ts  = new Date().toISOString();
  const row: Record<string, unknown> = {
    id,
    slot,
    url,
    filename:    file.name,
    file_size:   file.size,
    mime_type:   file.type,
    alt_text:    altText,
    width:       width  ?? null,
    height:      height ?? null,
    uploaded_at: ts,
  };

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToMedia(saved as Record<string, unknown>);
}

export async function saveMedia(
  data: Omit<MediaFile, 'id' | 'uploadedAt'> & { id?: string },
): Promise<MediaFile> {
  const id  = data.id ?? genId();
  const ts  = new Date().toISOString();
  const row: Record<string, unknown> = {
    id,
    slot:        data.slot,
    url:         data.url,
    filename:    data.filename,
    file_size:   data.fileSize,
    mime_type:   data.mimeType,
    alt_text:    data.altText,
    width:       data.width  ?? null,
    height:      data.height ?? null,
    uploaded_at: ts,
  };

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToMedia(saved as Record<string, unknown>);
}

export async function deleteMedia(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
