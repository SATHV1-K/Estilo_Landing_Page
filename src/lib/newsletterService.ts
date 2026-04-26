import { supabase, genId } from './supabase';

export interface NewsletterSubscriber {
  id:           string;
  email:        string;
  subscribedAt: string;
}

function toModel(row: Record<string, unknown>): NewsletterSubscriber {
  return {
    id:           row.id as string,
    email:        row.email as string,
    subscribedAt: row.subscribed_at as string,
  };
}

export async function subscribeEmail(email: string): Promise<void> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { id: genId(), email: email.trim().toLowerCase(), subscribed_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: true }
    );
  if (error) throw error;
}

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toModel);
}
