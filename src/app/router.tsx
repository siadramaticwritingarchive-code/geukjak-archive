import { createBrowserRouter } from 'react-router';
import { GuestRoute } from '../components/GuestRoute';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ArchivePage } from '../pages/archive/ArchivePage';
import { WorkCreatePage } from '../pages/archive/WorkCreatePage';
import { WorkDetailPage } from '../pages/archive/WorkDetailPage';
import { WorkEditPage } from '../pages/archive/WorkEditPage';
import { CommunityPage } from '../pages/community/CommunityPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ProfilePage } from '../pages/profile/ProfilePage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/archive', element: <ArchivePage /> },
      { path: '/archive/:workId', element: <WorkDetailPage /> },
      { path: '/community', element: <CommunityPage /> },
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/archive/new', element: <WorkCreatePage /> },
          { path: '/archive/:workId/edit', element: <WorkEditPage /> }
        ]
      }
    ]
  }
]);
