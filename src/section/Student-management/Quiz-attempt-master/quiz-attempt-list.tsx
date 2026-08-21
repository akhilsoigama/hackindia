import { memo, useCallback, useMemo } from "react";
import CommonDataList from "../../../components/common/commanDataList";
import type { ModalField } from "../../../components/common/commanDataList";
import type { QuizAttemptDetails } from "../../../types/quizApi";

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

type AttemptReviewData = {
  attemptId: number;
  quizId: number;
  studentId: number;
  status: string;
  attemptedAt: string;
  questions: AttemptReviewQuestion[];
};

type QuizAttemptRow = QuizAttemptDetails & {
  statusFlag: boolean;
  answerReview?: AttemptReviewData | null;
};

function getAttemptReviewStorageKey(attemptId: number) {
  return `quiz-attempt-review:${attemptId}`;
}

function readAttemptReview(attemptId: number): AttemptReviewData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(
    getAttemptReviewStorageKey(attemptId),
  );
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AttemptReviewData;
  } catch {
    return null;
  }
}

type QuizAttemptListProps = {
  attempts: QuizAttemptDetails[];
  isLoading?: boolean;
  onCreate?: () => void;
  onEdit?: (attempt: QuizAttemptDetails) => void;
  onDelete?: (id: number) => void | Promise<void>;
};

function getQuizTitle(attempt: QuizAttemptDetails): string {
  const attemptRecord = attempt as unknown as Record<string, unknown>;
  const quizDetails =
    (attemptRecord.quiz as Record<string, unknown> | undefined) ??
    (attemptRecord.QuizDetails as Record<string, unknown> | undefined) ??
    (attemptRecord.quizDetails as Record<string, unknown> | undefined);

  const title =
    (quizDetails?.quizTitle as string | undefined) ??
    (attemptRecord.quizTitle as string | undefined);

  return title?.trim() || "-";
}

const QuizAttemptList = memo(function QuizAttemptList({
  attempts,
  isLoading = false,
  onCreate,
  onEdit,
  onDelete,
}: QuizAttemptListProps) {
  const handleView = useCallback((dept: QuizAttemptRow) => {
    console.log("View department:", dept);
  }, []);
  const tableRows = useMemo<QuizAttemptRow[]>(
    () =>
      attempts.map((attempt) => ({
        ...attempt,
        statusFlag:
          attempt.status === "submitted" || attempt.status === "completed",
        answerReview: readAttemptReview(attempt.id),
      })),
    [attempts],
  );

  const viewModalFields = useMemo<ModalField<QuizAttemptRow>[]>(
    () => [
      {
        label: "Quiz",
        type: "custom",
        render: (_, data) => (
          <div className="text-sm font-medium">{getQuizTitle(data)}</div>
        ),
      },
      {
        label: "Student",
        type: "custom",
        render: (_, data) => (
          <div className="text-sm">{data.student?.studentName ?? "-"}</div>
        ),
      },
      {
        label: "Attempted At",
        key: "attemptedAt",
        type: "text",
        disabled: true,
      },
      {
        label: "Status",
        key: "status",
        type: "text",
        disabled: true,
      },
      {
        label: "Score",
        type: "custom",
        render: (_, data) => <div className="text-sm">{data.score ?? "-"}</div>,
      },
      {
        label: "Answer Review",
        type: "section",
        render: (_, data) => {
          const reviewQuestions = data.answerReview?.questions ?? [];

          if (reviewQuestions.length === 0) {
            return (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Answer review is available only after submitting this attempt
                from this device or when the backend returns answer details.
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {reviewQuestions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Q{questionIndex + 1}. {question.questionText}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Marks: {question.marks}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        question.isCorrect
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                      }`}
                    >
                      {question.isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={option.id ?? `${question.id}-${optionIndex}`}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          option.isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                            : option.isSelected
                              ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
                              : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span>{option.optionText}</span>
                          <div className="flex flex-wrap gap-2 text-xs font-medium">
                            {option.isSelected ? (
                              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                                Your answer
                              </span>
                            ) : null}
                            {option.isCorrect ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                Correct answer
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <CommonDataList<QuizAttemptRow>
      data={tableRows}
      title="Quiz Attempts"
      subtitle="Track and manage student quiz attempts"
      columns={[
        {
          header: "Attempt",
          accessor: (attempt) => `${attempt.attemptedAt}`,
          sortable: true,
          width: "20%",
        },
        {
          header: "Quiz Title",
          accessor: (attempt) => getQuizTitle(attempt),
          sortable: true,
          width: "30%",
        },
        {
          header: "Student Name",
          accessor: (attempt) => attempt.student?.studentName ?? "-",
          sortable: true,
          width: "25%",
        },
        {
          header: "Score",
          accessor: (attempt) => `${attempt.score ?? "-"}`,
          sortable: false,
          width: "10%",
        },
        {
          header: "Status",
          accessor: (attempt) => attempt.status,
          sortable: true,
          width: "15%",
        },
      ]}
      onView={handleView}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={(id) => onDelete?.(Number(id))}
      viewModalFields={viewModalFields}
      createButtonText="Create Attempt"
      searchPlaceholder="Search by attempt, quiz, student"
      emptyMessage="No quiz attempts found"
      emptyDescription="Create an attempt to start tracking quiz submissions"
      isLoading={isLoading}
      enableSearch
      enableStatusFilter
      statusFilterKey="statusFlag"
    />
  );
});

export default QuizAttemptList;
