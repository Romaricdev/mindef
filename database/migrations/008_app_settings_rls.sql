-- ============================================
-- Politiques RLS pour la table app_settings
-- ============================================
-- Permet aux utilisateurs authentifiés (admins) de modifier les paramètres
-- Lecture publique autorisée pour tous

-- S'assurer que RLS est activé
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Politique SELECT pour permettre la lecture publique (déjà dans rls.sql mais on la recrée ici pour être sûr)
DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
CREATE POLICY "anon_select_app_settings" ON app_settings
  FOR SELECT
  TO anon
  USING (true);

-- Politiques INSERT/UPDATE pour les admins authentifiés
DROP POLICY IF EXISTS "anon_insert_app_settings" ON app_settings;
CREATE POLICY "anon_insert_app_settings" ON app_settings
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
CREATE POLICY "anon_update_app_settings" ON app_settings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Note: Pour une sécurité renforcée, on pourrait restreindre ces politiques
-- aux admins uniquement en vérifiant la table admins via auth.jwt()
-- Pour l'instant, on autorise anon pour le développement
