import { Crown, PencilLine, Trash2 } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

const recommendations = [
  { id: 1, title: '비밀의 문장', author: '정민호', genre: '웹소설', featured: true, createdAt: '2026.06.14' },
  { id: 2, title: '우리는 서로의 빛', author: '이서진', genre: '영화', featured: false, createdAt: '2026.06.12' }
];

export function AdminRecommendedPage() {
  return (
    <AdminPageShell title="추천 작품 관리" description="메인 페이지에 노출될 추천 작품을 관리합니다." badge="RECOMMENDED">
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="space-y-4">
          {recommendations.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{item.genre}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#16233B]">{item.title}</h3>
                  <p className="mt-2 text-sm text-charcoal/70">작성자 {item.author}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><PencilLine size={14} className="mr-1 inline" />수정</button>
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><Trash2 size={14} className="mr-1 inline" />삭제</button>
                  <button type="button" className={`rounded-full px-3 py-2 text-sm font-semibold ${item.featured ? 'bg-[#16233B] text-white' : 'border border-ink/10 bg-white text-[#16233B]'}`}><Crown size={14} className="mr-1 inline" />{item.featured ? '대표 추천' : '대표 추천 지정'}</button>
                </div>
              </div>
              <p className="mt-4 text-sm text-charcoal/60">등록일 {item.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
