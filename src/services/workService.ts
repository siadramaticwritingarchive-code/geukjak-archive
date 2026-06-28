import { supabase } from '../lib/supabase';
import type {
  CategoryRecord,
  TagRecord,
  WorkRecord,
  WorkSort
} from '../types/archive';

export type WorkListFilters = {
  search?: string;
  categoryId?: string;
  sort?: WorkSort;
};

export type WorkMutationInput = {
  title: string;
  authorName: string;
  year: number;
  category: string;
  genre: string;
  logline: string;
  synopsis: string;
  tagNames: string[];
  visibility: 'draft' | 'published' | 'archived';
  isPdfDownloadAllowed: boolean;
  isFeatured: boolean;
  posterFile?: File | null;
  pdfFile?: File | null;
  userId: string;
};

const unavailableError = new Error(
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
);

const sortMap: Record<WorkSort, { column: string; ascending: boolean }> = {
  latest: { column: 'created_at', ascending: false },
  oldest: { column: 'created_at', ascending: true },
  views: { column: 'view_count', ascending: false },
  likes: { column: 'like_count', ascending: false }
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueTagNames(tagNames: string[]) {
  return Array.from(
    new Set(tagNames.map((tagName) => tagName.trim()).filter(Boolean)),
  );
}

async function uploadWorkAsset(bucket: 'work-images' | 'work-pdfs', workId: string, file: File) {
  if (!supabase) {
    throw unavailableError;
  }

  const extension = file.name.split('.').pop() ?? (bucket === 'work-pdfs' ? 'pdf' : 'webp');
  const filePath = `${workId}/${bucket}-${Date.now()}.${extension}`;

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  });

  if (error) {
    throw error;
  }

  return data.path;
}

async function syncWorkTags(workId: string, tagNames: string[]) {
  if (!supabase) {
    throw unavailableError;
  }

  const names = uniqueTagNames(tagNames);

  await supabase.from('work_tags').delete().eq('work_id', workId);

  if (names.length === 0) {
    return;
  }

  const tagRows = names.map((name) => ({
    name,
    slug: slugify(name)
  }));

  const { data: tags, error: tagError } = await supabase
    .from('tags')
    .upsert(tagRows, { onConflict: 'slug' })
    .select('id,name,slug')
    .returns<TagRecord[]>();

  if (tagError) {
    throw tagError;
  }

  const { error: joinError } = await supabase.from('work_tags').insert(
    tags.map((tag) => ({
      work_id: workId,
      tag_id: tag.id
    })),
  );

  if (joinError) {
    throw joinError;
  }
}

