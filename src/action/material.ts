// hooks/useLectures.ts
import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher, getWithCache } from '../utils/axios';
import { ICreateLecture, ILecture, IUpdateLecture } from '../types/material';
import { toast } from 'sonner';
import axios from 'axios';

// ----------------------------------------------------------------------
// SWR Options
const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

export function useGetLectures(searchFor?: string) {
  const url =
    searchFor === 'create'
      ? `${endpoints.lecture.getAll}?searchFor=${searchFor}`
      : endpoints.lecture.getAll;

  const { data, error, isLoading, isValidating } = useSWR<{ data: ILecture[] }>(
    url,
    fetcher,
    swrOptions
  );
  return useMemo(
    () => ({
      lectures: data?.data || [],
      isLoading,
      lecturesError: error,
      lecturesValidating: isValidating,
      lecturesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data?.data, error, isLoading, isValidating]
  );
}

export function useGetLecture(lectureId: number | null) {
  const url = lectureId ? endpoints.lecture.details(lectureId) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    url,
    async (url) => {
      return getWithCache<{ lecture?: ILecture; data?: ILecture }>(url);
    },
    {
      ...swrOptions,
      revalidateOnFocus: false,
    }
  );

  return useMemo(
    () => ({
      lecture: data?.lecture || data?.data || null,
      isLoading: isLoading && !!lectureId,
      lectureError: error,
      lectureValidating: isValidating,
      lectureEmpty: !isLoading && !error && !data,
      refetchLecture: mutate,
      
      // Debug info
      _debug: {
        rawData: data,
        error: error?.message,
        lectureId,
        url
      }
    }),
    [data, error, isLoading, isValidating, mutate, lectureId, url]
  );
}
// ----------------------------------------------------------------------
// Helper: Map frontend keys to backend validator format
function mapLecturePayload(data: Partial<ICreateLecture & IUpdateLecture>, isUpdate = false) {

  const baseFields = {
    title: data.title,
    description: data.description,
    subject: data.subject,
    std: data.std,
    department_id: data.departmentId ?? undefined,
    chapter_topic: data.chapterTopic ?? undefined,
    learning_objectives: data.learningObjectives ?? undefined,
    difficulty_level: data.difficultyLevel ?? undefined,
  };

  if (isUpdate) {
    // Update payload
    const mapped = {
      ...baseFields,
      content_type: data.contentType,
      content_url: data.contentUrl || undefined,
      thumbnail_url: data.thumbnailUrl || undefined,
      text_content: data.textContent,
      duration_in_seconds: data.durationInSeconds || undefined,
      faculty_id: data.facultyId,
    };
    return mapped;
  }

  // Create payload 
  const mapped = {
    ...baseFields,
    content_type: data.contentType,
    content_url: data.contentUrl || undefined,
    thumbnail_url: data.thumbnailUrl || undefined,
    duration_in_seconds: data.durationInSeconds || undefined,
    text_content: data.textContent,
    faculty_id: data.facultyId,
  };

  return mapped;
}

const getErrorText = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as { message?: string; error?: string } | undefined;
    return responseData?.message || responseData?.error || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

// ----------------------------------------------------------------------
// Create Lecture (JSON only - without files)
export async function createLecture(lectureData: ICreateLecture) {
  try {
    
    const payload = mapLecturePayload(lectureData);


    const res = await axiosInstance.post(endpoints.lecture.create, payload);

    return res.data?.lecture || null;
  } catch (error: unknown) {
    const errorMessage = getErrorText(error, 'Failed to create lecture');
    
    toast.error(`Failed to create lecture: ${errorMessage}`);
    throw error;
  }
}

// ----------------------------------------------------------------------
// Update Lecture (JSON only - without files)
export async function updateLecture(lectureId: number, lectureData: IUpdateLecture) {
  try {
    
    const payload = mapLecturePayload(lectureData, true);


    const res = await axiosInstance.put(endpoints.lecture.update(lectureId), payload);

    return res.data?.lecture || null;
  } catch (error: unknown) {
    const errorMessage = getErrorText(error, 'Failed to update lecture');
    
    toast.error(`Failed to update lecture: ${errorMessage}`);
    throw error;
  }
}

// ----------------------------------------------------------------------
// Delete Lecture
export async function deleteLecture(lectureId: number) {
  try {
    
    const res = await axiosInstance.delete(endpoints.lecture.delete(lectureId));
        
    return res;
  } catch (error: unknown) {
    const errorMessage = getErrorText(error, 'Failed to delete lecture');
    
    toast.error(`Failed to delete lecture: ${errorMessage}`);
    throw error;
  }
}

// ----------------------------------------------------------------------
// Upload files separately (if needed later)
export async function uploadLectureFiles(lectureId: number, files: { 
  mediaFile?: File; 
  thumbnailFile?: File;
}) {
  try {
    
    const formData = new FormData();
    formData.append('lecture_id', lectureId.toString());
    
    if (files.mediaFile) {
      formData.append('mediaFile', files.mediaFile);
    }
    
    if (files.thumbnailFile) {
      formData.append('thumbnailFile', files.thumbnailFile);
    }

    const res = await axiosInstance.post(endpoints.lecture.update(lectureId), formData);

    return res.data;
  } catch (error: unknown) {
    console.error('💥 Error uploading files:', error);

    const errorMessage = getErrorText(error, 'Failed to upload files');
    
    toast.error(`Failed to upload files: ${errorMessage}`);
    throw error;
  }
}

export function useLectureManagement() {
  const { lectures, isLoading, lecturesError } = useGetLectures();

  const createNewLecture = async (lectureData: ICreateLecture) => {
    return createLecture(lectureData);
  };

  const updateExistingLecture = async (lectureId: number, lectureData: IUpdateLecture) => {
    return updateLecture(lectureId, lectureData);
  };

  const deleteExistingLecture = async (lectureId: number) => {
    return deleteLecture(lectureId);
  };

  return {
    lectures,
    isLoading,
    lecturesError,
    createNewLecture,
    updateExistingLecture,
    deleteExistingLecture,
  };
}
