import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Image as ImageIcon, Save, Send } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';

const boardOptions = ['공지사항', '공연 홍보', '질문', '구인 · 구직', '자유게시판', '창작 고민'];

export function CommunityWritePage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState('자유게시판');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Community"
        title="글쓰기"
        description="커뮤니티에 새로운 글을 작성하는 UI입니다. 이미지 첨부와 임시 저장은 플레이스홀더 흐름으로 구성됩니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">게시판 선택</span>
              <select value={board} onChange={(event) => setBoard(event.target.value)} className="form-field w-full">
                {boardOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">제목</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="form-field w-full" placeholder="제목을 입력해 주세요." />
            </label>
            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#16233B]">
                <ImageIcon size={16} className="text-[#B08D57]" /> 이미지 첨부
              </div>
              <div className="mt-4 flex h-36 items-center justify-center rounded-[20px] border border-dashed border-ink/15 bg-white/80 text-charcoal/60">
                <div className="text-center">
                  <ImageIcon size={24} className="mx-auto text-[#B08D57]" />
                  <p className="mt-2 text-sm">이미지 업로드 UI (미연결)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">내용</span>
              <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={12} className="form-field min-h-80 w-full resize-none" placeholder="내용을 입력해 주세요." />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
                <Save size={16} /> 임시 저장
              </button>
              <button type="button" onClick={() => navigate('/community')} className="inline-flex items-center gap-2 rounded-full bg-[#16233B] px-4 py-2 text-sm font-semibold text-white">
                <Send size={16} /> 등록하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
