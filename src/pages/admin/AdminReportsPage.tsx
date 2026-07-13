import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  EyeOff,
  Trash2
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { reportService } from '../../services/reportService';
import type { Report } from '../../types/report';

export function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = async () => {
    const data = await reportService.listReports();
    setReports(data);
  };

  useEffect(() => {
    loadReports().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleResolve = async (id: string) => {
    await reportService.resolveReport(id);
    await loadReports();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    await reportService.deleteReport(id);
    await loadReports();
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="신고 관리"
        description="신고 내역을 불러오는 중입니다."
        badge="REPORTS"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          신고 내역을 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="신고 관리"
      description="신고 내역을 검토하고 필요한 조치를 취합니다."
      badge="REPORTS"
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="overflow-hidden rounded-[24px] border border-ink/10">
          <table className="min-w-full divide-y divide-ink/10 text-sm">
            <thead className="bg-[#F8F6F1] text-left text-charcoal/70">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  신고 대상
                </th>

                <th className="px-4 py-3 font-semibold">
                  신고 사유
                </th>

                <th className="px-4 py-3 font-semibold">
                  신고자
                </th>

                <th className="px-4 py-3 font-semibold">
                  신고일
                </th>

                <th className="px-4 py-3 font-semibold">
                  처리 상태
                </th>

                <th className="px-4 py-3 font-semibold">
                  액션
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-ink/10 bg-white">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-4 py-3 font-semibold text-[#16233B]">
                    {report.target_type}
                  </td>

                  <td className="px-4 py-3">
                    {report.reason}
                  </td>

                  <td className="px-4 py-3">
                    {report.reporter_id ?? '-'}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      report.created_at
                    ).toLocaleDateString('ko-KR')}
                  </td>

                  <td className="px-4 py-3">
                    {report.status}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">

                                            <button
                        type="button"
                        onClick={() =>
                          handleResolve(report.id)
                        }
                        className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"
                      >
                        <CheckCircle2
                          size={13}
                          className="mr-1 inline"
                        />
                        검토 완료
                      </button>

                      <button
                        type="button"
                        className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"
                      >
                        <EyeOff
                          size={13}
                          className="mr-1 inline"
                        />
                        게시글 숨김
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(report.id)
                        }
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                      >
                        <Trash2
                          size={13}
                          className="mr-1 inline"
                        />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageShell>
  );
}