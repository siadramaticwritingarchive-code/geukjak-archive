import { FileText, Save, Send, Trash2, PencilLine } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

export function AdminNoticesPage() {
  return (
    <AdminPageShell title="공지 관리" description="공지사항을 작성하고 임시 저장, 게시, 수정, 삭제까지 관리합니다." badge="NOTICES">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#16233B]">
            <FileText size={18} className="text-[#B08D57]" />
            <h2 className="font-serif text-2xl">공지 작성</h2>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-[#16233B]">
              제목
              <input className="mt-2 w-full rounded-2xl border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm outline-none" placeholder="공지 제목을 입력하세요." />
            </label>
            <label className="block text-sm font-medium text-[#16233B]">
              내용
              <textarea className="mt-2 min-h-48 w-full rounded-2xl border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm outline-none" placeholder="공지 내용을 입력하세요." />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"><Save size={14} className="mr-1 inline" />임시 저장</button>
              <button type="button" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"><Send size={14} className="mr-1 inline" />게시</button>
              <button type="button" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"><PencilLine size={14} className="mr-1 inline" />수정</button>
              <button type="button" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"><Trash2 size={14} className="mr-1 inline" />삭제</button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-[#16233B]">최근 공지</h2>
          <div className="mt-6 space-y-3">
            {[{ title: '6월 전공 워크숍 안내', date: '2026.06.27' }, { title: '커뮤니티 이용 규칙 업데이트', date: '2026.06.20' }].map((item) => (
              <div key={item.title} className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-4">
                <p className="font-semibold text-[#16233B]">{item.title}</p>
                <p className="mt-2 text-sm text-charcoal/60">작성일 {item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
