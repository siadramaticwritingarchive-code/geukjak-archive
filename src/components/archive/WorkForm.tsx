import { Save, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TextArea } from '../forms/TextArea';
import { TextInput } from '../forms/TextInput';
import type { CategoryRecord, WorkFormValues, WorkRecord } from '../../types/archive';

const currentYear = new Date().getFullYear();

const workSchema = z.object({
  title: z.string().min(1, '작품 제목을 입력해 주세요.').max(120, '제목은 120자 이하로 입력해 주세요.'),
  authorName: z.string().min(1, '작가명을 입력해 주세요.').max(80, '작가명은 80자 이하로 입력해 주세요.'),
  year: z
    .number()
    .int('연도는 정수로 입력해 주세요.')
    .min(1900, '1900년 이후 연도만 입력할 수 있습니다.')
    .max(currentYear + 5, '연도를 확인해 주세요.'),
  genre: z.string().min(1, '장르를 입력해 주세요.').max(60, '장르는 60자 이하로 입력해 주세요.'),
  synopsis: z.string().min(20, '시놉시스는 20자 이상 입력해 주세요.').max(2000, '시놉시스는 2000자 이하로 입력해 주세요.'),
  categoryId: z.string(),
  tagNames: z.string().max(240, '태그는 240자 이하로 입력해 주세요.'),
  visibility: z.enum(['draft', 'published', 'archived']),
  isPdfDownloadAllowed: z.boolean(),
  isFeatured: z.boolean(),
  posterFile: z.custom<FileList>().optional(),
  pdfFile: z.custom<FileList>().optional()
});

type WorkFormProps = {
  mode: 'create' | 'edit';
  categories: CategoryRecord[];
  initialWork?: WorkRecord;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (values: WorkFormValues) => Promise<void>;
};

function getDefaultValues(initialWork?: WorkRecord): WorkFormValues {
  return {
    title: initialWork?.title ?? '',
    authorName: initialWork?.author_name ?? '',
    year: initialWork?.year ?? currentYear,
    genre: initialWork?.genre ?? '',
    synopsis: initialWork?.synopsis ?? '',
    categoryId: initialWork?.category_id ?? '',
    tagNames: initialWork?.work_tags?.map((workTag) => workTag.tags?.name).filter(Boolean).join(', ') ?? '',
    visibility: initialWork?.visibility ?? 'draft',
    isPdfDownloadAllowed: initialWork?.is_pdf_download_allowed ?? false,
    isFeatured: initialWork?.is_featured ?? false
  };
}

export function WorkForm({
  mode,
  categories,
  initialWork,
  isSubmitting,
  error,
  onSubmit
}: WorkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: getDefaultValues(initialWork)
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <section className="rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm shadow-ink/5">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="작품 제목" error={errors.title?.message} {...register('title')} />
          <TextInput label="작가" error={errors.authorName?.message} {...register('authorName')} />
          <TextInput label="연도" type="number" error={errors.year?.message} {...register('year', { valueAsNumber: true })} />
          <TextInput label="장르" error={errors.genre?.message} {...register('genre')} />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">카테고리</span>
            <select
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
              {...register('categoryId')}
            >
              <option value="">카테고리 없음</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">공개 상태</span>
            <select
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
              {...register('visibility')}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
        <div className="mt-5">
          <TextArea
            label="시놉시스"
            error={errors.synopsis?.message}
            placeholder="작품의 줄거리와 분위기를 설명해 주세요."
            {...register('synopsis')}
          />
        </div>
        <div className="mt-5">
          <TextInput
            label="태그"
            error={errors.tagNames?.message}
            placeholder="쉼표로 구분: 가족, 독백, 블랙박스"
            {...register('tagNames')}
          />
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm shadow-ink/5">
        <h2 className="font-serif text-2xl">파일 업로드</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block rounded-lg border border-dashed border-ink/20 bg-ivory/60 p-5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <Upload size={16} /> 대표 이미지
            </span>
            <input className="mt-4 w-full text-sm" type="file" accept="image/png,image/jpeg,image/webp" {...register('posterFile')} />
          </label>
          <label className="block rounded-lg border border-dashed border-ink/20 bg-ivory/60 p-5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <Upload size={16} /> 작품 PDF
            </span>
            <input className="mt-4 w-full text-sm" type="file" accept="application/pdf" {...register('pdfFile')} />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white/50 p-4 text-sm">
            <input className="size-4 accent-gold" type="checkbox" {...register('isPdfDownloadAllowed')} />
            PDF 다운로드 허용
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white/50 p-4 text-sm">
            <input className="size-4 accent-gold" type="checkbox" {...register('isFeatured')} />
            추천 작품으로 표시
          </label>
        </div>
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        <Save size={16} />
        {isSubmitting ? '저장 중' : mode === 'create' ? '작품 등록' : '변경 저장'}
      </button>
    </form>
  );
}
