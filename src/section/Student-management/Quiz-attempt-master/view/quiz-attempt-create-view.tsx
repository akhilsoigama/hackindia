import { useMemo } from "react";
import { useGetQuizzes } from "../../../../action/quiz";
import { useRouter } from "../../../../hooks/useRouter";
import { useTheme } from '@/theme/AppThemeProvider';
import QuizCard, { QuizCardSkeleton } from "../../Quiz-master/quiz-card";
import type { QuizDetails } from "../../../../types/quizApi";
import { useUser } from "../../../../atoms/userAtom";

export default function QuizAttemptCreateView() {
  const router = useRouter();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { user } = useUser();
  const { quizzes, quizzesLoading } = useGetQuizzes();

  const activeQuizzes = useMemo(
    () => (quizzes || []).filter((quiz) => Boolean(quiz.isActive)),
    [quizzes],
  );

  const handleAttemptQuiz = (quiz: QuizDetails) => {
    router.push(
      `/dashboard/student-upload/quiz-attempt/quiz/${quiz.id}/attempt`,
    );
  };

  if (quizzesLoading) {
    return (
      <div
        className={`min-h-screen px-6 py-8 ${isDark ? "bg-gray-900" : "bg-slate-50"}`}
      >
        <div className="mx-auto max-w-7xl">
          <h1
            className={`mb-6 text-3xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            Available Quizzes
          </h1>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <QuizCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 py-2 ${isDark ? "bg-gray-900" : "bg-slate-50"}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1
            className={`text-3xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            Attempt Quiz
          </h1>
          <p
            className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Faculty-created quizzes are shown in card view. Click "Attempt Quiz" to
            open and fill the quiz.
          </p>
        </div>

        {activeQuizzes.length === 0 ? (
          <div
            className={`rounded-xl border px-6 py-12 text-center ${
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-300"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            No active quiz available right now.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onAttemptQuiz={handleAttemptQuiz}
                userType={user?.userType}
                permissions={{
                  canView: false,
                  canEdit: false,
                  canDelete: false,
                  canToggleStatus: false,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
