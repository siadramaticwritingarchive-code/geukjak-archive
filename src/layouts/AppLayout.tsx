import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';

const baseNavigationItems = [
  { label: '홈', to: '/' },
  { label: '작품 아카이브', to: '/archive' },
  { label: '추천 작품', to: '/recommended' },
  { label: '커뮤니티', to: '/community' },
  { label: '마이페이지', to: '/profile' }
];

export function AppLayout() {
  const { user, profile, signOut, devRole, setDevRole, effectiveRole, canAccessAdmin } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigationItems = [
    ...baseNavigationItems,
    ...(canAccessAdmin ? [{ label: '관리자', to: '/admin' }] : [])
  ];
  const isDevelopmentMode = import.meta.env.DEV;
  const roleOptions = [
  { value: 'dramaticwriting', label: '극작과 학생' },
  { value: 'other', label: '타과 학생' },
  { value: 'professor', label: '교수님' },
  { value: 'staff', label: '학회원' },
  { value: 'admin', label: '학회장단' }
] as const;


  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await signOut();
  };

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-7">
          <NavLink to="/" className="group w-fit">
            <span className="block text-[11px] font-medium uppercase tracking-[0.34em] text-[#B08D57]">
              Seoul Institute of the Arts
            </span>
            <span className="mt-1.5 block font-serif text-[1.7rem] leading-none text-[#16233B] sm:text-[1.9rem]">
              극작과 아카이브
            </span>
          </NavLink>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {isDevelopmentMode ? (
              <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/80 p-1 shadow-sm">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDevRole(option.value)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                      devRole === option.value ? 'bg-[#16233B] text-white' : 'text-charcoal/70 hover:text-[#16233B]'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn('nav-pill', isActive && 'nav-pill-active')}
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="btn-secondary inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16233B] text-sm font-semibold text-white">
                    {profile?.display_name?.charAt(0) ?? 'M'}
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold">
                      {profile?.display_name ?? '프로필'}님
                    </span>

                    <span className="block text-[11px] text-charcoal/60">
                      학번 {profile?.student_id ?? '-'}
                    </span>

                    <span className="mt-1 flex items-center gap-1 text-[11px] text-[#B08D57]">
                      <ShieldCheck size={12} />
                      {effectiveRole === 'admin'
  ? '학회장단'
  : effectiveRole === 'staff'
    ? '학회원'
    : effectiveRole === 'dramaticwriting'
      ? '극작과 학생'
      : effectiveRole === 'other'
        ? '타과 학생'
        : effectiveRole === 'professor'
          ? '교수님'
          : '일반 회원'}
                    </span>
                  </span>
                </button>
                {isProfileMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-ink/10 bg-white p-2 shadow-[0_16px_38px_rgba(22,35,59,0.12)]">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-[#16233B] transition hover:bg-[#F8F6F1] hover:text-[#1F2D4A]"
                    >
                      마이페이지
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-[#16233B] transition hover:bg-[#F8F6F1] hover:text-[#1F2D4A]"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : null}
              </div>
            ) : import.meta.env.DEV ? null : (
              <NavLink to="/login" className="btn-primary rounded-full px-4 py-2 text-sm font-medium">
                로그인
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <motion.main
        className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>

      <footer className="border-t border-ink/10 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-charcoal/70 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p>© Seoul Institute of the Arts · 극작과 아카이브</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/copyright-policy" className="transition hover:text-[#16233B]">저작권 정책</Link>
            <a href="mailto:archive@seoularts.ac.kr" className="transition hover:text-[#16233B]">문의</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
