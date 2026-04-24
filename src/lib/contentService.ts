import { supabase } from './supabase';
import type { SiteContent } from './adminData';

const TABLE = 'site_content';

function rowToContent(row: Record<string, unknown>): SiteContent {
  return {
    key:       row.key       as string,
    value:     (row.value    as string) ?? '',
    updatedAt: (row.updated_at as string) ?? '',
  };
}

export async function getAllContent(): Promise<SiteContent[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('key', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToContent);
}

export async function getContent(key: string, fallback = ''): Promise<string> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw error;
  return (data?.value as string | undefined) ?? fallback;
}

export async function setContent(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function setPageContent(updates: Record<string, string>): Promise<void> {
  const ts   = new Date().toISOString();
  const rows = Object.entries(updates).map(([key, value]) => ({ key, value, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(rows);
  if (error) throw error;
}

export async function getPageContent(prefix: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('key, value')
    .like('key', `${prefix}.%`);
  if (error) throw error;
  const result: Record<string, string> = {};
  for (const row of data ?? []) {
    const key = (row.key as string).slice(prefix.length + 1);
    result[key] = (row.value as string) ?? '';
  }
  return result;
}
