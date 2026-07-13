import { useAuth } from '../../hooks/useAuth';
import { AdminDashboardContent } from './AdminDashboardContent';
import { AdminPageShell } from './AdminPageShell';

export function AdminDashboardPage() {
  const { effectiveRole, canManageAdminPermissions } = useAuth();
  const roleLabel = effectiveRole === 'admin' ? '학회장단' : effectiveRole === 'staff' ? '학회원' : '일반 회원';

  return (
    <AdminPageShell
      title="관리자 대시보드"
      description="회원, 작품, 커뮤니티, 신고, 공지와 사이트 설정을 한눈에 관리합니다."
      badge="DASHBOARD"
      action={
        <div className="rounded-full border border-ink/10 bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#16233B]">
          현재 역할 · {roleLabel}{canManageAdminPermissions ? ' · 권한 관리 가능' : ''}
        </div>
      }
    >
      <AdminDashboardContent />
    </AdminPageShell>
  );
}
