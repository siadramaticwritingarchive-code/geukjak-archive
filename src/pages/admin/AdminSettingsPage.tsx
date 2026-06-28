import { AdminPageShell } from './AdminPageShell';

export function AdminSettingsPage() {
  return (
    <AdminPageShell title="사이트 설정" description="서비스 소개, 메인 배너, 저작권 정책, 이용약관을 미리 수정해볼 수 있습니다." badge="SETTINGS">
      <div className="space-y-6">
        {[
          ['서비스 소개 수정', '서비스 소개 문구를 미리 수정해보세요.'],
          ['메인 배너 수정', '메인 화면 배너 문구와 안내 문구를 조정합니다.'],
          ['저작권 정책 수정', '저작권 안내문을 갱신합니다.'],
          ['이용약관 수정', '이용약관 내용을 관리합니다.']
        ].map(([title, description]) => (
          <div key={title} className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-[#16233B]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-charcoal/70">{description}</p>
            <textarea className="mt-5 min-h-24 w-full rounded-2xl border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm outline-none" placeholder="내용을 입력하세요." />
          </div>
        ))}
      </div>
    </AdminPageShell>
  );
}
