import { useTheme } from '@/theme/AppThemeProvider';
import AssignmentCard from './AssignmentCard';
import type { Assignment, AssignmentsRole } from './AssignmentsLayout';

interface AssignmentsGridProps {
  assignments: Assignment[];
  role: AssignmentsRole;
  onView: (id: string) => void;
  onShowSubmissions?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

const AssignmentsGrid = ({ assignments, role, onView, onShowSubmissions, onEdit, onDelete, onToggleStatus, onSubmit }: AssignmentsGridProps) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  if (assignments.length === 0) {
    return (
      <div
        className={
          isDark
            ? 'flex min-h-70 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-8 text-center'
            : 'flex min-h-70 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center'
        }
      >
        <div>
          <p className={isDark ? 'text-base font-semibold text-white' : 'text-base font-semibold text-slate-900'}>No assignments found</p>
          <p className={isDark ? 'mt-1 text-sm text-slate-400' : 'mt-1 text-sm text-slate-500'}>Try adjusting your filters or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          role={role}
          onView={onView}
          onShowSubmissions={onShowSubmissions}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmit={onSubmit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default AssignmentsGrid;
