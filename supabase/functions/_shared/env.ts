const requireEnv = (key: string) => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const requireAnyEnv = (keys: string[]) => {
  for (const key of keys) {
    const value = Deno.env.get(key);
    if (value) {
      return value;
    }
  }

  throw new Error(`Missing required environment variable. Expected one of: ${keys.join(', ')}`);
};

export const env = {
  // Supabase hosted functions reserve SUPABASE_* names, so prefer APP_* and keep fallback for local dev.
  supabaseUrl: requireAnyEnv(['APP_SUPABASE_URL', 'SUPABASE_URL']),
  supabaseAnonKey: requireAnyEnv(['APP_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY']),
  supabaseServiceRoleKey: requireAnyEnv(['APP_SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY']),
  jwtSecret: requireEnv('JWT_SECRET'),
  adminEmail: requireEnv('ADMIN_EMAIL'),
  adminPassword: requireEnv('ADMIN_PASSWORD'),
  storageBucket:
    Deno.env.get('APP_SUPABASE_STORAGE_BUCKET') ??
    Deno.env.get('SUPABASE_STORAGE_BUCKET') ??
    'smartxerox-files',
};
