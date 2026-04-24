import { supabase } from './supabase';
import type { AdminSiteSettings } from './adminData';

const TABLE    = 'site_settings';
const SINGLETON = 'singleton';

function rowToSettings(row: Record<string, unknown>): AdminSiteSettings {
  return {
    studioName:      (row.studio_name       as string) ?? '',
    studioNameShort: (row.studio_name_short as string) ?? '',
    tagline:         (row.tagline           as string) ?? '',
    address:         (row.address           as string) ?? '',
    addressLine2:    (row.address_line2     as string) ?? '',
    city:            (row.city              as string) ?? '',
    state:           (row.state             as string) ?? '',
    zip:             (row.zip               as string) ?? '',
    phone:           (row.phone             as string) ?? '',
    whatsapp:        (row.whatsapp          as string) ?? '',
    email:           (row.email             as string) ?? '',
    googleMapsEmbed: (row.google_maps_embed as string) ?? '',
    socialLinks:     (row.social_links      as AdminSiteSettings['socialLinks']) ?? [],
    businessHours:   (row.business_hours    as AdminSiteSettings['businessHours']) ?? [],
    metaTitle:       (row.meta_title        as string) ?? '',
    metaDescription: (row.meta_description  as string) ?? '',
    footerText:      (row.footer_text       as string) ?? '',
  };
}

export async function getSiteSettings(): Promise<AdminSiteSettings | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', SINGLETON)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToSettings(data as Record<string, unknown>) : null;
}

export async function saveSiteSettings(settings: AdminSiteSettings): Promise<void> {
  const ts = new Date().toISOString();
  const row = {
    id:                 SINGLETON,
    studio_name:        settings.studioName,
    studio_name_short:  settings.studioNameShort,
    tagline:            settings.tagline,
    address:            settings.address,
    address_line2:      settings.addressLine2,
    city:               settings.city,
    state:              settings.state,
    zip:                settings.zip,
    phone:              settings.phone,
    whatsapp:           settings.whatsapp,
    email:              settings.email,
    google_maps_embed:  settings.googleMapsEmbed,
    social_links:       settings.socialLinks,
    business_hours:     settings.businessHours,
    meta_title:         settings.metaTitle,
    meta_description:   settings.metaDescription,
    footer_text:        settings.footerText,
    updated_at:         ts,
  };

  const { error } = await supabase.from(TABLE).upsert(row);
  if (error) throw error;
}
