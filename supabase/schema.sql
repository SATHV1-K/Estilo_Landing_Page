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

-- ─── Storage Buckets ──────────────────────────────────────────────────────────
-- Create these in: Dashboard → Storage → New bucket
--
--  1. Bucket name: gallery   | Public: YES
--  2. Bucket name: media     | Public: YES
--
-- Then add these Storage policies for each bucket:
--   • SELECT (download): allow for everyone  → policy: (bucket_id = 'gallery')
--   • INSERT (upload):   allow for anon role → policy: (bucket_id = 'gallery')
--   • UPDATE:            allow for anon role
--   • DELETE:            allow for anon role
-- (Same for the "media" bucket)
