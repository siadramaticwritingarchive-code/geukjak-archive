import { supabase } from '../lib/supabase';

export type WorkListFilters = {
  search?: string;
  categoryId?: string;
  tagIds?: string[];
  year?: number;
  genre?: string;
};

export const workService = {
  async listPublishedWorks(filters: WorkListFilters = {}) {
    let query = supabase
      .from('works')
      .select(
        'id,title,author_name,year,genre,synopsis,poster_path,is_featured,view_count,like_count,bookmark_count,created_at',
      )
      .eq('visibility', 'published')
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,author_name.ilike.%${filters.search}%,synopsis.ilike.%${filters.search}%`,
      );
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters.year) {
      query = query.eq('year', filters.year);
    }

    if (filters.genre) {
      query = query.eq('genre', filters.genre);
    }

    return query;
  },

  getWorkById(workId: string) {
    return supabase
      .from('works')
      .select('*, categories(*), work_tags(tags(*))')
      .eq('id', workId)
      .single();
  },

  getWorkComments(workId: string) {
    return supabase
      .from('comments')
      .select('*, users(id, display_name, avatar_path), replies(*)')
      .eq('work_id', workId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
  }
};
