export type WorkGenre =
  | '희곡'
  | '시나리오'
  | '드라마'
  | '뮤지컬'
  | '웹소설'
  | '기타';

export type WorkVisibility =
  | '전체 공개'
  | '서울예대생 전체'
  | '극작과 학생만';

export type WorkStatus =
  | '임시저장'
  | '검토중'
  | '게시됨';

export interface Work {
  id: string;

  title: string;

  author: string;

  studentId: string;

  genre: WorkGenre;

  logline: string;

  synopsis: string;

  visibility: WorkVisibility;

  coverImage?: string;

  scriptFile?: string;

  createdAt: string;

  updatedAt: string;

  status: WorkStatus;

  views: number;

  likes: number;

  bookmarks: number;
}
