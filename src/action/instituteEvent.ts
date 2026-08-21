import useSWR from "swr";
import axiosInstance, { fetcher } from '../utils/axios';
import { useMemo } from "react";
import { endpoints } from "../utils/axios";
import { toast } from "sonner";
import { ICreateInstituteEvent, IInstituteEvent, IUpdateInstituteEvent } from "../types/instituteEvent";

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
};

export function useGetInstituteEvents(searchFor?: string) {
    const url = searchFor === "create"
        ? `${endpoints.instituteEvent.getAll}?searchFor=${searchFor}`
        : endpoints.instituteEvent.getAll;

    const { data, isLoading, error, isValidating, mutate } = useSWR<{
        data: IInstituteEvent[];
    }>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            instituteEvents: data?.data || [],
            instituteEventsLoading: isLoading,
            instituteEventsError: error,
            instituteEventsValidating: isValidating,
            instituteEventsEmpty: !isLoading && (!data?.data || data.data.length === 0),
            instituteEventsMutate: mutate,
        }),
        [data?.data, error, isLoading, isValidating, mutate]
    );
    return memoizedValue;
}

export function useInstituteEvent(InstituteEventId: number) {
    const url = InstituteEventId ? endpoints.instituteEvent.details(InstituteEventId) : null;

    const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: IInstituteEvent }>(
        url,
        fetcher,
        {
            ...swrOptions,
            onError: (err) => {
                console.error("🔴 useInstituteEventEvent Error:", err)
                toast.error("Failed to fetch govtEvent data");
            },
        }
    );
    const memoizedValue = useMemo(
        () => ({
            instituteEvent: data?.data || null,
            instituteEventLoading: isLoading,
            instituteEventError: error,
            instituteEventValidating: isValidating,
            instituteEventEmpty: !isLoading && !error && !data?.data,
            instituteEventMutate: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );
    return memoizedValue;
}

export function useInstituteEventMutation() {
    const { mutate: muteteAll } = useSWR(endpoints.instituteEvent.getAll);
    const { mutate: mutateCreate } = useSWR(`${endpoints.instituteEvent.getAll}?searchFor=create`);

    const refreshInstituteEvent = async () => {
        try {
            await Promise.all([
                muteteAll(),
                mutateCreate(),
            ]);
        } catch (error) {
            console.error("Error refreshing Institute Servey data:", error);
        }
    }

    return { refreshInstituteEvent }
}

export async function useCreateInstituteEvent(InstituteEventData: ICreateInstituteEvent) {
    try {
        const res = await axiosInstance.post(endpoints.instituteEvent.create, InstituteEventData);
        if (res.status === 201 || res.status === 200) {
            toast.success("Institute Servey created successfully");

            const InstituteEventData = res.data.data || res.data;
            return InstituteEventData;
        }
        else {
            toast.error("Failed to create Institute Servey");
            return null;
        }
    } catch (error) {
        console.error("Error creating Institute Servey:", error);
        toast.error("Failed to create Institute Servey");
        return null;
    }
}

export async function useUpdateInstituteEvent(InstituteEventId: number, InstituteEventData: IUpdateInstituteEvent) {
    try {
        const res = await axiosInstance.put(endpoints.instituteEvent.update(InstituteEventId), InstituteEventData);
        if (res.status === 200 || res.status === 201 || res.status === 204) {
            const InstituteEventData = res.data?.data || res.data || null;
            toast.success("Institute Servey updated successfully");
            return InstituteEventData;
        } else {
            toast.error("Failed to update Institute Servey");
        }
    } catch (err: unknown) {
        console.error("Error updating Institute Servey:", err);
        toast.error("Failed to update Institute Servey");
        return null;
    }
}

export async function useDeleteInstituteEvent(InstituteEventId: number) {
    const url = endpoints.instituteEvent.delete(InstituteEventId);
    try {
        const res = await axiosInstance.delete(url);
        if (res.status === 200 || res.status === 204) {
            toast.success("Institute Servey deleted successfully");
            return res.data;
        } else {
            toast.error("Failed to delete Institute Servey");
        }
    } catch (err: unknown) {
        console.error("Error deleting Institute Servey:", err);
        toast.error("Failed to delete Institute Servey");
        return null;
    }
}