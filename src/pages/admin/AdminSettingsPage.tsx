import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageShell } from './AdminPageShell';
import {
  settingService,
  type SiteSettings
} from '../../services/settingService';

export function AdminSettingsPage() {
  const [settingsId, setSettingsId] =
    useState('');

  const [serviceIntro, setServiceIntro] =
    useState('');

  const [bannerTitle, setBannerTitle] =
    useState('');

  const [
    bannerDescription,
    setBannerDescription
  ] = useState('');

  const [
    copyrightPolicy,
    setCopyrightPolicy
  ] = useState('');

  const [
    termsOfService,
    setTermsOfService
  ] = useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await settingService.getSettings();

        setSettingsId(data.id);
        setServiceIntro(data.service_intro);
        setBannerTitle(data.main_banner_title);
        setBannerDescription(
          data.main_banner_description
        );
        setCopyrightPolicy(
          data.copyright_policy
        );
        setTermsOfService(
          data.terms_of_service
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const handleSave = async () => {
    await settingService.updateSettings(
      settingsId,
      {
        service_intro: serviceIntro,
        main_banner_title: bannerTitle,
        main_banner_description:
          bannerDescription,
        copyright_policy:
          copyrightPolicy,
        terms_of_service:
          termsOfService
      }
    );

    toast.success('저장되었습니다.');
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="사이트 설정"
        description="불러오는 중..."
        badge="SETTINGS"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          설정을 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="사이트 설정"
      description="서비스 소개와 이용약관 등을 관리합니다."
      badge="SETTINGS"
    >
      <div className="space-y-6">

        <Section
          title="서비스 소개"
          description="서비스 소개 문구"
          value={serviceIntro}
          onChange={setServiceIntro}
        />

        <Section
          title="메인 배너 제목"
          description="메인 배너 제목"
          value={bannerTitle}
          onChange={setBannerTitle}
        />

        <Section
          title="메인 배너 설명"
          description="메인 배너 설명"
          value={bannerDescription}
          onChange={setBannerDescription}
        />

        <Section
          title="저작권 정책"
          description="저작권 안내"
          value={copyrightPolicy}
          onChange={setCopyrightPolicy}
        />

        <Section
          title="이용약관"
          description="서비스 이용약관"
          value={termsOfService}
          onChange={setTermsOfService}
        />

        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-[#16233B] px-6 py-3 font-semibold text-white"
        >
          <Save
            size={16}
            className="mr-2 inline"
          />
          저장
        </button>

      </div>
    </AdminPageShell>
  );
}

type SectionProps = {
  title: string;
  description: string;
  value: string;
  onChange: (
    value: string
  ) => void;
};

function Section({
  title,
  description,
  value,
  onChange
}: SectionProps) {
  return (
    <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">

      <h2 className="font-serif text-2xl text-[#16233B]">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-charcoal/70">
        {description}
      </p>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-5 min-h-32 w-full rounded-2xl border border-ink/10 bg-[#F8F6F1] px-4 py-3 text-sm outline-none"
      />

    </div>
  );
}
