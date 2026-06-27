import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../layouts/AppLayout';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ArchivePage } from '../pages/archive/ArchivePage';
import { WorkDetailPage } from '../pages/archive/WorkDetailPage';
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
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/admin', element: <AdminDashboardPage /> }
    ]
  }
]);
