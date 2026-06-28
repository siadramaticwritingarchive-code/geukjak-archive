export type UserRole =
  | 'dramaticwriting'
  | 'other'
  | 'professor'
  | 'staff'
  | 'admin';
  


export type UserProfile = {
  id: string;
  email: string;

  display_name: string;

  student_id?: string;
  department?: string;
  student_year?: number;

  avatar_path: string | null;

  role: UserRole;

  bio: string | null;

  is_blocked: boolean;

  created_at: string;
  updated_at: string;
};
