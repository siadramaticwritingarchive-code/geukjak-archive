import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase.generated';

export type TableName = keyof Database['public']['Tables'] & string;

export function fromTable<TTable extends TableName>(table: TTable) {
  return supabase.from(table);
}

export const databaseService = {
  from: fromTable
};
