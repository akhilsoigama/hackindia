import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import { IcreateFaculty, IfacultyItem } from '../types/Faculty';
import { toast } from 'sonner';

// ----------------------------------------------------------------------
// SWR Options for data fetching
const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// To create Faculty
export async function createFaculty(formData: IcreateFaculty) {
    const url = endpoints.faculty.create;
    try {
        const res = await axiosInstance.post(url, formData);
        if (res?.status === 200) {
            return res.data?.data?.id;
        } else
            console.log(res)
        return null;
    } catch (err) {
        toast.error('Failed to create faculty');
        return null;

    }
}

export function useFaculties() {
    const url = endpoints.faculty.getAll;
    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IfacultyItem[];
    }>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            faculties: data?.data || [],
            facultiesLoading: isLoading,
            facultiesError: error,
            facultiesValidating: isValidating,
            facultiesEmpty: !isLoading && (!data?.data || data.data.length === 0),
            facultiesMutate: mutate,
        }),
        [data?.data, error, isLoading, isValidating, mutate]
    );
    console.log(memoizedValue)
    return memoizedValue;
}

export async function updateFaculty(id: number, formData: IcreateFaculty) {
    const url = endpoints.faculty.update(id);
    try {
        const res = await axiosInstance.put(url, formData);
        return res;
    } catch (err) {
        console.error('Update Faculty Error:', err);
        toast.error('Failed to update faculty');
        return null;

    }
}

export async function deleteFaculty(id: number) {
    const url = endpoints.faculty.delete(id);
    try {
        const res = await axiosInstance.delete(url);
        if (res.status === 200) {
            return true;
        }
        return false;
    } catch (err) {
        console.log('Delete Faculty Error:',err)
        return false;
    }
}
