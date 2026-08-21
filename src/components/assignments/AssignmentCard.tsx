import { useTheme } from "@/theme/AppThemeProvider";
import type { Assignment, AssignmentsRole } from "./AssignmentsLayout";
import ActionMenu from "../common/actionMenu";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Translated } from "../common/translator/translator";
import { ParticleButton } from "../ui/particle-button";

interface AssignmentCardProps {
  assignment: Assignment;
  role: AssignmentsRole;
  onView: (id: string) => void;
  onShowSubmissions?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

const formatDueDate = (dueDate: string): string => {
  if (!dueDate) {
    return "-";
  }

  const parsedDate = new Date(dueDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return dueDate;
  }

  return parsedDate.toLocaleDateString();
};

const AssignmentCard = ({
  assignment,
  onView,
  onShowSubmissions,
  onEdit,
  onDelete,
}: AssignmentCardProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { submissions, totalStudents } = assignment;
  const percentage =
    totalStudents > 0 ? (submissions / totalStudents) * 100 : 0;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <article
      className={
        isDark
          ? "flex flex-col justify-between rounded-2xl bg-slate-900/70 p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
          : "flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
      }
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3
            className={
              isDark
                ? "line-clamp-2 text-lg font-semibold text-white"
                : "line-clamp-2 text-lg font-semibold text-slate-950/70"
            }
          >
            <Translated text={`Title: ${assignment.title}`} />
          </h3>
          <ActionMenu
            data={assignment}
            items={[
              {
                label: <Translated text="View Details" />,
                onClick: () => onView && onView(assignment.id),
                icon: <FaEye size={12} />,
                variant: "default",
              },
              {
                label: <Translated text="Edit" />,
                onClick: () => onEdit && onEdit(assignment.id),
                icon: <FaEdit size={12} />,
                variant: "warning",
              },
              {
                label: <Translated text="Delete" />,
                onClick: () => onDelete && onDelete(assignment.id),
                icon: <FaTrash size={12} />,
                variant: "danger",
              },
            ]}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-600"}`}>
            <Translated text={`Subject: ${assignment.subject}`} />
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs ${
              assignment.status === "Active"
                ? isDark
                  ? "bg-teal-700 text-teal-300"
                  : "bg-teal-700 text-teal-300"
                : isDark
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-200 text-slate-600"
            }`}
          >
            <Translated text={`Status: ${assignment.status}`} />
          </span>
        </div>

        <p
          className={
            isDark
              ? "mt-3 line-clamp-2 text-sm text-slate-400"
              : "mt-3 line-clamp-2 text-sm text-slate-500"
          }
        >
          <Translated text={`Description: ${assignment.description}`} />
        </p>

        <div
          className={
            isDark
              ? "mt-4 grid grid-cols-2 gap-y-2 text-sm text-slate-300"
              : "mt-4 grid grid-cols-2 gap-y-2 text-sm text-slate-600"
          }
        >
          <p>
            <Translated
              text={`Department: ${assignment.department.departmentName}`}
            />
          </p>
          <p>
            <Translated text={`Faculty: ${assignment.faculty.name}`} />
          </p>
          <p>
            <Translated text={`Assigned To: ${assignment.assignedTo}`} />
          </p>
          <p>
            <Translated text={`Type: ${assignment.type}`} />
          </p>
          <p>
            <Translated text={`Due: ${formatDueDate(assignment.dueDate)}`} />
          </p>
          <p>
            <Translated
              text={`Marks / Points: ${assignment.marks} / ${assignment.points}`}
            />
          </p>
        </div>

        <div className="mt-4">
          <p
            className={
              isDark
                ? "text-sm font-medium text-slate-200"
                : "text-sm font-medium text-slate-700"
            }
          >
            <Translated
              text={`${submissions} / ${totalStudents} submissions (${Math.round(clampedPercentage)}%)`}
            />
          </p>
          <div
            className={
              isDark
                ? "mt-2 h-2 rounded-full bg-slate-700"
                : "mt-2 h-2 rounded-full bg-slate-200"
            }
          >
            <div
              className="h-2 rounded-full bg-slate-600"
              style={{ width: `${clampedPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          <ParticleButton
            type="button"
            onClick={() => onShowSubmissions?.(assignment.id)}
            className={`px-4 flex  items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              isDark
                ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
            }`}
          >
            <Translated text="Show Submissions" />
          </ParticleButton>
        </div>
      </div>
    </article>
  );
};

export default AssignmentCard;
