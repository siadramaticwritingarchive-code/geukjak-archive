import { useEffect, useState } from 'react';
import { Eye, ShieldCheck, SlidersHorizontal, UserX } from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { profileService } from '../../services/profileService';
import type { UserProfile } from '../../types/user';

type Member = UserProfile;


export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  profileService
    .listProfiles()
    .then((data) => {
      setMembers(data);
    })
    .finally(() => {
      setIsLoading(false);
    });
}, []);

  return (
    <AdminPageShell
      title="회원 관리"
      description="회원 목록을 확인하고 권한과 계정 상태를 관리합니다."
      badge="MEMBERS"
      action={<button type="button" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]">필터</button>}
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#16233B]">
          <SlidersHorizontal size={18} className="text-[#B08D57]" />
          <h2 className="font-serif text-2xl">회원 목록</h2>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-ink/10">
          <table className="min-w-full divide-y divide-ink/10 text-sm">
            <thead className="bg-[#F8F6F1] text-left text-charcoal/70">
              <tr>
                <th className="px-4 py-3 font-semibold">이름</th>
                <th className="px-4 py-3 font-semibold">학번</th>
                <th className="px-4 py-3 font-semibold">학과</th>
                <th className="px-4 py-3 font-semibold">가입일</th>
                <th className="px-4 py-3 font-semibold">권한</th>
                <th className="px-4 py-3 font-semibold">상태</th>
                <th className="px-4 py-3 font-semibold">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-white">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 font-semibold text-[#16233B]">{member.display_name}</td>
                  <td className="px-4 py-3">{member.student_id ?? '-'}</td>
                  <td className="px-4 py-3">{member.department ?? '-'}</td>
                  <td className="px-4 py-3">{new Date(member.created_at).toLocaleDateString('ko-KR')}</td>
                  <td className="px-4 py-3">{member.role}</td>
                  <td className="px-4 py-3">{member.is_blocked ? '비활성' : '활성'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold">정보 보기</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><ShieldCheck size={13} className="inline mr-1" />권한 변경</button>
                      <button type="button" className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"><UserX size={13} className="inline mr-1" />비활성화</button>
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
