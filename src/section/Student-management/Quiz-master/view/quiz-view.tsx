import { useMemo } from "react";
import { Calendar, CheckCircle2, FileText, GraduationCap, ListChecks } from "lucide-react";
import { useParams } from "../../../../hooks/useParams";
import { useTheme } from '@/theme/AppThemeProvider';import { useGetQuizById } from "../../../../action/quiz";
import MarkdownPreview from "../../../../components/markdown/markdown";

export default function QuizView() {
  const { id } = useParams();
  const quizId = Number(id);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const { quiz, quizLoading, quizError } = useGetQuizById(Number.isNaN(quizId) ? null : quizId);

  const questionCount = useMemo(() => quiz?.questions?.length ?? 0, [quiz?.questions]);
  const metaCardClass = isDark
    ? "rounded-2xl border border-slate-700  p-4"
    : "rounded-2xl border border-slate-200 bg-white p-4";

  if (quizLoading) {
    return <div className="p-6">Loading quiz details...</div>;
  }

  if (quizError) {
    return <div className="p-6 text-red-500">Failed to load quiz details.</div>;
  }

  if (!quiz) {
    return <div className="p-6">Quiz not found.</div>;
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-6 ${
        isDark
          ? ""
          : "bg-linear-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl rounded-2xl border p-4 shadow-xl transition-colors duration-300 md:p-6 ${
          isDark
            ? "border-slate-700  text-slate-100 shadow-black/30"
            : "border-slate-200 bg-white text-slate-900 shadow-slate-200/80"
        }`}
      >
        <div className="mb-6 rounded-2xl border border-teal-600/20 p-4">
          {quiz.quizBanner ? (
            <div className="mb-4 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={quiz.quizBanner}
                alt={quiz.quizTitle}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-56 w-full object-cover md:h-72"
              />
            </div>
          ) : null}
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{quiz.quizTitle}</h1>
          <div className="mt-3 text-sm opacity-90">
            <MarkdownPreview content={quiz.quizDescription || "No description"} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className={metaCardClass}>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <GraduationCap className="h-4 w-4" />
              Subject
            </div>
            <p className="text-sm font-semibold">{quiz.subject || "-"}</p>
          </div>

          <div className={metaCardClass}>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <FileText className="h-4 w-4" />
              Standard
            </div>
            <p className="text-sm font-semibold">{quiz.std || "-"}</p>
          </div>

          <div className={metaCardClass}>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4" />
              Status
            </div>
            <p className={`text-sm font-semibold ${quiz.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
              {quiz.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div className={metaCardClass}>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <ListChecks className="h-4 w-4" />
              Questions
            </div>
            <p className="text-sm font-semibold">{questionCount}</p>
          </div>

          <div className={metaCardClass}>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Marks</div>
            <p className="text-sm font-semibold">{quiz.marks ?? "-"}</p>
          </div>

          <div className={metaCardClass}>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              Attempt Limit
            </div>
            <p className="text-sm font-semibold">{quiz.attemptLimit ?? "-"}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {(quiz.questions || []).map((question, questionIndex) => (
            <div
              key={question.id}
              className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md md:p-5 ${
                isDark
                  ? "border-slate-700  hover:border-slate-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold leading-snug md:text-lg">
                  Q{questionIndex + 1}.
                </h2>
                <div className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {question.questionType}
                </div>
              </div>

              <div className="mb-3 text-sm opacity-90">
                <MarkdownPreview content={question.questionText || "No question text"} />
              </div>

              <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">Marks: {question.marks}</div>

              <ul className="space-y-2">
                {(question.options || []).map((option) => (
                  <li
                    key={option.id}
                    className={`rounded-xl border px-3 py-2 text-sm transition-all duration-200 ${
                      option.isCorrect
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : isDark
                          ? "border-slate-700 bg-slate-900/40"
                          : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <MarkdownPreview content={option.optionText || "-"} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
