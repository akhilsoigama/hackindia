// hooks/useDepartment.ts
import { useMemo } from "react";
import axios from "axios";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import {
  ICreateDepartment,
  IDepartment,
  IUpdateDepartment,
} from "../types/department";
import useSWR from "swr";
import { toast } from "sonner";
import { useUser } from "../atoms/userAtom";

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 5000,
};

export function useDepartments(searchFor?: string, instituteId?: number) {
  const { user } = useUser();
  void instituteId;

  const getEndpoint = () => {
    return endpoints.department.getAll;
  };
  const baseUrl = getEndpoint();

  const isInstituteUser = user?.userType === 'institute';
  const shouldHideForSuperAdmin = user?.userType === 'super_admin';
  const resolvedInstituteId = user?.instituteId ?? user?.data?.instituteId;

  const effectiveInstituteId = useMemo(() => {
    if (isInstituteUser && resolvedInstituteId) {
      return resolvedInstituteId;
    }
    return undefined;
  }, [isInstituteUser, resolvedInstituteId]);

  const params = useMemo(() => {
    const queryParams = new URLSearchParams();
    if (searchFor) {
      queryParams.append("searchFor", searchFor);
    }
    if (effectiveInstituteId) {
      queryParams.append("instituteId", effectiveInstituteId.toString());
    }
    return queryParams.toString();
  }, [effectiveInstituteId, searchFor]);

  const urlWithParams = params ? `${baseUrl}?${params}` : baseUrl;

  const { data, isLoading, error, isValidating, mutate } = useSWR<{
    data: IDepartment[];
  }>(user && !shouldHideForSuperAdmin ? urlWithParams : null, fetcher, swrOptions);

  const filteredDepartments = useMemo(() => {
    if (shouldHideForSuperAdmin) {
      return [];
    }
    const rawDepartments = data?.data || [];
    if (!effectiveInstituteId) {
      return rawDepartments;
    }
    return rawDepartments.filter((department) => department.instituteId === effectiveInstituteId);
  }, [data?.data, effectiveInstituteId, shouldHideForSuperAdmin]);

  const memoizedValue = useMemo(
    () => ({
      departments: filteredDepartments,
      departmentLoading: isLoading,
      departmentError: error,
      departmentValidating: isValidating,
      departmentEmpty: !isLoading && filteredDepartments.length === 0,
      departmentMutate: mutate,
    }),
    [error, filteredDepartments, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useDepartmentMutations() {
  const { mutate: mutateAll } = useSWR(endpoints.department.getAll);

  const refreshDepartments = async () => {
    try {
      await mutateAll(); // Revalidate department data
      console.log("🔄 Department cache refreshed successfully");
    } catch (error) {
      console.error("🔴 Failed to refresh department cache:", error);
    }
  };

  return { refreshDepartments };
}

// Fetch a single department's details
export function useDepartment(departmentId: number) {
  const url = departmentId ? endpoints.department.details(departmentId) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{
    data: IDepartment;
  }>(url, fetcher, {
    ...swrOptions,
    onError: (err) => {
      console.error("🔴 useDepartment Error:", err);
      toast.error("Failed to fetch department data");
    },
  });

  const memoizedValue = useMemo(
    () => ({
      department: data?.data || null,
      isLoading,
      departmentError: error,
      departmentValidating: isValidating,
      departmentEmpty: !isLoading && !error && !data?.data,
      departmentMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

// Service function to create a department
export const createDepartmentService = async (
  departmentData: ICreateDepartment,
): Promise<IDepartment | null> => {
  try {
    const res = await axiosInstance.post(
      endpoints.department.create,
      departmentData,
    );
    if (res.status === 201 || res.status === 200) {
      toast.success("Department created successfully");
      return res.data.data || res.data;
    } else {
      toast.error("Failed to create department");
      return null;
    }
  } catch (error: unknown) {
    const errorMessage = axios.isAxiosError(error)
      ? (typeof error.response?.data?.message === "string" ? error.response.data.message : error.message)
      : error instanceof Error
        ? error.message
        : "Something went wrong";
    toast.error(errorMessage);
    return null;
  }
};

export const updateDepartmentService = async (
  departmentId: number,
  formData: IUpdateDepartment,
) => {
  const url = endpoints.department.update(departmentId);
  try {
    const res = await axiosInstance.put(url, formData);
    if (res.status === 200 || res.status === 201) {
      toast.success("Department updated successfully");
      return res.data.data || res.data;
    } else {
      toast.error("Failed to update department");
      return null;
    }
  } catch (err: unknown) {
    const errorMessage = axios.isAxiosError(err)
      ? (typeof err.response?.data?.message === "string" ? err.response.data.message : "Failed to update Department")
      : "Failed to update Department";
    toast.error(errorMessage);
    return null;
  }
};

// Service function to delete a department
export const deleteDepartmentService = async (id: number) => {
  const url = endpoints.department.delete(id);
  try {
    const res = await axiosInstance.delete(url);
    if (res.status === 200 || res.status === 204) {
      toast.success("Department deleted successfully");
      return res.data;
    } else {
      toast.error("Failed to delete department");
      return null;
    }
  } catch (err: unknown) {
    const errorMessage = axios.isAxiosError(err)
      ? (typeof err.response?.data?.message === "string" ? err.response.data.message : "Failed to delete department")
      : "Failed to delete department";
    toast.error(errorMessage);
    return null;
  }
};
