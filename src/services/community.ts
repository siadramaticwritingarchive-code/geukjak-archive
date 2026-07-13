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

type IdRow = {
  id: string;
};

type ReactionTable = 'likes' | 'bookmarks';
type ReactionColumn = 'post_id' | 'comment_id' | 'community_comment_id';

export type CreateCommunityPostInput = {
  boardType: BoardType;
  authorId: string;
  title: string;
  content: string;
  isAnonymous?: boolean;
};

async function findCommunityReaction(
  table: ReactionTable,
  column: ReactionColumn,
  targetId: string,
  userId: string,
) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq(column, targetId)
    .eq('user_id', userId)
    .limit(1)
    .returns<IdRow[]>();

  if (error) {
    throw error;
  }

  return data[0] ?? null;
}

async function toggleCommunityReaction(
  table: ReactionTable,
  column: ReactionColumn,
  targetId: string,
  userId: string,
) {
  if (!supabase) {
    throw unavailableError;
  }

  const existingReaction = await findCommunityReaction(table, column, targetId, userId);

  if (existingReaction) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', existingReaction.id);

    if (error) {
      throw error;
    }

    return false;
  }

  const { error } = await supabase.from(table).insert({
    [column]: targetId,
    user_id: userId,
  } as Record<string, string>);

  if (error) {
    throw error;
  }

  return true;
}

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

  async createPost(input: CreateCommunityPostInput) {
    if (!supabase) {
      throw unavailableError;
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        board_type: input.boardType,
        author_id: input.authorId,
        title: input.title,
        content: input.content,
        is_anonymous: input.isAnonymous ?? input.boardType === 'anonymous',
      })
      .select('id')
      .returns<IdRow[]>()
      .single();

    if (error) {
      throw error;
    }

    return data.id;
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
  },

  async createComment(postId: string, userId: string, content: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        author_id: userId,
        content,
      });

    if (error) {
      throw error;
    }
  },

  async updateComment(commentId: string, content: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('community_comments')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId);

    if (error) {
      throw error;
    }
  },

  async deleteComment(commentId: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('community_comments')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', commentId);

    if (error) {
      throw error;
    }
  },

  async isPostLiked(postId: string, userId: string) {
    const reaction = await findCommunityReaction('likes', 'post_id', postId, userId);
    return Boolean(reaction);
  },

  async togglePostLike(postId: string, userId: string) {
    return toggleCommunityReaction('likes', 'post_id', postId, userId);
  },

  async isPostBookmarked(postId: string, userId: string) {
    const reaction = await findCommunityReaction('bookmarks', 'post_id', postId, userId);
    return Boolean(reaction);
  },

  async togglePostBookmark(postId: string, userId: string) {
    return toggleCommunityReaction('bookmarks', 'post_id', postId, userId);
  },

  async isCommentLiked(commentId: string, userId: string) {
    const reaction = await findCommunityReaction('likes', 'community_comment_id', commentId, userId);
    return Boolean(reaction);
  },

  async toggleCommentLike(commentId: string, userId: string) {
    return toggleCommunityReaction('likes', 'community_comment_id', commentId, userId);
  },

  async getCommentLikeCount(commentId: string) {
    if (!supabase) {
      return 0;
    }

    const { count, error } = await supabase
      .from('likes')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('community_comment_id', commentId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  },

  async deletePost(postId: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('community_posts')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (error) {
      throw error;
    }
  },

  async adminListPosts() {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        title,
        board_type,
        created_at,
        profiles(display_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  }
};
