import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MessageCircleMore, PencilLine, Search, Sparkles, Users} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';

type PostItem = {
  id: string;
  board: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  comments: number;
  likes: number;
  notice?: boolean;
};

const boards = [
  { title: '공지사항', description: '필수 공지와 전공 소식을 확인하는 공간입니다.', icon: Sparkles },
  { title: '공연 홍보', description: '공연, 발표회, 전시, 무대 소식을 공유합니다.', icon: Sparkles },
  { title: '질문', description: '작품, 제안, 실기, 학업에 대한 질문을 올려보세요.', icon: MessageCircleMore },
  { title: '구인 · 구직', description: '프로젝트, 스태프, 협업 제안을 나누는 공간입니다.', icon: Users },
  { title: '자유게시판', description: '전공생들이 자유롭게 이야기 나누는 공간입니다.' },
  { title: '창작 고민', description: '작품의 방향성을 함께 고민하는 전용 공간입니다.' }
];

const posts: PostItem[] = [
  { id: '1', board: '공지사항', title: '6월 전공 워크숍 일정 안내', author: '관리자', createdAt: '2026.06.25', views: 218, comments: 7, likes: 24, notice: true },
  { id: '2', board: '공연 홍보', title: '극작과 학생회 공연 홍보 요청', author: '윤서', createdAt: '2026.06.24', views: 132, comments: 4, likes: 15 },
  { id: '3', board: '질문', title: '작품 피드백 받는 방식이 궁금합니다', author: '민준', createdAt: '2026.06.23', views: 96, comments: 5, likes: 11 },
  { id: '4', board: '창작 고민', title: '대사와 침묵의 비율에 대한 고민', author: '서연', createdAt: '2026.06.22', views: 84, comments: 3, likes: 9 },
  { id: '5', board: '구인 · 구직', title: '공연 기획 스태프 모집', author: '하린', createdAt: '2026.06.22', views: 61, comments: 2, likes: 8 }
];

export function CommunityPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('최신순');

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const visible = posts.filter((post) => !query || [post.title, post.author, post.board].join(' ').toLowerCase().includes(query));
    return [...visible].sort((left, right) => {
      if (sort === '좋아요순') return right.likes - left.likes;
      if (sort === '댓글순') return right.comments - left.comments;
      return Number(new Date(right.createdAt.replace(/\./g, '-'))) - Number(new Date(left.createdAt.replace(/\./g, '-')));
    });
  }, [search, sort]);

  const noticePosts = filteredPosts.filter((post) => post.notice);
  const regularPosts = filteredPosts.filter((post) => !post.notice);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="커뮤니티"
        title="극작과 커뮤니티"
        description="공지사항, 공연 홍보, 질문, 구인·구직, 자유게시판, 창작 고민까지 한 곳에서 확인할 수 있는 mock 커뮤니티입니다."
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
              <article key={board.title} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5 transition hover:-translate-y-1 hover:border-[#B08D57]">
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
            {[...noticePosts, ...regularPosts].map((post) => (
              <button key={post.id} type="button" onClick={() => navigate(`/community/${post.id}`)} className="w-full rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4 text-left transition hover:-translate-y-1 hover:border-[#B08D57]">
                <div className="flex flex-wrap items-center gap-2">
                  {post.notice ? <span className="rounded-full bg-[#B08D57] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">공지</span> : null}
                  <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/60">{post.board}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-[#16233B]">{post.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal/60">
                  <span>작성자 {post.author}</span>
                  <span>작성일 {post.createdAt}</span>
                  <span>조회수 {post.views}</span>
                  <span>댓글 {post.comments}</span>
                  <span>좋아요 {post.likes}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 게시글</p>
              <div className="mt-4 space-y-3">
                {posts.slice(0, 3).map((post) => (
                  <button key={post.id} type="button" onClick={() => navigate(`/community/${post.id}`)} className="block w-full rounded-[20px] border border-ink/10 bg-white p-3 text-left text-sm text-charcoal/70">
                    <p className="font-semibold text-[#16233B]">{post.title}</p>
                    <p className="mt-1">{post.board} · {post.createdAt}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">인기 게시글</p>
              <div className="mt-4 space-y-3">
                {posts.slice(0, 2).map((post) => (
                  <div key={post.id} className="rounded-[20px] border border-ink/10 bg-white p-3 text-sm text-charcoal/70">
                    <p className="font-semibold text-[#16233B]">{post.title}</p>
                    <p className="mt-1">좋아요 {post.likes} · 댓글 {post.comments}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">공연 홍보</p>
              <div className="mt-4 rounded-[20px] border border-ink/10 bg-white p-4 text-sm leading-7 text-charcoal/70">
                학생회 공연 홍보 요청과 발표회 소식을 확인해 보세요.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
