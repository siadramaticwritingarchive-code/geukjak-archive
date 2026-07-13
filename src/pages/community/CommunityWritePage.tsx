import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Image as ImageIcon, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { communityService } from '../../services/community';
import type { BoardType } from '../../types/community';

const boardOptions: Array<{ label: string; value: BoardType }> = [
  { label: '공지사항', value: 'announcements' },
  { label: '공연 홍보', value: 'free' },
  { label: '질문', value: 'questions' },
  { label: '구인 · 구직', value: 'free' },
  { label: '자유게시판', value: 'free' },
  { label: '창작 고민', value: 'anonymous' },
];

export function CommunityWritePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [board, setBoard] = useState<BoardType>('free');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.warning('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const postId = await communityService.createPost({
        boardType: board,
        authorId: user.id,
        title: title.trim(),
        content: content.trim(),
      });

      toast.success('게시글이 등록되었습니다.');
      navigate(`/community/${postId}`);
    } catch {
      toast.error('게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Community"
        title="글쓰기"
        description="커뮤니티에 새로운 글을 작성합니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">게시판 선택</span>
              <select value={board} onChange={(event) => setBoard(event.target.value as BoardType)} className="form-field w-full">
                {boardOptions.map((option) => (
                  <option key={`${option.label}-${option.value}`} value={option.value}>{option.label}</option>
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
                  <p className="mt-2 text-sm">이미지 첨부는 게시글 등록 후 관리할 수 있습니다.</p>
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
              <button type="button" onClick={() => void handleSubmit()} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-[#16233B] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                <Send size={16} /> 등록하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
