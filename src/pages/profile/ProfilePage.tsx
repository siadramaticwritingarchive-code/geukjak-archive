import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Bookmark, Camera, Edit3, FileText, Heart, Lock, LogOut, MessageSquareText, PlusCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';

type WorkItem = {
  id: number;
  title: string;
  genre: string;
  visibility: string;
  views: number;
  likes: number;
  createdAt: string;
};

type PostItem = {
  id: number;
  board: string;
  title: string;
  createdAt: string;
  comments: number;
};

type CommentItem = {
  id: number;
  content: string;
  postTitle: string;
  createdAt: string;
};

const summaryCards = [
  { label: '등록한 작품', value: '3', icon: FileText },
  { label: '추천한 작품', value: '4', icon: Sparkles },
  { label: '작성한 게시글', value: '7', icon: MessageSquareText },
  { label: '작성한 댓글', value: '12', icon: MessageSquareText },
  { label: '받은 좋아요', value: '48', icon: Heart },
  { label: '북마크한 작품', value: '9', icon: Bookmark }
];

const works: WorkItem[] = [
  { id: 1, title: '도시의 마지막 빛', genre: '시나리오', visibility: '서울예대생 전체', views: 842, likes: 48, createdAt: '2026.06.20' },
  { id: 2, title: '해질 무렵의 연극', genre: '희곡', visibility: '극작과만', views: 612, likes: 37, createdAt: '2026.06.18' }
];

const bookmarks: WorkItem[] = [
  { id: 3, title: '밤의 회전목마', genre: '드라마', visibility: '서울예대생 전체', views: 431, likes: 29, createdAt: '2026.06.16' }
];

const recommendedWorks = [
  { id: 4, title: '비밀의 문장', genre: '웹소설', createdAt: '2026.06.14' },
  { id: 5, title: '우리는 서로의 빛', genre: '영화', createdAt: '2026.06.12' }
];

const posts: PostItem[] = [
  { id: 1, board: '자유게시판', title: '작품 피드백 받는 방식이 궁금합니다.', createdAt: '2026.06.23', comments: 5 },
  { id: 2, board: '창작 고민', title: '대사와 침묵의 비율에 대한 고민', createdAt: '2026.06.22', comments: 3 }
];

const comments: CommentItem[] = [
  { id: 1, content: '장면의 밀도와 대비가 정말 좋았어요.', postTitle: '6월 전공 워크숍 일정 안내', createdAt: '2026.06.25' },
  { id: 2, content: '다음 작품도 기대하겠습니다.', postTitle: '극작과 학생회 공연 홍보 요청', createdAt: '2026.06.24' }
];

