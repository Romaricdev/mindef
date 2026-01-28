-- ============================================
-- Script complet pour créer un administrateur
-- ============================================
-- 
-- INSTRUCTIONS :
-- 1. Créer d'abord le compte Supabase Auth (voir ci-dessous)
-- 2. Exécuter ensuite cette requête SQL
--
-- ============================================

-- OPTION 1 : Créer l'admin avec la fonction helper (RECOMMANDÉ)
-- Cette fonction vérifie automatiquement que le compte Auth existe
SELECT public.create_admin(
  'Nom de l''Administrateur',        -- Remplacez par le nom de l'admin
  'admin@example.com',               -- Remplacez par l'email (DOIT correspondre au compte Auth)
  true,                               -- true = super admin, false = admin avec permissions limitées
  '["orders", "menus", "settings"]'::jsonb  -- Permissions (optionnel, laissez '[]'::jsonb pour toutes)
);

-- OPTION 2 : Insertion directe (si vous êtes sûr que le compte Auth existe)
-- INSERT INTO admins (name, email, is_super_admin, permissions)
-- VALUES (
--   'Nom de l''Administrateur',
--   'admin@example.com',
--   true,
--   '["orders", "menus", "settings"]'::jsonb
-- );

-- ============================================
-- CRÉER LE COMPTE SUPABASE AUTH
-- ============================================
--
-- MÉTHODE 1 : Via le Dashboard Supabase
--   1. Aller dans Supabase Dashboard > Authentication > Users
--   2. Cliquer sur "Add user" > "Create new user"
--   3. Entrer :
--      - Email : admin@example.com
--      - Password : [mot de passe sécurisé]
--      - Auto Confirm User : ✅ (cocher)
--   4. Cliquer sur "Create user"
--
-- MÉTHODE 2 : Via l'API Supabase (curl)
--   curl -X POST 'https://[VOTRE-PROJECT].supabase.co/auth/v1/admin/users' \
--     -H "apikey: [VOTRE-SERVICE-ROLE-KEY]" \
--     -H "Authorization: Bearer [VOTRE-SERVICE-ROLE-KEY]" \
--     -H "Content-Type: application/json" \
--     -d '{
--       "email": "admin@example.com",
--       "password": "MotDePasse123!",
--       "email_confirm": true,
--       "user_metadata": {
--         "full_name": "Nom de l''Administrateur"
--       }
--     }'
--
-- MÉTHODE 3 : Via Supabase CLI
--   supabase auth admin create-user \
--     --email admin@example.com \
--     --password "MotDePasse123!" \
--     --email-confirm
--
-- ============================================
-- VÉRIFICATION
-- ============================================
--
-- Vérifier que l'admin a été créé :
-- SELECT * FROM admins WHERE email = 'admin@example.com';
--
-- Vérifier que le compte Auth existe :
-- SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@example.com';
--
-- ============================================
