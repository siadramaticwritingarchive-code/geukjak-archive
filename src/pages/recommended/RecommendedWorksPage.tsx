import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';

type RecommendedWork = {
  id: number;
  title: string;
  author: string;
  category: string;
  genre: string;
  recommender: '학생' | '교수';
  source: 'archive' | 'external';
  archiveWorkId?: string;
  reason: string;
  synopsis: string;
  likes: number;
  comments: number;
  bookmarks: number;
  createdAt: string;
};

const recommenders = ['전체', '학생', '교수'];

const sources = ['전체', '아카이브', '직접 추천'];

const categories = [
  '전체',
  '영화',
  '드라마',
  '희곡',
  '뮤지컬',
  '웹소설',
  '웹툰',
  '소설',
  '기타'
];

const sortOptions = [
  '최신순',
  '인기순',
  '좋아요순',
  '댓글순'
];

const works: RecommendedWork[] = [
  {
    id: 1,
    title: '도시의 마지막 빛',
    author: '최유진',
    category: '영화',
    genre: '스릴러',
    recommender: '학생',
    source: 'external',
    reason: '연출과 감정선이 뛰어난 작품입니다.',
    synopsis: '도시의 마지막 하루를 살아가는 사람들의 이야기.',
    likes: 152,
    comments: 24,
    bookmarks: 62,
    createdAt: '2026.06.20'
  },
  {
    id: 2,
    title: '해질 무렵의 연극',
    author: '이서연',
    category: '희곡',
    genre: '휴먼',
    recommender: '교수',
    source: 'archive',
    archiveWorkId: 'sample-work-id',
    reason: '학생 작품 중 완성도가 높아 추천합니다.',
    synopsis: '세 사람의 대화를 통해 상실과 용기를 그린 희곡입니다.',
    likes: 98,
    comments: 12,
    bookmarks: 31,
    createdAt: '2026.06.18'
  },
  {
    id: 3,
    title: '기생충',
    author: '봉준호',
    category: '영화',
    genre: '블랙코미디',
    recommender: '교수',
    source: 'external',
    reason: '장면 설계와 복선 회수를 공부하기 좋은 작품입니다.',
    synopsis: '반지하 가족과 부유한 가족이 만나며 벌어지는 이야기.',
    likes: 231,
    comments: 41,
    bookmarks: 102,
    createdAt: '2026.06.14'
  },
  {
    id: 4,
    title: '모리아',
    author: '이효정',
    category: '웹소설',
    genre: '로맨스 판타지',
    recommender: '학생',
    source: 'archive',
    archiveWorkId: 'moria',
    reason: '세계관과 떡밥 회수가 인상적인 작품입니다.',
    synopsis: '기억을 다루는 능력을 가진 소녀가 황궁의 비밀을 파헤치는 이야기.',
    likes: 74,
    comments: 8,
    bookmarks: 27,
    createdAt: '2026.06.11'
  }
];

