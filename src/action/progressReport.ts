import useSWR from 'swr';
import axios from 'axios';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import { toast } from 'sonner';
import type {
  ProgressReportData,
  ProgressReportFilters,
} from '../types/progressReport';

type ProgressReportApiResponse = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: ProgressReportData;
};

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

const buildProgressReportUrl = (filters?: ProgressReportFilters) => {
  const searchParams = new URLSearchParams();

  if (typeof filters?.studentId === 'number' && Number.isFinite(filters.studentId)) {
    searchParams.set('studentId', String(filters.studentId));
  }

  if (typeof filters?.instituteId === 'number' && Number.isFinite(filters.instituteId)) {
    searchParams.set('instituteId', String(filters.instituteId));
  }

  if (typeof filters?.departmentId === 'number' && Number.isFinite(filters.departmentId)) {
    searchParams.set('departmentId', String(filters.departmentId));
  }

  const query = searchParams.toString();
  return query ? `${endpoints.studentQuery.progressReport}?${query}` : endpoints.studentQuery.progressReport;
};

const isRequestSuccess = (res: ProgressReportApiResponse, statusCode: number) => {
  if (typeof res.success === 'boolean') {
    return res.success;
  }

  if (typeof res.status === 'boolean') {
    return res.status;
  }

  return statusCode >= 200 && statusCode < 300;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const payload = error.response?.data as { message?: string } | undefined;
  return payload?.message || error.message || fallback;
};

export function useProgressReport(filters?: ProgressReportFilters | null) {
  const url = filters === null ? null : buildProgressReportUrl(filters);

  const { data, isLoading, error, isValidating, mutate } = useSWR<ProgressReportApiResponse>(
    url,
    fetcher,
    {
      ...swrOptions,
      onError: (err) => {
        console.error('🔴 useProgressReport Error:', err);
        toast.error(getErrorMessage(err, 'Failed to fetch progress report'));
      },
    }
  );

  return {
    report: data?.data ?? null,
    reportMessage: data?.message,
    reportLoading: isLoading,
    reportError: error,
    reportValidating: isValidating,
    reportEmpty: !isLoading && !error && !data?.data,
    reportMutate: mutate,
  };
}

export async function getProgressReport(filters?: ProgressReportFilters): Promise<ProgressReportData | null> {
  try {
    const response = await axiosInstance.get<ProgressReportApiResponse>(buildProgressReportUrl(filters));
    const ok = isRequestSuccess(response.data, response.status);

    if (!ok || !response.data.data) {
      toast.error(response.data.message || 'Failed to fetch progress report');
      return null;
    }

    return response.data.data;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to fetch progress report'));
    return null;
  }
}