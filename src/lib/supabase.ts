
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { env } from './supabaseEnv';

export const supabase: SupabaseClient<Database> | null = env.isConfigured
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        storageKey: 'sia-dramaticwriting-auth'
      }
    })
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
    );
  }

  return supabase;
}
