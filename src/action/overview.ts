import useSWR from "swr"
import { useMemo } from "react"
import { endpoints, fetcher } from "../utils/axios"
import { getErrorMessage } from "@/utils/errorHandler"
import { toast } from "sonner"
import type { IOverviewWithGrowthResponse, IGrowthData } from "@/types/overview"

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}

const buildOverviewUrl = (params: {
  userType?: string
  id?: number
}) => {
  const { userType, id } = params
  if (!userType || !id) return null

  const searchParams = new URLSearchParams()
  searchParams.set("includeGrowth", "true")

  switch (userType.toLowerCase()) {
    case "institute":
      searchParams.set("instituteId", String(id))
      break
    case "faculty":
      searchParams.set("facultyId", String(id))
      break
    case "student":
      searchParams.set("studentId", String(id))
      break
    default:
      return null
  }

  return `${endpoints.institute.overview}?${searchParams.toString()}`
}

export const useOverview = (params: {
  userType?: string
  id?: number
}) => {
  const url = buildOverviewUrl(params)

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<IOverviewWithGrowthResponse>(url, fetcher, {
      ...swrOptions,
      onError: (err) => {
        console.error("Overview Error:", err)
        toast.error(getErrorMessage(err))
      },
    })

  return useMemo(
    () => ({
      current: data?.data?.current ?? null,
      previous: data?.data?.previous ?? null,
      growth: data?.data?.growth ?? ({} as IGrowthData),
      periods: {
        current: data?.data?.current?.period ?? "",
        previous: data?.data?.previous?.period ?? "",
      },
      isLoading: isLoading && !data,
      isValidating,
      error,
      isEmpty: !isLoading && !data?.data,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  )
}