-- ============================================
-- Storage — Bucket "images" + RLS
-- Exécuter après avoir créé le bucket dans le Dashboard Supabase.
-- ============================================
--
-- 1. Créer le bucket dans Dashboard > Storage > New bucket :
--    - Name: images
--    - Public: Oui (pour URLs publiques)
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp (optionnel)
--    - File size limit: 5 MB (optionnel)
--
-- 2. Exécuter ce script dans SQL Editor pour les politiques RLS.
--
-- 3. Structure des dossiers (pas de mélange) :
--    - products/  → images des produits (menu_items)
--    - halls/     → images des salles
--    - categories/ → images des catégories (si usage futur)
--    - addons/    → images des addons (si usage futur)
-- ============================================

-- Politiques sur storage.objects pour le bucket "images"
-- anon peut uploader (INSERT) et lire (SELECT) pour les formulaires dashboard.

DROP POLICY IF EXISTS "anon_insert_images" ON storage.objects;
CREATE POLICY "anon_insert_images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'images');

-- authenticated (utilisateurs connectés) peut aussi uploader et lire.
-- Important : sans ces policies, un admin connecté (role=authenticated) verra
-- "new row violates row-level security policy" lors de l'upload.
DROP POLICY IF EXISTS "authenticated_insert_images" ON storage.objects;
CREATE POLICY "authenticated_insert_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "anon_select_images" ON storage.objects;
CREATE POLICY "anon_select_images"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "authenticated_select_images" ON storage.objects;
CREATE POLICY "authenticated_select_images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "anon_update_images" ON storage.objects;
CREATE POLICY "anon_update_images"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "authenticated_update_images" ON storage.objects;
CREATE POLICY "authenticated_update_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "anon_delete_images" ON storage.objects;
CREATE POLICY "anon_delete_images"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "authenticated_delete_images" ON storage.objects;
CREATE POLICY "authenticated_delete_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
