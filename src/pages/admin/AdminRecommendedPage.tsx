import { useEffect, useState } from 'react';
import {
  Crown,
  PencilLine,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AdminPageShell } from './AdminPageShell';
import { workService } from '../../services/workService';
import type { WorkRecord } from '../../types/archive';

export function AdminRecommendedPage() {
  const navigate = useNavigate();

  const [works, setWorks] = useState<WorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorks = async () => {
    const data = await workService.listPublishedWorks();

    setWorks(
      data.filter((work) => work.is_featured)
    );
  };

  useEffect(() => {
    loadWorks().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    await workService.deleteWork(id);
    await loadWorks();
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="추천 작품 관리"
        description="추천 작품을 불러오는 중입니다."
        badge="RECOMMENDED"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          추천 작품을 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="추천 작품 관리"
      description="메인 페이지에 노출될 추천 작품을 관리합니다."
      badge="RECOMMENDED"
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="space-y-4">
          {works.map((work) => (
            <div
              key={work.id}
              className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">
                    {work.category}
                  </p>

                  <h3 className="mt-2 font-serif text-2xl text-[#16233B]">
                    {work.title}
                  </h3>

                  <p className="mt-2 text-sm text-charcoal/70">
                    작성자 {work.author_name}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                                    <button
                    type="button"
                    onClick={() =>
                      navigate(`/archive/edit/${work.id}`)
                    }
                    className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"
                  >
                    <PencilLine
                      size={14}
                      className="mr-1 inline"
                    />
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(work.id)
                    }
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    <Trash2
                      size={14}
                      className="mr-1 inline"
                    />
                    삭제
                  </button>

                  <button
                    type="button"
                    className="rounded-full bg-[#16233B] px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Crown
                      size={14}
                      className="mr-1 inline"
                    />
                    대표 추천
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-charcoal/60">
                등록일{' '}
                {new Date(
                  work.created_at
                ).toLocaleDateString('ko-KR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
                