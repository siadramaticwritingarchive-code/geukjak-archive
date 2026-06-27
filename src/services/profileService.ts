import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types/user';

type UpdateProfileInput = {
  displayName: string;
  bio: string | null;
  avatarPath?: string | null;
};

export const profileService = {
  getProfile(userId: string) {
    return supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .returns<UserProfile[]>()
      .single();
  },

  async isDisplayNameAvailable(displayName: string, currentUserId?: string) {
    let query = supabase
      .from('users')
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
    return supabase
      .from('users')
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
    if (!path) {
      return null;
    }

    const { data } = supabase.storage.from('profile-images').getPublicUrl(path);
    return data.publicUrl;
  }
};
