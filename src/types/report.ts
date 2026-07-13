export type ReportStatus =
  | 'open'
  | 'reviewing'
  | 'resolved'
  | 'dismissed';

export type ReportTargetType =
  | 'work'
  | 'community'
  | 'comment';

export type Report = {
  id: string;

  reporter_id: string | null;

  target_type: ReportTargetType;

  target_id: string;

  reason: string;

  description: string | null;

  status: ReportStatus;

  handled_by: string | null;

  handled_at: string | null;

  created_at: string;
};

export type CreateReportInput = {
  reporter_id: string;

  target_type: ReportTargetType;

  target_id: string;

  reason: string;

  description?: string;
};
