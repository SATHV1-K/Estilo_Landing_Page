-- ═══════════════════════════════════════════════════════════════════════════════
-- Estilo Latino Dance Company — Supabase Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Gallery Photos ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_photos (
  id          TEXT        PRIMARY KEY,
  title       TEXT        NOT NULL DEFAULT '',
  title_es    TEXT        NOT NULL DEFAULT '',
  alt_text    TEXT        NOT NULL DEFAULT '',
  image_url   TEXT        NOT NULL DEFAULT '',
  category    TEXT        NOT NULL DEFAULT 'general',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Videos ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS videos (
  id             TEXT        PRIMARY KEY,
  title          TEXT        NOT NULL DEFAULT '',
  title_es       TEXT        NOT NULL DEFAULT '',
  description    TEXT        NOT NULL DEFAULT '',
  description_es TEXT        NOT NULL DEFAULT '',
  source         TEXT        NOT NULL,
  external_url   TEXT        NOT NULL DEFAULT '',
  youtube_id     TEXT        NOT NULL DEFAULT '',
  thumbnail_url  TEXT        NOT NULL DEFAULT '',
  video_file_url TEXT        NOT NULL DEFAULT '',
  duration_sec   INTEGER     NOT NULL DEFAULT 0,
  category       TEXT        NOT NULL DEFAULT 'general',
  featured       BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos         ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (public site needs to fetch data)
CREATE POLICY "public_read_gallery"  ON gallery_photos FOR SELECT USING (TRUE);
CREATE POLICY "public_read_videos"   ON videos         FOR SELECT USING (TRUE);

-- Allow anon key full write access (admin panel uses anon key from the browser)
CREATE POLICY "anon_write_gallery"   ON gallery_photos FOR ALL   USING (TRUE);
CREATE POLICY "anon_write_videos"    ON videos         FOR ALL   USING (TRUE);

-- ─── Instructors ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS instructors (
  id           TEXT        PRIMARY KEY,
  name         TEXT        NOT NULL DEFAULT '',
  specialty    TEXT        NOT NULL DEFAULT '',
  bio          TEXT        NOT NULL DEFAULT '',
  bio_es       TEXT        NOT NULL DEFAULT '',
  photo_url    TEXT        NOT NULL DEFAULT '',
  social_links JSONB       NOT NULL DEFAULT '[]',
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Dance Styles ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dance_styles (
  id             TEXT        PRIMARY KEY,
  slug           TEXT        NOT NULL DEFAULT '',
  name           TEXT        NOT NULL DEFAULT '',
  name_es        TEXT        NOT NULL DEFAULT '',
  tagline        TEXT        NOT NULL DEFAULT '',
  description    TEXT        NOT NULL DEFAULT '',
  description_es TEXT        NOT NULL DEFAULT '',
  hero_image     TEXT        NOT NULL DEFAULT '',
  card_image     TEXT        NOT NULL DEFAULT '',
  video_url      TEXT        NOT NULL DEFAULT '',
  age_group      TEXT        NOT NULL DEFAULT 'all',
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  contact_only   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration: run this if the table already exists in your Supabase project
-- ALTER TABLE dance_styles ADD COLUMN IF NOT EXISTS video_url TEXT NOT NULL DEFAULT '';

-- ─── Recurring Schedule ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recurring_schedule (
  id          TEXT        PRIMARY KEY,
  day_of_week TEXT        NOT NULL,
  start_time  TEXT        NOT NULL DEFAULT '',
  end_time    TEXT        NOT NULL DEFAULT '',
  class_name  TEXT        NOT NULL DEFAULT '',
  detail      TEXT        NOT NULL DEFAULT '',
  category    TEXT        NOT NULL DEFAULT 'special',
  location    TEXT        NOT NULL DEFAULT '',
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Overview Schedule (separate grid — mirrors recurring by default) ──────────

CREATE TABLE IF NOT EXISTS overview_schedule (
  id          TEXT        PRIMARY KEY,
  day_of_week TEXT        NOT NULL,
  start_time  TEXT        NOT NULL DEFAULT '',
  end_time    TEXT        NOT NULL DEFAULT '',
  class_name  TEXT        NOT NULL DEFAULT '',
  detail      TEXT        NOT NULL DEFAULT '',
  category    TEXT        NOT NULL DEFAULT 'special',
  location    TEXT        NOT NULL DEFAULT '',
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reviews ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL DEFAULT '',
  stars      INTEGER     NOT NULL DEFAULT 5,
  text       TEXT        NOT NULL DEFAULT '',
  sort_order INTEGER     NOT NULL DEFAULT 0,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Packages ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS packages (
  id                 TEXT        PRIMARY KEY,
  name               TEXT        NOT NULL DEFAULT '',
  name_es            TEXT        NOT NULL DEFAULT '',
  category           TEXT        NOT NULL DEFAULT 'adults-salsa-bachata',
  price              NUMERIC,
  currency           TEXT        NOT NULL DEFAULT 'USD',
  class_count        INTEGER,
  expiration_months  INTEGER,
  description        TEXT        NOT NULL DEFAULT '',
  description_es     TEXT        NOT NULL DEFAULT '',
  payment_link       TEXT        NOT NULL DEFAULT '',
  sort_order         INTEGER     NOT NULL DEFAULT 0,
  is_active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Alerts ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS alerts (
  id         TEXT        PRIMARY KEY,
  title      TEXT        NOT NULL DEFAULT '',
  title_es   TEXT        NOT NULL DEFAULT '',
  message    TEXT        NOT NULL DEFAULT '',
  message_es TEXT        NOT NULL DEFAULT '',
  type       TEXT        NOT NULL DEFAULT 'info',
  link       TEXT        NOT NULL DEFAULT '',
  link_label TEXT        NOT NULL DEFAULT '',
  start_date TEXT,
  end_date   TEXT,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Site Settings (singleton row — id always 'singleton') ────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id                 TEXT        PRIMARY KEY DEFAULT 'singleton',
  studio_name        TEXT        NOT NULL DEFAULT '',
  studio_name_short  TEXT        NOT NULL DEFAULT '',
  tagline            TEXT        NOT NULL DEFAULT '',
  address            TEXT        NOT NULL DEFAULT '',
  address_line2      TEXT        NOT NULL DEFAULT '',
  city               TEXT        NOT NULL DEFAULT '',
  state              TEXT        NOT NULL DEFAULT '',
  zip                TEXT        NOT NULL DEFAULT '',
  phone              TEXT        NOT NULL DEFAULT '',
  whatsapp           TEXT        NOT NULL DEFAULT '',
  email              TEXT        NOT NULL DEFAULT '',
  google_maps_embed  TEXT        NOT NULL DEFAULT '',
  social_links       JSONB       NOT NULL DEFAULT '[]',
  business_hours     JSONB       NOT NULL DEFAULT '[]',
  meta_title         TEXT        NOT NULL DEFAULT '',
  meta_description   TEXT        NOT NULL DEFAULT '',
  footer_text        TEXT        NOT NULL DEFAULT '',
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Site Content (key-value) ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Media Files ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS media_files (
  id          TEXT        PRIMARY KEY,
  slot        TEXT        NOT NULL DEFAULT '',
  url         TEXT        NOT NULL DEFAULT '',
  filename    TEXT        NOT NULL DEFAULT '',
  file_size   INTEGER     NOT NULL DEFAULT 0,
  mime_type   TEXT        NOT NULL DEFAULT '',
  alt_text    TEXT        NOT NULL DEFAULT '',
  width       INTEGER,
  height      INTEGER,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Special Classes ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS special_classes (
  id           TEXT        PRIMARY KEY,
  name         TEXT        NOT NULL DEFAULT '',
  description  TEXT        NOT NULL DEFAULT '',
  date         TEXT        NOT NULL DEFAULT '',
  end_time     TEXT        NOT NULL DEFAULT '',
  duration_min INTEGER     NOT NULL DEFAULT 0,
  location     TEXT        NOT NULL DEFAULT '',
  instructor   TEXT        NOT NULL DEFAULT '',
  category     TEXT        NOT NULL DEFAULT 'special',
  price        INTEGER     NOT NULL DEFAULT 0,
  max_capacity INTEGER     NOT NULL DEFAULT 20,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  payment_link TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Newsletter Subscribers ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            TEXT        PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Contact Messages ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contact_messages (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL DEFAULT '',
  email      TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL DEFAULT '',
  message    TEXT        NOT NULL DEFAULT '',
  is_read    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reservations ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reservations (
  id               TEXT        PRIMARY KEY,
  special_class_id TEXT        NOT NULL REFERENCES special_classes(id) ON DELETE CASCADE,
  customer_name    TEXT        NOT NULL DEFAULT '',
  customer_email   TEXT        NOT NULL DEFAULT '',
  customer_phone   TEXT        NOT NULL DEFAULT '',
  payment_status   TEXT        NOT NULL DEFAULT 'pending',
  amount           INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE instructors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dance_styles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE overview_schedule  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files        ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_classes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers   ENABLE ROW LEVEL SECURITY;

-- Public read (public site needs to fetch data)
CREATE POLICY "public_read_instructors"        ON instructors        FOR SELECT USING (TRUE);
CREATE POLICY "public_read_dance_styles"       ON dance_styles       FOR SELECT USING (TRUE);
CREATE POLICY "public_read_recurring_schedule" ON recurring_schedule FOR SELECT USING (TRUE);
CREATE POLICY "public_read_overview_schedule"  ON overview_schedule  FOR SELECT USING (TRUE);
CREATE POLICY "public_read_reviews"            ON reviews            FOR SELECT USING (TRUE);
CREATE POLICY "public_read_packages"           ON packages           FOR SELECT USING (TRUE);
CREATE POLICY "public_read_alerts"             ON alerts             FOR SELECT USING (TRUE);
CREATE POLICY "public_read_site_settings"      ON site_settings      FOR SELECT USING (TRUE);
CREATE POLICY "public_read_site_content"       ON site_content       FOR SELECT USING (TRUE);
CREATE POLICY "public_read_media_files"        ON media_files        FOR SELECT USING (TRUE);
CREATE POLICY "public_read_special_classes"    ON special_classes    FOR SELECT USING (TRUE);
CREATE POLICY "public_read_reservations"       ON reservations       FOR SELECT USING (TRUE);
CREATE POLICY "public_insert_contact_messages"      ON contact_messages        FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "public_insert_newsletter_subscribers" ON newsletter_subscribers  FOR INSERT WITH CHECK (TRUE);

-- Anon full write (admin panel uses anon key from the browser)
CREATE POLICY "anon_write_instructors"        ON instructors        FOR ALL USING (TRUE);
CREATE POLICY "anon_write_dance_styles"       ON dance_styles       FOR ALL USING (TRUE);
CREATE POLICY "anon_write_recurring_schedule" ON recurring_schedule FOR ALL USING (TRUE);
CREATE POLICY "anon_write_overview_schedule"  ON overview_schedule  FOR ALL USING (TRUE);
CREATE POLICY "anon_write_reviews"            ON reviews            FOR ALL USING (TRUE);
CREATE POLICY "anon_write_packages"           ON packages           FOR ALL USING (TRUE);
CREATE POLICY "anon_write_alerts"             ON alerts             FOR ALL USING (TRUE);
CREATE POLICY "anon_write_site_settings"      ON site_settings      FOR ALL USING (TRUE);
CREATE POLICY "anon_write_site_content"       ON site_content       FOR ALL USING (TRUE);
CREATE POLICY "anon_write_media_files"        ON media_files        FOR ALL USING (TRUE);
CREATE POLICY "anon_write_special_classes"    ON special_classes    FOR ALL USING (TRUE);
CREATE POLICY "anon_write_reservations"       ON reservations       FOR ALL USING (TRUE);
CREATE POLICY "anon_write_contact_messages"        ON contact_messages        FOR ALL USING (TRUE);
CREATE POLICY "anon_write_newsletter_subscribers"  ON newsletter_subscribers  FOR ALL USING (TRUE);

-- ─── Storage Buckets ──────────────────────────────────────────────────────────
-- Create these in: Dashboard → Storage → New bucket
--
--  1. Bucket name: gallery   | Public: YES
--  2. Bucket name: media     | Public: YES
--     (instructor photos go in media/instructors/, style images in media/styles/)
--
-- Then add these Storage policies for each bucket:
--   • SELECT (download): allow for everyone  → policy: (bucket_id = 'gallery')
--   • INSERT (upload):   allow for anon role → policy: (bucket_id = 'gallery')
--   • UPDATE:            allow for anon role
--   • DELETE:            allow for anon role
-- (Same for the "media" bucket)
