import { lazy, Suspense, useMemo, useState, type ComponentType } from "react";
import { useParams } from "../../../../hooks/useParams";
import { useRouter } from "../../../../hooks/useRouter";
import { useTheme } from '@/theme/AppThemeProvider';import { useGetQuizAttemptById } from "../../../../action/quizAttempt";
import { useGetQuizById } from "../../../../action/quiz";
import { Button } from "../../../../components/ui/button";
import type { ModalField } from "../../../../components/common/commanDataList";
import QuizCard from "../../Quiz-master/quiz-card";
import type { QuizAttemptDetails } from "../../../../types/quizApi";

const CommonModal = lazy(() => import("../../../../components/common/ViewModel")) as ComponentType<any>;

type QuizAttemptModalData = QuizAttemptDetails & {
  quizMarks: string;
  attemptLimit: string;
};

export default function QuizAttemptView() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const attemptId = Number(id);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const { quizAttempt, quizAttemptLoading, quizAttemptError } = useGetQuizAttemptById(
    Number.isNaN(attemptId) ? null : attemptId,
  );
  const { quiz, quizLoading } = useGetQuizById(quizAttempt?.quizId ? Number(quizAttempt.quizId) : null);

  const modalData = useMemo<QuizAttemptModalData | null>(() => {
    if (!quizAttempt) {
      return null;
    }

    return {
      ...quizAttempt,
      quizMarks: quiz?.marks != null ? String(quiz.marks) : "-",
      attemptLimit: quiz?.attemptLimit != null ? String(quiz.attemptLimit) : "-",
    };
  }, [quiz?.attemptLimit, quiz?.marks, quizAttempt]);

  const viewModalFields: ModalField<QuizAttemptModalData>[] = useMemo(
    () => [
      { label: "Attempt ID", key: "id" as const, type: "text" as const, disabled: true },
      { label: "Quiz ID", key: "quizId" as const, type: "text" as const, disabled: true },
      { label: "Student ID", key: "studentId" as const, type: "text" as const, disabled: true },
      {
        label: "Status",
        key: "status",
        type: "custom" as const,
        disabled: true,
        render: (value: unknown) => {
          const val = value === "submitted" || value === "completed";
          return (
            <div className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold ${val ? "border-green-200 bg-green-100 text-green-700" : "border-amber-200 bg-amber-100 text-amber-700"}`}>
              {String(value)}
            </div>
          );
        },
      },
      {
        label: "Attempted At",
        key: "attemptedAt",
        type: "custom" as const,
        disabled: true,
        render: (value: unknown) => (
          <div className="text-sm font-medium">{value ? new Date(String(value)).toLocaleString() : "-"}</div>
        ),
      },
      {
        label: "Score",
        type: "custom" as const,
        render: (_: unknown, data: QuizAttemptModalData) => (
          <div className="text-sm font-medium">{data.score != null ? String(data.score) : "-"}</div>
        ),
      },
      {
        label: "Quiz Marks",
        key: "quizMarks",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Attempt Limit",
        key: "attemptLimit",
        type: "text" as const,
        disabled: true,
      },
    ],
    [],
  );

  if (quizAttemptLoading) {
    return <div className="p-6">Loading quiz attempt details...</div>;
  }

  if (quizAttemptError) {
    return <div className="p-6 text-red-500">Failed to load quiz attempt details.</div>;
  }

  if (!quizAttempt) {
    return <div className="p-6">Quiz attempt not found.</div>;
  }

  if (quizLoading && !quiz) {
    return <div className="p-6">Loading quiz details...</div>;
  }

  const handleSubmitQuiz = () => {
    if (!quiz?.id) {
      return;
    }

    router.push(`/dashboard/student-upload/quiz-attempt/quiz/${quiz.id}/attempt`);
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div
        className={`mx-auto max-w-5xl rounded-2xl border p-6 md:p-8 ${
          isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Submit Quiz</h1>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Faculty-created quiz is shown in card format. Click submit to open the quiz fill page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsViewModalOpen(true)}
              variant="outline"
              className="rounded-lg px-5"
            >
              View Details
            </Button>
            <Button onClick={handleSubmitQuiz} disabled={!quiz?.id} className="rounded-lg px-5">
              Submit Quiz
            </Button>
          </div>
        </div>

        <div className="mt-6 max-w-xl">
          {quiz ? (
            <QuizCard
              quiz={quiz}
              attempt={quizAttempt}
              permissions={{
                canView: false,
                canEdit: false,
                canDelete: false,
                canToggleStatus: false,
              }}
            />
          ) : (
            <div
              className={`rounded-2xl border p-5 ${
                isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-sm">Quiz details are unavailable.</p>
            </div>
          )}
        </div>

        
      </div>

      <Suspense fallback={null}>
        <CommonModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Quiz Attempt Details"
          data={modalData}
          fields={viewModalFields}
          size="md"
          footerContent={
            <Button onClick={() => setIsViewModalOpen(false)} variant="outline">
              Close
            </Button>
          }
        />
      </Suspense>
    </div>
  );
}
