import { supabase } from '../lib/supabase';
import type { Notice } from '../types/notice';

const unavailableError = new Error(
  'Supabase is not configured.',
);

export const noticeService = {
  async listNotices() {
    if (!supabase) {
      throw unavailableError;
    }

    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Notice[];
  },

  async createNotice(input: {
    title: string;
    content: string;
    published: boolean;
  }) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('notices')
      .insert({
        title: input.title,
        content: input.content,
        is_published: input.published
      });

    if (error) {
      throw error;
    }
  },

  async deleteNotice(id: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
};
