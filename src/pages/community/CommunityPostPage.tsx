import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Bookmark, Flag, Heart, MessageCircle, PencilLine, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { communityService } from '../../services/community';
import { reportService } from '../../services/reportService';
import type { BoardType } from '../../types/community';
import type { ReportTargetType } from '../../types/report';

type ProfileSummary = {
  id: string;
  display_name: string | null;
  avatar_path?: string | null;
};

type CommunityPostRecord = {
  id: string;
  board_type: BoardType;
  title: string;
  content: string;
  author_id?: string | null;
  created_by?: string | null;
  created_at: string;
  view_count?: number | null;
  like_count?: number | null;
  bookmark_count?: number | null;
  comment_count?: number | null;
  is_pinned?: boolean | null;
  profiles?: ProfileSummary | ProfileSummary[] | null;
};

type CommunityCommentRecord = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  profiles?: ProfileSummary | ProfileSummary[] | null;
  replies?: unknown[] | null;
};

type CommentView = CommunityCommentRecord & {
  likeCount: number;
  isLiked: boolean;
};

type ReportTarget = {
  type: ReportTargetType;
  id: string;
};

const boardLabels: Record<BoardType, string> = {
  free: '자유게시판',
  questions: '질문',
  announcements: '공지사항',
  anonymous: '익명게시판',
};

const reportReasons = [
  '스팸 또는 광고',
  '욕설 또는 혐오 표현',
  '개인정보 노출',
  '저작권 침해',
  '기타',
];

function firstProfile(profile: ProfileSummary | ProfileSummary[] | null | undefined) {
  if (Array.isArray(profile)) {
    return profile[0] ?? null;
  }

  return profile ?? null;
}

function getAuthorName(record: { profiles?: ProfileSummary | ProfileSummary[] | null; board_type?: BoardType }) {
  if (record.board_type === 'anonymous') {
    return '익명';
  }

  return firstProfile(record.profiles)?.display_name ?? '알 수 없는 사용자';
}

