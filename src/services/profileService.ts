import { supabase } from '../lib/supabase';
import type { UserProfile, UserRole } from '../types/user';

const unavailableError = new Error(
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
);

type UpdateProfileInput = {
  displayName: string;
  bio: string | null;
  avatarPath?: string | null;
};

export const profileService = {
  getProfile(userId: string) {
    if (!supabase) {
      return Promise.resolve({ data: null, error: unavailableError } as any);
    }

    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .returns<UserProfile[]>()
      .single();
  },

  async isDisplayNameAvailable(displayName: string, currentUserId?: string) {
    if (!supabase) {
      return false;
    }

    let query = supabase
      .from('profiles')
      .select('id')
      .eq('display_name', displayName)
      .limit(1);

    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.length === 0;
  },

  updateProfile(userId: string, input: UpdateProfileInput) {
    if (!supabase) {
      return Promise.resolve({ data: null, error: unavailableError } as any);
    }

    return supabase
      .from('profiles')
      .update({
        display_name: input.displayName,
        bio: input.bio,
        avatar_path: input.avatarPath
      })
      .eq('id', userId)
      .select('*')
      .returns<UserProfile[]>()
      .single();
  },

  async uploadAvatar(userId: string, file: File) {
    if (!supabase) {
      throw unavailableError;
    }

    const extension = file.name.split('.').pop() ?? 'webp';
    const filePath = `${userId}/avatar-${Date.now()}.${extension}`;

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    return data.path;
  },

  getAvatarPublicUrl(path: string | null) {
    if (!path || !supabase) {
      return null;
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(path);

    return data.publicUrl;
  },

  async listProfiles() {
    if (!supabase) {
      throw unavailableError;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as UserProfile[];
  },

  async updateRole(userId: string, role: UserRole) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  },

  async blockUser(userId: string, blocked: boolean) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        is_blocked: blocked
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  }
};