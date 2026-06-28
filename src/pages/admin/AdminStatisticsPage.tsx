import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

const bars = [48, 62, 69, 74, 81, 90];
const pieValues = [35, 25, 20, 20];

export function AdminStatisticsPage() {
  return (
    <AdminPageShell title="통계" description="작품 등록, 회원 가입, 게시글 작성, 인기 카테고리와 월별 활동을 확인합니다." badge="STATISTICS">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#16233B]">
            <LineChart size={18} className="text-[#B08D57]" />
            <h2 className="font-serif text-2xl">작품 등록 추이</h2>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {bars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-[16px] bg-gradient-to-t from-[#16233B] to-[#B08D57]" style={{ height: `${height}%` }} />
                <span className="text-xs text-charcoal/60">{['Jan','Feb','Mar','Apr','May','Jun'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#16233B]">
            <PieChart size={18} className="text-[#B08D57]" />
            <h2 className="font-serif text-2xl">인기 카테고리</h2>
          </div>
          <div className="mt-6 flex h-48 items-center justify-center rounded-[24px] border border-ink/10 bg-[#F8F6F1]">
            <div className="flex gap-2">
              {pieValues.map((value, index) => (
                <div key={index} className="h-24 w-10 rounded-full" style={{ background: ['#16233B', '#B08D57', '#C9A86A', '#E4D4B6'][index], height: `${value * 1.8}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
