import { Save, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TextArea } from '../forms/TextArea';
import { TextInput } from '../forms/TextInput';
import type { WorkFormValues, WorkRecord } from '../../types/archive';

const currentYear = new Date().getFullYear();

const categories = [
  '희곡',
  '영화 시나리오',
  '드라마',
  '웹드라마',
  '웹소설',
  '소설',
  '뮤지컬',
  '기타'
];

const workSchema = z.object({
  title: z.string().min(1, '작품 제목을 입력해주세요.'),
  authorName: z.string().min(1, '작가명을 입력해주세요.'),
  year: z.number().min(1900).max(currentYear + 5),
 category: z.string().min(1, '카테고리를 선택해주세요.'),
 genre: z.string().min(1, '장르를 입력해주세요.'),
  logline: z.string().min(10, '로그라인을 입력해주세요.'),
  synopsis: z.string().min(20, '작품 소개를 입력해주세요.'),
  tagNames: z.string(),
  visibility: z.enum(['draft', 'published', 'archived']),
  isPdfDownloadAllowed: z.boolean(),
  isFeatured: z.boolean(),
  agreeCopyright: z.boolean(),
  posterFile: z.custom<FileList>().optional(),
  pdfFile: z.custom<FileList>().optional()
});

type WorkFormProps = {
  mode: 'create' | 'edit';
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
    category: initialWork?.category ?? '',
    genre: initialWork?.genre ?? '',
    logline: initialWork?.logline ?? '',
    synopsis: initialWork?.synopsis ?? '',
    tagNames:
      initialWork?.work_tags
        ?.map((v) => v.tags?.name)
        .filter(Boolean)
        .join(', ') ?? '',
    visibility: initialWork?.visibility ?? 'draft',
    isPdfDownloadAllowed:
      initialWork?.is_pdf_download_allowed ?? false,
    isFeatured: initialWork?.is_featured ?? false,
    agreeCopyright: false
  };
}

export function WorkForm({
  mode,
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
    <form
      className="space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >

      <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">

        <h2 className="font-serif text-3xl text-[#16233B]">
          기본 정보
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <TextInput
            label="작품 제목"
            error={errors.title?.message}
            {...register('title')}
          />

          <TextInput
            label="작가명"
            error={errors.authorName?.message}
            {...register('authorName')}
          />

          <TextInput
            label="창작 연도"
            type="number"
            error={errors.year?.message}
            {...register('year', {
              valueAsNumber: true
            })}
          />

          
           <label>
  <span className="text-sm font-semibold">
    카테고리
  </span>

  <select
    className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3"
    {...register('category')}
  >
    {categories.map((category) => (
      <option
        key={category}
        value={category}
      >
        {category}
      </option>
    ))}
  </select>
</label>

        </div>


        <div className="mt-6"><TextInput
      label="장르"
      placeholder="예) 로맨스 판타지, 심리 스릴러, 청춘"
      error={errors.genre?.message}
      {...register('genre')}
      />
      
      </div>
       

        <div className="mt-6">

          <TextInput
            label="태그"
            placeholder="예) 성장, 청춘, 가족"
            error={errors.tagNames?.message}
            {...register('tagNames')}
          />

          <p className="mt-2 text-sm text-charcoal/60">
            쉼표(,)로 구분하여 입력해주세요.
          </p>

        </div>

        <div className="mt-6">

          <TextInput
            label="로그라인"
            placeholder="작품을 한 문장으로 소개해주세요."
            error={errors.logline?.message}
            {...register('logline')}
          />

        </div>

        <div className="mt-6">

          <TextArea
            label="작품 소개"
            placeholder="작품의 줄거리와 특징을 입력해주세요."
            error={errors.synopsis?.message}
            {...register('synopsis')}
          />

        </div>

      </section>
            <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">

        <h2 className="font-serif text-3xl text-[#16233B]">
          파일 업로드
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <label className="rounded-2xl border-2 border-dashed border-[#D8C7A3] p-6 transition hover:border-[#B08D57]">

            <div className="flex items-center gap-2 font-semibold">
              <Upload size={18} />
              대표 이미지
            </div>

            <p className="mt-2 text-sm text-charcoal/60">
              JPG, PNG, WEBP
            </p>

            <input
              className="mt-5 w-full"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              {...register('posterFile')}
            />

          </label>

          <label className="rounded-2xl border-2 border-dashed border-[#D8C7A3] p-6 transition hover:border-[#B08D57]">

            <div className="flex items-center gap-2 font-semibold">
              <Upload size={18} />
              작품 PDF
            </div>

            <p className="mt-2 text-sm text-charcoal/60">
              PDF 파일만 업로드 가능합니다.
            </p>

            <input
              className="mt-5 w-full"
              type="file"
              accept="application/pdf"
              {...register('pdfFile')}
            />

          </label>

        </div>

      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">

        <h2 className="font-serif text-3xl text-[#16233B]">
          공개 설정
        </h2>

        <div className="mt-8 space-y-4">

          <label className="flex items-center gap-3">

            <input
              type="radio"
              value="published"
              {...register('visibility')}
            />

            <span>공개</span>

          </label>

          <label className="flex items-center gap-3">

            <input
              type="radio"
              value="draft"
              {...register('visibility')}
            />

            <span>임시저장</span>

          </label>

          <label className="flex items-center gap-3">

            <input
              type="radio"
              value="archived"
              {...register('visibility')}
            />

            <span>비공개</span>

          </label>

        </div>

        <div className="mt-8 space-y-4">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              {...register('isPdfDownloadAllowed')}
            />

            <span>PDF 다운로드 허용</span>

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              {...register('isFeatured')}
            />

            <span>추천 작품으로 등록</span>

          </label>

        </div>

      </section>

      <section className="rounded-3xl border border-ink/10 bg-[#F8F6F1] p-8">

        <label className="flex items-start gap-3">

          <input
            className="mt-1"
            type="checkbox"
            {...register('agreeCopyright')}
          />

          <span className="text-sm leading-7">

            본인은 해당 작품의 저작권을 보유하고 있으며,
            극작과 아카이브에 게시되는 것에 동의합니다.
            또한 타인의 저작권을 침해하지 않았음을 확인합니다.

          </span>

        </label>

        {errors.agreeCopyright && (

          <p className="mt-3 text-sm text-red-600">
            {errors.agreeCopyright.message}
          </p>

        )}

      </section>

      {error && (

        <p className="text-sm text-red-600">
          {error}
        </p>

      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-[#16233B] py-4 text-lg font-semibold text-white transition hover:bg-[#243858] disabled:opacity-50"
      >

        <Save className="mr-2 inline" size={18} />

        {isSubmitting
          ? '저장 중...'
          : mode === 'create'
            ? '작품 등록'
            : '수정 완료'}

      </button>

    </form>
  );
}
