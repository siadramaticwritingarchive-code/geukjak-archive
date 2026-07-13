export type CommentRecord = {
  id: string;

  work_id: string;

  author_id: string;

  content: string;

  created_at: string;

  updated_at: string | null;

  deleted_at: string | null;

  profiles: {
    id: string;
    display_name: string;
    avatar_path: string | null;
  } | null;
};

export type CreateCommentInput = {
  work_id: string;
  author_id: string;
  content: string;
};

export type UpdateCommentInput = {
  content: string;
};
