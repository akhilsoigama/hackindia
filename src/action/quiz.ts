import useSWR from "swr";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import type {
  CreateQuizDto,
  QuizDetails,
  QuizApiResponse,
  QuizListQuery,
  UpdateQuizDto,
  ValidationMessage,
} from "../types/quizApi";

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

const getQuizErrorData = (
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

const buildQuizListUrl = (params?: QuizListQuery): string => {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) {
    queryParams.append("searchFor", params.searchFor);
  }

  const query = queryParams.toString();
  return query ? `${endpoints.quiz.getAll}?${query}` : endpoints.quiz.getAll;
};

export function useGetQuizzes(searchFor?: string) {
  const url = buildQuizListUrl({ searchFor });

  const { data, isLoading, error, isValidating, mutate } = useSWR<QuizApiResponse<QuizDetails[]>>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      quizzes: data?.data || [],
      quizzesLoading: isLoading,
      quizzesError: error,
      quizzesValidating: isValidating,
      quizzesEmpty: !isLoading && (!data?.data || data.data.length === 0),
      quizzesMutate: mutate,
      quizzesStatus: data?.status ?? false,
      quizzesMessage: data?.message,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetQuizById(quizId: number | null) {
  const url = quizId ? endpoints.quiz.details(quizId) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<QuizApiResponse<QuizDetails>>(
    url,
    fetcher,
    {
      ...swrOptions,
      onError: () => {
        toast.error("Failed to fetch quiz data");
      },
    },
  );

  const memoizedValue = useMemo(
    () => ({
      quiz: data?.data || null,
      quizLoading: isLoading,
      quizError: error,
      quizValidating: isValidating,
      quizEmpty: !isLoading && !error && !data?.data,
      quizMutate: mutate,
      quizStatus: data?.status ?? false,
      quizMessage: data?.message,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useQuizMutation() {
  const { mutate: mutateAll } = useSWR(endpoints.quiz.getAll);
  const { mutate: mutateCreate } = useSWR(`${endpoints.quiz.getAll}?searchFor=create`);

  const refreshQuizzes = async () => {
    try {
      await Promise.all([mutateAll(), mutateCreate()]);
    } catch (error) {
      console.error("Failed to refresh quiz cache", error);
    }
  };

  return { refreshQuizzes };
}

export async function createQuiz(payload: CreateQuizDto): Promise<QuizDetails | null> {
  try {
    const response = await axiosInstance.post<QuizApiResponse<QuizDetails>>(endpoints.quiz.create, payload);

    if ((response.status === 201 || response.status === 200) && response.data.status) {
      toast.success(response.data.message || "Quiz created successfully");
      return response.data.data;
    }

    toast.error(response.data.message || "Failed to create quiz");
    return null;
  } catch (error: unknown) {
    const parsedError = getQuizErrorData(error);

    if (parsedError.messages?.length) {
      parsedError.messages.forEach((msg) => {
        toast.error(`${msg.field}: ${msg.message}`);
      });
    } else {
      toast.error(parsedError.message || "Failed to create quiz");
    }

    return null;
  }
}

export async function updateQuiz(quizId: number, payload: UpdateQuizDto): Promise<QuizDetails | null> {
  try {
    const response = await axiosInstance.put<QuizApiResponse<QuizDetails>>(
      endpoints.quiz.update(quizId),
      payload,
    );

    if ((response.status === 200 || response.status === 201) && response.data.status) {
      toast.success(response.data.message || "Quiz updated successfully");
      return response.data.data;
    }

    toast.error(response.data.message || "Failed to update quiz");
    return null;
  } catch (error: unknown) {
    const parsedError = getQuizErrorData(error);

    if (parsedError.messages?.length) {
      parsedError.messages.forEach((msg) => {
        toast.error(`${msg.field}: ${msg.message}`);
      });
    } else {
      toast.error(parsedError.message || "Failed to update quiz");
    }

    return null;
  }
}

export async function deleteQuiz(quizId: number): Promise<boolean> {
  try {
    const response = await axiosInstance.delete<QuizApiResponse<null>>(endpoints.quiz.delete(quizId));

    if ((response.status === 200 || response.status === 204) && response.data.status) {
      toast.success(response.data.message || "Quiz deleted successfully");
      return true;
    }

    toast.error(response.data.message || "Failed to delete quiz");
    return false;
  } catch (error: unknown) {
    const parsedError = getQuizErrorData(error);
    toast.error(parsedError.message || "Failed to delete quiz");
    return false;
  }
}

export async function getQuizById(quizId: number): Promise<QuizDetails | null> {
  try {
    const response = await axiosInstance.get<QuizApiResponse<QuizDetails>>(endpoints.quiz.details(quizId));
    return response.data?.data || null;
  } catch (error: unknown) {
    const parsedError = getQuizErrorData(error);
    toast.error(parsedError.message || "Failed to fetch quiz");
    return null;
  }
}

export async function getAllQuizzes(searchFor?: string): Promise<QuizDetails[]> {
  try {
    const url = buildQuizListUrl({ searchFor });
    const response = await axiosInstance.get<QuizApiResponse<QuizDetails[]>>(url);
    return response.data?.data || [];
  } catch (error: unknown) {
    const parsedError = getQuizErrorData(error);
    toast.error(parsedError.message || "Failed to fetch quizzes");
    return [];
  }
}

export async function useCreateQuiz(payload: CreateQuizDto): Promise<QuizDetails | null> {
  return createQuiz(payload);
}

export async function useUpdateQuiz(quizId: number, payload: UpdateQuizDto): Promise<QuizDetails | null> {
  return updateQuiz(quizId, payload);
}

export async function useDeleteQuiz(quizId: number): Promise<boolean> {
  return deleteQuiz(quizId);
}
