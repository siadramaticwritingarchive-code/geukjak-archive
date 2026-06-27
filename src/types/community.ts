export type BoardType = 'free' | 'questions' | 'announcements' | 'anonymous';

export type CommunityPostSummary = {
  id: string;
  boardType: BoardType;
  title: string;
  authorName: string | null;
  commentCount: number;
  likeCount: number;
  bookmarkCount: number;
};
