export type WorkSummary = {
  id: string;
  title: string;
  author: string;
  author_name?: string;
  year: number;
  genre: string;
  synopsis?: string;
  poster_path?: string | null;
  script_pdf_path?: string | null;
  is_pdf_download_allowed?: boolean;
  is_featured?: boolean;
  tags: string[];
  views: number;
  view_count?: number;
  likes: number;
  like_count?: number;
  bookmarks: number;
  bookmark_count?: number;
  created_at?: string;
  visibility?: 'draft' | 'published' | 'archived';
};

export type WorkSort = 'latest' | 'oldest' | 'views' | 'likes';

export type WorkRecord = {
  id: string;
  title: string;
  author_id: string | null;
  author_name: string;
  year: number;
  genre: string;
  synopsis: string;
  category_id: string | null;
  poster_path: string | null;
  script_pdf_path: string | null;
  is_pdf_download_allowed: boolean;
  visibility: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  categories?: CategoryRecord | null;
  work_tags?: Array<{ tags: TagRecord | null }>;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type TagRecord = {
  id: string;
  name: string;
  slug: string;
};

export type WorkFormValues = {
  title: string;
  authorName: string;
  year: number;
  genre: string;
  synopsis: string;
  categoryId: string;
  tagNames: string;
  visibility: 'draft' | 'published' | 'archived';
  isPdfDownloadAllowed: boolean;
  isFeatured: boolean;
  posterFile?: FileList;
  pdfFile?: FileList;
};
