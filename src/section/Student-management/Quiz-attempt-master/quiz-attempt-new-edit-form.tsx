import { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import RHFDropDown from "../../../components/hook-form/RHFDropDown";
import { Button } from "../../../components/ui/button";
import { useTheme } from "@/theme/AppThemeProvider";
import { useRouter } from "../../../hooks/useRouter";
import { useUser } from "../../../atoms/userAtom";
import {
  createQuizAttempt,
  useGetQuizAttemptById,
  useQuizAttemptMutation,
  updateQuizAttempt,
} from "../../../action/quizAttempt";
import { useGetQuizById, useGetQuizzes } from "../../../action/quiz";
import type {
  CreateQuizAttemptDto,
  QuizAttemptDetails,
  QuizQuestion,
  UpdateQuizAttemptDto,
} from "../../../types/quizApi";
import { ParticleButton } from "../../../components/ui/particle-button";
import { FaSave, FaTimes } from "react-icons/fa";

type AttemptReviewQuestion = {
  id: number;
  questionText: string;
  marks: number;
  selectedOptionId?: number;
  selectedOptionText?: string;
  correctOptionId?: number;
  correctOptionText?: string;
  isCorrect: boolean;
  options: Array<{
    id?: number;
    optionText: string;
    isCorrect: boolean;
    isSelected: boolean;
  }>;
};

function getAttemptReviewStorageKey(attemptId: number) {
  return `quiz-attempt-review:${attemptId}`;
}

const quizAttemptSchema = z.object({
  quizId: z.coerce.number().min(1, "Quiz is required"),
  score: z.coerce.number().min(0, "Score cannot be negative").optional(),
});

type QuizAttemptFormData = z.infer<typeof quizAttemptSchema>;
type QuizAttemptFormInput = z.input<typeof quizAttemptSchema>;

type QuizAttemptNewEditFormProps = {
  currentData?: QuizAttemptDetails | null;
  onSuccess?: () => void;
  quizAttemptId?: number;
  preselectedQuizId?: number;
};

export default function QuizAttemptNewEditForm({
  currentData,
  onSuccess,
  quizAttemptId,
  preselectedQuizId,
}: QuizAttemptNewEditFormProps) {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();
  const { user } = useUser();
  const { refreshQuizAttempts } = useQuizAttemptMutation();
  const { quizzes, quizzesLoading } = useGetQuizzes();
  const [isAttemptStarted, setIsAttemptStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  const shouldFetchId = currentData ? null : (quizAttemptId ?? null);
  const { quizAttempt, quizAttemptMutate } =
    useGetQuizAttemptById(shouldFetchId);

  const sourceData = currentData ?? quizAttempt ?? null;

  const currentStudentId = useMemo(() => {
    const rawData = (user?.data ?? {}) as Record<string, unknown>;
    return Number(
      rawData.studentId ?? rawData.id ?? user?.id ?? sourceData?.studentId ?? 0,
    );
  }, [sourceData?.studentId, user?.data, user?.id]);

  const currentInstituteId = useMemo(() => {
    const rawData = (user?.data ?? {}) as Record<string, unknown>;
    return Number(
      rawData.instituteId ?? user?.instituteId ?? sourceData?.instituteId ?? 0,
    );
  }, [sourceData?.instituteId, user?.data, user?.instituteId]);

  const quizOptions = useMemo(
    () =>
      (quizzes ?? []).map((quiz) => ({
        value: quiz.id,
        label: `${quiz.quizTitle}${quiz.subject ? ` (${quiz.subject})` : ""}`,
      })),
    [quizzes],
  );

  const initialQuizId = Number(
    sourceData?.quizId ?? preselectedQuizId ?? quizOptions[0]?.value ?? 0,
  );

  const defaultValues: QuizAttemptFormInput = useMemo(
    () => ({
      quizId: initialQuizId,
      score: sourceData?.score != null ? Number(sourceData.score) : undefined,
    }),
    [initialQuizId, sourceData],
  );

  const methods = useForm<QuizAttemptFormInput, unknown, QuizAttemptFormData>({
    resolver: zodResolver(quizAttemptSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const selectedQuizId = Number(watch("quizId") || 0);
  const { quiz: selectedQuizDetails, quizLoading: selectedQuizLoading } =
    useGetQuizById(selectedQuizId > 0 ? selectedQuizId : null);

  const quizQuestions = useMemo(
    () => selectedQuizDetails?.questions ?? [],
    [selectedQuizDetails?.questions],
  );

  const answeredCount = useMemo(() => {
    const questionIds = new Set(quizQuestions.map((question) => question.id));
    return Object.keys(selectedAnswers).filter((questionId) =>
      questionIds.has(Number(questionId)),
    ).length;
  }, [quizQuestions, selectedAnswers]);

  const canStartAttempt = useMemo(
    () =>
      !sourceData?.id &&
      selectedQuizId > 0 &&
      !selectedQuizLoading &&
      quizQuestions.length > 0,
    [quizQuestions.length, selectedQuizId, selectedQuizLoading, sourceData?.id],
  );

  const isAttemptComplete =
    quizQuestions.length > 0 && answeredCount === quizQuestions.length;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    setIsAttemptStarted(false);
    setSelectedAnswers({});
  }, [selectedQuizId]);

  useEffect(() => {
    if (!sourceData?.id && preselectedQuizId && canStartAttempt) {
      setIsAttemptStarted(true);
    }
  }, [canStartAttempt, preselectedQuizId, sourceData?.id]);

  const getIsCorrectOption = (question: QuizQuestion, optionIndex: number) => {
    const option = question.options?.[optionIndex];
    if (!option) {
      return false;
    }

    return (
      option.isCorrect === true ||
      question.correctOptionId === option.id ||
      question.correctOptionId === optionIndex + 1
    );
  };

  const calculateResult = () => {
    const calculatedScore = quizQuestions.reduce((score, question) => {
      const selectedIndex = selectedAnswers[question.id];
      if (selectedIndex == null) {
        return score;
      }

      if (getIsCorrectOption(question, selectedIndex)) {
        return score + Number(question.marks || 0);
      }

      return score;
    }, 0);

    return {
      calculatedScore,
    };
  };

  const buildAttemptReview = (): AttemptReviewQuestion[] => {
    return quizQuestions.map((question) => {
      const selectedIndex = selectedAnswers[question.id];
      const selectedOption =
        selectedIndex != null ? question.options?.[selectedIndex] : undefined;
      const correctOption = (question.options || []).find((_, optionIndex) =>
        getIsCorrectOption(question, optionIndex),
      );

      return {
        id: question.id,
        questionText: question.questionText,
        marks: Number(question.marks || 0),
        selectedOptionId: selectedOption?.id,
        selectedOptionText: selectedOption?.optionText,
        correctOptionId: correctOption?.id,
        correctOptionText: correctOption?.optionText,
        isCorrect:
          selectedIndex != null
            ? getIsCorrectOption(question, selectedIndex)
            : false,
        options: (question.options || []).map((option, optionIndex) => ({
          id: option.id,
          optionText: option.optionText,
          isCorrect: getIsCorrectOption(question, optionIndex),
          isSelected: selectedIndex === optionIndex,
        })),
      };
    });
  };

  const persistAttemptReview = (attemptId: number) => {
    if (typeof window === "undefined" || quizQuestions.length === 0) {
      return;
    }

    const reviewPayload = {
      attemptId,
      quizId: selectedQuizId,
      studentId: currentStudentId,
      status: "submitted",
      attemptedAt: new Date().toISOString(),
      questions: buildAttemptReview(),
    };

    window.sessionStorage.setItem(
      getAttemptReviewStorageKey(attemptId),
      JSON.stringify(reviewPayload),
    );
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const onSubmit: SubmitHandler<QuizAttemptFormData> = async (data) => {
    if (currentStudentId <= 0) {
      toast.error("Student profile is missing. Please login again.");
      return;
    }

    if (currentInstituteId <= 0) {
      toast.error("Institute information is missing. Please login again.");
      return;
    }

    const isCreateMode = !sourceData?.id;
    const shouldSubmitAttempt =
      isAttemptStarted && quizQuestions.length > 0 && isAttemptComplete;
    const shouldAutoCalculate = isAttemptStarted && quizQuestions.length > 0;

    if (isCreateMode && isAttemptStarted && !isAttemptComplete) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const result = shouldAutoCalculate ? calculateResult() : null;
    const nextStatus: CreateQuizAttemptDto["status"] = shouldSubmitAttempt
      ? "submitted"
      : "in_progress";

    const normalizedData: QuizAttemptFormData = {
      ...data,
      score:
        result?.calculatedScore ??
        (data.score != null ? Number(data.score) : undefined),
    };

    const apiPayload: CreateQuizAttemptDto = {
      quizId: Number(normalizedData.quizId),
      studentId: currentStudentId,
      instituteId: currentInstituteId,
      attemptedAt: new Date(),
      status: nextStatus,
      score:
        normalizedData.score != null ? Number(normalizedData.score) : undefined,
    };

    try {
      if (sourceData?.id) {
        const updatePayload: UpdateQuizAttemptDto = {
          instituteId: currentInstituteId,
          attemptedAt: new Date(sourceData.attemptedAt ?? new Date()),
          status: shouldSubmitAttempt ? "submitted" : sourceData.status,
          score:
            normalizedData.score != null
              ? Number(normalizedData.score)
              : undefined,
        };

        const updated = await updateQuizAttempt(sourceData.id, updatePayload);
        if (updated) {
          if (shouldSubmitAttempt) {
            persistAttemptReview(sourceData.id);
          }
          await refreshQuizAttempts();
          if (quizAttemptMutate) await quizAttemptMutate();
          if (onSuccess) onSuccess();
          router.push("/dashboard/student-upload/quiz-attempt/list");
        }
        return;
      }

      const created = await createQuizAttempt(apiPayload);
      if (created) {
        if (shouldSubmitAttempt) {
          persistAttemptReview(created.id);
        }
        await refreshQuizAttempts();
        if (onSuccess) onSuccess();
        reset(defaultValues);
        router.push("/dashboard/student-upload/quiz-attempt/list");
      }
    } catch (error) {
      console.error("Failed to save quiz attempt", error);
      toast.error("Failed to save quiz attempt");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className={`min-h-screen px-4 py-6 `}>
        <div
          className={`mx-auto w-full max-w-4xl rounded-xl border p-6 ${
            isDark ? "border-slate-700 " : "border-slate-200 "
          }`}
        >
          <h1
            className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
          >
            {sourceData?.id ? "Edit Quiz Attempt" : "Create Quiz Attempt"}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {!sourceData?.id && quizzesLoading ? (
              <p
                className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                Loading available quizzes...
              </p>
            ) : null}

            {!sourceData?.id && !quizzesLoading && quizOptions.length === 0 ? (
              <p className="text-sm text-amber-600">
                No quiz available right now. Please contact faculty.
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFDropDown
                name="quizId"
                label="Select Quiz"
                placeholder="Select quiz"
                options={quizOptions}
                required
                disabled={
                  quizzesLoading ||
                  quizOptions.length === 0 ||
                  Boolean(preselectedQuizId)
                }
              />
            </div>

            {!sourceData?.id ? (
              <div
                className={`rounded-xl border p-4 ${
                  isDark ? "border-slate-700 " : "border-slate-200 "
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}
                    >
                      Quiz Attempt
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Select quiz and click start to answer questions.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAttemptStarted(true)}
                    disabled={!canStartAttempt}
                  >
                    Start Attempt
                  </Button>
                </div>

                {isAttemptStarted ? (
                  <div className="mt-4 space-y-4">
                    {quizQuestions.map((question, questionIndex) => (
                      <div
                        key={question.id}
                        className={`rounded-lg border p-4 ${
                          isDark
                            ? "border-slate-700 bg-slate-950"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}
                        >
                          Q{questionIndex + 1}. {question.questionText}
                        </p>
                        <p
                          className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                        >
                          Marks: {question.marks}
                        </p>

                        <div className="mt-3 space-y-2">
                          {(question.options || []).map(
                            (option, optionIndex) => {
                              const isSelected =
                                selectedAnswers[question.id] === optionIndex;

                              return (
                                <button
                                  key={
                                    option.id ?? `${question.id}-${optionIndex}`
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleSelectAnswer(question.id, optionIndex)
                                  }
                                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                                    isSelected
                                      ? isDark
                                        ? "border-slate-400 bg-slate-500/10 text-slate-100"
                                        : "border-slate-500 bg-slate-50 text-slate-900"
                                      : isDark
                                        ? "border-slate-700 bg-slate-950 text-slate-200"
                                        : "border-slate-200 bg-white text-slate-900"
                                  }`}
                                >
                                  {option.optionText}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ))}

                    <div
                      className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Answered: {answeredCount}/{quizQuestions.length}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <ParticleButton
                type="button"
                onClick={() => reset(defaultValues)}
                className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                successDuration={600}
              >
                <FaTimes className="mr-2" />
                Reset
              </ParticleButton>

              <ParticleButton
                type="submit"
                className={`px-4 flex  items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  isDark
                    ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                    : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                }`}
                successDuration={800}
                disabled={isSubmitting}
              >
                <FaSave className="mr-2" />
                Create Attempt
              </ParticleButton>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
