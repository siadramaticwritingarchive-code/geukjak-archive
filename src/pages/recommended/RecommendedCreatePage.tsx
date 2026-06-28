import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, CheckCircle2, Image as ImageIcon, Plus, Sparkles, UploadCloud } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { getSupabaseClient } from '../../lib/supabase';


type RecommendedDraftState = {
  title: string;
  author: string;
  category: string;
  genre: string;
  synopsis: string;
  reason: string;
  link: string;
  posterName: string;
  posterPreview: string | null;
};

const initialDraft: RecommendedDraftState = {
  title: '',
  author: '',
  category: ' ',
  genre: ' ',
  synopsis: '',
  reason: '',
  link: '',
  posterName: '',
  posterPreview: null
};

export function RecommendedCreatePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<RecommendedDraftState>(initialDraft);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsAutoSaved(true);
      window.setTimeout(() => setIsAutoSaved(false), 1600);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [draft, isDirty]);

  const handleFieldChange = (field: keyof RecommendedDraftState, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handlePosterSelect = (file?: File | null) => {
    if (!file) {
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, posterName: file.name, posterPreview: previewUrl }));
    setIsDirty(true);
  };

  useEffect(() => {
    return () => {
      if (draft.posterPreview) {
        URL.revokeObjectURL(draft.posterPreview);
      }
    };
  }, [draft.posterPreview]);

  const previewSummary = useMemo(() => ({
    title: draft.title || '추천 작품 제목',
    author: draft.author || '작가명',
    category: draft.category || '카테고리',
    genre: draft.genre || '장르',
    synopsis: draft.synopsis || '줄거리가 여기에 표시됩니다.',
    reason: draft.reason || '추천 이유가 여기에 표시됩니다.'
  }), [draft]);

  const handleLeave = () => {
    if (!isDirty) {
      navigate('/recommended');
      return;
    }
    setShowLeavePrompt(true);
  };
const handleSubmit = async () => {
  console.log(draft);

  alert('등록 준비 완료!');
};



  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        eyebrow="Recommended"
        title="추천 작품 등록"
        description="추천 작품 정보를 입력하고, 미리보기와 자동 저장 흐름을 확인할 수 있는 UI입니다."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-charcoal/70">
          {isAutoSaved ? <span className="inline-flex items-center gap-2 text-[#B08D57]"><CheckCircle2 size={16} /> 자동 저장되었습니다.</span> : '작성 중인 내용은 자동 저장 인터페이스로 표시됩니다.'}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold" onClick={() => setIsPreviewOpen(true)}>미리보기</button>
          <button type="button" className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold" onClick={handleLeave}>나가기</button>
          <button
  type="button"
  onClick={handleSubmit}
  className="btn-primary rounded-full px-4 py-3 text-sm font-semibold"
>
  등록하기