function getPostOwnerId(post: CommunityPostRecord) {
  return post.author_id ?? post.created_by ?? null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function CommunityPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [post, setPost] = useState<CommunityPostRecord | null>(null);
  const [recentPosts, setRecentPosts] = useState<CommunityPostRecord[]>([]);
  const [comments, setComments] = useState<CommentView[]>([]);
  const [draft, setDraft] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [reportReason, setReportReason] = useState(reportReasons[0]);
  const [reportDescription, setReportDescription] = useState('');

  const boardLabel = post ? boardLabels[post.board_type] : '';
  const postAuthor = post ? getAuthorName(post) : '';
  const postOwnerId = post ? getPostOwnerId(post) : null;
  const canManagePost = profile?.role === 'admin' || (Boolean(user) && postOwnerId === user?.id);

  const commentCount = useMemo(
    () => post?.comment_count ?? comments.length,
    [comments.length, post?.comment_count],
  );

  const loadComments = async (targetPostId: string, userId?: string) => {
    setIsCommentsLoading(true);

    try {
      const { data, error: commentsError } = await communityService.getPostComments(targetPostId);

      if (commentsError) {
        throw commentsError;
      }

      const commentRows = (data ?? []) as unknown as CommunityCommentRecord[];
      const nextComments = await Promise.all(
        commentRows.map(async (comment) => {
          const [likeCount, likedByUser] = await Promise.all([
            communityService.getCommentLikeCount(comment.id),
            userId ? communityService.isCommentLiked(comment.id, userId) : Promise.resolve(false),
          ]);

          return {
            ...comment,
            likeCount,
            isLiked: likedByUser,
          };
        }),
      );

      setComments(nextComments);
    } catch {
      setActionMessage('댓글을 불러오지 못했습니다.');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) {
      setError('게시글 경로가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadPost = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [{ data: postData, error: postError }, { data: recentData }] = await Promise.all([
          communityService.getPostById(postId),
          communityService.listPosts({ page: 1, pageSize: 5 }),
        ]);

        if (postError) {
          throw postError;
        }

        if (!isMounted) {
          return;
        }

        if (!postData) {
          setPost(null);
          setError('게시글을 찾을 수 없습니다.');
          return;
        }

        setPost(postData as unknown as CommunityPostRecord);
        setRecentPosts(
          ((recentData ?? []) as unknown as CommunityPostRecord[])
            .filter((item) => item.id !== postId)
            .slice(0, 3),
        );
      } catch {
        if (isMounted) {
          setError('게시글을 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  useEffect(() => {
    if (!postId) {
      return;
    }

    void loadComments(postId, user?.id);
  }, [postId, user?.id]);

  useEffect(() => {
    if (!postId || !user) {
      setIsLiked(false);
      setIsBookmarked(false);
      return;
    }

    let isMounted = true;

    Promise.all([
      communityService.isPostLiked(postId, user.id),
      communityService.isPostBookmarked(postId, user.id),
    ])
      .then(([liked, bookmarked]) => {
        if (isMounted) {
          setIsLiked(liked);
          setIsBookmarked(bookmarked);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLiked(false);
          setIsBookmarked(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [postId, user]);

  const handleAddComment = async () => {
    if (!postId || !user) {
      navigate('/login');
      return;
    }

    const content = draft.trim();
    if (!content) {
      return;
    }

    await communityService.createComment(postId, user.id, content);
    setDraft('');
    setPost((currentPost) => {
      if (!currentPost) {
        return currentPost;
      }

      return {
        ...currentPost,
        comment_count: (currentPost.comment_count ?? comments.length) + 1,
      };
    });
    await loadComments(postId, user.id);
  };

  const handleToggleLike = async () => {
    if (!postId || !user) {
      navigate('/login');
      return;
    }

    const nextState = await communityService.togglePostLike(postId, user.id);
    setIsLiked(nextState);
    setPost((currentPost) => {
      if (!currentPost) {
        return currentPost;
      }

      return {
        ...currentPost,
        like_count: Math.max((currentPost.like_count ?? 0) + (nextState ? 1 : -1), 0),
      };
    });
  };

  const handleToggleBookmark = async () => {
    if (!postId || !user) {
      navigate('/login');
      return;
    }

    const nextState = await communityService.togglePostBookmark(postId, user.id);
    setIsBookmarked(nextState);
    setPost((currentPost) => {
      if (!currentPost) {
        return currentPost;
      }

      return {
        ...currentPost,
        bookmark_count: Math.max((currentPost.bookmark_count ?? 0) + (nextState ? 1 : -1), 0),
      };
    });
  };

  const handleToggleCommentLike = async (commentId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const nextState = await communityService.toggleCommentLike(commentId, user.id);
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

  const startCommentEdit = (comment: CommentView) => {
    setEditingCommentId(comment.id);
    setEditingDraft(comment.content);
  };

  const handleUpdateComment = async (commentId: string) => {
    const content = editingDraft.trim();
    if (!content) {
      return;
    }

    await communityService.updateComment(commentId, content);
    setEditingCommentId(null);
    setEditingDraft('');

    if (postId) {
      await loadComments(postId, user?.id);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    await communityService.deleteComment(commentId);
    setPost((currentPost) => {
      if (!currentPost) {
        return currentPost;
      }

      return {
        ...currentPost,
        comment_count: Math.max((currentPost.comment_count ?? comments.length) - 1, 0),
      };
    });

    if (postId) {
      await loadComments(postId, user?.id);
    }
  };

  const handleDeletePost = async () => {
    if (!postId || !window.confirm('게시글을 삭제하시겠습니까?')) {
      return;
    }

    await communityService.deletePost(postId);
    navigate('/community');
  };

  const openReportModal = (target: ReportTarget) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setReportTarget(target);
    setReportReason(reportReasons[0]);
    setReportDescription('');
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setReportReason(reportReasons[0]);
    setReportDescription('');
  };

  const handleSubmitReport = async () => {
    if (!user || !reportTarget) {
      return;
    }

    await reportService.createReport({
      reporter_id: user.id,
      target_type: reportTarget.type,
      target_id: reportTarget.id,
      reason: reportReason,
      description: reportDescription.trim() || undefined,
    });
    setActionMessage('신고가 접수되었습니다.');
    closeReportModal();
  };

  if (isLoading) {
    return <div className="rounded-lg border border-ink/10 bg-white/60 p-6">게시글을 불러오는 중입니다.</div>;
  }

  if (error || !post) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error ?? '게시글이 없습니다.'}</div>;
  }

  return (
    <div className="space-y-8">
      {reportTarget ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#16233B]/60 p-4">
          <div className="w-full max-w-lg rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_24px_70px_rgba(22,35,59,0.16)]">
            <div className="flex items-center gap-3 text-[#16233B]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B08D57]/15 text-[#B08D57]">
                <Flag size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B08D57]">Report</p>
                <h2 className="mt-1 font-serif text-2xl">신고하기</h2>
              </div>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold text-ink">신고 사유</span>
              <select value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="form-field w-full">
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-ink">상세 내용</span>
              <textarea value={reportDescription} onChange={(event) => setReportDescription(event.target.value)} rows={5} className="form-field min-h-32 w-full resize-none" />
            </label>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={closeReportModal} className="btn-secondary rounded-full px-4 py-2.5 text-sm font-semibold">
                취소
              </button>
              <button type="button" onClick={() => void handleSubmitReport()} className="btn-primary rounded-full px-4 py-2.5 text-sm font-semibold">
                신고 접수
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <PageHeader
        eyebrow="Community"
        title={post.title}
        description={`${boardLabel} · ${postAuthor} · ${formatDate(post.created_at)}`}
      />

      {actionMessage ? (
        <div className="rounded-[20px] border border-[#B08D57]/20 bg-[#F8F6F1] px-4 py-3 text-sm text-[#16233B]">
          {actionMessage}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <article className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex flex-wrap items-center gap-3">
              {post.is_pinned ? <span className="rounded-full bg-[#B08D57] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">공지</span> : null}
              <span className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-xs font-semibold text-charcoal/70">{boardLabel}</span>
            </div>
            <h2 className="mt-5 font-serif text-3xl text-[#16233B]">{post.title}</h2>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal/60">
              <span>작성자 {postAuthor}</span>
              <span>작성일 {formatDate(post.created_at)}</span>
              <span>조회수 {post.view_count ?? 0}</span>
              <span>좋아요 {post.like_count ?? 0}</span>
              <span>댓글 {commentCount}</span>
            </div>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-charcoal/80">{post.content}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => void handleToggleLike()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-[#B08D57]' : ''} /> 좋아요
              </button>
              <button type="button" onClick={() => void handleToggleBookmark()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} className={isBookmarked ? 'text-[#B08D57]' : ''} /> 북마크
              </button>
              <button type="button" onClick={() => openReportModal({ type: 'community', id: post.id })} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
                <Flag size={16} /> 신고
              </button>
              {canManagePost ? (
                <>
                  <button type="button" onClick={() => navigate('/community/write')} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
                    <PencilLine size={16} /> 수정
                  </button>
                  <button type="button" onClick={() => void handleDeletePost()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
                    <Trash2 size={16} /> 삭제
                  </button>
                </>
              ) : null}
            </div>
          </article>

          <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-2xl text-[#16233B]">댓글</h3>
              <span className="rounded-full border border-ink/10 bg-[#F8F6F1] px-3 py-1 text-sm text-charcoal/70">{comments.length}개</span>
            </div>
            <div className="mt-6 rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-4">
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} className="w-full resize-none rounded-[20px] border border-ink/10 bg-white p-4 text-sm outline-none" aria-label="댓글 내용" />
              <div className="mt-3 flex items-center justify-end gap-3">
                <button type="button" onClick={() => void handleAddComment()} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">댓글 작성</button>
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
                const canManageComment = profile?.role === 'admin' || comment.author_id === user?.id;
                const repliesCount = Array.isArray(comment.replies) ? comment.replies.length : 0;

                return (
                  <div key={comment.id} className="rounded-[24px] border border-ink/10 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#16233B]">{getAuthorName({ profiles: comment.profiles })}</p>
                        <p className="mt-1 text-sm text-charcoal/60">{formatDateTime(comment.created_at)}</p>
                      </div>
                      <button type="button" onClick={() => openReportModal({ type: 'comment', id: comment.id })} className="text-sm text-charcoal/60">신고</button>
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="mt-3">
                        <textarea value={editingDraft} onChange={(event) => setEditingDraft(event.target.value)} rows={3} className="w-full resize-none rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-4 text-sm outline-none" aria-label="댓글 수정 내용" />
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => void handleUpdateComment(comment.id)} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">저장</button>
                          <button type="button" onClick={() => setEditingCommentId(null)} className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold">취소</button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-charcoal/75">{comment.content}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-charcoal/60">
                      <button type="button" onClick={() => void handleToggleCommentLike(comment.id)} className="inline-flex items-center gap-1.5">
                        <Heart size={14} fill={comment.isLiked ? 'currentColor' : 'none'} className="text-[#B08D57]" /> {comment.likeCount}
                      </button>
                      <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} className="text-[#B08D57]" /> {repliesCount}</span>
                      {canManageComment ? (
                        <>
                          <button type="button" onClick={() => startCommentEdit(comment)} className="text-[#16233B]">수정</button>
                          <button type="button" onClick={() => void handleDeleteComment(comment.id)} className="text-[#16233B]">삭제</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-ink/10 bg-[#F8F6F1] p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">커뮤니티 안내</p>
            <p className="mt-4 text-sm leading-7 text-charcoal/70">서로의 창작과 학업을 존중하는 댓글과 게시글 문화를 함께 지켜 주세요.</p>
          </div>
          <div className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08D57]">최근 게시글</p>
            <div className="mt-4 space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map((item) => (
                  <button key={item.id} type="button" onClick={() => navigate(`/community/${item.id}`)} className="w-full rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-left text-sm">
                    <p className="font-semibold text-[#16233B]">{item.title}</p>
                    <p className="mt-1 text-charcoal/60">{boardLabels[item.board_type]} · {formatDate(item.created_at)}</p>
                  </button>
                ))
              ) : (
                <div className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-3 text-sm text-charcoal/70">최근 게시글이 없습니다.</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
