import { BarChart3, Bell, FileText, MessageSquareText, Sparkles, Users2 } from 'lucide-react';

const summaryCards = [
  { label: '전체 회원 수', value: '248', icon: Users2 },
  { label: '등록 작품 수', value: '126', icon: FileText },
  { label: '추천 작품 수', value: '34', icon: Sparkles },
  { label: '게시글 수', value: '89', icon: MessageSquareText },
  { label: '댓글 수', value: '312', icon: MessageSquareText },
  { label: '오늘 가입한 회원', value: '7', icon: Users2 },
  { label: '오늘 등록된 작품', value: '4', icon: FileText },
  { label: '신고 접수 건수', value: '6', icon: Bell }
];

const chartBars = [42, 68, 54, 81, 72, 96];
const genreBars = [34, 27, 20, 19];

export function AdminDashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[24px] border border-ink/10 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-charcoal/70">{card.label}</p>
                <div className="rounded-full bg-[#F8F6F1] p-2 text-[#B08D57]"><Icon size={16} /></div>
              </div>
              <p className="mt-5 text-3xl font-semibold text-[#16233B]">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#16233B]">
            <BarChart3 size={18} className="text-[#B08D57]" />
            <h2 className="font-serif text-2xl">월별 활동</h2>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3">
            {chartBars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-[16px] bg-gradient-to-t from-[#16233B] to-[#B08D57]" style={{ height: `${height}%` }} />
                <span className="text-xs text-charcoal/60">{['1월','2월','3월','4월','5월','6월'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#16233B]">
            <Sparkles size={18} className="text-[#B08D57]" />
            <h2 className="font-serif text-2xl">인기 카테고리</h2>
          </div>
          <div className="mt-6 space-y-4">
            {['시나리오', '희곡', '연극 비평', '드라마'].map((genre, index) => (
              <div key={genre}>
                <div className="mb-2 flex items-center justify-between text-sm text-charcoal/70">
                  <span>{genre}</span>
                  <span>{genreBars[index]}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#F8F6F1]">
                  <div className="h-2 rounded-full bg-gradient-to-r from-[#16233B] to-[#B08D57]" style={{ width: `${genreBars[index]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
