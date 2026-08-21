// action/student.ts
import { toast } from "sonner";
import { IcreateStudent, IStudent, IupdateStudent } from "../types/student";
import axiosInstance, { endpoints, fetcher, getWithCache } from "../utils/axios";
import useSWR, { mutate as globalMutate } from "swr";
import { useMemo } from "react";
import { useUser } from "../atoms/userAtom";
import axios from "axios";

type ValidationMessage = {
    field: string;
    message: string;
};

const getStudentErrorData = (error: unknown): { message?: string; messages?: ValidationMessage[] } => {
    if (!axios.isAxiosError(error)) {
        return { message: error instanceof Error ? error.message : "Something went wrong" };
    }

    const responseData = error.response?.data as {
        message?: string;
        error?: { messages?: ValidationMessage[] };
    } | undefined;

    return {
        message: responseData?.message || error.message,
        messages: responseData?.error?.messages,
    };
};

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 8000,
    keepPreviousData: true,
};

export function useInstituteStudents(searchFor?: string, instituteId?: number, page = 1, limit = 20) {
    const { user } = useUser();
    void instituteId;
    const baseUrl = endpoints.student.getAll;

    const isInstituteUser = user?.userType === 'institute';

    const effectiveInstituteId = useMemo(() => {
        if (isInstituteUser && user?.instituteId) {
            return user.instituteId;
        }
        return undefined;
    }, [isInstituteUser, user?.instituteId]);

    const params = useMemo(() => {
        const queryParams = new URLSearchParams();
        if (searchFor) {
            queryParams.append('searchFor', searchFor);
        }
        if (effectiveInstituteId) {
            queryParams.append('instituteId', effectiveInstituteId.toString());
        }
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
        return queryParams.toString();
    }, [effectiveInstituteId, limit, page, searchFor]);

    const urlWithParams = params ? `${baseUrl}?${params}` : baseUrl;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IStudent[];
        meta?: {
            total: number;
            perPage: number;
            currentPage: number;
            lastPage: number;
        };
    }>(user ? urlWithParams : null, fetcher, swrOptions);
    const filteredStudents = useMemo(() => {
        const rawStudents = data?.data || [];
        if (!effectiveInstituteId) {
            return rawStudents;
        }
        return rawStudents.filter((student) => student.instituteId === effectiveInstituteId);
    }, [data?.data, effectiveInstituteId]);

    const memoizedValue = useMemo(
        () => ({
            students: filteredStudents,
            studentsLoading: isLoading,
            studentsError: error,
            studentsValidating: isValidating,
            studentsEmpty: !isLoading && !error && filteredStudents.length === 0,
            studentsMutate: mutate,
            studentsMeta: data?.meta,
        }),
        [data?.meta, error, filteredStudents, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGetStudent(studentId: number, instituteId?: number) {
    const url = studentId ? endpoints.student.details(studentId) : null;
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

    const { data, error, isLoading, isValidating, mutate } = useSWR<{
        data?: IStudent
    } | IStudent>(
        detailUrl,
        fetcher,
        {
            ...swrOptions,
            onError: () => {
                toast.error("Failed to fetch student data");
            },
        }
    );

    const normalizedStudent = useMemo(() => {
        if (!data) return null;

        if (typeof data === 'object' && data !== null && 'data' in data) {
            return (data as { data?: IStudent }).data || null;
        }

        return data as IStudent;
    }, [data]);

    const memoizedValue = useMemo(
        () => ({
            student: normalizedStudent,
            studentLoading: isLoading,
            studentError: error,
            studentValidating: isValidating,
            studentEmpty: !isLoading && !error && !normalizedStudent,
            studentMutate: mutate,
        }),
        [normalizedStudent, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export async function createStudent(formData: IcreateStudent) {
    try {
        const res = await axiosInstance.post(
            endpoints.student.create,
            formData
        );

        if (res.status === 201) {
            toast.success("Student created successfully");
            await globalMutate((key) => typeof key === 'string' && key.startsWith(endpoints.student.getAll));
            return res.data?.data || res.data;
        } else {
            toast.error("Failed to create student");
            throw new Error("Failed to create student");
        }
    } catch (error: unknown) {
        const parsedError = getStudentErrorData(error);
        if (parsedError.messages?.length) {
            parsedError.messages.forEach((msg) => {
                toast.error(`${msg.field}: ${msg.message}`);
            });
        } else {
            toast.error(parsedError.message || "Failed to create student");
        }
        throw error;
    }
}

export async function updateStudent(studentId: number, formData: IupdateStudent) {
    try {
        const url = endpoints.student.update(studentId);
        const res = await axiosInstance.put(url, formData);

        if (res.status === 200) {
            toast.success("Student updated successfully");
            await globalMutate((key) => typeof key === 'string' && key.startsWith(endpoints.student.getAll));
            await globalMutate(endpoints.student.details(studentId));
            return res.data?.data || res.data;
        } else {
            toast.error("Failed to update student");
            throw new Error("Failed to update student");
        }
    } catch (error: unknown) {
        const parsedError = getStudentErrorData(error);
        if (parsedError.messages?.length) {
            parsedError.messages.forEach((msg) => {
                toast.error(`${msg.field}: ${msg.message}`);
            });
        } else {
            toast.error(parsedError.message || "Failed to update student");
        }
        throw error;
    }
}

export async function deleteStudent(studentId: number) {
    try {
        const url = endpoints.student.delete(studentId);
        const res = await axiosInstance.delete(url);

        if (res.status === 200) {
            toast.success("Student deleted successfully");
            await globalMutate((key) => typeof key === 'string' && key.startsWith(endpoints.student.getAll));
            return res.data;
        } else {
            toast.error("Failed to delete student");
            throw new Error("Failed to delete student");
        }
    } catch (error: unknown) {
        const parsedError = getStudentErrorData(error);
        toast.error(parsedError.message || "Failed to delete student");
        throw error;
    }
}

export async function getAllStudents(searchFor?: string) {
    const url = searchFor
        ? `${endpoints.student.getAll}?searchFor=${searchFor}`
        : endpoints.student.getAll;

    const data = await getWithCache<{ data?: IStudent[] }>(url);
    return data?.data || [];
}

export async function getStudentById(studentId: number) {
    const data = await getWithCache<{ data?: IStudent }>(endpoints.student.details(studentId));
    return data?.data || null;
}