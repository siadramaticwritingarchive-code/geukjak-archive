export type UserRole = 'student' | 'faculty' | 'admin';

export type UserProfile = {
  id: string;
  email: string;
  display_name: string;
  avatar_path: string | null;
  role: UserRole;
  bio: string | null;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
};
