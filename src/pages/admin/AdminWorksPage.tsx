import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Eye,
  PencilLine,
  Trash2,
  EyeOff
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { workService } from '../../services/workService';
import type { WorkRecord } from '../../types/archive';

export function AdminWorksPage() {
  const navigate = useNavigate();

  const [works, setWorks] = useState<WorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorks = async () => {
    const data = await workService.listPublishedWorks();
    setWorks(data);
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
        title="작품 관리"
        description="작품 정보를 불러오는 중입니다."
        badge="WORKS"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          작품 정보를 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="작품 관리"
      description="등록된 작품의 상태를 확인하고 관리합니다."
      badge="WORKS"
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="overflow-hidden rounded-[24px] border border-ink/10">
          <table className="min-w-full divide-y divide-ink/10 text-sm">
            <thead className="bg-[#F8F6F1] text-left text-charcoal/70">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  작품명
                </th>

                <th className="px-4 py-3 font-semibold">
                  작성자
                </th>

                <th className="px-4 py-3 font-semibold">
                  카테고리
                </th>

                <th className="px-4 py-3 font-semibold">
                  공개 범위
                </th>

                <th className="px-4 py-3 font-semibold">
                  액션
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-ink/10 bg-white">
              {works.map((work) => (
                <tr key={work.id}>
                  <td className="px-4 py-3 font-semibold text-[#16233B]">
                    {work.title}
                  </td>

                  <td className="px-4 py-3">
                    {work.author_name}
                  </td>

                  <td className="px-4 py-3">
                    {work.category}
                  </td>

                  <td className="px-4 py-3">
                    {work.visibility === 'published'
                      ? '공개'
                      : work.visibility === 'draft'
                      ? '임시저장'
                      : '보관'}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                                            <button
                        type="button"
                        onClick={() => navigate(`/archive/${work.id}`)}
                        className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"
                      >
                        <Eye
                          size={13}
                          className="mr-1 inline"
                        />
                        보기
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/archive/edit/${work.id}`)}
                        className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"
                      >
                        <PencilLine
                          size={13}
                          className="mr-1 inline"
                        />
                        수정
                      </button>

                      <button
                        type="button"
                        className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"
                      >
                        <EyeOff
                          size={13}
                          className="mr-1 inline"
                        />
                        {work.visibility === 'published'
                          ? '숨기기'
                          : '공개'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(work.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                      >
                        <Trash2
                          size={13}
                          className="mr-1 inline"
                        />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageShell>
  );
}