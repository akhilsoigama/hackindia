import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';
import { toast } from 'sonner';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import type { IDepartment } from '../types/department';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

interface FacultyLeavePayload {
  leaveType: string;
  reason: string;
  startDate: string;
  endDate: string;
}

interface FacultyLeaveResponse {
  id: number;
  facultyId: number;
  teacherName?: string;
  teacherId?: string;
  faculty?: {
    id?: number;
    facultyName?: string;
    facultyId?: string;
    department?: IDepartment;
  };
  department?: IDepartment;
  leaveType: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isHalfDay?: boolean;
  halfDayType?: string;
  reason: string;
  substituteTeacher?: string;
  contactNumber?: string;
  emergencyContact?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate?: string;
  createdAt?: string;
  reviewedBy?: number;
  reviewDate?: string;
  instituteRemark?: string;
  documents?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export type { FacultyLeaveResponse };

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}

const getErrorData = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Something went wrong';
  }

  const responseData = error.response?.data as { message?: string } | undefined;
  return responseData?.message || error.message || 'Something went wrong';
};

interface RawFacultyLeaveItem {
  id?: number;
  facultyId?: number;
  faculty_id?: number;
  teacherName?: string;
  teacher_name?: string;
  teacherId?: number;
  teacher_id?: number;
  faculty?: { facultyName?: string; facultyId?: string; department?: unknown };
  department?: unknown;
  leaveType?: string;
  leave_type?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  startTime?: string;
  start_time?: string;
  endTime?: string;
  end_time?: string;
  isHalfDay?: boolean;
  is_half_day?: boolean;
  halfDayType?: string;
  half_day_type?: string;
  reason?: string;
  [key: string]: unknown;
}

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  return undefined;
};

const toDepartment = (value: unknown): IDepartment | undefined => {
  if (value && typeof value === 'object') {
    return value as IDepartment;
  }
  return undefined;
};

const isLeaveStatus = (value: unknown): value is FacultyLeaveResponse['status'] =>
  value === 'pending' || value === 'approved' || value === 'rejected';

const isLeavePriority = (value: unknown): value is NonNullable<FacultyLeaveResponse['priority']> =>
  value === 'low' || value === 'medium' || value === 'high';

const normalizeFacultyLeave = (item: RawFacultyLeaveItem): FacultyLeaveResponse => {
  const facultyDepartment = toDepartment(item?.faculty?.department);
  const department = toDepartment(item?.department) ?? facultyDepartment;

  return {
    id: toNumber(item?.id) ?? 0,
    facultyId: toNumber(item?.facultyId ?? item?.faculty_id) ?? 0,
    teacherName: toStringValue(item?.teacherName ?? item?.teacher_name ?? item?.faculty?.facultyName),
    teacherId: toStringValue(item?.teacherId ?? item?.teacher_id ?? item?.faculty?.facultyId),
    faculty: item?.faculty
      ? {
          id: toNumber((item.faculty as { id?: unknown })?.id),
          facultyName: toStringValue(item.faculty.facultyName),
          facultyId: toStringValue(item.faculty.facultyId),
          department,
        }
      : undefined,
    department,
    leaveType: toStringValue(item?.leaveType ?? item?.leave_type) ?? '',
    startDate: toStringValue(item?.startDate ?? item?.start_date) ?? '',
    endDate: toStringValue(item?.endDate ?? item?.end_date) ?? '',
    startTime: toStringValue(item?.startTime ?? item?.start_time),
    endTime: toStringValue(item?.endTime ?? item?.end_time),
    isHalfDay: toBoolean(item?.isHalfDay ?? item?.is_half_day),
    halfDayType: toStringValue(item?.halfDayType ?? item?.half_day_type),
    reason: toStringValue(item?.reason) ?? '',
    substituteTeacher: toStringValue(item?.substituteTeacher ?? item?.substitute_teacher),
    contactNumber: toStringValue(item?.contactNumber ?? item?.contact_number),
    emergencyContact: toStringValue(item?.emergencyContact ?? item?.emergency_contact),
    status: isLeaveStatus(item?.status) ? item.status : 'pending',
    submittedDate: toStringValue(item?.submittedDate ?? item?.submitted_date ?? item?.createdAt ?? item?.created_at),
    createdAt: toStringValue(item?.createdAt ?? item?.created_at),
    reviewedBy: toNumber(item?.reviewedBy ?? item?.reviewed_by),
    reviewDate: toStringValue(item?.reviewDate ?? item?.review_date ?? item?.reviewedAt ?? item?.reviewed_at),
    instituteRemark: toStringValue(item?.instituteRemark ?? item?.institute_remark),
    documents: Array.isArray(item?.documents)
      ? item.documents.filter((doc): doc is string => typeof doc === 'string')
      : Array.isArray(item?.documentList)
      ? item.documentList.filter((doc): doc is string => typeof doc === 'string')
      : undefined,
    priority: isLeavePriority(item?.priority) ? item.priority : undefined,
  };
};

/**
 * Fetch all faculty leaves
 */
