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
  if (!R2_FN_URL) {
    throw new Error(
      'Upload misconfigured: VITE_SUPABASE_EDGE_FN_URL is not set.\n' +
      'Check your .env file and deployment environment variables.',
    );
  }

  const form = new FormData();
  form.append('file', file instanceof File ? file : new File([file], 'upload', { type: contentType }));
  form.append('path', path);
  form.append('contentType', contentType);

  let res: Response;
  try {
    res = await fetch(R2_FN_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${supabaseAnonKey}` },
      body: form,
    });
  } catch (err) {
    throw new Error(
      `Upload failed: could not reach the upload service at ${R2_FN_URL}.\n` +
      `Check that the Supabase Edge Function is deployed and reachable.\n` +
      `(${(err as Error).message})`,
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) detail = body.error;
    } catch { /* response wasn't JSON, keep statusText */ }
    throw new Error(`Upload failed (HTTP ${res.status}): ${detail}`);
  }

  const json = await res.json() as { url?: string };
  if (!json.url) {
    throw new Error('Upload failed: upload service returned an unexpected response (no URL).');
  }

  return json.url;
}
