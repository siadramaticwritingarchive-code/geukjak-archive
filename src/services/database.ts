import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase.generated';

export type TableName = keyof Database['public']['Tables'] & string;

export function fromTable<TTable extends TableName>(table: TTable) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
    );
  }

  return supabase.from(table);
}

export const databaseService = {
  from: fromTable
};
