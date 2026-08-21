export type ILecture = {
  id: number;
  title: string;
  description?: string | null;
  contentType: 'video' | 'pdf' | 'audio' | 'text' | 'image';
  facultyId?: number;
  subject: string | null;
  std: string | null;
  departmentId: number | null;
  chapterTopic: string | null;
  learningObjectives: string | null;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  thumbnailUrl: string | null;
  contentUrl: string | null; 
  durationInSeconds: number | null;
  textContent: string | null;
};

export type ICreateLecture = Omit<ILecture, 'id'>;
export type IUpdateLecture = Partial<Omit<ILecture, 'id'>>;
