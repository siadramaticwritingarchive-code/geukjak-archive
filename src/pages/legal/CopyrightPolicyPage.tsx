import { PageHeader } from '../../components/PageHeader';

export function CopyrightPolicyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Policy"
        title="저작권 정책"
        description="작품의 보호, 열람 기준, 그리고 창작자 권리를 안내하는 개발용 정책 페이지입니다."
      />

      <section className="rounded-[32px] border border-ink/10 bg-white/85 p-7 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="space-y-6 text-base leading-8 text-charcoal/80">
          <div>
            <h2 className="font-serif text-2xl text-[#16233B]">1. 작품 보호</h2>
            <p className="mt-3">
              본 아카이브에 등록된 모든 작품의 저작권은 해당 창작자에게 있습니다. 작품은 창작 및 학습을 위한 열람 목적으로만 이용할 수 있으며, 작성자의 허가 없이 복제, 캡처, 배포, 재가공, AI 학습 데이터 활용 및 상업적 이용을 금지합니다.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#16233B]">2. 열람 기준</h2>
            <p className="mt-3">
              작품은 학습, 감상, 피드백 목적으로만 열람해 주세요. 무단 복제, 캡처, 배포, 재업로드 또는 AI 학습 이용은 제한됩니다.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#16233B]">3. 업로드 권한</h2>
            <p className="mt-3">
              업로드된 작품의 저작권은 작성자에게 있으며, 공개 범위 선택은 등록 과정에서 UI상으로 안내되는 예시입니다.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#16233B]">4. 문의</h2>
            <p className="mt-3">
              저작권을 침해하는 행위가 확인될 경우 운영 정책에 따라 게시물 이용이 제한될 수 있습니다. 문의는 관리자 또는 작품 작성자에게 직접 문의해 주세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
