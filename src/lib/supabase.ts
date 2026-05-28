import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  return imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.9,
  });
}

const R2_FN_URL = import.meta.env.VITE_SUPABASE_EDGE_FN_URL as string | undefined;

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  contentType: string,
): Promise<string> {
  if (R2_FN_URL) {
    const form = new FormData();
    form.append('file', file instanceof File ? file : new File([file], 'upload', { type: contentType }));
    form.append('path', path);
    form.append('contentType', contentType);
    const res = await fetch(R2_FN_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${supabaseAnonKey}` },
      body: form,
    });
    if (!res.ok) throw new Error(`R2 upload failed (${res.status})`);
    const json = await res.json() as { url: string };
    return json.url;
  }

  // Fallback: Supabase Storage (used when VITE_SUPABASE_EDGE_FN_URL is not set)
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
