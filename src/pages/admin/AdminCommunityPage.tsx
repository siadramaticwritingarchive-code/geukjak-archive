import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Eye,
  EyeOff,
  Megaphone,
  Trash2
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { communityService } from '../../services/community';

export function AdminCommunityPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = async () => {
    const data = await communityService.adminListPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    await communityService.deletePost(id);
    await loadPosts();
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="커뮤니티 관리"
        description="게시글을 불러오는 중입니다."
        badge="COMMUNITY"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          게시글을 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="커뮤니티 관리"
      description="커뮤니티 게시글을 관리합니다."
      badge="COMMUNITY"
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08D57]">
                    {post.board_type}
                  </p>

                  <h3 className="mt-2 font-serif text-2xl text-[#16233B]">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-sm text-charcoal/70">
                    작성자 {post.profiles?.display_name ?? '-'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                                    <button
                    type="button"
                    onClick={() =>
                      navigate(`/community/${post.id}`)
                    }
                    className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"
                  >
                    <Eye
                      size={14}
                      className="mr-1 inline"
                    />
                    보기
                  </button>

                  <button
                    type="button"
                    className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"
                  >
                    <EyeOff
                      size={14}
                      className="mr-1 inline"
                    />
                    숨기기
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(post.id)
                    }
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    <Trash2
                      size={14}
                      className="mr-1 inline"
                    />
                    삭제
                  </button>

                  <button
                    type="button"
                    className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-[#16233B]"
                  >
                    <Megaphone
                      size={14}
                      className="mr-1 inline"
                    />
                    공지 지정
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-charcoal/60">
                등록일{' '}
                {new Date(
                  post.created_at
                ).toLocaleDateString('ko-KR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}