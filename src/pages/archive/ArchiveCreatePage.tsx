import { useNavigate } from 'react-router';
import { toast } from 'sonner';
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

export function ArchiveCreatePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  toast.success(user?.id ?? '');


  const handleSubmit = async (values: WorkFormValues) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

 if (
  profile?.role !== 'dramaticwriting' &&
  profile?.role !== 'staff' &&
  profile?.role !== 'admin'
) {
  throw new Error('작품 등록 권한이 없습니다.');
}

toast.success('createWork 호출!');

    try {
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


  toast.success('등록 성공!');
  navigate(`/archive/${workId}`);
} catch (error) {
  console.error(error);
  toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
}

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
