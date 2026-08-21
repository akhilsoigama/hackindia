import { memo } from "react";
import type { QuizAttemptDetails, QuizDetails } from "../../../types/quizApi";
import type { UserType } from "../../../types/user";
import { useUser } from "../../../atoms/userAtom";
import SchemaCard from "@/components/ui/schema-card-with-animated-wave-visualizer";

export type QuizCardActionPermissions = {
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canToggleStatus?: boolean;
};

export interface QuizCardProps {
  quiz: QuizDetails;
  attempt?: QuizAttemptDetails;
  onEdit?: (quiz: QuizDetails) => void;
  onView?: (quiz: QuizDetails) => void;
  onAttemptQuiz?: (quiz: QuizDetails) => void;
  onDelete?: (id: number) => void;
  onToggleActive?: (quizId: number, isActive: boolean) => void;
  permissions?: QuizCardActionPermissions;
  userType?: UserType;
}

const defaultPermissions: Required<QuizCardActionPermissions> = {
  canView: true,
  canEdit: true,
  canDelete: true,
  canToggleStatus: true,
};

function formatDate(date?: string): string {
  if (!date) {
    return "No due date";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "No due date";
  }

  return parsed.toLocaleDateString();
}

function getRelativeDueDate(date?: string): string {
  if (!date) {
    return "No due date";
  }

  const dueDate = new Date(date);
  if (Number.isNaN(dueDate.getTime())) {
    return "No due date";
  }

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((dueDate.getTime() - now.getTime()) / oneDay);

  if (diff < 0) {
    return "Overdue";
  }

  if (diff === 0) {
    return "Due today";
  }

  if (diff === 1) {
    return "Due in 1 day";
  }

  return `Due in ${diff} days`;
}

  function getAttemptStatus(attempt?: QuizAttemptDetails) {
    if (!attempt) {
      return {
        label: "Not Attempted",
        dot: "bg-slate-400",
        badge:
          "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300",
        actionLabel: "Start Quiz",
      };
    }

    if (attempt.status === "submitted" || attempt.status === "completed") {
      return {
        label: "Submitted",
        dot: "bg-blue-500",
        badge:
          "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
        actionLabel: "View Result",
      };
    }

    return {
      label: "In Progress",
      dot: "bg-emerald-500",
      badge:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
      actionLabel: "Resume Quiz",
    };
  }

const QuizCard = memo(function QuizCard({
  quiz,
  attempt,
  onEdit,
  onView,
  onAttemptQuiz,
  onDelete,
  permissions,
}: QuizCardProps) {
  const { user } = useUser();
  const mergedPermissions = { ...defaultPermissions, ...permissions };
  const isActive = Boolean(quiz.isActive);
  const canAttemptQuiz = user?.authType === "student" && isActive;
  const attemptStatus = getAttemptStatus(attempt);
  const questionCount = quiz.questions?.length ?? 0;
  const buttonLabel = canAttemptQuiz
    ? attemptStatus.actionLabel
    : attempt?.status === "submitted" || attempt?.status === "completed"
      ? "View Result"
      : "View Details";
  const handlePrimaryAction = () => {
    if (attempt?.status === "submitted" || attempt?.status === "completed") {
      onView?.(quiz);
      return;
    }

    if (canAttemptQuiz) {
      onAttemptQuiz?.(quiz);
      return;
    }

    onView?.(quiz);
  };

  return (
        <div className="relative">
          <SchemaCard
            embedded
            badge={quiz.subject || "Quiz"}
            title={quiz.quizTitle}
            description={quiz.quizDescription?.trim() || "No description available."}
            ctaLabel={buttonLabel}
            statusLabel={attemptStatus.label}
            dateLabel={formatDate(quiz.dueDate)}
            metaLabel={getRelativeDueDate(quiz.dueDate)}
            extraFields={[
              { label: "Class", value: quiz.std || "N/A" },
              { label: "Questions", value: questionCount },
              { label: "Marks", value: quiz.marks ?? "-" },
              { label: "Attempts", value: quiz.attemptLimit ?? "-" },
            ]}
            imageUrl={quiz.quizBanner || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"}
            imageAlt={quiz.quizTitle}
            onPrimaryAction={handlePrimaryAction}
            showViewAction={mergedPermissions.canView}
            showEditAction={mergedPermissions.canEdit}
            showDeleteAction={mergedPermissions.canDelete}
            onViewAction={() => onView?.(quiz)}
            onEditAction={() => onEdit?.(quiz)}
            onDeleteAction={() => onDelete?.(quiz.id)}
          />
        </div>
  );
});

export const QuizCardSkeleton = memo(function QuizCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25">
      <div className="animate-pulse space-y-4">
        <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
        <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
});

export default QuizCard;