</button>
        </div>
      </div>

      <section className="rounded-[32px] border border-ink/10 bg-white/85 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)]">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">작품명</span>
                <input value={draft.title} onChange={(event) => handleFieldChange('title', event.target.value)} className="form-field w-full" placeholder="추천 작품명을 입력해 주세요." />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">감독 또는 작가</span>
                <input value={draft.author} onChange={(event) => handleFieldChange('author', event.target.value)} className="form-field w-full" placeholder="예: 최유진" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">카테고리</span>
                <select value={draft.category} onChange={(event) => handleFieldChange('category', event.target.value)} className="form-field w-full">
                  <option value="영화">영화</option>
                  <option value="드라마">드라마</option>
                  <option value="희곡">희곡</option>
                  <option value="뮤지컬">뮤지컬</option>
                  <option value="웹소설">웹소설</option>
                  <option value="웹툰">웹툰</option>
                  <option value="소설">소설</option>
                  <option value="에세이">에세이</option>
                  <option value="시">시</option>
                  <option value="기타">기타</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">장르</span>
                <input value={draft.genre} onChange={(event) => handleFieldChange('genre', event.target.value)} className="form-field w-full" placeholder="예: 스릴러, 로맨스" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">줄거리</span>
              <textarea value={draft.synopsis} onChange={(event) => handleFieldChange('synopsis', event.target.value)} className="form-field min-h-32 w-full resize-none" placeholder="작품의 줄거리를 소개해 주세요." />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">추천 이유</span>
              <textarea value={draft.reason} onChange={(event) => handleFieldChange('reason', event.target.value)} className="form-field min-h-28 w-full resize-none" placeholder="이 작품을 추천하는 이유를 적어 주세요." />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">관련 링크 (선택)</span>
              <input value={draft.link} onChange={(event) => handleFieldChange('link', event.target.value)} className="form-field w-full" placeholder="https://example.com" />
            </label>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-ink/10 bg-[#F8F6F1] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#16233B]">
                <UploadCloud size={16} className="text-[#B08D57]" /> 포스터 업로드
              </div>
              <div className="mt-4 rounded-[24px] border border-dashed border-ink/15 bg-white/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#16233B]">포스터 이미지</p>
                    <p className="mt-1 text-sm text-charcoal/70">드래그 앤 드롭 또는 파일 선택으로 업로드할 수 있습니다.</p>
                  </div>
                  <button type="button" className="btn-secondary rounded-full px-3 py-2 text-sm font-semibold" onClick={() => fileInputRef.current?.click()}>
                    업로드
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handlePosterSelect(event.target.files?.[0])} />
                {draft.posterPreview ? (
                  <img src={draft.posterPreview} alt="poster preview" className="mt-4 h-56 w-full rounded-[20px] object-cover" />
                ) : (
                  <div className="mt-4 flex h-56 items-center justify-center rounded-[20px] border border-ink/10 bg-white/80 text-charcoal/60">
                    <div className="text-center">
                      <ImageIcon size={28} className="mx-auto text-[#B08D57]" />
                      <p className="mt-2 text-sm">포스터 미리보기 영역</p>
                    </div>
                  </div>
                )}
                {draft.posterName ? <p className="mt-3 text-sm text-charcoal/60">선택된 이미지: {draft.posterName}</p> : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-ink/10 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#16233B]">
                <AlertCircle size={16} className="text-[#B08D57]" /> 작성 안내
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-charcoal/70">
                <li>• 추천 이유는 2줄 안팎으로 간결하게 써 주세요.</li>
                <li>• 포스터 업로드는 미리보기로 바로 확인됩니다.</li>
                <li>• 등록하기 버튼은 UI 전용 흐름을 시각적으로 보여줍니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {showLeavePrompt ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#16233B]/55 p-4">
          <div className="w-full max-w-md rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_24px_70px_rgba(22,35,59,0.16)]">
            <p className="text-lg font-semibold text-[#16233B]">저장되지 않은 내용이 있습니다.</p>
            <p className="mt-3 text-sm leading-7 text-charcoal/70">작업을 이어서 하시겠어요?</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold" onClick={() => setShowLeavePrompt(false)}>계속 작성</button>
              <button type="button" className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold" onClick={() => navigate('/recommended')}>임시 저장 후 나가기</button>
              <button type="button" className="btn-primary rounded-full px-4 py-2 text-sm font-semibold" onClick={() => navigate('/recommended')}>저장하지 않고 나가기</button>
            </div>
          </div>
        </div>
      ) : null}

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#16233B]/55 p-4">
          <div className="w-full max-w-4xl rounded-[32px] border border-ink/10 bg-white p-6 shadow-[0_24px_70px_rgba(22,35,59,0.16)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B08D57]">Preview</p>
                <h2 className="mt-2 font-serif text-2xl text-[#16233B]">{previewSummary.title}</h2>
              </div>
              <button type="button" className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold" onClick={() => setIsPreviewOpen(false)}>닫기</button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[24px] border border-ink/10 bg-[#F8F6F1] p-5 text-center">
                <div className="flex h-56 items-center justify-center rounded-[24px] border border-ink/10 bg-white/80">
                  <div>
                    <Sparkles size={28} className="mx-auto text-[#B08D57]" />
                    <p className="mt-2 text-sm text-charcoal/70">포스터 미리보기</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[24px] border border-ink/10 bg-white p-4">
                  <p className="text-sm font-semibold text-[#16233B]">작품 정보</p>
                  <p className="mt-2 text-sm text-charcoal/70">{previewSummary.author} · {previewSummary.category} · {previewSummary.genre}</p>
                </div>
                <div className="rounded-[24px] border border-ink/10 bg-white p-4">
                  <p className="text-sm font-semibold text-[#16233B]">줄거리</p>
                  <p className="mt-2 text-sm leading-7 text-charcoal/70">{previewSummary.synopsis}</p>
                </div>
                <div className="rounded-[24px] border border-ink/10 bg-white p-4">
                  <p className="text-sm font-semibold text-[#16233B]">추천 이유</p>
                  <p className="mt-2 text-sm leading-7 text-charcoal/70">{previewSummary.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
