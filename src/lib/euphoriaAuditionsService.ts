import { supabase, genId } from './supabase';
import { getAllContent, setPageContent } from './contentService';
import type { EuphoriaAuditionApplication } from './types';

const TABLE = 'euphoria_audition_applications';
const ACTIVE_KEY = 'euphoria.auditions.isActive';

function rowToApp(row: Record<string, unknown>): EuphoriaAuditionApplication {
  return {
    id:        (row.id          as string) ?? '',
    fullName:  (row.full_name   as string) ?? '',
    phone:     (row.phone       as string) ?? '',
    email:     (row.email       as string) ?? '',
    about:     (row.about       as string) ?? '',
    status:    (row.status      as 'new' | 'reviewed' | 'contacted') ?? 'new',
    createdAt: (row.created_at  as string) ?? '',
  };
}

export async function getAuditionsActive(): Promise<boolean> {
  try {
    const rows = await getAllContent();
    const row = rows.find(r => r.key === ACTIVE_KEY);
    return row?.value === 'true';
  } catch {
    return false;
  }
}

export async function setAuditionsActive(active: boolean): Promise<void> {
  await setPageContent({ [ACTIVE_KEY]: active ? 'true' : 'false' });
}

export async function checkDuplicateApplication(email: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from(TABLE)
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    return !!data;
  } catch {
    return false; // fail open — let the insert attempt and surface any real error
  }
}

export async function submitAuditionApplication(data: {
  fullName: string;
  phone: string;
  email: string;
  about: string;
}): Promise<EuphoriaAuditionApplication> {
  const id = genId();
  const ts = new Date().toISOString();
  const { data: saved, error } = await supabase
    .from(TABLE)
    .insert({
      id,
      full_name:  data.fullName,
      phone:      data.phone,
      email:      data.email.toLowerCase().trim(),
      about:      data.about,
      status:     'new',
      created_at: ts,
    })
    .select('id, full_name, phone, email, about, status, created_at')
    .single();
  if (error) {
    if ((error as { code?: string }).code === '23505') throw new Error('DUPLICATE_EMAIL');
    throw error;
  }
  return rowToApp(saved as Record<string, unknown>);
}

export async function getAuditionApplications(): Promise<EuphoriaAuditionApplication[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, full_name, phone, email, about, status, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => rowToApp(r as Record<string, unknown>));
}

export async function updateApplicationStatus(
  id: string,
  status: 'new' | 'reviewed' | 'contacted',
): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
