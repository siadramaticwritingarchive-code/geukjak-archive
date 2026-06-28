import { Link } from 'react-router';
import {
  ArrowRight,
  BookOpen,
  Flame,
  GraduationCap,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp
} from 'lucide-react';

const featuredWorks = [
  {
    title: '운명의 표정',
    genre: '희곡',
    summary: '사라지는 기억 속에서 관계의 진실을 읽어내는 3인극입니다.'
  },
  {
    title: '소리 없는 겨울',
    genre: '영화 시나리오',
    summary: '도시의 외로움을 조용하게 담아낸 섬세한 시나리오입니다.'
  },
  {
    title: '비밀의 정원',
    genre: '드라마',
    summary: '한 가족의 숨겨진 감정을 이야기하는 미묘한 드라마입니다.'
  }
];

const recommendedWorks = [
  {
    title: '정오의 환기',
    genre: '웹소설',
    summary: '현실과 상상이 교차하는 몰입형 서사로 주목받고 있습니다.'
  },
  {
    title: '연기와 밤',
    genre: '희곡',
    summary: '공연장에서 충분히 빛나는 밀도 높은 대사 구성이 돋보입니다.'
  },
  {
    title: '마음의 거리',
    genre: '드라마',
    summary: '관계의 미세한 변화를 섬세하게 포착한 작품입니다.'
  }
];

const professorPicks = [
  {
    title: '한 줄의 빛',
    genre: '영화 시나리오',
    summary: '비언어적 감정의 흐름이 정교하게 설계된 작품입니다.'
  },
  {
    title: '창문 너머',
    genre: '희곡',
    summary: '공간과 기억의 관계를 시적으로 풀어낸 작업입니다.'
  },
  {
    title: '여름의 잔향',
    genre: '드라마',
    summary: '잔잔한 감정선과 긴장감이 안정적으로 이어집니다.'
  }
];

const recentPosts = [
  { title: '제3회 극작과 전시회 홍보 공지', category: '공지', time: '3분 전' },
  { title: '작품 피드백 코멘트 나눠요', category: '토론', time: '18분 전' },
  { title: '공연 실습생 모집 안내', category: '모집', time: '1시간 전' },
  { title: '시나리오 워크숍 참여자 신청', category: '행사', time: '오늘' },
  { title: '전공생 작품 공유 페이지 안내', category: '안내', time: '오늘' }
];

