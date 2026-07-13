import { useEffect, useState } from 'react';
import {
  FileText,
  Save,
  Send,
  Trash2,
  PencilLine
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { noticeService } from '../../services/noticeService';
import type { Notice } from '../../types/notice';

export function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const loadNotices = async () => {
    const data = await noticeService.listNotices();
    setNotices(data);
  };

  useEffect(() => {
    loadNotices().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleCreate = async (
    published: boolean
  ) => {
    await noticeService.createNotice({
      title,
      content,
      published
    });

    setTitle('');
    setContent('');

    await loadNotices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    await noticeService.deleteNotice(id);
    await loadNotices();
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="공지 관리"
        description="공지를 불러오는 중입니다."
        badge="NOTICES"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          공지를 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="공지 관리"
      description="공지사항을 작성하고 관리합니다."
      badge="NOTICES"
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">

          <div className="flex items-center gap-2 text-[#16233B]">
            <FileText
              size={18}
              className="text-[#B08D57]"
            />

            <h2 className="font-serif text-2xl">
              공지 작성
            </h2>
          </div>

          <div className="mt-6 space-y-4">

            <label className="block text-sm font-medium text-[#16233B]">
              제목

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm outline-none"
                placeholder="공지 제목을 입력하세요."
              />
            </label>

            <label className="block text-sm font-medium text-[#16233B]">
              내용

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                className="mt-2 min-h-48 w-full rounded-2xl border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm outline-none"
                placeholder="공지 내용을 입력하세요."
              />
            </label>

            <div className="flex flex-wrap gap-3">
                            <button
                type="button"
                onClick={() => handleCreate(false)}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"
              >
                <Save
                  size={14}
                  className="mr-1 inline"
                />
                임시 저장
              </button>

              <button
                type="button"
                onClick={() => handleCreate(true)}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"
              >
                <Send
                  size={14}
                  className="mr-1 inline"
                />
                게시
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-[#16233B]">
            최근 공지
          </h2>

          <div className="mt-6 space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-[20px] border border-ink/10 bg-[#F8F6F1] p-4"
              >
                <p className="font-semibold text-[#16233B]">
                  {notice.title}
                </p>

                <p className="mt-2 text-sm text-charcoal/60">
                  작성일{' '}
                  {new Date(
                    notice.created_at
                  ).toLocaleDateString('ko-KR')}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-ink/10 px-3 py-1 text-xs font-semibold"
                  >
                    <PencilLine
                      size={13}
                      className="mr-1 inline"
                    />
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(notice.id)
                    }
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  >
                    <Trash2
                      size={13}
                      className="mr-1 inline"
                    />
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
              