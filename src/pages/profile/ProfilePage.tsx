import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TextArea } from '../../components/forms/TextArea';
import { TextInput } from '../../components/forms/TextInput';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(24, '닉네임은 24자 이하로 입력해 주세요.')
    .regex(/^[가-힣a-zA-Z0-9_-]+$/, '닉네임은 한글, 영문, 숫자, _, -만 사용할 수 있습니다.'),
  bio: z.string().max(240, '소개는 240자 이하로 입력해 주세요.').optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const avatarUrl = useMemo(
    () => profileService.getAvatarPublicUrl(profile?.avatar_path ?? null),
    [profile?.avatar_path],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: ''
    }
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      displayName: profile.display_name,
      bio: profile.bio ?? ''
    });
  }, [profile, reset]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!user) {
      return;
    }

    setStatusError(null);
    setStatusMessage(null);

    try {
      const isAvailable = await profileService.isDisplayNameAvailable(values.displayName, user.id);

      if (!isAvailable) {
        setStatusError('이미 사용 중인 닉네임입니다.');
        return;
      }

      let avatarPath = profile?.avatar_path ?? null;

      if (selectedFile) {
        avatarPath = await profileService.uploadAvatar(user.id, selectedFile);
      }

      const { error } = await profileService.updateProfile(user.id, {
        displayName: values.displayName,
        bio: values.bio?.trim() ? values.bio.trim() : null,
        avatarPath
      });

      if (error) {
        setStatusError('프로필을 저장하지 못했습니다.');
        return;
      }

      setSelectedFile(null);
      await refreshProfile();
      setStatusMessage('프로필이 저장되었습니다.');
    } catch {
      setStatusError('프로필 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Member Space"
        title="프로필"
        description="공개 닉네임, 소개, 프로필 이미지를 관리합니다. 인증 세션은 새로고침 후에도 유지됩니다."
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-lg border border-ink/10 bg-ink p-6 text-ivory shadow-sm shadow-ink/10">
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center overflow-hidden rounded-full border border-gold/40 bg-charcoal">
              {avatarUrl ? (
                <img className="h-full w-full object-cover" src={avatarUrl} alt="" />
              ) : (
                <span className="font-serif text-3xl text-gold">
                  {profile?.display_name?.slice(0, 1) ?? 'P'}
                </span>
              )}
            </div>
            <div>
              <p className="font-serif text-2xl">{profile?.display_name}</p>
              <p className="mt-1 text-sm text-ivory/65">{user?.email}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-4 border-t border-ivory/10 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/55">Role</dt>
              <dd className="font-medium text-gold">{profile?.role ?? 'student'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/55">Status</dt>
              <dd className="font-medium">{profile?.is_blocked ? 'Blocked' : 'Active'}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-8 w-full rounded-lg border border-ivory/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-gold hover:text-gold"
          >
            로그아웃
          </button>
        </aside>

        <section className="rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm shadow-ink/5">
          <h2 className="font-serif text-3xl">Edit Profile</h2>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(handleProfileUpdate)}>
            <TextInput
              label="Nickname"
              autoComplete="nickname"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
            <TextArea
              label="Bio"
              error={errors.bio?.message}
              placeholder="작품 세계, 관심 장르, 짧은 소개를 적어 주세요."
              {...register('bio')}
            />
            <label className="block">
              <span className="text-sm font-medium text-ink">Profile Image</span>
              <input
                className="mt-2 w-full rounded-lg border border-dashed border-ink/20 bg-white/70 px-4 py-3 text-sm text-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </label>
            {statusError ? <p className="text-sm text-red-700">{statusError}</p> : null}
            {statusMessage ? <p className="text-sm text-green-700">{statusMessage}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? '저장 중' : '프로필 저장'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
