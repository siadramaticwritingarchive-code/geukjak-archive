import { useEffect, useState } from 'react';
import {
  Crown,
  Sparkles,
  ToggleLeft
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { workService } from '../../services/workService';
import type { WorkRecord } from '../../types/archive';

export function AdminProfessorPicksPage() {
  const [works, setWorks] = useState<WorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorks = async () => {
    const data =
      await workService.listPublishedWorks();

    setWorks(data);
  };

  useEffect(() => {
    loadWorks().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleFeatured = async (
    work: WorkRecord
  ) => {
    await workService.updateWork(work.id, {
      title: work.title,
      authorName: work.author_name,
      year: work.year,
      category: work.category,
      genre: work.genre,
      logline: work.logline,
      synopsis: work.synopsis,
      tagNames:
        work.work_tags?.map(
          (tag) => tag.tags?.name ?? ''
        ) ?? [],
      visibility: work.visibility,
      isPdfDownloadAllowed:
        work.is_pdf_download_allowed,
      isFeatured: !work.is_featured,
      userId: work.updated_by ?? '',
      posterFile: null,
      pdfFile: null
    });

    await loadWorks();
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="교수 추천 관리"
        description="불러오는 중..."
        badge="PROFESSOR PICKS"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          작품을 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="교수 추천 관리"
      description="교수 추천 작품을 관리합니다."
      badge="PROFESSOR PICKS"
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">

        <div className="flex items-center gap-2 text-[#16233B]">
          <Sparkles
            size={18}
            className="text-[#B08D57]"
          />

          <h2 className="font-serif text-2xl">
            추천 작품 목록
          </h2>
        </div>

        <div className="mt-6 space-y-4">

          {works.map((work) => (
            <div
              key={work.id}
              className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5"
            >
                           <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <h3 className="font-serif text-2xl text-[#16233B]">
                    {work.title}
                  </h3>

                  <p className="mt-2 text-sm text-charcoal/70">
                    {work.is_featured
                      ? '교수 추천 작품'
                      : '일반 작품'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"
                  >
                    <ToggleLeft
                      size={14}
                      className="mr-1 inline"
                    />

                    {work.visibility === 'published'
                      ? '공개 중'
                      : '비공개'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFeatured(work)
                    }
                    className={`rounded-full px-3 py-2 text-sm font-semibold ${
                      work.is_featured
                        ? 'bg-[#16233B] text-white'
                        : 'border border-ink/10 bg-white text-[#16233B]'
                    }`}
                  >
                    <Crown
                      size={14}
                      className="mr-1 inline"
                    />

                    {work.is_featured
                      ? '대표 추천'
                      : '대표 추천 지정'}
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </AdminPageShell>
  );
} 
            