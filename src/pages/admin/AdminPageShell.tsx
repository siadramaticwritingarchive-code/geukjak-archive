import { NavLink } from 'react-router';
import { ArrowUpRight, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

type AdminPageShellProps = {
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

const navItems = [
  { label: '대시보드', to: '/admin' },
  { label: '회원 관리', to: '/admin/members' },
  { label: '작품 관리', to: '/admin/works' },
  { label: '추천 작품', to: '/admin/recommended' },
  { label: '커뮤니티', to: '/admin/community' },
  { label: '신고 관리', to: '/admin/reports' },
  { label: '공지 관리', to: '/admin/notices' },
  { label: '교수 추천', to: '/admin/professor-picks' },
  { label: '사이트 설정', to: '/admin/settings' },
  { label: '통계', to: '/admin/statistics' }
];

export function AdminPageShell({ title, description, badge, action, children }: AdminPageShellProps) {
  const { effectiveRole, canManageAdminPermissions } = useAuth();
  const roleLabel = effectiveRole === 'admin' ? '학회장단' : effectiveRole === 'staff' ? '학회원' : '일반 회원';

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-ink/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(22,35,59,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B08D57]">{badge ?? 'ADMIN'}</p>
            <h1 className="mt-3 font-serif text-3xl text-[#16233B] sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal/70">{description}</p>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-ink/10 bg-[#F8F6F1] p-4 shadow-sm">
          <div className="flex items-center gap-3 rounded-[20px] border border-ink/10 bg-white/80 p-3">
            <div className="rounded-full bg-[#16233B] p-2 text-white"><ShieldCheck size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-[#16233B]">운영 패널</p>
              <p className="text-xs text-charcoal/60">{roleLabel}</p>
              <p className="mt-1 text-[11px] text-charcoal/60">{canManageAdminPermissions ? '권한 관리 가능' : '권한 변경은 학회장단만 가능'}</p>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn('flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-[#16233B] text-white' : 'text-[#16233B] hover:bg-white/70')}
              >
                <span>{item.label}</span>
                <ArrowUpRight size={14} />
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 rounded-[24px] border border-ink/10 bg-white/80 p-4 text-sm text-charcoal/70">
            <div className="flex items-center gap-2 text-[#16233B]"><Users size={16} /> 운영 안내</div>
            <p className="mt-2 leading-7">실제 인증 연결 전까지는 개발 모드 역할 전환으로 관리자 기능을 미리 확인할 수 있습니다.</p>
          </div>
        </aside>

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
