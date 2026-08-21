import { useMemo, useCallback } from 'react';
import {
  FaCalendarAlt,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaVenusMars,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CommonDataList, { ModalField } from '../../../components/common/commanDataList';
import { IStudent } from '../../../types/student';

interface StudentListProps {
  students: IStudent[];
  onEdit?: (student: IStudent) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const StudentList = ({
  students,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: StudentListProps) => {
  const navigate = useNavigate();
  const formatDateOnly = useCallback((value: Date | string | undefined) => {
    if (!value) return 'N/A';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toISOString().split('T')[0];
  }, []);

  const handleEdit = useCallback((student: IStudent) => {
    const originalStudent = students.find(s => s.id === student.id);
    if (originalStudent) {
      onEdit?.(originalStudent);
    }
  }, [onEdit, students]);

  const handleDelete = useCallback((id: number) => {
    onDelete?.(id);
  }, [onDelete]);

  const handleCreate = useCallback(() => {
    if (onCreate) onCreate();
    else navigate('/dashboard/institute-management/student/new');
  }, [onCreate, navigate]);

 const columns = useMemo(
  () => [
    {
      header: 'Student Name',
      accessor: 'studentName' as keyof IStudent,
      width: '15%',
      render: (item: IStudent) => (
        <span translate="yes" className="font-medium truncate wrap-break-word">
          {item.studentName || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Email',
      accessor: 'studentEmail' as keyof IStudent,
      width: '20%',
    },
    {
      header: 'GR Number',
      accessor: 'studentGrNo' as keyof IStudent,
      width: '10%',
    },
    {
      header: 'Gender',
      accessor: 'studentGender' as keyof IStudent,
      width: '8%',
    },
    {
      header: 'Student ID',
      accessor: 'studentId' as keyof IStudent,
      width: '8%',
    },
    {
      header: 'Standard',
      accessor: 'studentStd' as keyof IStudent,
      width: '10%',
    },
    {
      header: 'Mobile',
      accessor: 'studentMobile' as keyof IStudent,
      width: '12%',
    },
    {
      header: 'Status',
      accessor: 'isActive' as keyof IStudent,
      width: '7%',
    },
    {
      header: 'Admission Date',
      accessor: 'studentAddmissionDate' as keyof IStudent,
      sortable: true,
      width: '10%',
      render: (item: IStudent) =>
        formatDateOnly(item.studentAddmissionDate),
    },
  ],
  [formatDateOnly]
);

  const viewModalFields: ModalField<IStudent>[] = useMemo(() => [
    {
      label: 'Student Name',
      key: 'studentName',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Student ID',
      key: 'studentId',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Standard',
      key: 'studentStd',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'GR Number',
      key: 'studentGrNo',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Gender',
      key: 'studentGender',
      type: 'custom' as const,
      disabled: true,
      render: (val) => (
        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
          <FaVenusMars size={14} className="text-slate-500" />
          <span>{typeof val === 'string' ? val : 'Not specified'}</span>
        </div>
      ),
    },
    {
      label: 'Department',
      key: 'department' as keyof IStudent,
      type: 'custom' as const,
      disabled: true,
      render: (val) => (
        <div className="text-sm text-slate-600">
          {typeof val === 'object' && val !== null && 'departmentName' in val
            ? String((val as { departmentName?: string }).departmentName ?? 'Not specified')
            : 'Not specified'}
        </div>
      ),
    },
    {
      label: 'Role',
      key: 'role' as keyof IStudent,
      type: 'custom' as const,
      disabled: true,
      render: (val) => (
        <div className="text-sm text-slate-600">
          {typeof val === 'object' && val !== null && 'roleName' in val
            ? String((val as { roleName?: string }).roleName ?? 'Not specified')
            : 'Not specified'}
        </div>
      ),
    },
    {
      label: 'Email Address',
      key: 'studentEmail',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Mobile Number',
      key: 'studentMobile',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Date of Birth',
      key: 'studentDob',
      type: 'custom' as const,
      disabled: true,
      render: (val) => {
        const formatDate = (dateString: string) => {
          if (!dateString) return 'Not specified';
          try {
            return new Date(dateString).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          } catch {
            return dateString;
          }
        };

        return (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaCalendarAlt size={14} className="text-slate-500" />
            <span>{formatDate(typeof val === 'string' ? val : '')}</span>
          </div>
        );
      },
    },
    {
      label: 'Admission Date',
      key: 'studentAddmissionDate',
      type: 'custom' as const,
      disabled: true,
      render: (val) => {
        return (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaCalendarAlt size={14} className="text-slate-500" />
            <span>{formatDateOnly((val instanceof Date || typeof val === 'string') ? val : undefined)}</span>
          </div>
        );
      },
    },
    {
      label: 'Address',
      key: 'studentAddress',
      type: 'custom' as const,
      disabled: true,
      render: (val, item: IStudent) => (
        <div className="text-sm text-slate-600">
          <div className="mb-2 flex items-center gap-2 font-medium text-slate-700">
            <FaMapMarkerAlt size={14} className="text-slate-500" />
            <span>Address Information</span>
          </div>
          {typeof val === 'string' && val && (
            <div className="mb-1 text-slate-500">{val}</div>
          )}
          {(item.studentCity || item.studentState || item.studentCountry || item.studentPincode) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.studentCity && <span className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700">City: {item.studentCity}</span>}
              {item.studentState && <span className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700">State: {item.studentState}</span>}
              {item.studentCountry && <span className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700">Country: {item.studentCountry}</span>}
              {item.studentPincode && <span className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700">Pin Code: {item.studentPincode}</span>}
            </div>
          )}
        </div>
      ),
    },
    {
      label: 'Status',
      key: 'isActive',
      type: 'custom' as const,
      disabled: true,
      render: (val) => {
        const active = Boolean(val);
        return (
          <div className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold transition-all duration-300 ease-in-out ${active ? 'border-green-300/60 bg-green-100/70 text-green-700 shadow-sm shadow-green-200/40' : 'border-red-300/60 bg-red-100/70 text-red-700 shadow-sm shadow-red-200/40'}`}>
            {active ? 'Active' : 'Inactive'}
          </div>
        );
      },
    },
    {
      label: 'Created Date',
      key: 'createdAt',
      type: 'custom' as const,
      disabled: true,
      render: (val) => {
        const dateString = typeof val === 'string' ? val : '';
        const formatted = dateString
          ? new Date(dateString).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'N/A';

        return (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaCalendarAlt size={14} className="text-slate-500" />
            <span>{formatted}</span>
          </div>
        );
      },
    },
  ], [formatDateOnly]);

  return (
    <CommonDataList<IStudent>
      data={students}
      title="Student Management"
      subtitle="Manage student profiles, academic records, and enrollment status"
      columns={columns}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      viewModalFields={viewModalFields}
      icon={<FaUserGraduate />}
      createButtonText="Add New Student"
      searchPlaceholder="Search students by name, ID, standard, or email..."
      emptyMessage="No students found"
      emptyDescription="Get started by adding your first student to the system"
      enableSearch={true}
      enableStatusFilter={true}
      statusFilterKey="isActive"
      customFilters={{
        status: [
          { value: 'all', label: 'All Students' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        standard: [
          { value: 'all', label: 'All Standards' },
          { value: '1st', label: '1st Standard' },
          { value: '2nd', label: '2nd Standard' },
          { value: '3rd', label: '3rd Standard' },
          { value: '4th', label: '4th Standard' },
          { value: '5th', label: '5th Standard' },
          { value: '6th', label: '6th Standard' },
          { value: '7th', label: '7th Standard' },
          { value: '8th', label: '8th Standard' },
          { value: '9th', label: '9th Standard' },
          { value: '10th', label: '10th Standard' },
        ],
      }}
      isLoading={isLoading}
    />
  );
};

export default StudentList;