export const workService = {
  async listPublishedWorks(filters: WorkListFilters = {}) {
    if (!supabase) {
      return [];
    }

    const sort = sortMap[filters.sort ?? 'latest'];

    let query = supabase
      .from('works')
      .select('*, categories(id,name,slug,description), work_tags(tags(id,name,slug))')
      .eq('visibility', 'published')
      .order(sort.column, { ascending: sort.ascending });

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,author_name.ilike.%${filters.search}%`,
      );
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query.returns<WorkRecord[]>();

    if (error) {
      throw error;
    }

    if (!filters.search) {
      return data;
    }

    const search = filters.search.toLowerCase();
    return data.filter((work) => {
      const tagNames = work.work_tags?.map((workTag) => workTag.tags?.name.toLowerCase() ?? '') ?? [];
      return (
        work.title.toLowerCase().includes(search)
        || work.author_name.toLowerCase().includes(search)
        || tagNames.some((tagName) => tagName.includes(search))
      );
    });
  },

  async listCategories() {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id,name,slug,description')
      .order('name')
      .returns<CategoryRecord[]>();

    if (error) {
      throw error;
    }

    return data;
  },

  async getWorkById(workId: string) {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('works')
      .select('*, categories(id,name,slug,description), work_tags(tags(id,name,slug))')
      .eq('id', workId)
      .returns<WorkRecord[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async createWork(input: WorkMutationInput) {
    if (!supabase) {
      throw unavailableError;
    }

    const { data: createdWork, error } = await supabase
      .from('works')
      .insert({
        title: input.title,
        author_name: input.authorName,
        year: input.year,
        genre: input.genre,
        category: input.category,
        logline: input.logline,
        synopsis: input.synopsis,
        visibility: input.visibility,
        is_pdf_download_allowed: input.isPdfDownloadAllowed,
        is_featured: input.isFeatured,
        created_by: input.userId,
        updated_by: input.userId,
        published_at: input.visibility === 'published' ? new Date().toISOString() : null
      })
      .select('id')
      .returns<Array<{ id: string }>>()
      .single();
console.log(error);
alert(error?.message ?? 'insert 성공');

    if (error) {
      throw error;
    }

    const posterPath = input.posterFile
      ? await uploadWorkAsset('work-images', createdWork.id, input.posterFile)
      : null;
    const pdfPath = input.pdfFile
      ? await uploadWorkAsset('work-pdfs', createdWork.id, input.pdfFile)
      : null;

    if (posterPath || pdfPath) {
      const { error: assetError } = await supabase
        .from('works')
        .update({
          poster_path: posterPath,
          script_pdf_path: pdfPath
        })
        .eq('id', createdWork.id);

      if (assetError) {
        throw assetError;
      }
    }

    await syncWorkTags(createdWork.id, input.tagNames);
    return createdWork.id;
  },

  async updateWork(workId: string, input: WorkMutationInput) {
    if (!supabase) {
      throw unavailableError;
    }

    const posterPath = input.posterFile
      ? await uploadWorkAsset('work-images', workId, input.posterFile)
      : undefined;
    const pdfPath = input.pdfFile
      ? await uploadWorkAsset('work-pdfs', workId, input.pdfFile)
      : undefined;

    const { error } = await supabase
      .from('works')
      .update({
        title: input.title,
        author_name: input.authorName,
        year: input.year,
        category: input.category,
        genre: input.genre,
        synopsis: input.synopsis,
        visibility: input.visibility,
        is_pdf_download_allowed: input.isPdfDownloadAllowed,
        is_featured: input.isFeatured,
        updated_by: input.userId,
        published_at: input.visibility === 'published' ? new Date().toISOString() : null,
        ...(posterPath ? { poster_path: posterPath } : {}),
        ...(pdfPath ? { script_pdf_path: pdfPath } : {})
      })
      .eq('id', workId);

    if (error) {
      throw error;
    }

    await syncWorkTags(workId, input.tagNames);
  },

  async deleteWork(workId: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase.from('works').delete().eq('id', workId);

    if (error) {
      throw error;
    }
  },

  incrementViewCount(workId: string) {
    if (!supabase) {
      return Promise.resolve({ data: null, error: unavailableError } as any);
    }

    return supabase.rpc('increment_work_view_count', { work_id: workId });
  },

  async isBookmarked(workId: string, userId: string) {
    if (!supabase) {
      return false;
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('work_id', workId)
      .eq('user_id', userId)
      .limit(1)
      .returns<Array<{ id: string }>>();

    if (error) {
      throw error;
    }

    return data.length > 0;
  },

  async toggleBookmark(workId: string, userId: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('work_id', workId)
      .eq('user_id', userId)
      .limit(1)
      .returns<Array<{ id: string }>>();

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', data[0].id);

      if (deleteError) {
        throw deleteError;
      }

      return false;
    }

    const { error: insertError } = await supabase.from('bookmarks').insert({
      work_id: workId,
      user_id: userId
    });

    if (insertError) {
      throw insertError;
    }

    return true;
  },

  getPosterUrl(path: string | null) {
    if (!path || !supabase) {
      return null;
    }

    const { data } = supabase.storage.from('work-images').getPublicUrl(path);
    return data.publicUrl;
  },

  async getPdfUrl(path: string | null) {
    if (!path || !supabase) {
      return null;
    }

    const { data, error } = await supabase.storage
      .from('work-pdfs')
      .createSignedUrl(path, 60 * 10);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  }
};
