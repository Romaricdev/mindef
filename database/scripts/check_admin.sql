-- ============================================
-- Script de diagnostic pour vérifier l'admin
-- ============================================
-- Exécuter ce script dans Supabase SQL Editor pour diagnostiquer les problèmes

-- 1. Vérifier si la table admins existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admins'
) AS "Table admins exists";

-- 2. Vérifier les politiques RLS sur admins
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'admins';

-- 3. Lister tous les admins (si vous avez les permissions)
SELECT id, name, email, is_super_admin, created_at 
FROM admins 
ORDER BY created_at DESC;

-- 4. Vérifier si un admin existe pour un email spécifique
-- REMPLACER 'admin@example.com' par l'email de votre admin
SELECT * FROM admins WHERE email = 'admin@example.com';

-- 5. Vérifier si le compte Supabase Auth existe pour cet email
-- REMPLACER 'admin@example.com' par l'email de votre admin
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@example.com';

-- 6. Tester la fonction get_authenticated_user_email (si elle existe)
-- Cette requête doit être exécutée en étant connecté comme l'utilisateur
-- SELECT public.get_authenticated_user_email();

-- 7. Vérifier si RLS est activé sur admins
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'admins';
