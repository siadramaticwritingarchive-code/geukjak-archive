import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { WorkCard } from '../../components/archive/WorkCard';
import { useAuth } from '../../hooks/useAuth';
import { workService } from '../../services/workService';
import type { CategoryRecord, WorkRecord, WorkSort } from '../../types/archive';

const sortOptions: Array<{ label: string; value: WorkSort }> = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
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

  const isAdmin = profile?.role === 'admin';

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
    <div>
      <PageHeader
        eyebrow="Archive"
        title="희곡의 표지, 문장, 기록을 한 곳에서 탐색합니다."
        description="제목, 작가, 태그로 검색하고 카테고리와 정렬 기준으로 작품을 좁혀 볼 수 있습니다."
      />

      <section className="mb-8 rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm shadow-ink/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="text-sm font-medium text-ink">검색</span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink/15 bg-white/70 px-4 py-3 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25">
              <Search size={18} className="text-charcoal/50" />
              <input
                className="w-full bg-transparent text-base outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="제목, 작가, 태그"
              />
            </div>
          </label>
          <label className="min-w-52">
            <span className="text-sm font-medium text-ink">카테고리</span>
            <select
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">전체</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-44">
            <span className="text-sm font-medium text-ink">정렬</span>
            <select
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
              value={sort}
              onChange={(event) => setSort(event.target.value as WorkSort)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {isAdmin ? (
            <Link
              to="/archive/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ivory transition hover:bg-charcoal"
            >
              <Plus size={16} /> 작품 등록
            </Link>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-charcoal/70">{resultLabel}</p>
      </section>

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-lg bg-ink/10" />
          ))}
        </div>
      ) : works.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-ink/10 bg-white/60 p-8 text-center">
          <p className="font-serif text-2xl">조건에 맞는 작품이 없습니다.</p>
          <p className="mt-2 text-sm text-charcoal/70">검색어 또는 필터를 조정해 보세요.</p>
        </div>
      )}
    </div>
  );
}
