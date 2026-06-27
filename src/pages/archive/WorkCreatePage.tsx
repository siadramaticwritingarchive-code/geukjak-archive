import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PageHeader } from '../../components/PageHeader';
import { WorkForm } from '../../components/archive/WorkForm';
import { useAuth } from '../../hooks/useAuth';
import { workService } from '../../services/workService';
import type { CategoryRecord, WorkFormValues } from '../../types/archive';

function splitTags(tagNames: string) {
  return tagNames.split(',').map((tagName) => tagName.trim()).filter(Boolean);
}

export function WorkCreatePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workService.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (values: WorkFormValues) => {
    if (!user || profile?.role !== 'admin') {
      setError('작품 등록 권한이 없습니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const workId = await workService.createWork({
        title: values.title,
        authorName: values.authorName,
        year: values.year,
        genre: values.genre,
        synopsis: values.synopsis,
        categoryId: values.categoryId || null,
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
      setError('작품을 등록하지 못했습니다. 입력값과 권한을 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Archive Admin"
        title="작품 등록"
        description="대표 이미지, PDF, 태그, 공개 상태를 포함해 아카이브 작품을 등록합니다."
      />
      <WorkForm
        mode="create"
        categories={categories}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
