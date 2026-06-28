import { Bookmark, CalendarDays, Eye, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import type { WorkRecord } from '../../types/archive';
import { workService } from '../../services/workService';

type WorkCardProps = {
  work: WorkRecord;
};

export function WorkCard({ work }: WorkCardProps) {
  const posterUrl = workService.getPosterUrl(work.poster_path);
  const tags = work.work_tags?.map((workTag) => workTag.tags?.name).filter(Boolean) ?? [];
  const createdDate = work.created_at
    ? new Date(work.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '미등록';

  return (
    <Link
      to={`/archive/${work.id}`}
      className="card-surface group overflow-hidden rounded-[28px] border border-ink/10 bg-white/90 shadow-[0_16px_40px_rgba(22,35,59,0.08)] transition-all hover:border-[#B08D57]/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#16233B] via-[#1F2D4A] to-[#B08D57]">
        {posterUrl ? (
          <img
            className="h-full w-full object-cover opacity-95 transition duration-300 group-hover:scale-[1.03]"
            src={posterUrl}
            alt=""
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-5 text-ivory">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F7E8C7]">
                Archive
              </span>
              <Sparkles size={16} className="text-[#F7E8C7]" />
            </div>
            <div>
              <p className="text-sm text-white/70">대표 이미지 준비 중</p>
              <p className="mt-2 font-serif text-2xl leading-tight">{work.title}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#0f1728]/70 to-transparent px-4 py-4 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F7E8C7]">
            {work.genre}
          </span>
          <span className="text-sm text-white/80">{work.year}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">
              {work.genre} · {work.year}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">{work.title}</h2>
            <p className="mt-1 text-sm text-charcoal/70">{work.author_name}</p>
          </div>
          {work.is_featured ? (
            <span className="rounded-full bg-[#F8F6F1] px-3 py-1 text-xs font-semibold text-[#B08D57]">
              Featured
            </span>
          ) : null}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-charcoal/70">{work.synopsis}</p>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-xs text-charcoal/70">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-sm text-charcoal/70">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#B08D57]" /> 작성일
            </span>
            <span>{createdDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <Eye size={14} className="text-[#B08D57]" /> 조회수
            </span>
            <span>{work.view_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <Heart size={14} className="text-[#B08D57]" /> 좋아요
            </span>
            <span>{work.like_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle size={14} className="text-[#B08D57]" /> 댓글
            </span>
            <span>0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <Bookmark size={14} className="text-[#B08D57]" /> 북마크
            </span>
            <span>{work.bookmark_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
