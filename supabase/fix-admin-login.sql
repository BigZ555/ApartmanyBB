-- FIX: Login works but "Nincs jogosultsága a hozzáféréshez" (no permission)
-- Run in Supabase → SQL Editor
-- Replace 'YOUR_EMAIL@example.com' with your actual login email

-- STEP 1: Diagnose – see if profile exists and matches auth user
SELECT
  u.id          AS auth_user_id,
  u.email       AS auth_email,
  p.id          AS profile_id,
  p.email       AS profile_email,
  p.role        AS profile_role,
  CASE WHEN u.id = p.id THEN 'OK' ELSE 'MISMATCH' END AS id_match
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'YOUR_EMAIL@example.com';

-- STEP 2: Create or fix profile (must use auth.users.id, NOT email alone)
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    email = EXCLUDED.email;

-- STEP 3: Remove orphan profiles (wrong id, same email) that confuse things
DELETE FROM public.profiles
WHERE email = 'YOUR_EMAIL@example.com'
  AND id NOT IN (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com');

-- STEP 4: Verify
SELECT u.id, u.email, p.role
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'YOUR_EMAIL@example.com';
-- Expected: role = 'admin'

-- STEP 5: Ensure RLS allows reading own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

GRANT SELECT ON public.profiles TO authenticated;
