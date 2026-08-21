import { toast } from "sonner";
import { IAssignmentItem, IcreateAssignment } from "../types/assignment";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import { useUser } from "../atoms/userAtom";
import { useMemo } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useFaculties } from "./faculty";

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 8000,
    keepPreviousData: true,
};

const getApiErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string; messages?: string } } }).response;
        return response?.data?.message || response?.data?.messages || fallback;
    }
    return fallback;
};

export async function createAssignment(formData: IcreateAssignment) {
    const url = endpoints.assignment.create;
    try {
        const res = await axiosInstance.post(url, formData);
        if (res?.status === 200 || res?.status === 201) {
            await globalMutate((key) => typeof key === 'string' && key.startsWith(endpoints.assignment.getAll));
            return res.data?.data?.id ?? res.data?.id ?? null;
        }
        return null;
    } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, 'Failed to create Assignment'));
        return null;
    }
}

export function useAssignments(searchFor?: string, facultyId?: number, page = 1, limit = 20, search?: string) {
    const { user } = useUser();

    const getEndpoint = () => {
        if (user?.isInstitute) {
            return endpoints.assignment.getAll;
        } else if (user?.isSuperAdmin) {
            return endpoints.assignment.getAll;
        } else {
            return endpoints.assignment.getAll;
        }
    };

    const BaseUrl = getEndpoint();

    const params = useMemo(() => {
        const queryParams = new URLSearchParams();
        if (searchFor) {
            queryParams.append('searchFor', searchFor)
        }
        if (facultyId && user?.isSuperAdmin) {
            queryParams.append('facultyId', facultyId.toString());
        }
        if (search) {
            queryParams.append('search', search);
        }
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
        return queryParams.toString();
    }, [search, searchFor, facultyId, limit, page, user?.isSuperAdmin])

    const urlWithParams = params ? `${BaseUrl}?${params}` : BaseUrl;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IAssignmentItem[];
        meta?: {
            total: number;
            perPage: number;
            currentPage: number;
            lastPage: number;
        };
    }>(urlWithParams, fetcher, swrOptions)

    const memoizedValue = useMemo(
        () => ({
            assignments: data?.data || [],
            assignmentLoadind: isLoading,
            assignmentError: error,
            assessmentValidating: isValidating,
            assessmentEmpty: !isLoading && !error && (!data?.data || data.data.length === 0),
            assignmentMutate: mutate,
            assignmentMeta: data?.meta,
        }),
        [data?.data, data?.meta, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useInstituteAssignments(searchFor?: string, page = 1, limit = 20, search?: string) {
    const { user } = useUser()

    const params = useMemo(() => {
        const queryParams = new URLSearchParams();
        if (searchFor) {
            queryParams.append('searchFor', searchFor);
        }
        if (search) {
            queryParams.append('search', search);
        }
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
        return queryParams.toString();
    }, [limit, page, search, searchFor]);

    const urlWithParams = params ? `${endpoints.assignment.getAll}?${params}` : endpoints.assignment.getAll;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IAssignmentItem[];
    }>(
        user?.userType === 'institute' ? urlWithParams : null,
        fetcher,
        swrOptions
    );

    const memoizedValue = useMemo(
        () => ({
            assignments: data?.data || [],
            assignmentsLoading: isLoading,
            assignmentsError: error,
            assignmentsValidating: isValidating,
            assignmentsEmpty: !isLoading && !error && !data?.data,
            assignmentMutate: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue
}

export function useAssignment(assignmentId: number) {
    const url = assignmentId ? endpoints.assignment.details(assignmentId) : null;
    const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: IAssignmentItem }>(
        url,
        fetcher,
        swrOptions
    );

    const memoizedValue = useMemo(
        () => ({
            assignment: data?.data || null,
            isLoading,
            assignmentError: error,
            assignmentValidating: isValidating,
            assignmentEmpty: !isLoading && !error && !data?.data,
            assignmentMutate: mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue
}

export async function updateAssignment(id: number, formData: IcreateAssignment) {
    const url = endpoints.assignment.update(id)
    try {
        const res = await axiosInstance.put(url, formData);
        await globalMutate((key) => typeof key === 'string' && key.startsWith(endpoints.assignment.getAll));
        await globalMutate(endpoints.assignment.details(id));
        return res
    } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, 'Failed to update Assignment'))
        return null;
    }
}

export async function deleteAssignment(id: number) {
    const url = endpoints.assignment.delete(id)
    try {
        const res = await axiosInstance.delete(url);
        if (res.status === 200) {
            await globalMutate((key) => typeof key === 'string' && key.startsWith(endpoints.assignment.getAll));
            return true;
        }
    } catch {
        return false
    }
}

export function useSearchAssignments(searchFor: string) {
    return useFaculties(searchFor)
}