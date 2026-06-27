export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      users: GenericTable;
      works: GenericTable;
      comments: GenericTable;
      replies: GenericTable;
      likes: GenericTable;
      bookmarks: GenericTable;
      categories: GenericTable;
      tags: GenericTable;
      work_tags: GenericTable;
      community_posts: GenericTable;
      community_comments: GenericTable;
      notifications: GenericTable;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'student' | 'faculty' | 'admin';
      work_visibility: 'draft' | 'published' | 'archived';
      community_board_type: 'free' | 'questions' | 'announcements' | 'anonymous';
      report_status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
      notification_type: 'comment' | 'reply' | 'like' | 'bookmark' | 'announcement' | 'system';
    };
    CompositeTypes: Record<string, never>;
  };
};
