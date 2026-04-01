-- Security hardening migration for existing Supabase projects
-- Run this once in Supabase SQL Editor to address Advisor findings.

-- 1) Lock down orders table
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.orders FROM anon, authenticated;

-- 2) Lock down students table
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.students FROM anon, authenticated;

-- 3) Prevent elevated-privilege view execution
ALTER VIEW IF EXISTS public.order_statistics SET (security_invoker = true);
REVOKE ALL ON TABLE public.order_statistics FROM anon, authenticated;
