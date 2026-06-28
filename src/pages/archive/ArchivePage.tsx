import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { WorkCard } from '../../components/archive/WorkCard';
import { useAuth } from '../../hooks/useAuth';
import { workService } from '../../services/workService';
import type { CategoryRecord, WorkRecord, WorkSort } from '../../types/archive';

const genreOptions = [
  { label: '전체', value: '' },
  { label: '희곡', value: '희곡' },
  { label: '시나리오', value: '시나리오' },
  { label: '드라마', value: '드라마' },
  { label: '뮤지컬', value: '뮤지컬' },
  { label: '웹소설', value: '웹소설' },
  { label: '기타', value: '기타' }
];

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '조회순', value: 'views' },
  { label: '좋아요순', value: 'likes' }
];

export function ArchivePage() {
  const { profile } = useAuth();
  const [works, setWorks] = useState<WorkRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState<WorkSort>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canWrite =
  profile?.role === 'dramaticwriting' ||
  profile?.role === 'professor';


  const handleGenreChange = (value: string) => {
    const matchedCategory = categories.find((category) => category.name === value);
    setCategoryId(matchedCategory?.id ?? '');
  };

  useEffect(() => {
    workService.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let isMounted = true;

    workService
      .listPublishedWorks({ search, categoryId, sort })
      .then((data) => {
        if (isMounted) {
          setWorks(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('작품 목록을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId, search, sort]);

  const resultLabel = useMemo(() => {
    if (isLoading) {
      return '작품을 불러오는 중입니다.';
    }

    return `${works.length}개의 작품`;
  }, [isLoading, works.length]);

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-ink/10 bg-white/85 p-7 shadow-[0_24px_70px_rgba(22,35,59,0.08)] sm:p-8 lg:p-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#B08D57]">Archive</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-[#16233B] sm:text-4xl">
              극작과 아카이브
            </h1>
            <p className="mt-4 text-base leading-8 text-charcoal/75">
              극작과 학생들의 다양한 창작물을 열람하고, 
              좋아요와 댓글을 통해 서로 피드백을 나누며 함께 성장하는 공간입니다.
            </p>
          </div>
          {canWrite ? (
            <Link
              to="/archive/new"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              <Plus size={16} /> 작품 등록
            </Link>
          ) : null}
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_0.7fr_0.55fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">검색</span>
            <div className="form-field flex items-center gap-2 px-4 py-3">
              <Search size={18} className="text-charcoal/50" />
              <input
                className="w-full bg-transparent text-base outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="제목 또는 작가를 검색해 보세요."
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">카테고리</span>
            <select
              className="form-field w-full text-base outline-none"
              value={categoryId}
              onChange={(event) => handleGenreChange(event.target.value)}
            >
              {genreOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">정렬</span>
            <select
              className="form-field w-full text-base outline-none"
              value={sort}
              onChange={(event) => setSort(event.target.value as WorkSort)}
            >
              {sortOptions.map((option) => (
                <option key={`${option.value}-${option.label}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-charcoal/70">{resultLabel}</p>
          <p className="text-sm text-charcoal/60">다양한 카테고리의 작품을 탐색하고,
            좋아요와 댓글을 통해 자유롭게 피드백을 나눠보세요.</p>
        </div>
      </section>

      {error ? <p className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-[28px] border border-ink/10 bg-ink/10" />
          ))}
        </div>
      ) : works.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-ink/10 bg-white/80 p-8 text-center shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
          <p className="font-serif text-2xl text-[#16233B]">아직 등록된 작품이 없습니다.</p>
          <p className="mt-2 text-sm leading-7 text-charcoal/70">첫 번째 작품을 등록해 보세요.</p>
          {canWrite ? (
            <Link
              to="/archive/new"
              className="btn-primary mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              <Plus size={16} /> 작품 등록
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
