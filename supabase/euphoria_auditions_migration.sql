-- ═══════════════════════════════════════════════════════════════════════════════
-- Euphoria Ladies — Audition Applications Migration
-- Run via: Supabase Dashboard → SQL Editor → New Query → paste → Run
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS euphoria_audition_applications (
  id         TEXT        PRIMARY KEY,
  full_name  TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL DEFAULT '',
  email      TEXT        NOT NULL DEFAULT '',
  about      TEXT        NOT NULL DEFAULT '',
  status     TEXT        NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevents duplicate submissions from the same email, even under concurrent load
CREATE UNIQUE INDEX IF NOT EXISTS euphoria_audition_applications_email_key
  ON euphoria_audition_applications (email);

ALTER TABLE euphoria_audition_applications ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (anyone submitting the audition form)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'euphoria_audition_applications'
    AND policyname = 'public_insert_euphoria_audition_applications'
  ) THEN
    CREATE POLICY public_insert_euphoria_audition_applications
      ON euphoria_audition_applications
      FOR INSERT WITH CHECK (TRUE);
  END IF;
END $$;

-- Anon full access (admin panel uses anon key from the browser)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'euphoria_audition_applications'
    AND policyname = 'anon_write_euphoria_audition_applications'
  ) THEN
    CREATE POLICY anon_write_euphoria_audition_applications
      ON euphoria_audition_applications
      FOR ALL USING (TRUE);
  END IF;
END $$;
