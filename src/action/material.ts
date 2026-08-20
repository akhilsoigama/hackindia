// hooks/useLectures.ts
import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import { ICreateLecture, ILecture, IUpdateLecture } from '../types/material';
import { toast } from 'sonner';

// ----------------------------------------------------------------------
// SWR Options
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
// Fetch all lectures
export function useGetLectures(searchFor?: string) {
  const url =
    searchFor === 'create'
      ? `${endpoints.material.getAll}?searchFor=${searchFor}`
      : endpoints.material.getAll;

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

// ----------------------------------------------------------------------
// Fetch single lecture
export function useGetLecture(lectureId: number) {
  const url = endpoints.material.details(lectureId);

  const { data, error, isLoading, isValidating } = useSWR<{ data: ILecture }>(
    url,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      lecture: data?.data || null,
      isLoading,
      lectureError: error,
      lectureValidating: isValidating,
      lectureEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// ----------------------------------------------------------------------
// Helper: Map frontend keys to backend validator format
function mapLecturePayload(data: any, isUpdate = false) {
  const mapped = {
    title: data.title,
    description: data.description,
    subject: data.subject,
    std: data.std,
    duration: data.duration,
  };

  if (isUpdate) {
    // Update validator uses camelCase keys
    return {
      ...mapped,
      contentType: data.contentType,
      contentUrl: data.contentUrl || undefined,
      thumbnailPath: data.thumbnailUrl || undefined,
      textContent: data.textContent,
    };
  }

  // Create validator requires snake_case
  return {
    ...mapped,
    content_type: data.contentType,
    content_url: data.contentUrl || undefined,
    thumbnail_url: data.thumbnailUrl || undefined,
    duration_in_seconds: data.durationInSeconds || undefined,
    text_content: data.textContent,
    faculty_id: data.faculty_id ?? 1, 
  };
}

// ----------------------------------------------------------------------
// Create Lecture
export async function createLecture(lectureData: ICreateLecture) {
  try {
    const payload = mapLecturePayload(lectureData);

    const res = await axiosInstance.post(endpoints.lecture.create, payload);
    toast.success('Lecture created successfully');

    return res.data?.lecture || null;
  } catch (error: any) {
    toast.error(
      `Failed to create lecture: ${error?.response?.data?.message || error.message}`
    );
    return null;
  }
}

// ----------------------------------------------------------------------
// Update Lecture
export async function updateLecture(lectureId: number, lectureData: IUpdateLecture) {
  try {
    const payload = mapLecturePayload(lectureData, true);

    const res = await axiosInstance.put(endpoints.material.update(lectureId), payload);
    toast.success('Lecture updated successfully');

    return res.data?.lecture || null;
  } catch (error: any) {
    toast.error(
      `Failed to update lecture: ${error?.response?.data?.message || error.message}`
    );
    return null;
  }
}

// ----------------------------------------------------------------------
// Delete Lecture
export async function deleteLecture(lectureId: number) {
  try {
    const res = await axiosInstance.delete(endpoints.material.delete(lectureId));
    toast.success('Lecture deleted successfully');
    return res;
  } catch (error: any) {
    toast.error(
      `Failed to delete lecture: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
