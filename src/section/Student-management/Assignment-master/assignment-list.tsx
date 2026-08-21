import { lazy, Suspense, useMemo, useState } from 'react';
import { IAssignmentItem } from '../../../types/assignment';
import { useNavigate } from 'react-router-dom';
import type { Assignment } from '../../../components/assignments/AssignmentsLayout';
import SearchAndFilter from '../../../components/common/SearchAndFilter';
const AssignmentsLayout = lazy(() => import('../../../components/assignments/AssignmentsLayout'));

const AssignmentList = ({
  assignmentses,
  submissionCounts,
  onEdit,
  onView,
  onShowSubmissions,
  onDelete,
  onCreate,
  isLoading = false
}: {
  assignmentses: IAssignmentItem[];
  submissionCounts?: Record<string, number>;
  onEdit?: (assignment: IAssignmentItem) => void;
  onView?: (assignment: IAssignmentItem) => void;
  onShowSubmissions?: (assignment: IAssignmentItem) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-statuses');

  const handleCreate = () => {
    if (onCreate) onCreate();
    else navigate('faculty-management/assignment/new');
  };

  const mappedAssignments = useMemo<Assignment[]>(() => {
    return (assignmentses ?? []).map((item) => ({
      id: String(item.id),
      title: item.assignmentTitle,
      subject: item.subject,
      department: {
        id: String(item.departmentId),
        departmentName: item.department?.departmentName ?? String(item.departmentId),
      },
      faculty: {
        id: String(item.facultyId),
        name: item.faculty?.facultyName ?? String(item.facultyId),
      },
      assignedTo: item.std,
      type: item.assignmentFile ? 'File' : 'General',
      description: item.assignmentDescription,
      dueDate: new Date(item.dueDate).toISOString(),
      marks: item.marks,
      points: item.marks,
      submissions: submissionCounts?.[String(item.id)] || 0,
      totalStudents: Math.max(submissionCounts?.[String(item.id)] || 0, 1),
      status: item.isActive ? 'Active' : 'Inactive',
    }));
  }, [assignmentses, submissionCounts]);

  const filteredAssignments = useMemo(() => {
    return mappedAssignments.filter((assignment) => {
      const matchSearch =
        !searchValue ||
        assignment.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchValue.toLowerCase());

      const matchStatus =
        statusFilter === 'all-statuses' ||
        (statusFilter === 'active' ? assignment.status === 'Active' : assignment.status === 'Inactive');

      return matchSearch && matchStatus;
    });
  }, [mappedAssignments, searchValue, statusFilter]);


  if (isLoading) return null;

  return (
    <Suspense fallback={null}>
      <AssignmentsLayout
        role="faculty"
        onCreate={handleCreate}
        filters={{
          searchInput: (
            <SearchAndFilter
              searchTerm={searchValue}
              onSearchChange={setSearchValue}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onReset={() => {
                setSearchValue('');
                setStatusFilter('all-statuses');
              }}
              filterOptions={{
                status: [
                  { value: 'all-statuses', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ],
              }}
              placeholder="Search assignments"
            />
          ),
        }}
        assignments={filteredAssignments}
        onEdit={(id) => {
          if (!onEdit) {
            return;
          }

          const selectedAssignment = (assignmentses ?? []).find((item) => String(item.id) === id);
          if (selectedAssignment) {
            onEdit(selectedAssignment);
          }
        }}
        onDelete={(id) => {
          if (!onDelete) {
            return;
          }

          const selectedAssignment = (assignmentses ?? []).find((item) => String(item.id) === id);
          if (selectedAssignment) {
            onDelete(selectedAssignment.id);
          }
        }}
        onView={(id) => {
          const selectedAssignment = (assignmentses ?? []).find((item) => String(item.id) === id);

          if (selectedAssignment && onView) {
            onView(selectedAssignment);
            return;
          }

          navigate(`/dashboard/faculty-management/assignment/${id}/edit`);
        }}
        onShowSubmissions={(id) => {
          const selectedAssignment = (assignmentses ?? []).find((item) => String(item.id) === id);
          if (selectedAssignment && onShowSubmissions) {
            onShowSubmissions(selectedAssignment);
          }
        }}
      />
    </Suspense>
  );
};

export default AssignmentList;