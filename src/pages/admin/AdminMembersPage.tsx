import { useEffect, useState } from 'react';
import {
  Eye,
  ShieldCheck,
  SlidersHorizontal,
  UserX
} from 'lucide-react';
import { AdminPageShell } from './AdminPageShell';
import { profileService } from '../../services/profileService';
import type { UserProfile, UserRole } from '../../types/user';

const roleLabels: Record<UserRole, string> = {
  dramaticwriting: '극작과 학생',
  other: '타과 학생',
  professor: '교수님',
  staff: '학회원',
  admin: '학회장단'
};

const roleColors: Record<UserRole, string> = {
  dramaticwriting: 'bg-sky-100 text-sky-700',
  other: 'bg-gray-100 text-gray-700',
  professor: 'bg-purple-100 text-purple-700',
  staff: 'bg-green-100 text-green-700',
  admin: 'bg-amber-100 text-amber-700'
};

export function AdminMembersPage() {
 const [members, setMembers] = useState<UserProfile[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);


  const loadMembers = async () => {
    const data = await profileService.listProfiles();
    setMembers(data);
  };

  useEffect(() => {
    loadMembers().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleRoleChange = async (
    userId: string,
    role: UserRole
  ) => {
    await profileService.updateRole(userId, role);
    await loadMembers();
  };

  const handleBlockToggle = async (
    userId: string,
    blocked: boolean
  ) => {
    await profileService.blockUser(userId, blocked);
    await loadMembers();
  };

  if (isLoading) {
    return (
      <AdminPageShell
        title="회원 관리"
        description="회원 정보를 불러오는 중입니다."
        badge="MEMBERS"
      >
        <div className="rounded-[28px] bg-white p-10 text-center">
          회원 정보를 불러오는 중...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="회원 관리"
      description="회원 목록을 확인하고 권한과 계정 상태를 관리합니다."
      badge="MEMBERS"
      action={
        <button
          type="button"
          className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-[#16233B]"
        >
          필터
        </button>
      }
    >
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#16233B]">
          <SlidersHorizontal
            size={18}
            className="text-[#B08D57]"
          />
          <h2 className="font-serif text-2xl">
            회원 목록
          </h2>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-ink/10">
          <table className="min-w-full divide-y divide-ink/10 text-sm">
            <thead className="bg-[#F8F6F1] text-left text-charcoal/70">
              <tr>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">학번</th>
                <th className="px-4 py-3">학과</th>
                <th className="px-4 py-3">정보</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-ink/10 bg-white">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 font-semibold text-[#16233B]">
                    {member.display_name}
                  </td>

                  <td className="px-4 py-3">
                    {member.student_id ?? '-'}
                  </td>

                  <td className="px-4 py-3">
                    {member.department ?? '-'}
                  </td>

<td className="px-4 py-3">
  <div className="flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => setSelectedMember(member)}
      className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold"
    >
      <Eye
        size={13}
        className="mr-1 inline"
      />
      정보 보기
    </button>

    <select
      value={member.role}
      onChange={(e) =>
        handleRoleChange(
          member.id,
          e.target.value as UserRole
        )
      }
      className={`rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold ${roleColors[member.role]}`}
    >
      <option value="dramaticwriting">극작과 학생</option>
      <option value="other">타과 학생</option>
      <option value="professor">교수님</option>
      <option value="staff">학회원</option>
      <option value="admin">학회장단</option>
    </select>

    <button
      type="button"
      onClick={() =>
        handleBlockToggle(
          member.id,
          !member.is_blocked
        )
      }
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        member.is_blocked
          ? 'border border-green-200 bg-green-50 text-green-700'
          : 'border border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <UserX
        size={13}
        className="mr-1 inline"
      />

      {member.is_blocked
        ? '활성화'
        : '비활성화'}
    </button>
    </div>
</td>
</tr>
))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMember && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#16233B]">
          회원 정보
        </h2>

        <button
          type="button"
          onClick={() => setSelectedMember(null)}
          className="text-2xl"
        >
          ×
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs text-charcoal/60">이름</p>
          <p className="font-semibold">{selectedMember.display_name}</p>
        </div>

        <div>
          <p className="text-xs text-charcoal/60">이메일</p>
          <p>{selectedMember.email}</p>
        </div>

        <div>
          <p className="text-xs text-charcoal/60">학번</p>
          <p>{selectedMember.student_id ?? '-'}</p>
        </div>

        <div>
          <p className="text-xs text-charcoal/60">학과</p>
          <p>{selectedMember.department ?? '-'}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => setSelectedMember(null)}
          className="rounded-full bg-[#16233B] px-5 py-2 text-sm font-semibold text-white"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
)}

    </AdminPageShell>
  );
}
