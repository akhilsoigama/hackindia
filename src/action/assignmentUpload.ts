import { toast } from 'sonner';
import { useMemo } from 'react';
import useSWR from 'swr';
import {
  IAssignment,
  IAssignmentUploadResponse,
  IAssignmentUploadListItem,
} from '../types/assignmentUpload';
import { IAssignmentItem } from '../types/assignment';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import { useUser } from '../atoms/userAtom';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 30000,
  keepPreviousData: true,
};

const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string; messages?: string } } })
      .response;
    return response?.data?.message || response?.data?.messages || fallback;
  }
  return fallback;
};

const getGradeFromMarks = (marks: number): string => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
};

/**
 * Create a new assignment upload
 */
export async function createAssignmentUpload(
  formData: FormData
): Promise<IAssignmentUploadResponse | null> {
  const url = endpoints.assignmentUpload.create;
  try {
    const res = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res?.status === 200 || res?.status === 201) {
      return res.data?.data ?? null;
    }
    return null;
  } catch (err: unknown) {
    toast.error(getApiErrorMessage(err, 'Failed to submit assignment'));
    return null;
  }
}

/**
 * Fetch all assignments for the current user
 */
export function useAssignments(searchFor?: string) {
  const BaseUrl = endpoints.assignment.getAll;

  const params = useMemo(() => {
    const queryParams = new URLSearchParams();
    if (searchFor) {
      queryParams.append('searchFor', searchFor);
    }
    return queryParams.toString();
  }, [searchFor]);

  const urlWithParams = params ? `${BaseUrl}?${params}` : BaseUrl;

  const { data, isLoading, error, isValidating, mutate } = useSWR<{
    data: IAssignmentItem[];
  }>(urlWithParams, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      assignments: (data?.data || []).map((item: IAssignmentItem): IAssignment => {
        const dueDateValue =
          typeof item.dueDate === 'string'
            ? item.dueDate
            : item.dueDate instanceof Date
              ? item.dueDate.toISOString()
              : new Date().toISOString();

        return {
          id: String(item.id),
          title: item.assignmentTitle || 'Untitled Assignment',
          course: item.subject || 'Unknown',
          subject: item.subject || 'Unknown',
          dueDate: dueDateValue.split('T')[0],
          dueTime: '23:59',
          description: item.assignmentDescription || '',
          instructions: '',
          maxPoints: item.marks || 100,
          status: 'pending',
        };
      }),
      assignmentsLoading: isLoading,
      assignmentsError: error,
      assignmentsValidating: isValidating,
      assignmentsEmpty: !isLoading && (data?.data || []).length === 0,
      assignmentsMutate: mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
    
/**
 * Fetch all assignment uploads (submissions) for the current user
 */
export function useAssignmentUploads(searchFor?: string) {
  const { user, isFacultyUser } = useUser();
  const BaseUrl = endpoints.assignmentUpload.getAll;

  const params = useMemo(() => {
    const queryParams = new URLSearchParams();
    if (searchFor) {
      queryParams.append('searchFor', searchFor);
    }
    return queryParams.toString();
  }, [searchFor]);

  const urlWithParams = params ? `${BaseUrl}?${params}` : BaseUrl;
  const hasFacultyAssociation = typeof user?.facultyId === 'number' && user.facultyId > 0;
  const shouldFetch = !(isFacultyUser && !hasFacultyAssociation);

  const { data, isLoading, error, isValidating, mutate } = useSWR<{
    data: IAssignmentUploadResponse[];
  }>(shouldFetch ? urlWithParams : null, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      submissions: (data?.data || []).map((item: IAssignmentUploadResponse) => {
        const studentName = item.Student?.studentName?.trim() || `Student ${item.studentId}`;
        const studentId = item.Student?.studentId || String(item.studentId);
        const studentGrNo = item.Student?.studentGrNo ? String(item.Student.studentGrNo) : '';
        const hasSubmittedFile = Boolean(item.assignmentFile);
        const isSubmitted = item.isSubmitted || hasSubmittedFile;
        const isGraded =
          item.isGraded ||
          Boolean(item.isGradedByFaculty) ||
          item.marks !== null ||
          item.grad !== null;
        const facultyName =
          item.Faculty?.facultyName ||
          (item.Assignment?.facultyId ? `Faculty #${item.Assignment.facultyId}` : undefined) ||
          (item.facultyId ? `Faculty #${item.facultyId}` : undefined) ||
          'N/A';
        
        return {
          id: String(item.id),
          assignmentId: String(item.assignmentId),
          isActive: item.isActive ?? true,
          studentName,
          studentId,
          studentGrNo,
          title: item.Assignment?.assignmentTitle || item.Assignment?.title || 'Unknown',
          subject: item.Assignment?.subject || 'Unknown',
          submittedDate: item.createdAt?.split('T')[0],
          assignmentFile: item.assignmentFile,
          comments: item.comments,
          status: isSubmitted ? (isGraded ? 'graded' : 'submitted') : 'pending',
          fileType: (item.assignmentFile?.split('.').pop()?.toLowerCase() || 'pdf') as
            | 'pdf'
            | 'doc'
            | 'image'
            | 'zip',
          fileSize: '5.1 MB',
          marks: item.marks ?? undefined,
          maxPoints: item.Assignment?.marks ?? item.Assignment?.maxPoints ?? 100,
          facultyName,
        } as IAssignmentUploadListItem;
      }),
      submissionsLoading: isLoading,
      submissionsError: error,
      submissionsValidating: isValidating,
      submissionsEmpty: !isLoading && (data?.data || []).length === 0,
      submissionsMutate: mutate,
      hasFacultyAssociation,
      hasAssociationError: isFacultyUser && !hasFacultyAssociation,
    }),
    [data?.data, error, isLoading, isValidating, mutate, hasFacultyAssociation, isFacultyUser]
  );

  return memoizedValue;
}

