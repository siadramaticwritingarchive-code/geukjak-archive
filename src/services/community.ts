import { supabase } from '../lib/supabase';
import type { BoardType } from '../types/community';

export type CommunityPostFilters = {
  boardType?: BoardType;
  search?: string;
  page?: number;
  pageSize?: number;
};

const unavailableError = new Error(
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
);

export const communityService = {
  listPosts({ boardType, search, page = 1, pageSize = 20 }: CommunityPostFilters = {}) {
    if (!supabase) {
      return Promise.resolve({ data: [], error: unavailableError, count: 0 } as any);
    }
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('community_posts')
      .select('*, profiles(id, display_name, avatar_path)', { count: 'exact' })
      .is('deleted_at', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (boardType) {
      query = query.eq('board_type', boardType);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    return query;
  },

  getPostById(postId: string) {
    if (!supabase) {
      return Promise.resolve({ data: null, error: unavailableError } as any);
    }

    return supabase
      .from('community_posts')
      .select('*, profiles(id, display_name, avatar_path)')
      .eq('id', postId)
      .single();
  },

  getPostComments(postId: string) {
    if (!supabase) {
      return Promise.resolve({ data: [], error: unavailableError } as any);
    }

    return supabase
      .from('community_comments')
      .select('*, profiles(id, display_name, avatar_path), replies(*)')
      .eq('post_id', postId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
  }
};
