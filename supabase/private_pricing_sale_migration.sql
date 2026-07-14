-- Migration: Add "compare-at" (original) price to packages and apply the
-- private-lesson sale pricing.
-- Run this in your Supabase SQL editor.

-- 1. Add the column that stores the pre-discount price (cents). NULL means
--    "no discount — show price as-is".
ALTER TABLE packages ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC;

-- 2. Apply sale pricing to the private lesson packages. Matched by
--    category + class_count so this works regardless of row ids.
UPDATE packages SET price = 12000, compare_at_price = 14000 WHERE category = 'private' AND class_count = 1;
UPDATE packages SET price = 24000, compare_at_price = 25000 WHERE category = 'private' AND class_count = 2;
UPDATE packages SET price = 34500, compare_at_price = 36000 WHERE category = 'private' AND class_count = 3;
UPDATE packages SET price = 46000, compare_at_price = 47500 WHERE category = 'private' AND class_count = 4;
UPDATE packages SET price = 57500, compare_at_price = 59000 WHERE category = 'private' AND class_count = 5;
UPDATE packages SET price = 66000, compare_at_price = 68000 WHERE category = 'private' AND class_count = 6;
UPDATE packages SET price = 77000, compare_at_price = 79000 WHERE category = 'private' AND class_count = 7;
UPDATE packages SET price = 88000, compare_at_price = 91000 WHERE category = 'private' AND class_count = 8;
