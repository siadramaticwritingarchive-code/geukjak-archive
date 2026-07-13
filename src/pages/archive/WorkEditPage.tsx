import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '../../components/PageHeader';
import { WorkForm } from '../../components/archive/WorkForm';
import { useAuth } from '../../hooks/useAuth';
import { workService } from '../../services/workService';
import type { WorkFormValues, WorkRecord } from '../../types/archive';

function splitTags(tagNames: string) {
  return tagNames
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function WorkEditPage() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [work, setWork] = useState<WorkRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workId) return;

    workService
      .getWorkById(workId)
      .then((data) => {
        setWork(data);
      })
      .catch(() => {
        setError('작품 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [workId]);

  const handleSubmit = async (values: WorkFormValues) => {
    if (!workId || !user || profile?.role !== 'admin') {
      setError('작품 수정 권한이 없습니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await workService.updateWork(workId, {
  title: values.title,
  authorName: values.authorName,
  year: values.year,
  category: values.category,
  genre: values.genre,
  logline: values.logline,
  synopsis: values.synopsis,
  tagNames: splitTags(values.tagNames),
  visibility: values.visibility,
  isPdfDownloadAllowed: values.isPdfDownloadAllowed,
  isFeatured: values.isFeatured,
  posterFile: values.posterFile?.[0] ?? null,
  pdfFile: values.pdfFile?.[0] ?? null,
  userId: user.id
});

      navigate(`/archive/${workId}`);
    } catch {
      setError('작품을 수정하지 못했습니다. 입력값과 권한을 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
   if (isLoading) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white/60 p-6">
        작품 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (!work) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        {error ?? '작품이 없습니다.'}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Archive"
        title="작품 수정"
        description="작품 정보를 수정하고 변경 사항을 저장합니다."
      />

      <WorkForm
        mode="edit"
        initialWork={work}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 