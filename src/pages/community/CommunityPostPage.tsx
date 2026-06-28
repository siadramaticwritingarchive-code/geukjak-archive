import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Flag, Heart, MessageCircle, PencilLine, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';

type CommentItem = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Array<{ id: number; author: string; content: string; createdAt: string }>;
};

type PostItem = {
  id: string;
  board: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  body: string;
  commentsList: CommentItem[];
  notice?: boolean;
};

const posts: PostItem[] = [
  {
    id: '1',
    board: '공지사항',
    title: '6월 전공 워크숍 일정 안내',
    author: '관리자',
    createdAt: '2026.06.25',
    views: 218,
    likes: 24,
    comments: 7,
    body: '이번 달 전공 워크숍은 작품 발표와 피드백 세션으로 구성됩니다. 참여 신청은 커뮤니티 글쓰기에서 가능합니다.',
    notice: true,
    commentsList: [
      { id: 1, author: '이효정', content: '일정 확인했습니다. 감사합니다.', createdAt: '3시간 전', likes: 2, replies: [] }
    ]
  },
  {
    id: '2',
    board: '공연 홍보',
    title: '극작과 학생회 공연 홍보 요청',
    author: '윤서',
    createdAt: '2026.06.24',
    views: 132,
    likes: 15,
    comments: 4,
    body: '연극 실습 발표회에 참여할 학생들을 찾고 있습니다. 관심 있으신 분은 댓글로 연락 부탁드립니다.',
    commentsList: []
  }
];

export function CommunityPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(() => posts[0].commentsList);

  const post = useMemo(() => posts.find((item) => item.id === postId) ?? posts[0], [postId]);

  const handleAddComment = () => {
    if (!draft.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        author: '익명',
        content: draft.trim(),
        createdAt: '방금 전',
        likes: 0,
        replies: []
      },
      ...prev
    ]);
    setDraft('');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Community"
        title={post.title}
        description={`${post.board} · ${post.author} · ${post.createdAt}`}
      />

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <article className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex flex-wrap items-center gap-3">
              {post.notice ? <span className="rounded-full bg-[#B08D57] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">공지</span> : null}
              <span className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-xs font-semibold text-charcoal/70">{post.board}</span>
            </div>
            <h2 className="mt-5 font-serif text-3xl text-[#16233B]">{post.title}</h2>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal/60">
              <span>작성자 {post.author}</span>
              <span>작성일 {post.createdAt}</span>
              <span>조회수 {post.views}</span>
              <span>좋아요 {post.likes}</span>
              <span>댓글 {post.comments}</span>
            </div>
            <p className="mt-6 text-base leading-8 text-charcoal/80">{post.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">좋아요</button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">신고</button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">수정</button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">삭제</button>
            </div>
          </article>

          <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-2xl text-[#16233B]">댓글</h3>
              <span className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-sm text-charcoal/70">{comments.length}개</span>
            </div>
            <div className="mt-6 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4">
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} className="w-full resize-none rounded-[20px] border border-ink/10 bg-white p-4 text-sm outline-none" placeholder="댓글을 작성해 주세요." />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-charcoal/60">UI 전용 댓글 입력입니다.</p>
                <button type="button" onClick={handleAddComment} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">댓글 작성</button>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-[24px] border border-ink/10 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#16233B]">{comment.author}</p>
                      <p className="mt-1 text-sm text-charcoal/60">{comment.createdAt}</p>
                    </div>
                    <button type="button" className="text-sm text-charcoal/60">수정</button>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-charcoal/75">{comment.content}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-charcoal/60">
                    <span className="inline-flex items-center gap-1.5"><Heart size={14} className="text-[#B08D57]" /> {comment.likes}</span>
                    <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} className="text-[#B08D57]" /> {comment.replies.length}</span>
                    <button type="button" className="text-[#16233B]">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">커뮤니티 안내</p>
            <p className="mt-4 text-sm leading-7 text-charcoal/70">이 페이지는 mock 데이터 기반의 상세 열람 화면입니다. 댓글, 대댓글, 신고, 수정, 삭제는 모두 UI 전용입니다.</p>
          </div>
          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 게시글</p>
            <div className="mt-4 space-y-3">
              {posts.map((item) => (
                <button key={item.id} type="button" onClick={() => navigate(`/community/${item.id}`)} className="w-full rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-left text-sm">
                  <p className="font-semibold text-[#16233B]">{item.title}</p>
                  <p className="mt-1 text-charcoal/60">{item.board} · {item.createdAt}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
