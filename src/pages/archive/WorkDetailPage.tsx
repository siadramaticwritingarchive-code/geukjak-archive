import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Bookmark, CalendarDays, Download, Edit, Eye, FileText, Flag, Heart, MessageCircle, Share2, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
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
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);
  const [hideCopyrightModal, setHideCopyrightModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarkedState, setBookmarkedState] = useState(false);
  const [draftComment, setDraftComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: number; author: string; role: string; content: string; createdAt: string; likes: number; replies: Array<{ id: number; author: string; content: string; createdAt: string }> }>>([
    {
      id: 1,
      author: '윤서',
      role: 'dramaticwriting',
      content: '작품의 분위기가 정말 섬세해서 몰입감이 좋았습니다.',
      createdAt: '2시간 전',
      likes: 3,
      replies: [{ id: 11, author: '이효정', content: '감사합니다. 다음 작업도 기대해 주세요.', createdAt: '1시간 전' }]
    }
  ]);
  const didIncrementView = useRef(false);

  const isAdmin = profile?.role === 'admin';
  const posterUrl = useMemo(() => workService.getPosterUrl(work?.poster_path ?? null), [work?.poster_path]);
  const tags = work?.work_tags?.map((workTag) => workTag.tags?.name).filter(Boolean) ?? [];

  useEffect(() => {
    if (!workId) {
      return;
    }

    const shouldShowModal = !hideCopyrightModal && !sessionStorage.getItem('sia-copyright-modal-dismissed');
    if (shouldShowModal) {
      setShowCopyrightModal(true);
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

  const handleCommentSubmit = () => {
    if (!draftComment.trim()) {
      return;
    }

    setComments((prev) => [
      {
        id: Date.now(),
        author: profile?.display_name ?? '익명',
        role: profile?.role ?? 'dramaticwriting',
        content: draftComment.trim(),
        createdAt: '방금 전',
        likes: 0,
        replies: []
      },
      ...prev
    ]);
    setDraftComment('');
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
        eyebrow={work.categories?.name ?? 'Work Detail'}
        title={work.title}
        description={`${work.author_name} · ${work.year} · ${work.genre}`}
      />

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-ink/10 bg-white/90 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#16233B] via-[#1F2D4A] to-[#B08D57] p-6 text-white">
                {posterUrl ? (
                  <img className="h-full w-full rounded-[24px] object-cover" src={posterUrl} alt="" />
                ) : (
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur">
                    <Sparkles size={28} className="mx-auto text-[#F7E8C7]" />
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#F7E8C7]">Cover</p>
                    <p className="mt-2 text-sm text-white/80">placeholder preview</p>
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
                  <button type="button" onClick={() => setLiked((prev) => !prev)} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-[#B08D57]' : ''} /> 좋아요
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Share2 size={16} /> 공유하기
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#16233B] transition hover:border-[#B08D57]">
                    <Flag size={16} /> 신고하기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">로그라인</p>
                <p className="mt-3 text-base leading-8 text-charcoal/80">{work.synopsis}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">작품 소개</p>
                <p className="mt-3 text-base leading-8 text-charcoal/80">{work.synopsis}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">기획 의도</p>
                <p className="mt-3 text-base leading-8 text-charcoal/80">이 작품은 학우들의 창작 이해를 돕기 위해 준비된 플레이스홀더 상세 페이지입니다.</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#B08D57]/20 bg-[#F8F6F1] p-4 text-sm leading-7 text-charcoal/75">
              <p className="font-semibold text-[#16233B]">ⓒ 모든 저작권은 작품 작성자에게 있습니다.</p>
              <p className="mt-2">무단 복제 · 배포 · 캡처 · AI 학습 이용을 금지합니다.</p>
            </div>

            <div className="mt-6 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">PDF Viewer</p>
                  <p className="mt-2 text-sm text-charcoal/70">플레이스홀더 PDF 뷰어 영역입니다.</p>
                </div>
                <button type="button" onClick={() => void handleDownload()} disabled={!work.script_pdf_path || !work.is_pdf_download_allowed} className="btn-primary rounded-full px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
                  PDF 다운로드
                </button>
              </div>
              <div className="mt-4 flex h-48 items-center justify-center rounded-[20px] border border-dashed border-ink/15 bg-white/80 text-charcoal/60">
                <div className="text-center">
                  <FileText size={28} className="mx-auto text-[#B08D57]" />
                  <p className="mt-3 text-sm">PDF 미리보기 영역</p>
                </div>
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
              <textarea value={draftComment} onChange={(event) => setDraftComment(event.target.value)} rows={4} className="w-full resize-none rounded-[20px] border border-ink/10 bg-white p-4 text-sm outline-none" placeholder="작품에 대한 의견을 남겨 보세요." />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-charcoal/60">UI 전용 댓글 입력입니다.</p>
                <button type="button" onClick={handleCommentSubmit} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">댓글 작성</button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-[24px] border border-ink/10 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#16233B]">{comment.author}</p>
                      <p className="mt-1 text-sm text-charcoal/60">{comment.role} · {comment.createdAt}</p>
                    </div>
                    <button type="button" className="text-sm text-charcoal/60">수정</button>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-charcoal/75">{comment.content}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-charcoal/60">
                    <span className="inline-flex items-center gap-1.5"><Heart size={14} className="text-[#B08D57]" /> {comment.likes}</span>
                    <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} className="text-[#B08D57]" /> {comment.replies.length}</span>
                    <button type="button" className="text-[#16233B]">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">작성자 정보</p>
            <div className="mt-4 rounded-[24px] border border-ink/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16233B] text-sm font-semibold text-white">{profile?.display_name?.charAt(0) ?? '이'}</div>
                <div>
                  <p className="font-semibold text-[#16233B]">{work.author_name}</p>
                  <p className="text-sm text-charcoal/60">Student · 극작과</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-charcoal/70">이 작품은 학우들의 시청과 피드백을 위한 플레이스홀더 상세 페이지입니다.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">관련 작품</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">같은 카테고리 작품</div>
              <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">최근 등록 작품</div>
              <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">추천 작품 더 보기</div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 등록 작품</p>
              <CalendarDays size={16} className="text-[#B08D57]" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">새로운 시나리오 1</div>
              <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">새로운 희곡 2</div>
              <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">새로운 드라마 3</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
