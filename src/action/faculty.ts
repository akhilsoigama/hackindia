import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import { IcreateFaculty, IfacultyItem } from '../types/Faculty';
import { toast } from 'sonner';
import { useUser } from '../atoms/userAtom';

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
};

const facultyLiveFetcher = async <T = unknown>(url: string): Promise<T> => {
    const response = await axiosInstance.get<T>(url);
    return response.data;
};

export async function createFaculty(formData: IcreateFaculty) {
    const url = endpoints.faculty.create;
    try {
        const res = await axiosInstance.post(url, formData);
        if (res?.status === 200) {
            return res.data?.data?.id;
        }
        return null;
    } catch {
        toast.error('Failed to create faculty');
        return null;
    }
}

export function useFaculties(searchFor?: string, instituteId?: number) {
    const { user } = useUser();

    const getEndpoint = () => {
        if (user?.isInstitute) {
            return endpoints.faculty.getAll;
        } else if (user?.isSuperAdmin) {
            return endpoints.faculty.getAll;
        } else {
            return endpoints.faculty.getAll;
        }
    };

    const baseUrl = getEndpoint();

    const params = useMemo(() => {
        const queryParams = new URLSearchParams();
        if (searchFor) {
            queryParams.append('searchFor', searchFor);
        }
        if (instituteId && user?.isSuperAdmin) {
            queryParams.append('instituteId', instituteId.toString());
        }
        return queryParams.toString();
    }, [searchFor, instituteId, user]);

    const urlWithParams = params ? `${baseUrl}?${params}` : baseUrl;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data?: IfacultyItem[];
        status?: boolean;
        message?: string;
    } | IfacultyItem[]>(user ? urlWithParams : null, facultyLiveFetcher, swrOptions);

    const normalizedFaculties = useMemo(() => {
        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        return [];
    }, [data]);

    const memoizedValue = useMemo(
        () => ({
            faculties: normalizedFaculties,
            facultiesLoading: isLoading,
            facultiesError: error,
            facultiesValidating: isValidating,
            facultiesEmpty: !isLoading && normalizedFaculties.length === 0,
            facultiesMutate: mutate,
        }),
        [normalizedFaculties, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useInstituteFaculties(searchFor?: string) {
    const { user } = useUser();
    const instituteId = user?.instituteId ?? user?.data?.instituteId ?? ((user?.data as unknown as Record<string, unknown> | undefined)?.institute_id as number | undefined);

    const params = useMemo(() => {
        const queryParams = new URLSearchParams();
        if (searchFor) {
            queryParams.append('searchFor', searchFor);
        }

        if (instituteId) {
            queryParams.append('instituteId', String(instituteId));
        }

        return queryParams.toString();
    }, [searchFor, instituteId]);

    const urlWithParams = params ? `${endpoints.faculty.getAll}?${params}` : endpoints.faculty.getAll;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data?: IfacultyItem[];
        status?: boolean;
        message?: string;
    } | IfacultyItem[]>(
        user ? urlWithParams : null,
        facultyLiveFetcher,
        swrOptions
    );

    const normalizedFaculties = useMemo(() => {
        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        return [];
    }, [data]);

    const memoizedValue = useMemo(
        () => ({
            faculties: normalizedFaculties,
            facultiesLoading: isLoading,
            facultiesError: error,
            facultiesValidating: isValidating,
            facultiesEmpty: !isLoading && !error && normalizedFaculties.length === 0,
            facultiesMutate: mutate,
        }),
        [normalizedFaculties, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useFaculty(facultyId: number, instituteId?: number) {
    const url = facultyId ? endpoints.faculty.details(facultyId) : null;
    const detailUrl = useMemo(() => {
        if (!url) {
            return null;
        }

        if (instituteId) {
            const queryParams = new URLSearchParams();
            queryParams.append('instituteId', String(instituteId));
            return `${url}?${queryParams.toString()}`;
        }

        return url;
    }, [url, instituteId]);

    const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: IfacultyItem }>(
        detailUrl,
        fetcher,
        swrOptions
    );

    const memoizedValue = useMemo(
        () => ({
            faculty: data?.data || null,
            isLoading,
            facultyError: error,
            facultyValidating: isValidating,
            facultyEmpty: !isLoading && !error && !data?.data,
            facultyMutate: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export async function updateFaculty(id: number, formData: IcreateFaculty) {
    const url = endpoints.faculty.update(id);
    try {
        const res = await axiosInstance.put(url, formData);
        return res;
    } catch {
        toast.error('Failed to update faculty');
        return null;
    }
}

export async function deleteFaculty(id: number, instituteId?: number | string | null) {
    const url = endpoints.faculty.delete(id);
    try {
        const config = instituteId ? { params: { instituteId: String(instituteId) } } : undefined;
        const res = await axiosInstance.delete(url, config);

        const payload = res.data as { status?: boolean; message?: string } | undefined;
        const okByStatus = res.status === 200 || res.status === 204;
        const okByPayload = payload?.status ?? true;

        if (okByStatus && okByPayload) {
            toast.success(payload?.message || 'Faculty deleted successfully');
            return true;
        }

        toast.error(payload?.message || 'Failed to delete faculty');
        return false;
    } catch {
        // Error toast is handled by axios interceptor.
        return false;
    }
}

export function useSearchFaculties(searchFor: string) {
    return useFaculties(searchFor);
}