// hooks/useDepartment.ts
import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import { ICreateDepartment, IDepartment, IUpdateDepartment } from "../types/department";
import useSWR from "swr";
import { toast } from "sonner";

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};
export function useDepartments(searchFor?: string) {
    const url =
        searchFor === 'create'
            ? `${endpoints.department.getAll}?searchFor=${searchFor}`
            : endpoints.department.getAll;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IDepartment[];
    }>(url);

    const memoizedValue = useMemo(
        () => ({
            department: data?.data || [],
            departmentLoading: isLoading,
            departmentError: error,
            departmentValidating: isValidating,
            departmentEmpty: !isLoading && (!data?.data || data.data.length === 0),
            departmentMutate: mutate,

        }),
        [data?.data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useDepartment(departmentId: number) {
    const url = endpoints.department.details(departmentId)
    const { data, error, isLoading, isValidating } = useSWR<{ data: IDepartment }>(
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

export async function useCreateDepartment(departmentData: ICreateDepartment): Promise<IDepartment | null> {
    try {
        const res = await axiosInstance.post<{ success: boolean; data: IDepartment }>(
            endpoints.department.create,
            departmentData
        );

        if (res.data.success) {
            toast.success("Department created successfully");
            return res.data.data;
        } else {
            toast.error("Failed to create department");
            return null;
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        return null;
    }
}

export async function useUpdateDepartment(departmentId: number, formData: IUpdateDepartment) {
    const url = endpoints.department.update(departmentId)
    try {
        const res = await axiosInstance.put(url, formData);
        toast.success("Department Update Successfully")
        return res;
    } catch (err) {
        toast.error('Failed to update Department');
        return null;

    }
}

export async function useDeleteDepartment(id: number) {
    const url = endpoints.department.delete(id)
    try {
        const res = axiosInstance.delete(url)
        toast.success("Department Delete Successfully")
        return res;
    } catch (err) {
        toast.error('failed to delete department')
        return err
    }
}