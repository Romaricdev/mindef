-- ============================================
-- Politiques RLS pour la table profiles
-- ============================================
-- Permet aux utilisateurs authentifiés de lire et créer leur propre profil

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs authentifiés de lire leur propre profil
DROP POLICY IF EXISTS "authenticated_read_own_profile" ON profiles;
CREATE POLICY "authenticated_read_own_profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs authentifiés de créer leur propre profil
DROP POLICY IF EXISTS "authenticated_insert_own_profile" ON profiles;
CREATE POLICY "authenticated_insert_own_profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour leur propre profil
DROP POLICY IF EXISTS "authenticated_update_own_profile" ON profiles;
CREATE POLICY "authenticated_update_own_profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique pour permettre à anon de lire les profils (pour le site public si nécessaire)
-- Note: À restreindre si vous ne voulez pas que les profils soient publics
DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles
  FOR SELECT
  TO anon
  USING (true);

-- Politique pour permettre à anon d'insérer des profils (nécessaire pour l'inscription)
DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);
