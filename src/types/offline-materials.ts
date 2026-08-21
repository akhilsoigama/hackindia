// ... existing types ...

export interface OfflineMaterial {
  id: number;
  title: string;
  description: string;
  course: string;
  subject: string;
  type: 'lesson' | 'video' | 'audio' | 'file';
  fileSize: string;
  duration?: string; // for video/audio
  downloadDate: string;
  lastAccessed?: string;
  filePath: string;
  thumbnail?: string;
  progress?: number; // 0-100 for videos/audio
  completed: boolean;
  category: string;
  tags: string[];
}

export interface DownloadProgress {
  materialId: number;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
}

export interface OfflineMaterialsProps {
  studentId: string;
}

export interface StorageInfo {
  total: string;
  used: string;
  available: string;
  usagePercentage: number;
}// ... existing types ...

export interface OfflineMaterial {
  id: number;
  title: string;
  description: string;
  course: string;
  subject: string;
  type: 'lesson' | 'video' | 'audio' | 'file';
  fileSize: string;
  duration?: string; // for video/audio
  downloadDate: string;
  lastAccessed?: string;
  filePath: string;
  thumbnail?: string;
  progress?: number; // 0-100 for videos/audio
  completed: boolean;
  category: string;
  tags: string[];
}

export interface DownloadProgress {
  materialId: number;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
}

export interface OfflineMaterialsProps {
  studentId: string;
}

export interface StorageInfo {
  total: string;
  used: string;
  available: string;
  usagePercentage: number;
}