const notices = [
  {
    title: '📌 플랫폼 이용 안내',
    detail: '새로운 이용자를 위한 아카이브 이용 가이드입니다.'
  },
  {
    title: '🔔 시스템 업데이트 안내',
    detail: '서비스 개선 및 기능 업데이트 안내입니다.'
  },
  {
    title: '📄 작품 업로드 가이드',
    detail: '작품 등록 전 꼭 확인해야 할 안내입니다.'
  }
];

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-ink/10 bg-white/85 p-8 shadow-[0_24px_70px_rgba(22,35,59,0.08)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#B08D57]">Department of Dramatic Writing</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#16233B] sm:text-5xl">
              서울예술대학교 극작과 아카이브
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/80">
              극작과 학생들의 다양한 창작물을 기록하고 공유하는 공간입니다.
            </p>
            <p className="mt-3 max-w-2xl text-base leading-8 text-charcoal/70">
              희곡, 영화 시나리오, 드라마, 웹소설 등 다양한 작품을 열람하고
            </p>
            <p className="mt-3 text-base leading-8 text-charcoal/70">
              좋아요와 댓글을 통해 서로 피드백을 나누며 함께 성장할 수 있습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/archive"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
              >
                작품 둘러보기
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/community"
                className="btn-secondary inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                커뮤니티 바로가기
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-ink/10 bg-[#F8F6F1] p-6">
            <div className="rounded-[24px] border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#16233B] p-2 text-white">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#16233B]">오늘의 큐레이션</p>
                  <p className="text-sm text-charcoal/70">전공의 감성과 흐름을 따라 읽는 아카이브</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-charcoal/70">
                <div className="rounded-2xl border border-ink/10 bg-ivory p-3">• 최신 공개 작품과 업데이트 흐름을 한눈에 확인합니다.</div>
                <div className="rounded-2xl border border-ink/10 bg-ivory p-3">• 커뮤니티와 작품 피드백을 함께 탐색합니다.</div>
                <div className="rounded-2xl border border-ink/10 bg-ivory p-3">• 교수 추천과 인기 작품을 우선적으로 둘러볼 수 있습니다.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-ink/10 bg-white/80 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">인기 작품</p>
            <h2 className="mt-2 font-serif text-2xl text-[#16233B]">이번 주 가장 많은 관심을 받은 학생 작품입니다.</h2>
          </div>
          <Link to="/archive" className="text-sm font-semibold text-[#16233B] transition hover:text-[#B08D57]">
            전체 보기
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featuredWorks.map((work, index) => (
            <article key={work.title} className="card-surface rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">
                  {work.genre}
                </span>
                <span className="text-sm text-charcoal/50">0{index + 1}</span>
              </div>
              <h3 className="mt-4 font-serif text-xl text-[#16233B]">{work.title}</h3>
              <p className="mt-3 text-sm leading-7 text-charcoal/70">{work.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-ink/10 bg-white/80 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">추천 작품</p>
            <h2 className="mt-2 font-serif text-2xl text-[#16233B]">영화, 드라마, 희곡, 웹소설 등 다양한 작품 추천</h2>
          </div>
          <Link to="/recommended" className="text-sm font-semibold text-[#16233B] transition hover:text-[#B08D57]">
            더 보기
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {recommendedWorks.map((work) => (
            <article key={work.title} className="card-surface rounded-[24px] border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#B08D57]">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">{work.genre}</span>
              </div>
              <h3 className="mt-3 font-serif text-xl text-[#16233B]">{work.title}</h3>
              <p className="mt-3 text-sm leading-7 text-charcoal/70">{work.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-ink/10 bg-[#16233B] p-6 text-white shadow-[0_18px_45px_rgba(22,35,59,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">교수님 추천</p>
            <h2 className="mt-2 font-serif text-2xl">교수님이 추천하는 작품을 만나보세요.</h2>
          </div>
        <Link
  to="/recommended/professor"
  className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/20"
>
  더 보기
</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {professorPicks.map((work) => (
            <article key={work.title} className="card-surface rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#B08D57]" />
                <span className="text-sm font-semibold">{work.genre}</span>
              </div>
              <h3 className="mt-3 font-serif text-xl">{work.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/75">{work.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-ink/10 bg-white/80 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 게시글</p>
              <h2 className="mt-2 font-serif text-2xl text-[#16233B]">최근 커뮤니티에 올라온 게시글입니다.</h2>
            </div>
            <Link to="/community" className="text-sm font-semibold text-[#16233B] transition hover:text-[#B08D57]">
              커뮤니티 열기
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {recentPosts.map((post) => (
              <div key={post.title} className="flex items-center justify-between rounded-[20px] border border-ink/10 bg-[#F8F6F1] px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#16233B]">{post.title}</p>
                  <p className="mt-1 text-sm text-charcoal/60">{post.category} · {post.time}</p>
                </div>
                <MessageSquareText size={16} className="text-[#B08D57]" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#16233B] p-2 text-white">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#16233B]">공지사항</p>
                  <p className="text-sm text-charcoal/70">아카이브 플랫폼에서 확인할 안내를 모아두었습니다.</p>
                </div>
              </div>
              <Link to="/community" className="text-sm font-semibold text-[#16233B] transition hover:text-[#B08D57]">
                전체 보기 →
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {notices.map((notice) => (
                <div key={notice.title} className="rounded-[20px] border border-ink/10 bg-white p-4">
                  <p className="text-sm font-semibold text-[#16233B]">{notice.title}</p>
                  <p className="mt-2 text-sm leading-7 text-charcoal/70">{notice.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/80 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#B08D57] p-2 text-white">
                <Star size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#16233B]">이번 달 포인트</p>
                <p className="text-sm text-charcoal/70">공식 아카이브 메인 페이지의 분위기를 더해두었습니다.</p>
              </div>
            </div>
            <div className="mt-5 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4 text-sm leading-7 text-charcoal/70">
              작품 탐색, 게시글 확인, 공지 파악까지 한 페이지에서 자연스럽게 이어지도록 구성한 플레이스홀더 화면입니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
