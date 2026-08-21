import useSWR, { mutate as globalMutate } from "swr";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import type {
  CreateQuizAttemptDto,
  QuizApiResponse,
  QuizAttemptDetails,
  QuizAttemptListQuery,
  UpdateQuizAttemptDto,
  ValidationMessage,
} from "../types/quizApi";

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 8000,
  keepPreviousData: true,
};

const getQuizAttemptErrorData = (
  error: unknown,
): { message: string; messages?: ValidationMessage[] } => {
  if (!axios.isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }

  const responseData = error.response?.data as
    | {
        message?: string;
        error?: {
          messages?: ValidationMessage[];
        };
      }
    | undefined;

  return {
    message: responseData?.message || error.message || "Something went wrong",
    messages: responseData?.error?.messages,
  };
};

const buildQuizAttemptListUrl = (params?: QuizAttemptListQuery): string => {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) {
    queryParams.append("searchFor", params.searchFor);
  }

  if (params?.quizId) {
    queryParams.append("quizId", String(params.quizId));
  }

  if (params?.studentId) {
    queryParams.append("studentId", String(params.studentId));
  }

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.page) {
    queryParams.append("page", String(params.page));
  }

  if (params?.limit) {
    queryParams.append("limit", String(params.limit));
  }

  const query = queryParams.toString();
  return query
    ? `${endpoints.quizAttempt.getAll}?${query}`
    : endpoints.quizAttempt.getAll;
};

export function useGetQuizAttempts(params?: QuizAttemptListQuery) {
  const url = buildQuizAttemptListUrl(params);

  const { data, isLoading, error, isValidating, mutate } = useSWR<
    QuizApiResponse<QuizAttemptDetails[]>
  >(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      quizAttempts: data?.data || [],
      quizAttemptsLoading: isLoading,
      quizAttemptsError: error,
      quizAttemptsValidating: isValidating,
      quizAttemptsEmpty: !isLoading && (!data?.data || data.data.length === 0),
      quizAttemptsMutate: mutate,
      quizAttemptsStatus: data?.status ?? false,
      quizAttemptsMessage: data?.message,
      quizAttemptsMeta: data?.meta,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetQuizAttemptById(quizAttemptId: number | null) {
  const url = quizAttemptId ? endpoints.quizAttempt.details(quizAttemptId) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    QuizApiResponse<QuizAttemptDetails>
  >(url, fetcher, {
    ...swrOptions,
    onError: () => {
      toast.error("Failed to fetch quiz attempt data");
    },
  });

  const memoizedValue = useMemo(
    () => ({
      quizAttempt: data?.data || null,
      quizAttemptLoading: isLoading,
      quizAttemptError: error,
      quizAttemptValidating: isValidating,
      quizAttemptEmpty: !isLoading && !error && !data?.data,
      quizAttemptMutate: mutate,
      quizAttemptStatus: data?.status ?? false,
      quizAttemptMessage: data?.message,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useQuizAttemptMutation() {
  const { mutate: mutateAll } = useSWR(endpoints.quizAttempt.getAll);
  const { mutate: mutateCreate } = useSWR(
    `${endpoints.quizAttempt.getAll}?searchFor=create`,
  );

  const refreshQuizAttempts = async () => {
    try {
      await Promise.all([
        mutateAll(),
        mutateCreate(),
        globalMutate(
          (key) => typeof key === "string" && key.startsWith(endpoints.quizAttempt.getAll),
          undefined,
          { revalidate: true },
        ),
      ]);
    } catch (error) {
      console.error("Failed to refresh quiz attempt cache", error);
    }
  };

  return { refreshQuizAttempts };
}

export async function createQuizAttempt(
  payload: CreateQuizAttemptDto,
): Promise<QuizAttemptDetails | null> {
  try {
    const response = await axiosInstance.post<QuizApiResponse<QuizAttemptDetails>>(
      endpoints.quizAttempt.create,
      payload,
    );

    if ((response.status === 201 || response.status === 200) && response.data.status) {
      toast.success(response.data.message || "Quiz attempt created successfully");
      return response.data.data;
    }

    toast.error(response.data.message || "Failed to create quiz attempt");
    return null;
  } catch (error: unknown) {
    const parsedError = getQuizAttemptErrorData(error);

    if (parsedError.messages?.length) {
      parsedError.messages.forEach((msg) => {
        toast.error(`${msg.field}: ${msg.message}`);
      });
    } else {
      toast.error(parsedError.message || "Failed to create quiz attempt");
    }

    return null;
  }
}

export async function updateQuizAttempt(
  quizAttemptId: number,
  payload: UpdateQuizAttemptDto,
): Promise<QuizAttemptDetails | null> {
  try {
    const response = await axiosInstance.put<QuizApiResponse<QuizAttemptDetails>>(
      endpoints.quizAttempt.update(quizAttemptId),
      payload,
    );

    if ((response.status === 200 || response.status === 201) && response.data.status) {
      toast.success(response.data.message || "Quiz attempt updated successfully");
      return response.data.data;
    }

    toast.error(response.data.message || "Failed to update quiz attempt");
    return null;
  } catch (error: unknown) {
    const parsedError = getQuizAttemptErrorData(error);

    if (parsedError.messages?.length) {
      parsedError.messages.forEach((msg) => {
        toast.error(`${msg.field}: ${msg.message}`);
      });
    } else {
      toast.error(parsedError.message || "Failed to update quiz attempt");
    }

    return null;
  }
}

export async function deleteQuizAttempt(quizAttemptId: number): Promise<boolean> {
  try {
    const response = await axiosInstance.delete<QuizApiResponse<null>>(
      endpoints.quizAttempt.delete(quizAttemptId),
    );

    if ((response.status === 200 || response.status === 204) && response.data.status) {
      toast.success(response.data.message || "Quiz attempt deleted successfully");
      return true;
    }

    toast.error(response.data.message || "Failed to delete quiz attempt");
    return false;
  } catch (error: unknown) {
    const parsedError = getQuizAttemptErrorData(error);
    toast.error(parsedError.message || "Failed to delete quiz attempt");
    return false;
  }
}

export async function getQuizAttemptById(
  quizAttemptId: number,
): Promise<QuizAttemptDetails | null> {
  try {
    const response = await axiosInstance.get<QuizApiResponse<QuizAttemptDetails>>(
      endpoints.quizAttempt.details(quizAttemptId),
    );
    return response.data?.data || null;
  } catch (error: unknown) {
    const parsedError = getQuizAttemptErrorData(error);
    toast.error(parsedError.message || "Failed to fetch quiz attempt");
    return null;
  }
}

export async function getAllQuizAttempts(
  params?: QuizAttemptListQuery,
): Promise<QuizAttemptDetails[]> {
  try {
    const url = buildQuizAttemptListUrl(params);
    const response = await axiosInstance.get<QuizApiResponse<QuizAttemptDetails[]>>(url);
    return response.data?.data || [];
  } catch (error: unknown) {
    const parsedError = getQuizAttemptErrorData(error);
    toast.error(parsedError.message || "Failed to fetch quiz attempts");
    return [];
  }
}
