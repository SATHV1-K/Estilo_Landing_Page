-- ═══════════════════════════════════════════════════════════════════════════════
-- Estilo Kids — Database Migration
-- Run via: Supabase Dashboard → SQL Editor → New Query → paste → Run
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Kids Programs ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kids_programs (
  id            text        PRIMARY KEY,
  name          text        NOT NULL DEFAULT '',
  name_es       text        NOT NULL DEFAULT '',
  description   text        NOT NULL DEFAULT '',
  description_es text       NOT NULL DEFAULT '',
  age_range     text        NOT NULL DEFAULT '5+',
  image_url     text        NOT NULL DEFAULT '',
  schedule_note text        NOT NULL DEFAULT '',
  sort_order    integer     NOT NULL DEFAULT 0,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kids_programs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kids_programs' AND policyname = 'kids_programs_public_read'
  ) THEN
    CREATE POLICY kids_programs_public_read ON kids_programs FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kids_programs' AND policyname = 'kids_programs_anon_write'
  ) THEN
    CREATE POLICY kids_programs_anon_write ON kids_programs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─── Kids Gallery Items ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kids_gallery_items (
  id            text        PRIMARY KEY,
  title         text        NOT NULL DEFAULT '',
  title_es      text        NOT NULL DEFAULT '',
  type          text        NOT NULL DEFAULT 'photo',
  url           text        NOT NULL DEFAULT '',
  thumbnail_url text        NOT NULL DEFAULT '',
  youtube_id    text        NOT NULL DEFAULT '',
  category      text        NOT NULL DEFAULT 'general',
  sort_order    integer     NOT NULL DEFAULT 0,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kids_gallery_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kids_gallery_items' AND policyname = 'kids_gallery_public_read'
  ) THEN
    CREATE POLICY kids_gallery_public_read ON kids_gallery_items FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kids_gallery_items' AND policyname = 'kids_gallery_anon_write'
  ) THEN
    CREATE POLICY kids_gallery_anon_write ON kids_gallery_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─── Kids Achievements ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kids_achievements (
  id             text        PRIMARY KEY,
  title          text        NOT NULL DEFAULT '',
  title_es       text        NOT NULL DEFAULT '',
  description    text        NOT NULL DEFAULT '',
  description_es text        NOT NULL DEFAULT '',
  image_url      text        NOT NULL DEFAULT '',
  date           timestamptz,
  sort_order     integer     NOT NULL DEFAULT 0,
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kids_achievements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kids_achievements' AND policyname = 'kids_achievements_public_read'
  ) THEN
    CREATE POLICY kids_achievements_public_read ON kids_achievements FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kids_achievements' AND policyname = 'kids_achievements_anon_write'
  ) THEN
    CREATE POLICY kids_achievements_anon_write ON kids_achievements FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─── Add enroll_link column (safe to re-run) ──────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'kids_programs' AND column_name = 'enroll_link'
  ) THEN
    ALTER TABLE kids_programs ADD COLUMN enroll_link text NOT NULL DEFAULT '';
  END IF;
END $$;

-- ─── Seed Data ────────────────────────────────────────────────────────────────

INSERT INTO kids_programs (id, name, name_es, description, description_es, age_range, schedule_note, sort_order, is_active) VALUES
('kp-1', 'Kids Latin Rhythms', 'Ritmos Latinos para Niños',
  'Fun and energetic Latin dance classes for children. Learn Salsa, Merengue, and Cumbia while building confidence and rhythm.',
  'Clases de baile latino divertidas y enérgicas para niños. Aprende Salsa, Merengue y Cumbia desarrollando confianza y ritmo.',
  '5+', 'Mon & Wed 6:00–7:00 PM', 1, true),
('kp-2', 'Kids Ballet Basics', 'Ballet Básico para Niños',
  'Introduction to ballet fundamentals: posture, coordination, and grace. Building a strong foundation for any dance style.',
  'Introducción a los fundamentos del ballet: postura, coordinación y gracia. Construyendo una base sólida para cualquier estilo de baile.',
  '4–8', 'Tue & Thu 5:00–6:00 PM', 2, true),
('kp-3', 'Kids Street Dance', 'Baile Urbano para Niños',
  'High-energy Hip Hop and urban choreography. Kids learn self-expression, creativity, and teamwork through street-dance styles.',
  'Hip Hop de alta energía y coreografía urbana. Los niños aprenden autoexpresión, creatividad y trabajo en equipo.',
  '7–12', 'Sat 10:00–11:30 AM', 3, true),
('kp-4', 'Gymnastics Workshop', 'Taller de Gimnasia',
  'Flexibility, balance, and acrobatic fundamentals combined with dance. A perfect blend of athleticism and artistry.',
  'Flexibilidad, equilibrio y fundamentos acrobáticos combinados con baile. Una mezcla perfecta de atletismo y arte.',
  '5–10', 'Sat 12:00–1:30 PM', 4, true)
ON CONFLICT (id) DO NOTHING;
