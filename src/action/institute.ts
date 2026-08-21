// services/institute.ts
import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher } from '../utils/axios';
import { toast } from 'sonner';
import { ICreateInstitute, IInstitute, IUpdateInstitute } from '../types/Institute';
import axios from 'axios';


const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
};


export function useInstitutes(searchFor?: string) {
    const url = searchFor === 'create'
        ? `${endpoints.institute.getAll}?searchFor=${searchFor}`
        : endpoints.institute.getAll;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data?: IInstitute[];
        status?: boolean;
        message?: string;
    } | IInstitute[]>(url, fetcher, swrOptions);

    const normalizedInstitutes = useMemo(() => {
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
            institutes: normalizedInstitutes,
            institutesLoading: isLoading,
            institutesError: error,
            institutesValidating: isValidating,
            institutesEmpty: !isLoading && normalizedInstitutes.length === 0,
            institutesMutate: mutate,
        }),
        [normalizedInstitutes, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useInstitute(instituteId: number) {
    const url = instituteId ? endpoints.institute.details(instituteId) : null;

    const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: IInstitute }>(
        url,
        fetcher,
        {
            ...swrOptions,
            onError: (err) => {
                console.error("🔴 useInstitute Error:", err);
                toast.error("Failed to fetch institute data");
            },
        }
    );

    const memoizedValue = useMemo(
        () => ({
            institute: data?.data || null,
            instituteLoading: isLoading,
            instituteError: error,
            instituteValidating: isValidating,
            instituteEmpty: !isLoading && !error && !data?.data,
            instituteMutate: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useInstituteMutations() {
    const { mutate: mutateAll } = useSWR(endpoints.institute.getAll);
    const { mutate: mutateCreate } = useSWR(`${endpoints.institute.getAll}?searchFor=create`);

    const refreshInstitutes = async () => {
        try {
            await Promise.all([
                mutateAll(),
                mutateCreate()
            ]);
        } catch (error) {
            console.error('🔴 Failed to refresh institute cache:', error);
        }
    };

    return { refreshInstitutes };
}

export const createInstituteService = async (instituteData: ICreateInstitute): Promise<IInstitute | null> => {
    try {
        const res = await axiosInstance.post(
            endpoints.institute.create,
            instituteData
        );

        if (res.status === 201 || res.status === 200) {
            toast.success("Institute created successfully");
            
            const instituteData = res.data.data || res.data;
            
            return instituteData;
        } else {
            toast.error("Failed to create institute");
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error)
            ? (typeof error.response?.data?.message === 'string' ? error.response.data.message : error.message)
            : error instanceof Error
                ? error.message
                : "Something went wrong";
        toast.error(errorMessage);
        return null;
    }
};

export const updateInstituteService = async (instituteId: number, formData: IUpdateInstitute) => {
  const url = endpoints.institute.update(instituteId);
  
  try {
    
    const res = await axiosInstance.put(url, formData);

    if (res.status === 200 || res.status === 201) {
      toast.success("Institute updated successfully");
      
      return res.data?.data || res.data;
    } else {
      toast.error("Failed to update institute");
      return null;
    }
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? (typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to update Institute')
            : 'Failed to update Institute';
    toast.error(errorMessage);
    return null;
  }
};

export const deleteInstituteService = async (id: number) => {
    const url = endpoints.institute.delete(id)
    try {
        const res = await axiosInstance.delete(url)

        if (res.status === 200 || res.status === 204) {
            toast.success("Institute deleted successfully");
            return res.data;
        } else {
            toast.error("Failed to delete institute");
            return null;
        }
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? (typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to delete institute')
            : 'Failed to delete institute';
        toast.error(errorMessage);
        return null;
    }
};