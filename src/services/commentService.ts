import { supabase } from '../lib/supabase';
import type {
  CommentRecord,
  CreateCommentInput,
  UpdateCommentInput,
} from '../types/comment';

const unavailableError = new Error(
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
);

export const commentService = {
  async getComments(workId: string): Promise<CommentRecord[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(
          id,
          display_name,
          avatar_path
        )
      `)
      .eq('work_id', workId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return (data ?? []) as unknown as CommentRecord[];
  },

  async createComment(
    input: CreateCommentInput,
  ) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('comments')
      .insert({
        work_id: input.work_id,
        author_id: input.author_id,
        content: input.content,
      });

    if (error) {
      throw error;
    }
  },

  async updateComment(
    commentId: string,
    input: UpdateCommentInput,
  ) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('comments')
      .update({
        content: input.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId);

    if (error) {
      throw error;
    }
  },

  async deleteComment(
    commentId: string,
  ) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('comments')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', commentId);

    if (error) {
      throw error;
    }
  },
    async toggleLike(
    commentId: string,
    userId: string,
  ) {
    if (!supabase) {
      throw unavailableError;
    }

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const likes = (data ?? []) as Array<{ id: string }>;

    if (likes.length > 0) {
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', likes[0].id);

      if (deleteError) {
        throw deleteError;
      }

      return false;
    }

    const { error: insertError } = await supabase
      .from('likes')
      .insert({
        comment_id: commentId,
        user_id: userId,
      });

    if (insertError) {
      throw insertError;
    }

    return true;
  },

  async isLiked(
    commentId: string,
    userId: string,
  ) {
    if (!supabase) {
      return false;
    }

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      throw error;
    }

    return (data ?? []).length > 0;
  },

  async getLikeCount(
    commentId: string,
  ) {
    if (!supabase) {
      return 0;
    }

    const { count, error } = await supabase
      .from('likes')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('comment_id', commentId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  },

  async getCommentCount(
    workId: string,
  ) {
    if (!supabase) {
      return 0;
    }

    const { count, error } = await supabase
      .from('comments')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('work_id', workId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }

    return count ?? 0;
  },
};
