import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { env } from './env.ts';

export const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false },
});

export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
