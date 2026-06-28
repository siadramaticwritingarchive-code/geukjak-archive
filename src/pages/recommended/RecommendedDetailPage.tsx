import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Bookmark, CalendarDays, Eye, Flag, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';

type RecommendedComment = {
  id: number;
  author: string;
  role: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Array<{ id: number; author: string; content: string; createdAt: string }>;
};

type RecommendedWorkDetail = {
  id: string;
  title: string;
  author: string;
  genre: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  bookmarks: number;
  comments: number;
  synopsis: string;
  reason: string;
  writer: string;
  writerRole: string;
  tags: string[];
  commentsList: RecommendedComment[];
  relatedWorks: Array<{ id: string; title: string; genre: string }>;
};

const recommendedWorks: RecommendedWorkDetail[] = [
  {
    id: '1',
    title: '도시의 마지막 빛',
    author: '최유진',
    genre: '영화',
    category: '영화',
    createdAt: '2026.06.20',
    views: 1240,
    likes: 132,
    bookmarks: 46,
    comments: 18,
    synopsis: '한밤의 도시를 배경으로 각자의 상처를 숨긴 사람들의 만남을 그린 감각적인 이야기입니다.',
    reason: '도시의 소외감을 섬세하게 담아내는 장면 구성과 인물 간 긴장감이 돋보입니다.',
    writer: '이효정',
    writerRole: 'Student · 극작과',
    tags: ['도시', '감성', '인물'],
    commentsList: [
      {
        id: 1,
        author: '윤서',
        role: 'Student',
        content: '장면의 밀도와 대비가 정말 인상적이었습니다. 추천 이유도 잘 읽혔어요.',
        createdAt: '2시간 전',
        likes: 4,
        replies: [{ id: 11, author: '이효정', content: '감사합니다. 다음 작품도 기대해 주세요.', createdAt: '1시간 전' }]
      }
    ],
    relatedWorks: [
      { id: '2', title: '해질 무렵의 연극', genre: '희곡' },
      { id: '3', title: '밤의 회전목마', genre: '드라마' },
      { id: '4', title: '비밀의 문장', genre: '웹소설' }
    ]
  },
  {
    id: '2',
    title: '해질 무렵의 연극',
    author: '이서연',
    genre: '희곡',
    category: '희곡',
    createdAt: '2026.06.18',
    views: 980,
    likes: 98,
    bookmarks: 31,
    comments: 12,
    synopsis: '세 사람의 대화를 통해 서서히 드러나는 상실과 용기를 그린 단막극입니다.',
    reason: '대사와 침묵의 균형이 정교해 극장에서 읽었을 때의 몰입감이 뛰어납니다.',
    writer: '이효정',
    writerRole: 'Student · 극작과',
    tags: ['희곡', '대사', '침묵'],
    commentsList: [],
    relatedWorks: []
  }
];

export function RecommendedDetailPage() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<RecommendedComment[]>(() => recommendedWorks[0].commentsList);
  const [draft, setDraft] = useState('');

  const work = useMemo(() => {
    return recommendedWorks.find((item) => item.id === workId) ?? recommendedWorks[0];
  }, [workId]);

  const handleSubmit = () => {
    if (!draft.trim()) {
      return;
    }

    setComments((prev) => [
      {
        id: Date.now(),
        author: profile?.display_name ?? '익명',
        role: profile?.role ?? 'Student',
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
        eyebrow="Recommended"
        title={work.title}
        description={`${work.author} · ${work.genre} · ${work.createdAt}`}
      />

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-ink/10 bg-white/90 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#16233B] via-[#1F2D4A] to-[#B08D57] p-6 text-white">
                <div className="rounded-[24px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur">
                  <Sparkles size={28} className="mx-auto text-[#F7E8C7]" />
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#F7E8C7]">Poster</p>
                  <p className="mt-2 text-sm text-white/80">placeholder preview</p>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-xs font-semibold text-charcoal/70">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h2 className="mt-5 font-serif text-3xl text-[#16233B]">{work.title}</h2>
                <p className="mt-2 text-base text-charcoal/70">{work.author} · {work.genre}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#B08D57]">작성일</p>
                    <p className="mt-2 text-sm text-charcoal/75">{work.createdAt}</p>
                  </div>
                  <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#B08D57]">좋아요</p>
                    <p className="mt-2 text-sm text-charcoal/75">{work.likes}</p>
                  </div>
                  <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#B08D57]">북마크</p>
                    <p className="mt-2 text-sm text-charcoal/75">{work.bookmarks}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setLiked((prev) => !prev)} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-[#B08D57]' : ''} /> 좋아요
                  </button>
                  <button type="button" onClick={() => setBookmarked((prev) => !prev)} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} className={bookmarked ? 'text-[#B08D57]' : ''} /> 북마크
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Share2 size={16} /> 공유하기
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Flag size={16} /> 신고하기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">줄거리</p>
                <p className="mt-3 text-base leading-8 text-charcoal/80">{work.synopsis}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">추천 이유</p>
                <p className="mt-3 text-base leading-8 text-charcoal/80">{work.reason}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">댓글</p>
                <h3 className="mt-2 font-serif text-2xl text-[#16233B]">대화로 이어지는 추천</h3>
              </div>
              <span className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-sm text-charcoal/70">{work.comments}개</span>
            </div>

            <div className="mt-6 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-[20px] border border-ink/10 bg-white p-4 text-sm outline-none"
                placeholder="이 작품에 대한 생각을 남겨 보세요."
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-charcoal/60">UI 전용 댓글 입력입니다.</p>
                <button type="button" onClick={handleSubmit} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">댓글 작성</button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-[24px] border border-ink/10 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#16233B]">{comment.author}</p>
                      <p className="mt-1 text-sm text-charcoal/60">{comment.role} · {comment.createdAt}</p>
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
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">추천 작품 더 보기</p>
                <h3 className="mt-2 font-serif text-2xl text-[#16233B]">다른 추천 작품</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {recommendedWorks.slice(0, 4).map((item) => (
                <Link key={item.id} to={`/recommended/${item.id}`} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4 transition hover:-translate-y-1 hover:border-[#B08D57]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{item.genre}</p>
                  <h4 className="mt-2 font-serif text-xl text-[#16233B]">{item.title}</h4>
                  <p className="mt-2 text-sm text-charcoal/70">{item.author}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">작성자 정보</p>
            <div className="mt-4 rounded-[24px] border border-ink/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16233B] text-sm font-semibold text-white">{profile?.display_name?.charAt(0) ?? '이'}</div>
                <div>
                  <p className="font-semibold text-[#16233B]">{work.writer}</p>
                  <p className="text-sm text-charcoal/60">{work.writerRole}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-charcoal/70">이 작품은 추천과 피드백을 위해 준비된 플레이스홀더 페이지입니다.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">관련 작품</p>
            <div className="mt-4 space-y-3">
              {work.relatedWorks.map((item) => (
                <Link key={item.id} to={`/recommended/${item.id}`} className="flex items-center justify-between rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm">
                  <span className="text-[#16233B]">{item.title}</span>
                  <span className="text-charcoal/60">{item.genre}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 등록 작품</p>
              <CalendarDays size={16} className="text-[#B08D57]" />
            </div>
            <div className="mt-4 space-y-3">
              {recommendedWorks.map((item) => (
                <Link key={item.id} to={`/recommended/${item.id}`} className="block rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm transition hover:border-[#B08D57]">
                  <p className="font-semibold text-[#16233B]">{item.title}</p>
                  <p className="mt-1 text-charcoal/60">{item.genre} · {item.createdAt}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
