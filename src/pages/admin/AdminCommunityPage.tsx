import { Eye, EyeOff, Megaphone, Trash2 } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

const posts = [
  { id: 1, title: '작품 피드백 요청', author: '김민서', board: '자유게시판', status: '공개', createdAt: '2026.06.23' },
  { id: 2, title: '공연 일정 안내', author: '운영진', board: '공지', status: '공지', createdAt: '2026.06.22' }
];

export function AdminCommunityPage() {
  return (
    <AdminPageShell title="커뮤니티 관리" description="커뮤니티 게시글의 공개 상태와 공지사항 여부를 관리합니다." badge="COMMUNITY">
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{post.board}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#16233B]">{post.title}</h3>
                  <p className="mt-2 text-sm text-charcoal/70">작성자 {post.author}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><Eye size={14} className="mr-1 inline" />보기</button>
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><EyeOff size={14} className="mr-1 inline" />숨기기</button>
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><Trash2 size={14} className="mr-1 inline" />삭제</button>
                  <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"><Megaphone size={14} className="mr-1 inline" />공지사항 지정</button>
                </div>
              </div>
              <p className="mt-4 text-sm text-charcoal/60">상태 {post.status} · 등록일 {post.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
