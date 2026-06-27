import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { env } from './supabaseEnv';

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storageKey: 'sia-playwriting-auth'
    }
  },
);
