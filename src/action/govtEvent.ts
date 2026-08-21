import useSWR from "swr";
import { ICreateGovtEvent, IGovtEvent, IUpdateGovtEvent } from "../types/govtEvent";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import { useMemo } from "react";
import { toast } from "sonner";
import axios from "axios";

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
};

export function useGetAllGovtEvents(searchFor?: string) {
    const url = searchFor === 'create'
        ? `${endpoints.govtEvent.getAll}?searchFor=${searchFor}`
        : endpoints.govtEvent.getAll;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IGovtEvent[];
    }>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            govtEvents: data?.data || [],
            govtEventsLoading: isLoading,
            govtEventsError: error,
            govtEventsValidating: isValidating,
            govtEventsEmpty: !isLoading && (!data?.data || data.data.length === 0),
            govtEventsMutate: mutate,
        }),
        [data?.data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGetGovtEvent(govtEventId: number) {
    const url = govtEventId ? endpoints.govtEvent.details(govtEventId) : null;

    const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: IGovtEvent }>(
        url,
        fetcher,
        {
            ...swrOptions,
            onError: (err) => {
                console.error("🔴 usegovtEvent Error:", err);
                toast.error("Failed to fetch govtEvent data");
            },
        }
    );
    const memoizedValue = useMemo(
        () => ({
            govtEvent: data?.data || null,
            govtEventLoading: isLoading,
            govtEventError: error,
            govtEventValidating: isValidating,
            govtEventEmpty: !isLoading && !error && !data?.data,
            govtEventMutate: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGovtEventMutations() {
    const { mutate: mutateAll } = useSWR(endpoints.govtEvent.getAll);
    const { mutate: mutateCreate } = useSWR(`${endpoints.govtEvent.getAll}?searchFor=create`);

    const refreshgovtEvents = async () => {
        try {
            await Promise.all([
                mutateAll(),
                mutateCreate()
            ]);
        } catch (error) {
            console.error('🔴 Failed to refresh govtEvent cache:', error);
        }
    };

    return { refreshgovtEvents };
}


export async function createGovtEvent(govtEventData: ICreateGovtEvent) {
    try {
        const res = await axiosInstance.post(endpoints.govtEvent.create, govtEventData)
        if (res.status == 201 || res.status == 200) {
            toast.success("Government Event created successfully");

            const govtEventData = res.data.data || res.data;
            return govtEventData;
        }
        else {
            toast.error("Failed to create Government Event");
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
}

export async function updateGovtEvent(govtEventId: number, formData: IUpdateGovtEvent) {
    try {
        const res = await axiosInstance.put(endpoints.govtEvent.update(govtEventId), formData);
        if (res.status == 200 || res.status == 201) {
            const govtEventData = res.data.data || res.data;
            toast.success("Update Government Event successfully");
            return govtEventData
        } else {
            toast.error("failed to Update Government Event");
        }
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? (typeof err.response?.data?.message === "string" ? err.response.data.message : 'Failed to update Government Event')
            : 'Failed to update Government Event';
        toast.error(errorMessage);
        return null;
    }
}

export async function deleteGovtEvent(id: number) {
    const url = endpoints.govtEvent.delete(id);
    try {
        const res = await axiosInstance.delete(url);

        if (res.status == 200 || res.status == 204) {
            toast.success("Government Event Delete successfully");
            return res.data;
        } else {
            toast.error(" failed to delete Government Event ");
        }
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? (typeof err.response?.data?.message === "string" ? err.response.data.message : 'Failed to delete Government Event')
            : 'Failed to delete Government Event';
        toast.error(errorMessage);
        return null;
    }
}