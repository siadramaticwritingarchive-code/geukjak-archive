import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Bookmark, Download, Edit, Eye, FileText, Heart, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { workService } from '../../services/workService';
import type { WorkRecord } from '../../types/archive';

export function WorkDetailPage() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [work, setWork] = useState<WorkRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didIncrementView = useRef(false);

  const isAdmin = profile?.role === 'admin';
  const posterUrl = useMemo(() => workService.getPosterUrl(work?.poster_path ?? null), [work?.poster_path]);
  const tags = work?.work_tags?.map((workTag) => workTag.tags?.name).filter(Boolean) ?? [];

  useEffect(() => {
    if (!workId) {
      return;
    }

    let isMounted = true;

    workService
      .getWorkById(workId)
      .then((data) => {
        if (isMounted) {
          setWork(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('작품을 불러오지 못했습니다.');
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
  }, [workId]);

  useEffect(() => {
    if (!workId || didIncrementView.current) {
      return;
    }

    didIncrementView.current = true;
    void workService.incrementViewCount(workId);
  }, [workId]);

  useEffect(() => {
    if (!workId || !user) {
      return;
    }

    workService.isBookmarked(workId, user.id).then(setIsBookmarked).catch(() => setIsBookmarked(false));
  }, [user, workId]);

  const handleBookmark = async () => {
    if (!workId || !user) {
      navigate('/login');
      return;
    }

    const nextState = await workService.toggleBookmark(workId, user.id);
    setIsBookmarked(nextState);
    setWork((currentWork) => {
      if (!currentWork) {
        return currentWork;
      }

      return {
        ...currentWork,
        bookmark_count: Math.max(
          currentWork.bookmark_count + (nextState ? 1 : -1),
          0,
        )
      };
    });
  };

  const handleDownload = async () => {
    if (!work?.script_pdf_path || !work.is_pdf_download_allowed) {
      return;
    }

    const url = await workService.getPdfUrl(work.script_pdf_path);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDelete = async () => {
    if (!workId || !window.confirm('이 작품을 삭제하시겠습니까?')) {
      return;
    }

    await workService.deleteWork(workId);
    navigate('/archive');
  };

  if (isLoading) {
    return <div className="rounded-lg border border-ink/10 bg-white/60 p-6">작품을 불러오는 중입니다.</div>;
  }

  if (error || !work) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error ?? '작품이 없습니다.'}</div>;
  }

  return (
    <div>
      <PageHeader
        eyebrow={work.categories?.name ?? 'Work Detail'}
        title={work.title}
        description={`${work.author_name} · ${work.year} · ${work.genre}`}
      />

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="overflow-hidden rounded-lg border border-ink/10 bg-ink shadow-sm shadow-ink/10">
          <div className="aspect-[4/5]">
            {posterUrl ? (
              <img className="h-full w-full object-cover" src={posterUrl} alt="" />
            ) : (
              <div className="flex h-full flex-col justify-between p-8 text-ivory">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Archive</span>
                <span className="font-serif text-5xl leading-tight">{work.title}</span>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-ink/10 bg-white/50 px-3 py-1 text-sm text-charcoal/75">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm shadow-ink/5">
            <h2 className="font-serif text-3xl">Synopsis</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-charcoal/80">{work.synopsis}</p>
            <div className="mt-6 grid gap-3 border-t border-ink/10 pt-6 text-sm text-charcoal/70 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <Eye size={16} /> {work.view_count} views
              </span>
              <span className="inline-flex items-center gap-2">
                <Heart size={16} /> {work.like_count} likes
              </span>
              <span className="inline-flex items-center gap-2">
                <Bookmark size={16} /> {work.bookmark_count} bookmarks
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleBookmark()}
              className="inline-flex items-center gap-2 rounded-lg border border-ink/15 bg-white/60 px-4 py-3 text-sm font-semibold transition hover:border-gold"
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
            </button>
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={!work.script_pdf_path || !work.is_pdf_download_allowed}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} /> PDF 다운로드
            </button>
            {work.script_pdf_path && !work.is_pdf_download_allowed ? (
              <span className="inline-flex items-center gap-2 rounded-lg border border-ink/10 px-4 py-3 text-sm text-charcoal/65">
                <FileText size={16} /> PDF 열람 제한
              </span>
            ) : null}
          </div>

          {isAdmin ? (
            <div className="mt-5 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
              <Link
                to={`/archive/${work.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-gold bg-gold px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ivory"
              >
                <Edit size={16} /> 수정
              </Link>
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={16} /> 삭제
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
