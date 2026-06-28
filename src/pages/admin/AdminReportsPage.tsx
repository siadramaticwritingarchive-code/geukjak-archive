import { CheckCircle2, EyeOff, Trash2 } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';

const reports = [
  { id: 1, target: '작품 〈도시의 마지막 빛〉', reason: '저작권 침해 의심', reporter: '김서윤', reportedAt: '2026.06.25', status: '대기 중' },
  { id: 2, target: '커뮤니티 게시글', reason: '욕설 및 비방', reporter: '박도윤', reportedAt: '2026.06.24', status: '검토 중' }
];

export function AdminReportsPage() {
  return (
    <AdminPageShell title="신고 관리" description="신고 내역을 검토하고 필요한 조치를 취합니다." badge="REPORTS">
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="overflow-hidden rounded-[24px] border border-ink/10">
          <table className="min-w-full divide-y divide-ink/10 text-sm">
            <thead className="bg-[#F8F6F1] text-left text-charcoal/70">
              <tr>
                <th className="px-4 py-3 font-semibold">신고 대상</th>
                <th className="px-4 py-3 font-semibold">신고 사유</th>
                <th className="px-4 py-3 font-semibold">신고자</th>
                <th className="px-4 py-3 font-semibold">신고일</th>
                <th className="px-4 py-3 font-semibold">처리 상태</th>
                <th className="px-4 py-3 font-semibold">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-white">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-4 py-3 font-semibold text-[#16233B]">{report.target}</td>
                  <td className="px-4 py-3">{report.reason}</td>
                  <td className="px-4 py-3">{report.reporter}</td>
                  <td className="px-4 py-3">{report.reportedAt}</td>
                  <td className="px-4 py-3">{report.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><CheckCircle2 size={13} className="mr-1 inline" />검토 완료</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><EyeOff size={13} className="mr-1 inline" />게시글 숨김</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><Trash2 size={13} className="mr-1 inline" />삭제</button>
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
