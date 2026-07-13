import { useEffect, useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { profileService } from '../../services/profileService';
import { workService } from '../../services/workService';
import { communityService } from '../../services/community';
import { noticeService } from '../../services/noticeService';

export function AdminStatisticsPage() {
  const [memberCount, setMemberCount] = useState(0);
  const [workCount, setWorkCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const members =
        await profileService.listProfiles();

      const works =
        await workService.listPublishedWorks();

      const posts =
        await communityService.adminListPosts();

      const notices =
        await noticeService.listNotices();

      setMemberCount(members.length);
      setWorkCount(works.length);
      setCommunityCount(posts.length);
      setNoticeCount(notices.length);

      setIsLoading(false);
    }

    load();
  }, []);

  if (isLoading) {
    return (
      <AdminPageShell
        title="통계"
        description="통계를 불러오는 중입니다."
        badge="STATISTICS"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          통계를 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="통계"
      description="서비스 전체 현황을 확인합니다."
      badge="STATISTICS"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3
              className="text-[#B08D57]"
              size={20}
            />

            <p className="font-semibold">
              회원
            </p>
          </div>

          <p className="mt-5 text-4xl font-bold text-[#16233B]">
            {memberCount}
          </p>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <LineChart
              className="text-[#B08D57]"
              size={20}
            />

            <p className="font-semibold">
              작품
            </p>
          </div>

          <p className="mt-5 text-4xl font-bold text-[#16233B]">
            {workCount}
          </p>
        </div>
        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <PieChart
              className="text-[#B08D57]"
              size={20}
            />

            <p className="font-semibold">
              커뮤니티
            </p>
          </div>

          <p className="mt-5 text-4xl font-bold text-[#16233B]">
            {communityCount}
          </p>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3
              className="text-[#B08D57]"
              size={20}
            />

            <p className="font-semibold">
              공지
            </p>
          </div>

          <p className="mt-5 text-4xl font-bold text-[#16233B]">
            {noticeCount}
          </p>
        </div>

      </div>
    </AdminPageShell>
  );
}
