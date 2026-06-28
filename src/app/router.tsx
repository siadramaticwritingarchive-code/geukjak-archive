import { createBrowserRouter } from 'react-router';
import { GuestRoute } from '../components/GuestRoute';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { AdminCommunityPage } from '../pages/admin/AdminCommunityPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminMembersPage } from '../pages/admin/AdminMembersPage';
import { AdminNoticesPage } from '../pages/admin/AdminNoticesPage';
import { AdminProfessorPicksPage } from '../pages/admin/AdminProfessorPicksPage';
import { AdminRecommendedPage } from '../pages/admin/AdminRecommendedPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminStatisticsPage } from '../pages/admin/AdminStatisticsPage';
import { AdminWorksPage } from '../pages/admin/AdminWorksPage';
import { AdminRoute } from '../components/AdminRoute';
import { ArchiveCreatePage } from '../pages/archive/ArchiveCreatePage';
import { ArchivePage } from '../pages/archive/ArchivePage';
import { WorkDetailPage } from '../pages/archive/WorkDetailPage';
import { WorkEditPage } from '../pages/archive/WorkEditPage';
import { CommunityPage } from '../pages/community/CommunityPage';
import { CommunityPostPage } from '../pages/community/CommunityPostPage';
import { CommunityWritePage } from '../pages/community/CommunityWritePage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { CopyrightPolicyPage } from '../pages/legal/CopyrightPolicyPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { RecommendedCreatePage } from '../pages/recommended/RecommendedCreatePage';
import { RecommendedDetailPage } from '../pages/recommended/RecommendedDetailPage';
import { RecommendedWorksPage } from '../pages/recommended/RecommendedWorksPage';
import { ProfessorRecommendedPage } from '../pages/recommended/ProfessorRecommendedPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/archive', element: <ArchivePage /> },
      { path: '/archive/:workId', element: <WorkDetailPage /> },
      { path: '/recommended', element: <RecommendedWorksPage /> },
      { path: "/recommended/professor", element: <ProfessorRecommendedPage />},
      { path: '/recommended/:workId', element: <RecommendedDetailPage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/community/:postId', element: <CommunityPostPage /> },
      { path: '/community/write', element: <CommunityWritePage /> },
      { path: '/copyright-policy', element: <CopyrightPolicyPage /> },
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
          { path: '/archive/new', element: <ArchiveCreatePage /> },
          { path: '/archive/:workId/edit', element: <WorkEditPage /> },
          { path: '/recommended/new', element: <RecommendedCreatePage /> },
          {
            element: <AdminRoute />,
            children: [
              { path: '/admin', element: <AdminDashboardPage /> },
              { path: '/admin/members', element: <AdminMembersPage /> },
              { path: '/admin/works', element: <AdminWorksPage /> },
              { path: '/admin/recommended', element: <AdminRecommendedPage /> },
              { path: '/admin/community', element: <AdminCommunityPage /> },
              { path: '/admin/reports', element: <AdminReportsPage /> },
              { path: '/admin/notices', element: <AdminNoticesPage /> },
              { path: '/admin/professor-picks', element: <AdminProfessorPicksPage /> },
              { path: '/admin/settings', element: <AdminSettingsPage /> },
              { path: '/admin/statistics', element: <AdminStatisticsPage /> }
              
            ]
          }
        ]
      }
    ]
  }
]);
