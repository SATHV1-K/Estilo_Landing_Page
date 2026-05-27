-- Migration: Replace single "call us" private package with 8 individual priced packages
-- Run this in your Supabase SQL editor.

-- 1. Remove old private package(s)
DELETE FROM packages WHERE category = 'private';

-- 2. Insert 8 individual private lesson packages
--    Prices stored in cents (USD).
--    payment_link is intentionally blank — update each via the admin panel.
INSERT INTO packages
  (id, name, name_es, category, price, currency, class_count, expiration_months,
   description, description_es, payment_link, sort_order, is_active, created_at, updated_at)
VALUES
  ('priv-1', '1 Private Class',   '1 Clase Privada',   'private', 12000, 'USD', 1, NULL,
   'One private lesson tailored entirely to your goals.',
   'Una clase privada adaptada a tus objetivos.',
   '', 1, TRUE, now(), now()),

  ('priv-2', '2 Private Classes', '2 Clases Privadas', 'private', 24000, 'USD', 2, NULL,
   'Two private lessons — build momentum from the start.',
   'Dos clases privadas — construye impulso desde el inicio.',
   '', 2, TRUE, now(), now()),

  ('priv-3', '3 Private Classes', '3 Clases Privadas', 'private', 34500, 'USD', 3, NULL,
   'Three private lessons — great for focused skill building.',
   'Tres clases privadas — ideal para desarrollar habilidades específicas.',
   '', 3, TRUE, now(), now()),

  ('priv-4', '4 Private Classes', '4 Clases Privadas', 'private', 46000, 'USD', 4, NULL,
   'Four private lessons — a solid foundation package.',
   'Cuatro clases privadas — un paquete sólido de inicio.',
   '', 4, TRUE, now(), now()),

  ('priv-5', '5 Private Classes', '5 Clases Privadas', 'private', 57500, 'USD', 5, NULL,
   'Five private lessons — steady progress toward your goals.',
   'Cinco clases privadas — avance constante hacia tus objetivos.',
   '', 5, TRUE, now(), now()),

  ('priv-6', '6 Private Classes', '6 Clases Privadas', 'private', 66000, 'USD', 6, NULL,
   'Six private lessons — best value for intermediate progress.',
   'Seis clases privadas — la mejor relación calidad-precio.',
   '', 6, TRUE, now(), now()),

  ('priv-7', '7 Private Classes', '7 Clases Privadas', 'private', 77000, 'USD', 7, NULL,
   'Seven private lessons — comprehensive skill development.',
   'Siete clases privadas — desarrollo integral de habilidades.',
   '', 7, TRUE, now(), now()),

  ('priv-8', '8 Private Classes', '8 Clases Privadas', 'private', 88000, 'USD', 8, NULL,
   'Eight private lessons — our most complete private package.',
   'Ocho clases privadas — nuestro paquete privado más completo.',
   '', 8, TRUE, now(), now());
