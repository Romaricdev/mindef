-- Migration: halls.image (TEXT) -> halls.images (TEXT[])
-- Exécuter dans SQL Editor Supabase après schema + seed.
-- Permet plusieurs images par salle.

ALTER TABLE halls ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'halls' AND column_name = 'image'
  ) THEN
    UPDATE halls
    SET images = CASE
      WHEN image IS NOT NULL AND trim(image) != '' THEN ARRAY[trim(image)]
      ELSE '{}'
    END;
    ALTER TABLE halls DROP COLUMN image;
  END IF;
END $$;
