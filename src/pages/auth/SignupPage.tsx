import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { PageHeader } from '../../components/PageHeader';
import { TextInput } from '../../components/forms/TextInput';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';

const signupSchema = z
  .object({
    displayName: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(24, '닉네임은 24자 이하로 입력해 주세요.')
      .regex(/^[가-힣a-zA-Z0-9_-]+$/, '닉네임은 한글, 영문, 숫자, _, -만 사용할 수 있습니다.'),
    email: z.string().email('올바른 이메일을 입력해 주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    passwordConfirm: z.string()
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  });

  const handleSignup = async (values: SignupFormValues) => {
    setFormError(null);
    setFormMessage(null);

    const isAvailable = await profileService.isDisplayNameAvailable(values.displayName);

    if (!isAvailable) {
      setFormError('이미 사용 중인 닉네임입니다.');
      return;
    }

    const { data, error } = await authService.signUp({
      email: values.email,
      password: values.password,
      displayName: values.displayName
    });

    if (error) {
      setFormError('회원가입을 완료하지 못했습니다. 입력 정보를 확인해 주세요.');
      return;
    }

    if (data.session) {
      navigate('/profile', { replace: true });
      return;
    }

    setFormMessage('가입 확인 메일을 보냈습니다. 이메일 인증 후 로그인해 주세요.');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Authentication"
        title="새로운 작가 프로필 만들기"
        description="이메일 인증과 프로필 생성은 Supabase Auth와 users 테이블 트리거를 통해 연결됩니다."
      />
      <section className="rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm shadow-ink/5">
        <form className="space-y-5" onSubmit={handleSubmit(handleSignup)}>
          <TextInput
            label="Nickname"
            autoComplete="nickname"
            error={errors.displayName?.message}
            {...register('displayName')}
          />
          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              label="Password"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <TextInput
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              error={errors.passwordConfirm?.message}
              {...register('passwordConfirm')}
            />
          </div>
          {formError ? <p className="text-sm text-red-700">{formError}</p> : null}
          {formMessage ? <p className="text-sm text-green-700">{formMessage}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '가입 처리 중' : '회원가입'}
          </button>
        </form>
        <p className="mt-5 text-sm text-charcoal/75">
          이미 계정이 있나요?{' '}
          <Link className="font-semibold text-ink underline decoration-gold underline-offset-4" to="/login">
            로그인
          </Link>
        </p>
      </section>
    </div>
  );
}
