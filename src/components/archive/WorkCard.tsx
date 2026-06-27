import { Bookmark, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router';
import type { WorkRecord } from '../../types/archive';
import { workService } from '../../services/workService';

type WorkCardProps = {
  work: WorkRecord;
};

export function WorkCard({ work }: WorkCardProps) {
  const posterUrl = workService.getPosterUrl(work.poster_path);
  const tags = work.work_tags?.map((workTag) => workTag.tags?.name).filter(Boolean) ?? [];

  return (
    <Link
      to={`/archive/${work.id}`}
      className="group overflow-hidden rounded-lg border border-ink/10 bg-white/60 shadow-sm shadow-ink/5 transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg hover:shadow-ink/10"
    >
      <div className="aspect-[4/5] bg-ink">
        {posterUrl ? (
          <img
            className="h-full w-full object-cover opacity-95 transition group-hover:scale-[1.03]"
            src={posterUrl}
            alt=""
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-5 text-ivory">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Archive
            </span>
            <span className="font-serif text-3xl leading-tight">{work.title}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {work.genre} · {work.year}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">{work.title}</h2>
            <p className="mt-1 text-sm text-charcoal/70">{work.author_name}</p>
          </div>
          {work.is_featured ? (
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
              Featured
            </span>
          ) : null}
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-charcoal/75">{work.synopsis}</p>
        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-ink/10 px-3 py-1 text-xs text-charcoal/70">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex items-center gap-4 text-xs text-charcoal/60">
          <span className="inline-flex items-center gap-1">
            <Eye size={14} /> {work.view_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart size={14} /> {work.like_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bookmark size={14} /> {work.bookmark_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
