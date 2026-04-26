import { supabase, genId } from './supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function toModel(row: Record<string, unknown>): ContactMessage {
  return {
    id:        row.id as string,
    name:      row.name as string,
    email:     row.email as string,
    phone:     row.phone as string,
    message:   row.message as string,
    isRead:    row.is_read as boolean,
    createdAt: row.created_at as string,
  };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toModel);
}

export async function saveContactMessage(
  msg: Pick<ContactMessage, 'name' | 'email' | 'phone' | 'message'>
): Promise<ContactMessage> {
  const row = {
    id:         genId(),
    name:       msg.name.trim(),
    email:      msg.email.trim().toLowerCase(),
    phone:      msg.phone.trim(),
    message:    msg.message.trim(),
    is_read:    false,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return toModel(data);
}

export async function markMessageRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
