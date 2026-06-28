import { Eye, PencilLine, Trash2, EyeOff } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

const works = [
  { id: 1, title: '도시의 마지막 빛', author: '이효정', genre: '시나리오', visibility: '전체 공개', views: 842, likes: 48, createdAt: '2026.06.20' },
  { id: 2, title: '해질 무렵의 연극', author: '김서윤', genre: '희곡', visibility: '운영진 공개', views: 612, likes: 37, createdAt: '2026.06.18' }
];

export function AdminWorksPage() {
  return (
    <AdminPageShell title="작품 관리" description="등록된 작품의 상태를 확인하고 노출 여부를 관리합니다." badge="WORKS">
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="overflow-hidden rounded-[24px] border border-ink/10">
          <table className="min-w-full divide-y divide-ink/10 text-sm">
            <thead className="bg-[#F8F6F1] text-left text-charcoal/70">
              <tr>
                <th className="px-4 py-3 font-semibold">작품명</th>
                <th className="px-4 py-3 font-semibold">작성자</th>
                <th className="px-4 py-3 font-semibold">카테고리</th>
                <th className="px-4 py-3 font-semibold">공개 범위</th>
                <th className="px-4 py-3 font-semibold">조회수</th>
                <th className="px-4 py-3 font-semibold">좋아요</th>
                <th className="px-4 py-3 font-semibold">등록일</th>
                <th className="px-4 py-3 font-semibold">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-white">
              {works.map((work) => (
                <tr key={work.id}>
                  <td className="px-4 py-3 font-semibold text-[#16233B]">{work.title}</td>
                  <td className="px-4 py-3">{work.author}</td>
                  <td className="px-4 py-3">{work.genre}</td>
                  <td className="px-4 py-3">{work.visibility}</td>
                  <td className="px-4 py-3">{work.views}</td>
                  <td className="px-4 py-3">{work.likes}</td>
                  <td className="px-4 py-3">{work.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><Eye size={13} className="inline mr-1" />보기</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><PencilLine size={13} className="inline mr-1" />수정</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><EyeOff size={13} className="inline mr-1" />숨기기</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><Trash2 size={13} className="inline mr-1" />삭제</button>
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
