-- ============================================
-- Politiques RLS pour la table admins
-- ============================================
-- Permet aux utilisateurs authentifiés de vérifier s'ils sont admin
-- (en comparant leur email avec la table admins)
-- Utilise auth.jwt() pour obtenir l'email depuis le JWT token

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs authentifiés de lire leur propre enregistrement admin
-- (en comparant l'email du JWT avec l'email dans admins)
DROP POLICY IF EXISTS "authenticated_read_own_admin" ON admins;
CREATE POLICY "authenticated_read_own_admin" ON admins
  FOR SELECT
  TO authenticated
  USING (
    -- Permettre la lecture si l'email correspond à l'email du JWT token
    email = (auth.jwt() ->> 'email')
  );

-- Politique pour permettre la mise à jour de last_login_at pour son propre enregistrement
DROP POLICY IF EXISTS "authenticated_update_own_login" ON admins;
CREATE POLICY "authenticated_update_own_login" ON admins
  FOR UPDATE
  TO authenticated
  USING (
    email = (auth.jwt() ->> 'email')
  )
  WITH CHECK (
    email = (auth.jwt() ->> 'email')
  );

-- Note : Les admins super_admin peuvent gérer tous les admins via le dashboard
-- Cette politique sera ajoutée plus tard si nécessaire
