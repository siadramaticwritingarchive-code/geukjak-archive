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
      .regex(
        /^[가-힣a-zA-Z0-9_-]+$/,
        '닉네임은 한글, 영문, 숫자, _, -만 사용할 수 있습니다.'
      ),

    role: z.enum([
      'dramaticwriting',
      'other',
      'professor'
    ]),

    studentId: z.string().optional(),

    email: z
      .string()
      .email('올바른 이메일을 입력해 주세요.'),

    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.'),

    passwordConfirm: z.string()
  })
  .superRefine((values, ctx) => {

    if (values.password !== values.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: '비밀번호가 일치하지 않습니다.'
      });
    }

    if (
      values.role !== 'professor' &&
      (!values.studentId ||
        values.studentId.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['studentId'],
        message: '학번을 입력해주세요.'
      });
    }

  });

type SignupFormValues =
  z.infer<typeof signupSchema>;

export function SignupPage() {

  const navigate = useNavigate();

  const [formError, setFormError] =
    useState<string | null>(null);

  const [formMessage, setFormMessage] =
    useState<string | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      displayName: '',
      role: 'dramaticwriting',
      studentId: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  });

  const role = watch('role');

  const handleSignup = async (
    values: SignupFormValues
  ) => {

    setFormError(null);
    setFormMessage(null);

    const isAvailable =
      await profileService.isDisplayNameAvailable(
        values.displayName
      );

    if (!isAvailable) {
      setFormError(
        '이미 사용 중인 닉네임입니다.'
      );
      return;
    }

    const { data, error } =
      await authService.signUp({
        email: values.email,
        password: values.password,
        displayName: values.displayName,

        // 다음 단계에서 authService 수정
        role: values.role,
        studentId: values.studentId
      });

    if (error) {
      setFormError(
        '회원가입을 완료하지 못했습니다.'
      );
      return;
    }

    if (data.session) {
      navigate('/profile', {
        replace: true
      });
      return;
    }

    setFormMessage(
      '회원가입이 완료되었습니다.'
    );
  };

  return (
    <div className="mx-auto max-w-3xl">

      <PageHeader
        eyebrow="회원가입"
        title="새로운 멤버 프로필을 만들어보세요"
        description="이메일 인증 후 아카이브와 커뮤니티에 참여할 수 있습니다."
      />

      <section className="rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm shadow-ink/5">

        <form
          className="space-y-5"
          onSubmit={handleSubmit(handleSignup)}
        >

          <TextInput
  label="닉네임"
  autoComplete="nickname"
  error={errors.displayName?.message}
  {...register('displayName')}
/>

<div className="space-y-3">

  <label className="text-sm font-semibold text-charcoal">
    회원 유형
  </label>

  <div className="space-y-2">

    <label className="flex items-center gap-3">
      <input
        type="radio"
        value="dramaticwriting"
        {...register('role')}
      />
      <span>극작과 학생</span>
    </label>

    <label className="flex items-center gap-3">
      <input
        type="radio"
        value="other"
        {...register('role')}
      />
      <span>타과 학생</span>
    </label>

    <label className="flex items-center gap-3">
      <input
        type="radio"
        value="professor"
        {...register('role')}
      />
      <span>교수님</span>
    </label>

  </div>

</div>

{role !== 'professor' && (

  <TextInput
    label="학번"
    placeholder="예) 2442123"
    autoComplete="off"
    error={errors.studentId?.message}
    {...register('studentId')}
  />

)}

<TextInput
  label="이메일"
  type="email"
  autoComplete="email"
  error={errors.email?.message}
  {...register('email')}
/>

<div className="grid gap-5 md:grid-cols-2">

  <TextInput
    label="비밀번호"
    type="password"
    autoComplete="new-password"
    error={errors.password?.message}
    {...register('password')}
  />

  <TextInput
    label="비밀번호 확인"
    type="password"
    autoComplete="new-password"
    error={errors.passwordConfirm?.message}
    {...register('passwordConfirm')}
  />

</div>

{formError && (
  <p className="text-sm text-red-700">
    {formError}
  </p>
)}

{formMessage && (
  <p className="text-sm text-green-700">
    {formMessage}
  </p>
)}

<button
  type="submit"
  disabled={isSubmitting}
  className="w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
>

  {isSubmitting
    ? '가입 처리 중...'
    : '회원가입'}

</button>

</form>

<p className="mt-5 text-sm text-charcoal/75"></p>

        <p className="mt-5 text-sm text-charcoal/75">
          이미 계정이 있나요?{' '}
          <Link
            className="font-semibold text-ink underline decoration-gold underline-offset-4"
            to="/login"
          >
            로그인
          </Link>
        </p>


        </section>
    </div>
  );
}