export function ProfilePage() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'works' | 'bookmarks' | 'recommended' | 'posts' | 'comments'>('works');

  const displayName = profile?.display_name ?? '이효정';
  const department = '극작과';
  const studentId = '2442123';

  const avatarInitial = useMemo(() => displayName.charAt(0) ?? '이', [displayName]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="마이페이지"
        title="나의 작업실"
        description="작품, 추천, 게시글, 댓글까지 한 곳에서 정리된 개인 작업 공간입니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-ink/10 bg-[#F8F6F1] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16233B] text-2xl font-semibold text-white">
                {avatarInitial}
              </div>
              <div>
                <p className="font-serif text-3xl text-[#16233B]">{displayName}</p>
                <p className="mt-2 text-sm text-charcoal/70">{department}</p>
                <p className="mt-1 text-sm text-charcoal/60">학번 {studentId}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[24px] border border-ink/10 bg-white/80 p-4 text-sm text-charcoal/70">
              <div className="flex items-center justify-between"><span>가입일</span><span>2026.06.28</span></div>
              <div className="flex items-center justify-between"><span>한 줄 소개</span><span>창작을 기록하고 함께 성장하는 공간.</span></div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]">
                <Edit3 size={16} /> 프로필 수정
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]">
                <Camera size={16} /> 프로필 이미지 변경
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-[24px] border border-ink/10 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-charcoal/70">{card.label}</p>
                    <div className="rounded-full bg-[#F8F6F1] p-2 text-[#B08D57]"><Icon size={16} /></div>
                  </div>
                  <p className="mt-5 text-3xl font-semibold text-[#16233B]">{card.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {[
            ['works', '내 작품'],
            ['bookmarks', '북마크한 작품'],
            ['recommended', '추천한 작품'],
            ['posts', '내가 작성한 게시글'],
            ['comments', '최근 작성한 댓글']
          ].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setActiveTab(key as typeof activeTab)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === key ? 'bg-[#16233B] text-white' : 'border border-ink/10 bg-[#F8F6F1] text-[#16233B]'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'works' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {works.length > 0 ? works.map((work) => (
                <div key={work.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{work.genre}</p>
                      <h3 className="mt-2 font-serif text-2xl text-[#16233B]">{work.title}</h3>
                    </div>
                    <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-semibold text-charcoal/70">{work.visibility}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal/70">
                    <span>조회수 {work.views}</span>
                    <span>좋아요 {work.likes}</span>
                    <span>작성일 {work.createdAt}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]">수정</button>
                    <button type="button" className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]">삭제</button>
                  </div>
                </div>
              )) : <p className="rounded-[24px] border border-dashed border-ink/10 bg-[#F8F6F1] p-6 text-sm text-charcoal/70">등록한 작품이 없습니다.</p>}
            </div>
          ) : null}

          {activeTab === 'bookmarks' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {bookmarks.length > 0 ? bookmarks.map((work) => (
                <div key={work.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{work.genre}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#16233B]">{work.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">공개 범위 {work.visibility}</p>
                </div>
              )) : <p className="rounded-[24px] border border-dashed border-ink/10 bg-[#F8F6F1] p-6 text-sm text-charcoal/70">북마크한 작품이 없습니다.</p>}
            </div>
          ) : null}

          {activeTab === 'recommended' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {recommendedWorks.length > 0 ? recommendedWorks.map((work) => (
                <div key={work.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{work.genre}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#16233B]">{work.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">추천일 {work.createdAt}</p>
                </div>
              )) : <p className="rounded-[24px] border border-dashed border-ink/10 bg-[#F8F6F1] p-6 text-sm text-charcoal/70">추천한 작품이 없습니다.</p>}
            </div>
          ) : null}

          {activeTab === 'posts' ? (
            <div className="space-y-3">
              {posts.length > 0 ? posts.map((post) => (
                <div key={post.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">{post.board}</p>
                      <h3 className="mt-2 font-serif text-xl text-[#16233B]">{post.title}</h3>
                    </div>
                    <div className="text-sm text-charcoal/70">
                      <p>작성일 {post.createdAt}</p>
                      <p className="mt-1">댓글 {post.comments}</p>
                    </div>
                  </div>
                </div>
              )) : <p className="rounded-[24px] border border-dashed border-ink/10 bg-[#F8F6F1] p-6 text-sm text-charcoal/70">작성한 게시글이 없습니다.</p>}
            </div>
          ) : null}

          {activeTab === 'comments' ? (
            <div className="space-y-3">
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4">
                  <p className="text-sm leading-7 text-charcoal/75">“{comment.content}”</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-charcoal/60">
                    <span>{comment.postTitle}</span>
                    <span>{comment.createdAt}</span>
                  </div>
                </div>
              )) : <p className="rounded-[24px] border border-dashed border-ink/10 bg-[#F8F6F1] p-6 text-sm text-charcoal/70">작성한 댓글이 없습니다.</p>}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="flex items-center gap-2 text-[#16233B]">
          <ShieldCheck size={18} className="text-[#B08D57]" />
          <h2 className="font-serif text-2xl">계정 설정</h2>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <button type="button" className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-left text-sm font-semibold text-[#16233B]">프로필 수정</button>
          <button type="button" className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-left text-sm font-semibold text-[#16233B] flex items-center gap-2"><Lock size={16} /> 비밀번호 변경</button>
          <button type="button" className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-left text-sm font-semibold text-[#16233B]">알림 설정</button>
          <Link to="/copyright-policy" className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-left text-sm font-semibold text-[#16233B]">저작권 정책</Link>
          <button type="button" onClick={() => void signOut()} className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-left text-sm font-semibold text-[#16233B] flex items-center gap-2"><LogOut size={16} /> 로그아웃</button>
        </div>
      </section>
    </div>
  );
}