/**
 * Delete an assignment upload (submission)
 */
export async function deleteAssignmentUpload(uploadId: number): Promise<boolean> {
  const url = endpoints.assignmentUpload.delete(uploadId);
  try {
    const res = await axiosInstance.delete(url);
    if (res?.status === 200 || res?.status === 204) {
      toast.success('Submission deleted successfully');
      return true;
    }
    return false;
  } catch (err: unknown) {
    toast.error(getApiErrorMessage(err, 'Failed to delete submission'));
    return false;
  }
}

/**
 * Update an assignment upload (submission)
 */
export async function updateAssignmentUpload(
  uploadId: number,
  formData: FormData
): Promise<IAssignmentUploadResponse | null> {
  const url = endpoints.assignmentUpload.update(uploadId);
  try {
    const res = await axiosInstance.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res?.status === 200 || res?.status === 201) {
      toast.success('Submission updated successfully');
      return res.data?.data ?? null;
    }
    return null;
  } catch (err: unknown) {
    toast.error(getApiErrorMessage(err, 'Failed to update submission'));
    return null;
  }
}

/**
 * Update marks and grading status for an assignment submission (Faculty only)
 */
export async function gradeAssignmentSubmission(
  uploadId: number,
  marks: number,
  isGraded: boolean = true,
  facultyId?: number
): Promise<IAssignmentUploadResponse | null> {
  const url = endpoints.assignmentUpload.update(uploadId);
  try {
    const payload: Record<string, unknown> = {
      marks,
      isGraded,
      isGradedByFaculty: true,
      grad: getGradeFromMarks(marks),
    };

    if (typeof facultyId === 'number') {
      payload.facultyId = facultyId;
    }

    const res = await axiosInstance.put(
      url,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (res?.status === 200 || res?.status === 201) {
      toast.success('Marks updated successfully');
      return res.data?.data ?? null;
    }
    return null;
  } catch (err: unknown) {
    toast.error(getApiErrorMessage(err, 'Failed to update marks'));
    return null;
  }
}
