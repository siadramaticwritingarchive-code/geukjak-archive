import { supabase } from '../lib/supabase';
import type { BoardType } from '../types/community';

export type CommunityPostFilters = {
  boardType?: BoardType;
  search?: string;
  page?: number;
  pageSize?: number;
};

export const communityService = {
  listPosts({ boardType, search, page = 1, pageSize = 20 }: CommunityPostFilters = {}) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('community_posts')
      .select('*, users(id, display_name, avatar_path)', { count: 'exact' })
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
    return supabase
      .from('community_posts')
      .select('*, users(id, display_name, avatar_path)')
      .eq('id', postId)
      .single();
  },

  getPostComments(postId: string) {
    return supabase
      .from('community_comments')
      .select('*, users(id, display_name, avatar_path), replies(*)')
      .eq('post_id', postId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
  }
};
