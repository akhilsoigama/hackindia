export type ILecture = {
    id: number;
    title: string;
    description: string | null;
    contentType: 'video' | 'pdf' | 'audio' | 'text' | 'image';
    facultyId: number;
    subject: string | null;
    std: string | null;
    thumbnailUrl: string | null;
    videoUrl: string | null;
    durationInSeconds: number | null;
    textContent: string | null;
    duration?: string | null;
}

export type ICreateLecture = {
    title: string;
    description?: string | null;
    contentType: 'video' | 'pdf' | 'audio' | 'text' | 'image';
    facultyId: number;
    subject?: string | null;
    std?: string | null;
    thumbnailUrl?: string | null;
    videoUrl?: string | null;
    contentUrl?: string | null;
    durationInSeconds?: number | null;
    textContent?: string | null;
}

export type IUpdateLecture = {
    id: number;
    title?: string;
    description?: string | null;
    contentType?: 'video' | 'pdf' | 'audio' | 'text' | 'image';
    facultyId?: number;
    subject?: string | null;
    std?: string | null;
    thumbnailUrl?: string | null;
    videoUrl?: string | null;
    contentUrl?: string | null;
    durationInSeconds?: number | null;
    textContent?: string | null;
    thumbnailPath?: string | null;
    duration?: string | null;
}
