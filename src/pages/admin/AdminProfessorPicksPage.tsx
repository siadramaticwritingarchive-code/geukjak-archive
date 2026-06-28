import { Crown, Sparkles, ToggleLeft } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

const picks = [
  { id: 1, title: '비밀의 문장', featured: true, visible: true },
  { id: 2, title: '우리는 서로의 빛', featured: false, visible: false }
];

export function AdminProfessorPicksPage() {
  return (
    <AdminPageShell title="교수 추천 관리" description="교수 추천 작품을 등록하고 메인 노출과 대표 추천 여부를 관리합니다." badge="PROFESSOR PICKS">
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#16233B]">
          <Sparkles size={18} className="text-[#B08D57]" />
          <h2 className="font-serif text-2xl">추천 작품 목록</h2>
        </div>

        <div className="mt-6 space-y-4">
          {picks.map((pick) => (
            <div key={pick.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl text-[#16233B]">{pick.title}</h3>
                  <p className="mt-2 text-sm text-charcoal/70">{pick.visible ? '메인 페이지 노출 중' : '메인 페이지 비노출'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><ToggleLeft size={14} className="mr-1 inline" />{pick.visible ? '노출 중지' : '메인 노출'}</button>
                  <button type="button" className={`rounded-full px-3 py-2 text-sm font-semibold ${pick.featured ? 'bg-[#16233B] text-white' : 'border border-ink/10 bg-white text-[#16233B]'}`}><Crown size={14} className="mr-1 inline" />{pick.featured ? '대표 추천' : '대표 추천 지정'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
