import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute() {
  const { user, isLoading, canAccessAdmin } = useAuth();

  if (isLoading) {
    return <div className="rounded-lg border border-ink/10 bg-white/45 p-6 text-sm text-charcoal/75">관리자 권한을 확인하고 있습니다.</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
