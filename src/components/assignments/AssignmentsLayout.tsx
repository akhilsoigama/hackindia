import type { ReactNode } from 'react';
import { useTheme } from '@/theme/AppThemeProvider';
import AssignmentsGrid from './AssignmentsGrid';
import AssignmentsHeader from './AssignmentsHeader';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  department: {
    id: string;
    departmentName: string;
  };
  faculty: {
    id: string;
    name: string;
  };
  assignedTo: string;
  type: string;
  description: string;
  dueDate: string;
  marks: number;
  points: number;
  submissions: number;
  totalStudents: number;
  status: 'Active' | 'Inactive';
}

export type AssignmentsRole = 'faculty' | 'student';

export interface AssignmentsFiltersProps {
  searchInput?: ReactNode;
}

export interface AssignmentsLayoutProps {
  assignments: Assignment[];
  role: AssignmentsRole;
  onCreate?: () => void;
  onView: (id: string) => void;
  onShowSubmissions?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onSubmit?: (id: string) => void;
  filters?: AssignmentsFiltersProps;
}

const AssignmentsLayout = ({
  assignments,
  role,
  onCreate,
  onView,
  onShowSubmissions,
  onEdit,
  onDelete,
  onToggleStatus,
  onSubmit,
  filters,
}: AssignmentsLayoutProps) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <section className={isDark ? 'min-h-screen ' : 'min-h-screen '}>
      <div className=" flex w-full max-w-full flex-col gap-6 ">
        <AssignmentsHeader role={role} onCreate={onCreate} />
        {filters?.searchInput ? filters.searchInput : null}
        <AssignmentsGrid
          assignments={assignments}
          role={role}
          onView={onView}
          onShowSubmissions={onShowSubmissions}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onSubmit={onSubmit}
        />
      </div>
    </section>
  );
};

export default AssignmentsLayout;
