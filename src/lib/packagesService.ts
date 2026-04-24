import { supabase, genId } from './supabase';
import type { Package } from './types';

const TABLE = 'packages';

function rowToPackage(row: Record<string, unknown>): Package {
  return {
    id:                row.id                as string,
    name:              (row.name             as string)  ?? '',
    nameEs:            (row.name_es          as string)  ?? '',
    category:          (row.category         as Package['category']) ?? 'adults-salsa-bachata',
    price:             row.price !== null ? (row.price as number) : null,
    currency:          'USD',
    classCount:        (row.class_count       as number | undefined),
    expirationMonths:  (row.expiration_months as number | undefined),
    description:       (row.description      as string)  ?? '',
    descriptionEs:     (row.description_es   as string)  ?? '',
    paymentLink:       (row.payment_link      as string)  ?? '',
    sortOrder:         (row.sort_order        as number)  ?? 0,
    isActive:          (row.is_active         as boolean) ?? true,
  };
}

export async function getAllPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToPackage);
}

export async function getPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToPackage);
}

export async function savePackage(
  data: Omit<Package, 'id'> & { id?: string },
): Promise<Package> {
  const id    = data.id ?? genId();
  const isNew = !data.id;
  const ts    = new Date().toISOString();

  const row: Record<string, unknown> = {
    id,
    name:               data.name,
    name_es:            data.nameEs,
    category:           data.category,
    price:              data.price,
    currency:           data.currency,
    class_count:        data.classCount ?? null,
    expiration_months:  data.expirationMonths ?? null,
    description:        data.description,
    description_es:     data.descriptionEs,
    payment_link:       data.paymentLink ?? '',
    sort_order:         data.sortOrder,
    is_active:          data.isActive,
    updated_at:         ts,
  };
  if (isNew) row.created_at = ts;

  const { data: saved, error } = await supabase
    .from(TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return rowToPackage(saved as Record<string, unknown>);
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderPackages(ids: string[]): Promise<void> {
  const ts      = new Date().toISOString();
  const updates = ids.map((id, idx) => ({ id, sort_order: idx + 1, updated_at: ts }));
  const { error } = await supabase.from(TABLE).upsert(updates);
  if (error) throw error;
}
