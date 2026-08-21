import useSWR from 'swr';
import { useMemo } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import type {
  CreateStudentQueryPayload,
  StudentQueryItem,
  StudentQueryListFilters,
  StudentQueryPriority,
  StudentQueryStatus,
  UpdateStudentQueryPayload,
} from '../types/studentQuery';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

type ApiResponse<T> = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    perPage?: number;
    currentPage?: number;
    lastPage?: number;
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const payload = error.response?.data as { message?: string } | undefined;
  return payload?.message || error.message || fallback;
};

interface RawStudentQueryItem {
  id?: number;
  studentId?: number;
  student_id?: number;
  instituteId?: number;
  institute_id?: number;
  assignedFacultyId?: number | null;
  assigned_faculty_id?: number | null;
  resolvedByUserId?: number | null;
  resolved_by_user_id?: number | null;
  title?: string;
  description?: string;
  subject?: string | null;
  category?: string | null;
  priority?: string;
  status?: string;
  response?: string | null;
  resolvedAt?: string | null;
  resolved_at?: string | null;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  student?: unknown;
  assignedFaculty?: unknown;
  assigned_faculty?: unknown;
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
  return undefined;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  return undefined;
};

const isPriority = (value: unknown): value is StudentQueryPriority =>
  value === 'low' || value === 'medium' || value === 'high';

const isStatus = (value: unknown): value is StudentQueryStatus =>
  value === 'open' || value === 'in_progress' || value === 'resolved' || value === 'closed';

const toStudentMeta = (value: unknown): StudentQueryItem['student'] => {
  if (!value || typeof value !== 'object') return undefined;
  const student = value as { id?: unknown; studentName?: unknown; studentId?: unknown };
  return {
    id: toNumber(student.id),
    studentName: toStringValue(student.studentName),
    studentId: toStringValue(student.studentId),
  };
};

const toFacultyMeta = (value: unknown): StudentQueryItem['assignedFaculty'] => {
  if (!value || typeof value !== 'object') return undefined;
  const faculty = value as { id?: unknown; facultyName?: unknown; facultyId?: unknown };
  return {
    id: toNumber(faculty.id),
    facultyName: toStringValue(faculty.facultyName),
    facultyId: toStringValue(faculty.facultyId),
  };
};

const normalizeItem = (item: RawStudentQueryItem): StudentQueryItem => ({
  id: toNumber(item?.id) ?? 0,
  studentId: toNumber(item?.studentId ?? item?.student_id) ?? 0,
  instituteId: toNumber(item?.instituteId ?? item?.institute_id) ?? 0,
  assignedFacultyId: toNumber(item?.assignedFacultyId ?? item?.assigned_faculty_id) ?? null,
  resolvedByUserId: toNumber(item?.resolvedByUserId ?? item?.resolved_by_user_id) ?? null,
  title: toStringValue(item?.title) ?? '',
  description: toStringValue(item?.description) ?? '',
  subject: item?.subject ?? null,
  category: item?.category ?? null,
  priority: isPriority(item?.priority) ? item.priority : 'medium',
  status: isStatus(item?.status) ? item.status : 'open',
  response: item?.response ?? null,
  resolvedAt: toStringValue(item?.resolvedAt ?? item?.resolved_at) ?? null,
  isActive: toBoolean(item?.isActive ?? item?.is_active),
  createdAt: toStringValue(item?.createdAt ?? item?.created_at),
  updatedAt: toStringValue(item?.updatedAt ?? item?.updated_at),
  student: toStudentMeta(item?.student),
  assignedFaculty: toFacultyMeta(item?.assignedFaculty ?? item?.assigned_faculty),
});

const isRequestSuccess = (res: ApiResponse<unknown>, statusCode: number) => {
  if (typeof res.success === 'boolean') {
    return res.success;
  }
  if (typeof res.status === 'boolean') {
    return res.status;
  }
  return statusCode >= 200 && statusCode < 300;
};

export function useStudentQueries(filters?: StudentQueryListFilters) {
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (filters?.page) searchParams.append('page', String(filters.page));
    if (filters?.limit) searchParams.append('limit', String(filters.limit));
    if (filters?.status) searchParams.append('status', filters.status);
    if (filters?.priority) searchParams.append('priority', filters.priority);
    return searchParams.toString();
  }, [filters]);

  const url = params ? `${endpoints.studentQuery.getAll}?${params}` : endpoints.studentQuery.getAll;

  const { data, isLoading, error, isValidating, mutate } = useSWR<ApiResponse<RawStudentQueryItem[]>>(
    url,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      queries: (data?.data || []).map(normalizeItem),
      meta: data?.meta,
      queriesLoading: isLoading,
      queriesError: error,
      queriesValidating: isValidating,
      queriesEmpty: !isLoading && (!data?.data || data.data.length === 0),
      queriesMutate: mutate,
      queriesMessage: data?.message,
    }),
    [data, error, isLoading, isValidating, mutate]
  );
}

export async function createStudentQuery(payload: CreateStudentQueryPayload): Promise<StudentQueryItem | null> {
  try {
    const response = await axiosInstance.post<ApiResponse<RawStudentQueryItem>>(endpoints.studentQuery.create, payload);
    const ok = isRequestSuccess(response.data, response.status);

    if (!ok) {
      toast.error(response.data.message || 'Failed to create query');
      return null;
    }

    toast.success(response.data.message || 'Query created successfully');
    return response.data.data ? normalizeItem(response.data.data) : null;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to create query'));
    return null;
  }
}

export async function updateStudentQuery(
  queryId: number,
  payload: UpdateStudentQueryPayload
): Promise<StudentQueryItem | null> {
  try {
    const response = await axiosInstance.put<ApiResponse<RawStudentQueryItem>>(
      endpoints.studentQuery.update(queryId),
      payload
    );

    const ok = isRequestSuccess(response.data, response.status);
    if (!ok) {
      toast.error(response.data.message || 'Failed to update query');
      return null;
    }

    toast.success(response.data.message || 'Query updated successfully');
    return response.data.data ? normalizeItem(response.data.data) : null;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to update query'));
    return null;
  }
}

export async function resolveStudentQuery(queryId: number, responseText: string): Promise<StudentQueryItem | null> {
  return updateStudentQuery(queryId, {
    response: responseText,
    status: 'resolved',
  });
}

export async function deleteStudentQuery(queryId: number): Promise<boolean> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(endpoints.studentQuery.delete(queryId));
    const ok = isRequestSuccess(response.data, response.status);

    if (!ok) {
      toast.error(response.data.message || 'Failed to delete query');
      return false;
    }

    toast.success(response.data.message || 'Query deleted successfully');
    return true;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to delete query'));
    return false;
  }
}