export function RecommendedWorksPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRecommender, setSelectedRecommender] = useState('전체');
  const [selectedSource, setSelectedSource] = useState('전체');
  const [sort, setSort] = useState('최신순');
  const [selectedWork, setSelectedWork] =
    useState<RecommendedWork | null>(null);

      useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, navigate, user]);

  const filteredWorks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return works
      .filter((work) => {
        const matchesCategory =
          selectedCategory === '전체' ||
          work.category === selectedCategory;

        const matchesRecommender =
          selectedRecommender === '전체' ||
          work.recommender === selectedRecommender;

        const matchesSource =
          selectedSource === '전체' ||
          (selectedSource === '아카이브' &&
            work.source === 'archive') ||
          (selectedSource === '직접 추천' &&
            work.source === 'external');

        const matchesSearch =
          !keyword ||
          [
            work.title,
            work.author,
            work.genre,
            work.reason
          ]
            .join(' ')
            .toLowerCase()
            .includes(keyword);

        return (
          matchesCategory &&
          matchesRecommender &&
          matchesSource &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case '인기순':
          case '좋아요순':
            return b.likes - a.likes;

          case '댓글순':
            return b.comments - a.comments;

          default:
            return (
              Number(
                new Date(
                  b.createdAt.replace(/\./g, '-')
                )
              ) -
              Number(
                new Date(
                  a.createdAt.replace(/\./g, '-')
                )
              )
            );
        }
      });
  }, [
    search,
    selectedCategory,
    selectedRecommender,
    selectedSource,
    sort
  ]);

    useEffect(() => {
    if (
      !selectedWork &&
      filteredWorks.length > 0
    ) {
      setSelectedWork(filteredWorks[0]);
    }
  }, [filteredWorks, selectedWork]);

  if (isLoading) {
    return (
      <div className="rounded-[32px] border border-ink/10 bg-white/80 p-8">
        인증 상태를 확인하고 있습니다.
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">

      <PageHeader
        eyebrow="추천 작품"
        title="추천 작품"
        description="학생과 교수님이 추천하는 아카이브 작품과 외부 작품을 한곳에서 확인할 수 있습니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white p-6">

        <div className="space-y-5">

          <div>

            <p className="mb-2 text-sm font-semibold">
              추천자
            </p>

            <div className="flex flex-wrap gap-2">

              {recommenders.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setSelectedRecommender(item)
                  }
                  className={`rounded-full px-3 py-2 text-sm ${
                    selectedRecommender === item
                      ? 'bg-[#16233B] text-white'
                      : 'border border-ink/10'
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          <div>

            <p className="mb-2 text-sm font-semibold">
              작품 종류
            </p>

            <div className="flex flex-wrap gap-2">

              {sources.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setSelectedSource(item)
                  }
                  className={`rounded-full px-3 py-2 text-sm ${
                    selectedSource === item
                      ? 'bg-[#16233B] text-white'
                      : 'border border-ink/10'
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

                    <div>

            <p className="mb-2 text-sm font-semibold">
              카테고리
            </p>

            <div className="flex flex-wrap gap-2">

              {categories.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(item)
                  }
                  className={`rounded-full px-3 py-2 text-sm ${
                    selectedCategory === item
                      ? 'bg-[#16233B] text-white'
                      : 'border border-ink/10'
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-3">

              <Search
                size={16}
                className="text-charcoal/50"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="작품명 또는 작가 검색"
                className="w-full bg-transparent outline-none"
              />

            </div>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="rounded-full border border-ink/10 px-4 py-3"
            >

              {sortOptions.map((option) => (

                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>

              ))}

            </select>

            <button
              type="button"
              onClick={() =>
                navigate('/recommended/new')
              }
              className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3"
            >
              <Plus size={16} />
              추천 작품 등록
            </button>

          </div>

        </div>

      </section>

            {filteredWorks.length > 0 ? (

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

          <div className="space-y-4">

            {filteredWorks.map((work) => (

              <button
                key={work.id}
                type="button"
                onClick={() => setSelectedWork(work)}
                className="w-full overflow-hidden rounded-[28px] border border-ink/10 bg-white text-left transition hover:border-[#B08D57]"
              >

                <div className="grid md:grid-cols-[0.9fr_1.1fr]">

                  <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#16233B] via-[#1F2D4A] to-[#B08D57] text-white">

                    <div className="text-center">

                      <Sparkles
                        size={30}
                        className="mx-auto text-[#F7E8C7]"
                      />

                      <p className="mt-3">
                        POSTER
                      </p>

                    </div>

                  </div>

                  <div className="p-6">

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="mb-3 flex flex-wrap gap-2">

                          <span className="rounded-full bg-[#16233B] px-3 py-1 text-xs text-white">
                            {work.category}
                          </span>

                          <span className="rounded-full bg-[#F3F3F3] px-3 py-1 text-xs">
                            {work.genre}
                          </span>

                          <span className="rounded-full bg-[#DCE8FF] px-3 py-1 text-xs">
                            {work.recommender} 추천
                          </span>

                          <span className="rounded-full bg-[#FFF3DD] px-3 py-1 text-xs">
                            {work.source === 'archive'
                              ? '아카이브'
                              : '직접 추천'}
                          </span>

                        </div>

                        <h2 className="font-serif text-2xl text-[#16233B]">
                          {work.title}
                        </h2>

                        <p className="mt-2 text-sm text-charcoal/70">
                          {work.author}
                        </p>

                      </div>

                      <span className="text-xs text-charcoal/50">
                        {work.createdAt}
                      </span>

                    </div>

                                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-charcoal/70">
                      {work.reason}
                    </p>

                    <div className="mt-5 flex items-center gap-5 text-sm text-charcoal/60">

                      <span className="inline-flex items-center gap-1">

                        <Heart
                          size={15}
                          className="text-[#B08D57]"
                        />

                        {work.likes}

                      </span>

                      <span className="inline-flex items-center gap-1">

                        <MessageCircle
                          size={15}
                          className="text-[#B08D57]"
                        />

                        {work.comments}

                      </span>

                      <span className="inline-flex items-center gap-1">

                        <Bookmark
                          size={15}
                          className="text-[#B08D57]"
                        />

                        {work.bookmarks}

                      </span>

                    </div>

                  </div>

                </div>

              </button>

            ))}

          </div>

          <aside className="rounded-[28px] border border-ink/10 bg-[#F8F6F1] p-6">

            {selectedWork ? (

              <>

                <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#16233B] via-[#1F2D4A] to-[#B08D57] text-white">

                  <div className="text-center">

                    <Sparkles
                      size={28}
                      className="mx-auto text-[#F7E8C7]"
                    />

                    <p className="mt-3">
                      POSTER
                    </p>

                  </div>

                </div>

                                <div className="mt-6">

                  <div className="mb-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-[#16233B] px-3 py-1 text-xs text-white">
                      {selectedWork.category}
                    </span>

                    <span className="rounded-full bg-[#F3F3F3] px-3 py-1 text-xs">
                      {selectedWork.genre}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        selectedWork.recommender === '교수'
                          ? 'bg-[#B08D57] text-white'
                          : 'bg-[#DCE8FF] text-[#16233B]'
                      }`}
                    >
                      {selectedWork.recommender} 추천
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        selectedWork.source === 'archive'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {selectedWork.source === 'archive'
                        ? '아카이브 작품'
                        : '직접 추천'}
                    </span>

                  </div>

                  <h2 className="font-serif text-3xl text-[#16233B]">
                    {selectedWork.title}
                  </h2>

                  <p className="mt-2 text-sm text-charcoal/70">
                    {selectedWork.author}
                  </p>

                  <p className="mt-5 text-sm leading-7 text-charcoal/75">
                    {selectedWork.synopsis}
                  </p>

                </div>

                <div className="mt-6 rounded-[20px] border border-ink/10 bg-white p-5">

                  <p className="font-semibold text-[#16233B]">
                    추천 이유
                  </p>

                  <p className="mt-3 text-sm leading-7 text-charcoal/70">
                    {selectedWork.reason}
                  </p>

                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl border border-ink/10 bg-white p-4">
                    ❤️ {selectedWork.likes}
                  </div>

                  <div className="rounded-xl border border-ink/10 bg-white p-4">
                    💬 {selectedWork.comments}
                  </div>

                  <div className="rounded-xl border border-ink/10 bg-white p-4">
                    🔖 {selectedWork.bookmarks}
                  </div>

                  <div className="rounded-xl border border-ink/10 bg-white p-4">
                    📅 {selectedWork.createdAt}
                  </div>

                </div>

                {selectedWork.source === 'archive' && (

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/archive/${selectedWork.archiveWorkId}`
                      )
                    }
                    className="btn-primary mt-6 w-full rounded-2xl py-3 font-semibold"
                  >
                    아카이브 작품 보러가기
                  </button>

                )}

              </>

            ) : (

              <div className="rounded-[24px] border border-ink/10 bg-white p-6 text-center">

                <Sparkles
                  size={28}
                  className="mx-auto text-[#B08D57]"
                />

                <p className="mt-4 font-serif text-2xl text-[#16233B]">
                  추천 작품을 선택하세요
                </p>

                <p className="mt-2 text-sm leading-7 text-charcoal/70">
                  왼쪽 목록에서 작품을 선택하면
                  상세 정보를 확인할 수 있습니다.
                </p>

              </div>

            )}

          </aside>

                  </div>

      ) : (

        <div className="rounded-[32px] border border-ink/10 bg-white p-10 text-center">

          <h2 className="font-serif text-3xl text-[#16233B]">
            검색 결과가 없습니다.
          </h2>

          <p className="mt-3 text-sm leading-7 text-charcoal/70">
            다른 검색어나 필터를 선택해 보세요.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('전체');
              setSelectedRecommender('전체');
              setSelectedSource('전체');
            }}
            className="mt-6 rounded-full border border-[#B08D57] px-6 py-3 font-semibold text-[#B08D57] transition hover:bg-[#B08D57] hover:text-white"
          >
            필터 초기화
          </button>

        </div>

      )}

    </div>

  );
}

