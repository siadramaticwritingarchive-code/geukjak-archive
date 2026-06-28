import { useMemo, useState } from 'react';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';

type ProfessorRecommendation = {
  id: number;
  type: 'archive' | 'external';
  title: string;
  author: string;
  category: string;
  genre: string;
  summary: string;
  reason: string;
  likes: number;
  comments: number;
  bookmarks: number;
};

const recommendations: ProfessorRecommendation[] = [
  {
    id: 1,
    type: 'archive',
    title: '기억의 표정',
    author: '이효정',
    category: '희곡',
    genre: '성장',
    summary: '기억을 잃어가는 인물의 이야기',
    reason: '학생 작품 중 구조와 인물 설계가 매우 뛰어난 작품입니다.',
    likes: 28,
    comments: 6,
    bookmarks: 11
  },
  {
    id: 2,
    type: 'external',
    title: '기생충',
    author: '봉준호',
    category: '영화',
    genre: '스릴러',
    summary: '계급 구조를 다룬 대표적인 영화입니다.',
    reason: '장면 설계와 복선 회수가 뛰어나 창작 공부에 도움이 되는 작품입니다.',
    likes: 41,
    comments: 8,
    bookmarks: 18
  },
  {
    id: 3,
    type: 'archive',
    title: '모리아',
    author: '홍길동',
    category: '웹소설',
    genre: '판타지',
    summary: '황궁을 배경으로 한 로맨스 판타지.',
    reason: '세계관 설계와 인물 구성이 인상적인 학생 작품입니다.',
    likes: 12,
    comments: 2,
    bookmarks: 7
  }
];

export function ProfessorRecommendedPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return recommendations.filter((work) =>
      [work.title, work.author, work.genre, work.category]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }, [search]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Professor Pick"
        title="교수님 추천 작품"
        description="교수님이 추천하는 학생 작품과 외부 작품을 확인할 수 있습니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white/85 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">

        <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-3">
          <Search
            size={18}
            className="text-charcoal/50"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="작품명 · 작가명 검색"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-6 grid gap-6">
          {filtered.map((work) => (
            <article
              key={work.id}
              className="overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-[320px_1fr]">
                                <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#16233B] via-[#243A63] to-[#B08D57] text-white">
                  <div className="text-center">
                    <Sparkles
                      size={30}
                      className="mx-auto text-[#F7E8C7]"
                    />

                    <p className="mt-4 text-sm tracking-[0.3em]">
                      POSTER
                    </p>
                  </div>
                </div>

                <div className="p-7">

                  <div className="mb-4 flex flex-wrap gap-2">

                    <span className="rounded-full bg-[#16233B] px-3 py-1 text-xs font-medium text-white">
                      {work.category}
                    </span>

                    <span className="rounded-full bg-[#F3F3F3] px-3 py-1 text-xs">
                      {work.genre}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        work.type === 'archive'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {work.type === 'archive'
                        ? '아카이브 작품'
                        : '외부 작품'}
                    </span>

                  </div>

                  <h2 className="font-serif text-3xl text-[#16233B]">
                    {work.title}
                  </h2>

                  <p className="mt-2 text-sm text-charcoal/70">
                    {work.author}
                  </p>

                  <p className="mt-6 text-sm leading-7 text-charcoal/75">
                    {work.summary}
                  </p>

                  <div className="mt-7 rounded-[22px] border border-ink/10 bg-[#F8F6F1] p-5">

                    <p className="font-semibold text-[#16233B]">
                      교수님 추천 이유
                    </p>

                    <p className="mt-3 text-sm leading-7 text-charcoal/70">
                      {work.reason}
                    </p>

                  </div>

                  <div className="mt-7 flex items-center gap-6 text-sm text-charcoal/70">

                    <span className="inline-flex items-center gap-1">
                      <Heart
                        size={16}
                        className="text-[#B08D57]"
                      />
                      {work.likes}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <MessageCircle
                        size={16}
                        className="text-[#B08D57]"
                      />
                      {work.comments}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Bookmark
                        size={16}
                        className="text-[#B08D57]"
                      />
                      {work.bookmarks}
                    </span>

                  </div>

                </div>

              </div>

            </article>

          ))}
                  </div>

        {filtered.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-ink/10 bg-[#F8F6F1] py-16 text-center text-charcoal/60">
            검색 결과가 없습니다.
          </div>
        )}

      </section>

    </div>
  );
}
              