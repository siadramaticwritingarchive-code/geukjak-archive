import { useNavigate } from 'react-router';
import { PageHeader } from '../../components/PageHeader';
import { WorkForm } from '../../components/archive/WorkForm';
import { useAuth } from '../../hooks/useAuth';
import { workService } from '../../services/workService';
import type { WorkFormValues } from '../../types/archive';

function splitTags(tagNames: string) {
  return tagNames
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function WorkCreatePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleSubmit = async (values: WorkFormValues) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (
      profile?.role !== 'professor' &&
      profile?.role !== 'admin'
    ) {
      throw new Error('작품 등록 권한이 없습니다.');
    }

    const workId = await workService.createWork({
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
  };

  return (
    <div className="mx-auto max-w-5xl">

      <PageHeader
        eyebrow="Archive"
        title="작품 등록"
        description="극작과 아카이브에 새로운 작품을 등록합니다."
      />

      <WorkForm
        mode="create"
        isSubmitting={false}
        onSubmit={handleSubmit}
      />

    </div>
  );
}
