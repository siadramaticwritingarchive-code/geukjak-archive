import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  Bookmark,
  CalendarDays,
  Download,
  Edit,
  FileText,
  Flag,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { commentService } from '../../services/commentService';
import { reportService } from '../../services/reportService';
import { workService } from '../../services/workService';
import type { WorkRecord } from '../../types/archive';
import type { CommentRecord } from '../../types/comment';

type CommentView = CommentRecord & {
  likeCount: number;
  isLiked: boolean;
};

const reportReason = '부적절한 콘텐츠';

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getDisplayName(comment: CommentRecord) {
  return comment.profiles?.display_name ?? '알 수 없는 사용자';
}

export function WorkDetailPage() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [work, setWork] = useState<WorkRecord | null>(null);
  const [comments, setComments] = useState<CommentView[]>([]);
  const [relatedWorks, setRelatedWorks] = useState<WorkRecord[]>([]);
  const [recentWorks, setRecentWorks] = useState<WorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);
  const [hideCopyrightModal, setHideCopyrightModal] = useState(false);
  const [draftComment, setDraftComment] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const didIncrementView = useRef(false);

  const isAdmin = profile?.role === 'admin';
  const canEditWork = isAdmin || (Boolean(user) && work?.created_by === user?.id);
  const posterUrl = useMemo(() => workService.getPosterUrl(work?.poster_path ?? null), [work?.poster_path]);
  const tags = work?.work_tags?.map((workTag) => workTag.tags?.name).filter(Boolean) ?? [];

  const loadComments = async (targetWorkId: string, userId?: string) => {
    setIsCommentsLoading(true);

    try {
      const commentRows = await commentService.getComments(targetWorkId);
      const commentViews = await Promise.all(
        commentRows.map(async (comment) => {
          const [likeCount, likedByUser] = await Promise.all([
            commentService.getLikeCount(comment.id),
            userId ? commentService.isLiked(comment.id, userId) : Promise.resolve(false),
          ]);

          return {
            ...comment,
            likeCount,
            isLiked: likedByUser,
          };
        }),
      );

      setComments(commentViews);
    } catch {
      setActionMessage('댓글을 불러오지 못했습니다.');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (!workId) {
      setError('작품 경로가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    const shouldShowModal =
      !sessionStorage.getItem('sia-copyright-modal-dismissed');
    if (shouldShowModal) {
      setShowCopyrightModal(true);
    }

    let isMounted = true;

    const loadWork = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [workData, publishedWorks] = await Promise.all([
          workService.getWorkById(workId),
          workService.listPublishedWorks({ sort: 'latest' }),
        ]);

        if (!isMounted) {
          return;
        }

        if (!workData) {
          setWork(null);
          setError('작품을 찾을 수 없습니다.');
          return;
        }

        setWork(workData);
        setRelatedWorks(
          publishedWorks
            .filter((item) => {
              if (item.id === workData.id) {
                return false;
              }

              if (workData.category_id) {
                return item.category_id === workData.category_id;
              }

              return item.category === workData.category;
            })
            .slice(0, 3),
        );
        setRecentWorks(
          publishedWorks
            .filter((item) => item.id !== workData.id)
            .slice(0, 3),
        );
      } catch {
        if (isMounted) {
          setError('작품을 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadWork();

    return () => {
      isMounted = false;
    };
  }, [workId]);

  useEffect(() => {
    if (!workId) {
      return;
    }

    void loadComments(workId, user?.id);
  }, [user?.id, workId]);

  useEffect(() => {
    if (!workId || didIncrementView.current) {
      return;
    }

    didIncrementView.current = true;
    void workService.incrementViewCount(workId);
  }, [workId]);

  useEffect(() => {
    if (!workId || !user) {
      setIsBookmarked(false);
      setIsLiked(false);
      return;
    }

    let isMounted = true;

    Promise.all([
      workService.isBookmarked(workId, user.id),
      workService.isLiked(workId, user.id),
    ])
      .then(([bookmarked, liked]) => {
        if (isMounted) {
          setIsBookmarked(bookmarked);
          setIsLiked(liked);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsBookmarked(false);
          setIsLiked(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user, workId]);

  useEffect(() => {
    if (!work?.script_pdf_path || !work.is_pdf_download_allowed) {
      setPdfUrl(null);
      return;
    }

    let isMounted = true;

    workService
      .getPdfUrl(work.script_pdf_path)
      .then((url) => {
        if (isMounted) {
          setPdfUrl(url);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPdfUrl(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [work?.is_pdf_download_allowed, work?.script_pdf_path]);

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
        bookmark_count: Math.max(currentWork.bookmark_count + (nextState ? 1 : -1), 0),
      };
    });
  };

  const handleLike = async () => {
    if (!workId || !user) {
      navigate('/login');
      return;
    }

    const nextState = await workService.toggleLike(workId, user.id);
    setIsLiked(nextState);
    setWork((currentWork) => {
      if (!currentWork) {
        return currentWork;
      }

      return {
        ...currentWork,
        like_count: Math.max(currentWork.like_count + (nextState ? 1 : -1), 0),
      };
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share && work) {
      await navigator.share({
        title: work.title,
        text: `${work.title} - ${work.author_name}`,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setActionMessage('작품 링크를 복사했습니다.');
  };

  const handleReportWork = async () => {
    if (!workId || !user) {
      navigate('/login');
      return;
    }

    const description = window.prompt('신고 내용을 입력해 주세요.');
    if (!description?.trim()) {
      return;
    }

    await reportService.createReport({
      reporter_id: user.id,
      target_type: 'work',
      target_id: workId,
      reason: reportReason,
      description: description.trim(),
    });
    setActionMessage('신고가 접수되었습니다.');
  };

  const handleReportComment = async (commentId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const description = window.prompt('신고 내용을 입력해 주세요.');
    if (!description?.trim()) {
      return;
    }

    await reportService.createReport({
      reporter_id: user.id,
      target_type: 'comment',
      target_id: commentId,
      reason: reportReason,
      description: description.trim(),
    });
    setActionMessage('댓글 신고가 접수되었습니다.');
  };

  const handleDownload = async () => {
    if (!work?.script_pdf_path || !work.is_pdf_download_allowed) {
      return;
    }

    const url = pdfUrl ?? await workService.getPdfUrl(work.script_pdf_path);
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

  const handleCommentSubmit = async () => {
    if (!workId || !user) {
      navigate('/login');
      return;
    }

    const content = draftComment.trim();
    if (!content) {
      return;
    }

    await commentService.createComment({
      work_id: workId,
      author_id: user.id,
      content,
    });
    setDraftComment('');
    await loadComments(workId, user.id);
  };

  const handleCommentLike = async (commentId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const nextState = await commentService.toggleLike(commentId, user.id);
    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== commentId) {
          return comment;
        }

        return {
          ...comment,
          isLiked: nextState,
          likeCount: Math.max(comment.likeCount + (nextState ? 1 : -1), 0),
        };
      }),
    );
  };

  const handleCommentEdit = async (comment: CommentView) => {
    const content = window.prompt('댓글을 수정해 주세요.', comment.content);
    if (!content?.trim()) {
      return;
    }

    await commentService.updateComment(comment.id, {
      content: content.trim(),
    });

    if (workId) {
      await loadComments(workId, user?.id);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    await commentService.deleteComment(commentId);

    if (workId) {
      await loadComments(workId, user?.id);
    }
  };

  const handleCopyrightAgree = () => {
    if (hideCopyrightModal) {
      sessionStorage.setItem('sia-copyright-modal-dismissed', 'true');
    }
    setShowCopyrightModal(false);
  };

  const handleCopyrightCancel = () => {
    navigate('/archive');
  };

  if (isLoading) {
    return <div className="rounded-lg border border-ink/10 bg-white/60 p-6">작품을 불러오는 중입니다.</div>;
  }

  if (error || !work) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error ?? '작품이 없습니다.'}</div>;
  }

  return (
    <div className="space-y-8">
      {showCopyrightModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#16233B]/60 p-4">
          <div className="w-full max-w-lg rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_24px_70px_rgba(22,35,59,0.16)]">
            <div className="flex items-center gap-3 text-[#16233B]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B08D57]/15 text-[#B08D57]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B08D57]">Copyright</p>
                <h2 className="mt-1 font-serif text-2xl">작품 열람 안내</h2>
              </div>
            </div>

            <p className="mt-6 text-base leading-8 text-charcoal/80">
              본 작품은 창작자의 소중한 창작물입니다. 무단 복제, 캡처, 배포, 재업로드 및 AI 학습 이용을 금지합니다.
              모든 저작권은 창작자에게 있습니다. 작품은 창작 및 학습 목적으로만 열람해 주세요.
            </p>

            <label className="mt-6 flex items-center gap-3 rounded-[20px] border border-ink/10 bg-white/70 px-4 py-3 text-sm text-charcoal/75">
              <input type="checkbox" checked={hideCopyrightModal} onChange={(event) => setHideCopyrightModal(event.target.checked)} className="h-4 w-4 rounded border-ink/20 text-[#16233B] focus:ring-[#B08D57]" />
              다시 보지 않기
            </label>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={handleCopyrightCancel} className="btn-secondary rounded-full px-4 py-2.5 text-sm font-semibold">
                취소
              </button>
              <button type="button" onClick={handleCopyrightAgree} className="btn-primary rounded-full px-4 py-2.5 text-sm font-semibold">
                동의하고 열람하기
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <PageHeader
        eyebrow={work.categories?.name ?? work.category}
        title={work.title}
        description={`${work.author_name} · ${work.year} · ${work.genre}`}
      />

      {actionMessage ? (
        <div className="rounded-[20px] border border-[#B08D57]/20 bg-[#F8F6F1] px-4 py-3 text-sm text-[#16233B]">
          {actionMessage}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-ink/10 bg-white/90 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#16233B] via-[#1F2D4A] to-[#B08D57] p-6 text-white">
                {posterUrl ? (
                  <img className="h-full w-full rounded-[24px] object-cover" src={posterUrl} alt={work.title} />
                ) : (
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur">
                    <Sparkles size={28} className="mx-auto text-[#F7E8C7]" />
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#F7E8C7]">Cover</p>
                    <p className="mt-2 text-sm text-white/80">{work.title}</p>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-xs font-semibold text-charcoal/70">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h2 className="mt-5 font-serif text-3xl text-[#16233B]">{work.title}</h2>
                <p className="mt-2 text-base text-charcoal/70">{work.author_name} · {work.genre}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">작성일</p>
                    <p className="mt-2 text-sm text-charcoal/75">{work.year}</p>
                  </div>
                  <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">조회수</p>
                    <p className="mt-2 text-sm text-charcoal/75">{work.view_count}</p>
                  </div>
                  <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">좋아요</p>
                    <p className="mt-2 text-sm text-charcoal/75">{work.like_count}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => void handleBookmark()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} className={isBookmarked ? 'text-[#B08D57]' : ''} /> 즐겨찾기
                  </button>
                  <button type="button" onClick={() => void handleLike()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-[#B08D57]' : ''} /> 좋아요
                  </button>
                  <button type="button" onClick={() => void handleShare()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Share2 size={16} /> 공유하기
                  </button>
                  <button type="button" onClick={() => void handleReportWork()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Flag size={16} /> 신고하기
                  </button>
                  {canEditWork ? (
                    <>
                      <Link to={`/archive/${work.id}/edit`} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                        <Edit size={16} /> 수정
                      </Link>
                      <button type="button" onClick={() => void handleDelete()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-red-300">
                        <Trash2 size={16} /> 삭제
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">로그라인</p>
                <p className="mt-3 text-base leading-8 text-charcoal/80">{work.logline}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">작품 소개</p>
                <p className="mt-3 whitespace-pre-line text-base leading-8 text-charcoal/80">{work.synopsis}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#B08D57]/20 bg-[#F8F6F1] p-4 text-sm leading-7 text-charcoal/75">
              <p className="font-semibold text-[#16233B]">ⓒ 모든 저작권은 작품 작성자에게 있습니다.</p>
              <p className="mt-2">무단 복제 · 배포 · 캡처 · AI 학습 이용을 금지합니다.</p>
            </div>

            <div className="mt-6 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">PDF</p>
                  <p className="mt-2 text-sm text-charcoal/70">
                    {work.script_pdf_path && work.is_pdf_download_allowed ? '첨부된 작품 문서를 열람할 수 있습니다.' : '공개된 작품 문서가 없습니다.'}
                  </p>
                </div>
                <button type="button" onClick={() => void handleDownload()} disabled={!work.script_pdf_path || !work.is_pdf_download_allowed} className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
                  <Download size={16} />
                  PDF 다운로드
                </button>
              </div>
              <div className="mt-4 flex min-h-48 items-center justify-center rounded-[20px] border border-dashed border-ink/15 bg-white/80 text-charcoal/60">
                {pdfUrl ? (
                  <iframe title={`${work.title} PDF`} src={pdfUrl} className="h-96 w-full rounded-[20px] border-0 bg-white" />
                ) : (
                  <div className="text-center">
                    <FileText size={28} className="mx-auto text-[#B08D57]" />
                    <p className="mt-3 text-sm">열람 가능한 PDF가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">댓글</p>
                <h3 className="mt-2 font-serif text-2xl text-[#16233B]">작품에 대한 피드백</h3>
              </div>
              <span className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-sm text-charcoal/70">{comments.length}개</span>
            </div>

            <div className="mt-6 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4">
              <textarea value={draftComment} onChange={(event) => setDraftComment(event.target.value)} rows={4} className="w-full resize-none rounded-[20px] border border-ink/10 bg-white p-4 text-sm outline-none" aria-label="댓글 내용" />
              <div className="mt-3 flex items-center justify-end gap-3">
                <button type="button" onClick={() => void handleCommentSubmit()} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">댓글 작성</button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {isCommentsLoading ? (
                <div className="rounded-[24px] border border-ink/10 bg-white p-4 text-sm text-charcoal/60">댓글을 불러오는 중입니다.</div>
              ) : null}

              {!isCommentsLoading && comments.length === 0 ? (
                <div className="rounded-[24px] border border-ink/10 bg-white p-4 text-sm text-charcoal/60">아직 작성된 댓글이 없습니다.</div>
              ) : null}

              {comments.map((comment) => {
                const canManageComment = isAdmin || comment.author_id === user?.id;

                return (
                  <div key={comment.id} className="rounded-[24px] border border-ink/10 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#16233B]">{getDisplayName(comment)}</p>
                        <p className="mt-1 text-sm text-charcoal/60">{formatDateTime(comment.created_at)}</p>
                      </div>
                      <button type="button" onClick={() => void handleReportComment(comment.id)} className="text-sm text-charcoal/60">신고</button>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-charcoal/75">{comment.content}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-charcoal/60">
                      <button type="button" onClick={() => void handleCommentLike(comment.id)} className="inline-flex items-center gap-1.5">
                        <Heart size={14} fill={comment.isLiked ? 'currentColor' : 'none'} className="text-[#B08D57]" /> {comment.likeCount}
                      </button>
                      <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} className="text-[#B08D57]" /> 0</span>
                      {canManageComment ? (
                        <>
                          <button type="button" onClick={() => void handleCommentEdit(comment)} className="text-[#16233B]">수정</button>
                          <button type="button" onClick={() => void handleCommentDelete(comment.id)} className="text-[#16233B]">삭제</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">작성자 정보</p>
            <div className="mt-4 rounded-[24px] border border-ink/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16233B] text-sm font-semibold text-white">{work.author_name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-[#16233B]">{work.author_name}</p>
                  <p className="text-sm text-charcoal/60">{work.genre} · {work.year}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-charcoal/70">{work.logline}</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">관련 작품</p>
            <div className="mt-4 space-y-3">
              {relatedWorks.length > 0 ? (
                relatedWorks.map((item) => (
                  <Link key={item.id} to={`/archive/${item.id}`} className="block rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70 transition hover:border-[#B08D57]">
                    {item.title}
                  </Link>
                ))
              ) : (
                <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">관련 작품이 없습니다.</div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 등록 작품</p>
              <CalendarDays size={16} className="text-[#B08D57]" />
            </div>
            <div className="mt-4 space-y-3">
              {recentWorks.length > 0 ? (
                recentWorks.map((item) => (
                  <Link key={item.id} to={`/archive/${item.id}`} className="block rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70 transition hover:border-[#B08D57]">
                    {item.title}
                  </Link>
                ))
              ) : (
                <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">최근 등록 작품이 없습니다.</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
