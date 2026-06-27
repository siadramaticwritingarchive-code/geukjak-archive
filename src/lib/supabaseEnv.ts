const requiredEnv = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};

type SupabaseEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

function getSupabaseEnv(): SupabaseEnv {
  const missingKeys = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Supabase environment variables: ${missingKeys.join(', ')}. Add them to .env.local.`,
    );
  }

  return requiredEnv as SupabaseEnv;
}

export const env = getSupabaseEnv();
