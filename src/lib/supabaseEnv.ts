const requiredEnv = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.trim() ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''
};

type SupabaseEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
  missingKeys: string[];
};

function getSupabaseEnv(): SupabaseEnv {
  const missingKeys = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return {
    ...requiredEnv,
    isConfigured: missingKeys.length === 0,
    missingKeys,
  };
}

export const env = getSupabaseEnv();
