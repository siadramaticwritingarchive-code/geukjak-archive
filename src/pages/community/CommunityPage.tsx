import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { MessageCircleMore, Search, Sparkles, Users } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { communityService } from '../../services/community';
import type { BoardType } from '../../types/community';

type ProfileSummary = {
  display_name: string | null;
};

type CommunityPostRecord = {
  id: string;
  board_type: BoardType;
  title: string;
  created_at: string;
  view_count: number | null;
  like_count: number | null;
  comment_count?: number | null;
  is_pinned: boolean | null;
  profiles?: ProfileSummary | ProfileSummary[] | null;
};

const boards: Array<{
  type: BoardType;
  title: string;
  description: string;
  icon?: typeof Sparkles;
}> = [
  { type: 'announcements', title: '공지사항', description: '필수 공지와 전공 소식을 확인하는 공간입니다.', icon: Sparkles },
  { type: 'free', title: '공연 홍보', description: '공연, 발표회, 전시, 무대 소식을 공유합니다.', icon: Sparkles },
  { type: 'questions', title: '질문', description: '작품, 제안, 실기, 학업에 대한 질문을 올려보세요.', icon: MessageCircleMore },
  { type: 'free', title: '구인 · 구직', description: '프로젝트, 스태프, 협업 제안을 나누는 공간입니다.', icon: Users },
  { type: 'free', title: '자유게시판', description: '전공생들이 자유롭게 이야기 나누는 공간입니다.' },
  { type: 'anonymous', title: '창작 고민', description: '작품의 방향성을 함께 고민하는 전용 공간입니다.' },
];

const boardLabels: Record<BoardType, string> = {
  free: '자유게시판',
  questions: '질문',
  announcements: '공지사항',
  anonymous: '익명게시판',
};

function firstProfile(profile: ProfileSummary | ProfileSummary[] | null | undefined) {
  if (Array.isArray(profile)) {
    return profile[0] ?? null;
  }

  return profile ?? null;
}

function getAuthorName(post: CommunityPostRecord) {
  if (post.board_type === 'anonymous') {
    return '익명';
  }

  return firstProfile(post.profiles)?.display_name ?? '알 수 없는 사용자';
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function CommunityPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('최신순');
  const [posts, setPosts] = useState<CommunityPostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      setIsLoading(true);

      const { data, error } = await communityService.listPosts({
        search: search.trim() || undefined,
        page: 1,
        pageSize: 50,
      });

      if (!isMounted) {
        return;
      }

      if (error) {
        setPosts([]);
      } else {
        setPosts((data ?? []) as unknown as CommunityPostRecord[]);
      }

      setIsLoading(false);
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, [search]);

  const filteredPosts = useMemo(() => {
    return [...posts].sort((left, right) => {
      if (sort === '좋아요순') {
        return (right.like_count ?? 0) - (left.like_count ?? 0);
      }

      if (sort === '댓글순') {
        return (right.comment_count ?? 0) - (left.comment_count ?? 0);
      }

      return Number(new Date(right.created_at)) - Number(new Date(left.created_at));
    });
  }, [posts, sort]);

  const noticePosts = filteredPosts.filter((post) => post.is_pinned);
  const regularPosts = filteredPosts.filter((post) => !post.is_pinned);
  const recentPosts = filteredPosts.slice(0, 3);
  const popularPosts = [...filteredPosts]
    .sort((left, right) => (right.like_count ?? 0) - (left.like_count ?? 0))
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="커뮤니티"
        title="커뮤니티"
        description="공지사항, 공연 홍보, 질문, 구인·구직, 자유게시판, 창작 고민까지 한 곳에서 확인할 수 있습니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">게시판</p>
            <h2 className="mt-2 font-serif text-2xl text-[#16233B]">커뮤니티 홈</h2>
          </div>
          <button type="button" onClick={() => navigate('/community/write')} className="btn-primary rounded-full px-4 py-2.5 text-sm font-semibold">글쓰기</button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {boards.map((board) => {
            const Icon = board.icon;
            return (
              <article key={`${board.type}-${board.title}`} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5 transition hover:-translate-y-1 hover:border-[#B08D57]">
                <div className="flex items-center gap-3">
                  {Icon ? <div className="rounded-full bg-[#16233B] p-2 text-white"><Icon size={16} /></div> : null}
                  <h3 className="font-semibold text-[#16233B]">{board.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-charcoal/70">{board.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">게시글</p>
            <h2 className="mt-2 font-serif text-2xl text-[#16233B]">최근 게시글</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2.5">
              <Search size={16} className="text-charcoal/50" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-40 bg-transparent text-sm outline-none" placeholder="검색" />
            </label>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none">
              <option value="최신순">최신순</option>
              <option value="좋아요순">좋아요순</option>
              <option value="댓글순">댓글순</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4 text-sm text-charcoal/60">게시글을 불러오는 중입니다.</div>
            ) : null}

            {!isLoading && filteredPosts.length === 0 ? (
              <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4 text-sm text-charcoal/60">게시글이 없습니다.</div>
            ) : null}

            {[...noticePosts, ...regularPosts].map((post) => (
              <button key={post.id} type="button" onClick={() => navigate(`/community/${post.id}`)} className="w-full rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4 text-left transition hover:-translate-y-1 hover:border-[#B08D57]">
                <div className="flex flex-wrap items-center gap-2">
                  {post.is_pinned ? <span className="rounded-full bg-[#B08D57] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">공지</span> : null}
                  <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/60">{boardLabels[post.board_type]}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-[#16233B]">{post.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal/60">
                  <span>작성자 {getAuthorName(post)}</span>
                  <span>작성일 {formatDate(post.created_at)}</span>
                  <span>조회수 {post.view_count ?? 0}</span>
                  <span>댓글 {post.comment_count ?? 0}</span>
                  <span>좋아요 {post.like_count ?? 0}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 게시글</p>
              <div className="mt-4 space-y-3">
                {recentPosts.map((post) => (
                  <button key={post.id} type="button" onClick={() => navigate(`/community/${post.id}`)} className="block w-full rounded-[20px] border border-ink/10 bg-white p-3 text-left text-sm text-charcoal/70">
                    <p className="font-semibold text-[#16233B]">{post.title}</p>
                    <p className="mt-1">{boardLabels[post.board_type]} · {formatDate(post.created_at)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">인기 게시글</p>
              <div className="mt-4 space-y-3">
                {popularPosts.map((post) => (
                  <div key={post.id} className="rounded-[20px] border border-ink/10 bg-white p-3 text-sm text-charcoal/70">
                    <p className="font-semibold text-[#16233B]">{post.title}</p>
                    <p className="mt-1">좋아요 {post.like_count ?? 0} · 댓글 {post.comment_count ?? 0}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">공연 홍보</p>
              <div className="mt-4 rounded-[20px] border border-ink/10 bg-white p-4 text-sm leading-7 text-charcoal/70">
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
