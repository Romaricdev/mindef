-- ============================================
-- Politiques RLS pour les tables menus et menu_products
-- ============================================
-- S'assure que les politiques RLS sont correctement configurées
-- pour permettre la lecture publique des menus et menu_products

-- S'assurer que RLS est activé
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_products ENABLE ROW LEVEL SECURITY;

-- Politique SELECT pour menus (lecture publique)
DROP POLICY IF EXISTS "anon_select_menus" ON menus;
CREATE POLICY "anon_select_menus" ON menus
  FOR SELECT
  TO anon
  USING (true);

-- Politique SELECT pour authenticated (lecture pour utilisateurs authentifiés)
DROP POLICY IF EXISTS "authenticated_select_menus" ON menus;
CREATE POLICY "authenticated_select_menus" ON menus
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique SELECT pour menu_products (lecture publique)
DROP POLICY IF EXISTS "anon_select_menu_products" ON menu_products;
CREATE POLICY "anon_select_menu_products" ON menu_products
  FOR SELECT
  TO anon
  USING (true);

-- Politique SELECT pour authenticated (lecture pour utilisateurs authentifiés)
DROP POLICY IF EXISTS "authenticated_select_menu_products" ON menu_products;
CREATE POLICY "authenticated_select_menu_products" ON menu_products
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques INSERT/UPDATE/DELETE pour menus (pour le dashboard)
DROP POLICY IF EXISTS "anon_insert_menus" ON menus;
CREATE POLICY "anon_insert_menus" ON menus
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menus" ON menus;
CREATE POLICY "anon_update_menus" ON menus
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menus" ON menus;
CREATE POLICY "anon_delete_menus" ON menus
  FOR DELETE
  TO anon
  USING (true);

-- Politiques INSERT/DELETE pour menu_products (pour le dashboard)
DROP POLICY IF EXISTS "anon_insert_menu_products" ON menu_products;
CREATE POLICY "anon_insert_menu_products" ON menu_products
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_products" ON menu_products;
CREATE POLICY "anon_delete_menu_products" ON menu_products
  FOR DELETE
  TO anon
  USING (true);

-- Note: Pour une sécurité renforcée, on pourrait restreindre ces politiques
-- aux admins uniquement en vérifiant la table admins via auth.jwt()
-- Pour l'instant, on autorise anon pour le développement