export function useGetFacultyLeaves(filters?: { status?: string; facultyId?: number }) {
  const params = useMemo(() => {
    const queryParams = new URLSearchParams();
    if (filters?.status) {
      queryParams.append('status', filters.status);
    }
    if (filters?.facultyId) {
      queryParams.append('facultyId', String(filters.facultyId));
    }
    return queryParams.toString();
  }, [filters]);

  const url = params ? `${endpoints.facultyLeave.getAll}?${params}` : endpoints.facultyLeave.getAll;

  const { data, isLoading, error, isValidating, mutate } = useSWR<ApiResponse<RawFacultyLeaveItem[]>>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      leaves: (data?.data || []).map(normalizeFacultyLeave),
      leavesLoading: isLoading,
      leavesError: error,
      leavesValidating: isValidating,
      leavesEmpty: !isLoading && (!data?.data || data.data.length === 0),
      leavesMutate: mutate,
      leavesStatus: data?.status ?? false,
      leavesMessage: data?.message,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

/**
 * Fetch a single faculty leave by ID
 */
export function useGetFacultyLeaveById(leaveId: number | null) {
  const url = leaveId ? endpoints.facultyLeave.details(leaveId) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<RawFacultyLeaveItem>>(
    url,
    fetcher,
    {
      ...swrOptions,
      onError: () => {
        toast.error('Failed to fetch leave data');
      },
    }
  );

  const memoizedValue = useMemo(
    () => ({
      leave: data?.data ? normalizeFacultyLeave(data.data) : null,
      leaveLoading: isLoading,
      leaveError: error,
      leaveValidating: isValidating,
      leaveEmpty: !isLoading && !error && !data?.data,
      leaveMutate: mutate,
      leaveStatus: data?.status ?? false,
      leaveMessage: data?.message,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

/**
 * Hook to refresh leave data
 */
export function useFacultyLeaveMutation() {
  const { mutate: mutateAll } = useSWR(endpoints.facultyLeave.getAll);

  const refreshLeaves = async () => {
    try {
      await mutateAll();
    } catch (error) {
      console.error('Failed to refresh leaves cache', error);
    }
  };

  return { refreshLeaves };
}

/**
 * Create a new faculty leave request
 */
export async function createFacultyLeave(payload: FacultyLeavePayload): Promise<FacultyLeaveResponse | null> {
  try {
    const response = await axiosInstance.post<ApiResponse<RawFacultyLeaveItem>>(
      endpoints.facultyLeave.create,
      payload
    );

    if ((response.status === 201 || response.status === 200) && response.data.status) {
      toast.success(response.data.message || 'Leave request created successfully');
      return response.data.data ? normalizeFacultyLeave(response.data.data) : null;
    }

    toast.error(response.data.message || 'Failed to create leave request');
    return null;
  } catch (error: unknown) {
    const errorMessage = getErrorData(error);
    toast.error(errorMessage);
    return null;
  }
}

/**
 * Update an existing faculty leave request
 */
export async function updateFacultyLeave(
  leaveId: number,
  payload: FacultyLeavePayload
): Promise<FacultyLeaveResponse | null> {
  try {
    const response = await axiosInstance.patch<ApiResponse<RawFacultyLeaveItem>>(
      endpoints.facultyLeave.update(leaveId),
      payload
    );

    if ((response.status === 200 || response.status === 201) && response.data.status) {
      toast.success(response.data.message || 'Leave request updated successfully');
      return response.data.data ? normalizeFacultyLeave(response.data.data) : null;
    }

    toast.error(response.data.message || 'Failed to update leave request');
    return null;
  } catch (error: unknown) {
    const errorMessage = getErrorData(error);
    toast.error(errorMessage);
    return null;
  }
}

/**
 * Delete a faculty leave request
 */
export async function deleteFacultyLeave(leaveId: number): Promise<boolean> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(endpoints.facultyLeave.delete(leaveId));

    if ((response.status === 200 || response.status === 204) && response.data.status) {
      toast.success(response.data.message || 'Leave request deleted successfully');
      return true;
    }

    toast.error(response.data.message || 'Failed to delete leave request');
    return false;
  } catch (error: unknown) {
    const errorMessage = getErrorData(error);
    toast.error(errorMessage);
    return false;
  }
}

/**
 * Approve a faculty leave request
 */
export async function approveFacultyLeave(
  leaveId: number,
  remark?: string
): Promise<FacultyLeaveResponse | null> {
  try {
    const payload = remark ? { instituteRemark: remark } : {};
    const response = await axiosInstance.patch<ApiResponse<RawFacultyLeaveItem>>(
      endpoints.facultyLeave.approve(leaveId),
      payload
    );

    if ((response.status === 200 || response.status === 201) && response.data.status) {
      toast.success(response.data.message || 'Leave approved successfully');
      return response.data.data ? normalizeFacultyLeave(response.data.data) : null;
    }

    toast.error(response.data.message || 'Failed to approve leave');
    return null;
  } catch (error: unknown) {
    const errorMessage = getErrorData(error);
    toast.error(errorMessage);
    return null;
  }
}

/**
 * Reject a faculty leave request
 */
export async function rejectFacultyLeave(
  leaveId: number,
  remark?: string
): Promise<FacultyLeaveResponse | null> {
  try {
    const payload = remark ? { instituteRemark: remark } : {};
    const response = await axiosInstance.patch<ApiResponse<RawFacultyLeaveItem>>(
      endpoints.facultyLeave.reject(leaveId),
      payload
    );

    if ((response.status === 200 || response.status === 201) && response.data.status) {
      toast.success(response.data.message || 'Leave rejected successfully');
      return response.data.data ? normalizeFacultyLeave(response.data.data) : null;
    }

    toast.error(response.data.message || 'Failed to reject leave');
    return null;
  } catch (error: unknown) {
    const errorMessage = getErrorData(error);
    toast.error(errorMessage);
    return null;
  }
}
