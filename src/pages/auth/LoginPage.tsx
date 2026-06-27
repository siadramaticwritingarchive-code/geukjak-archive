import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import { PageHeader } from '../../components/PageHeader';
import { TextInput } from '../../components/forms/TextInput';
import { authService } from '../../services/authService';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해 주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.')
});

const resetSchema = z.object({
  email: z.string().email('비밀번호 재설정 링크를 받을 이메일을 입력해 주세요.')
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/profile';

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ''
    }
  });

  const handleLogin = async (values: LoginFormValues) => {
    setAuthError(null);
    setAuthMessage(null);

    const { error } = await authService.signInWithPassword(values);

    if (error) {
      setAuthError('이메일 또는 비밀번호를 확인해 주세요.');
      return;
    }

    navigate(from, { replace: true });
  };

  const handlePasswordReset = async (values: ResetFormValues) => {
    setAuthError(null);
    setAuthMessage(null);

    const { error } = await authService.resetPassword(values.email);

    if (error) {
      setAuthError('비밀번호 재설정 메일을 보내지 못했습니다.');
      return;
    }

    setAuthMessage('비밀번호 재설정 링크를 이메일로 보냈습니다.');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Authentication"
        title="다시 무대로 돌아오기"
        description="이메일로 로그인하고, 세션은 Supabase Auth를 통해 안전하게 유지됩니다."
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm shadow-ink/5">
          <h2 className="font-serif text-3xl">Login</h2>
          <form className="mt-6 space-y-5" onSubmit={loginForm.handleSubmit(handleLogin)}>
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            <TextInput
              label="Password"
              type="password"
              autoComplete="current-password"
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register('password')}
            />
            {authError ? <p className="text-sm text-red-700">{authError}</p> : null}
            {authMessage ? <p className="text-sm text-green-700">{authMessage}</p> : null}
            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              className="w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginForm.formState.isSubmitting ? '로그인 중' : '로그인'}
            </button>
          </form>
          <p className="mt-5 text-sm text-charcoal/75">
            계정이 없나요?{' '}
            <Link className="font-semibold text-ink underline decoration-gold underline-offset-4" to="/signup">
              회원가입
            </Link>
          </p>
        </section>

        <section className="rounded-lg border border-gold/30 bg-ink p-6 text-ivory shadow-sm shadow-ink/10">
          <h2 className="font-serif text-3xl">Password Reset</h2>
          <p className="mt-3 text-sm leading-6 text-ivory/75">
            가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
          </p>
          <form className="mt-6 space-y-5" onSubmit={resetForm.handleSubmit(handlePasswordReset)}>
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              error={resetForm.formState.errors.email?.message}
              className="bg-ivory text-ink"
              {...resetForm.register('email')}
            />
            <button
              type="submit"
              disabled={resetForm.formState.isSubmitting}
              className="w-full rounded-lg border border-gold bg-gold px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetForm.formState.isSubmitting ? '전송 중' : '재설정 메일 보내기'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
