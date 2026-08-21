// pages/DepartmentList.tsx
import { useMemo, useCallback } from 'react';
import { FaBuilding, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IDepartment } from '../../../types/department';
import CommonDataList, { ModalField } from '../../../components/common/commanDataList';

interface TransformedDepartment {
  id: string;
  departmentName: string;
  departmentCode: string;
  description: string;
  instituteId: number;
  createdAt: string;
  isActive: boolean;
}

interface DepartmentListProps {
  departments: IDepartment[];
  onEdit?: (department: IDepartment) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const transformApiDataToDepartments = (apiData: IDepartment[]): TransformedDepartment[] => {
  return apiData.map(item => ({
    id: item.id?.toString() ?? '',
    departmentName: item.departmentName ?? '',
    departmentCode: item.departmentCode ?? '',
    description: item.description ?? '',
    instituteId: item.instituteId,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    isActive: item.isActive ?? false,
  }));
};

const DepartmentList = ({
  departments,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: DepartmentListProps) => {
  const navigate = useNavigate();
  
  const transformedDepartments = useMemo(() => 
    transformApiDataToDepartments(departments ?? []), 
    [departments]
  );

  const handleEdit = useCallback((dept: TransformedDepartment) => {
    const originalDept = departments.find(d => d.id.toString() === dept.id);
    if (originalDept) {
      onEdit?.(originalDept);
    }
  }, [onEdit, departments]);

  const handleDelete = useCallback((id: string) => {
    onDelete?.(parseInt(id));
  }, [onDelete]);

  const handleCreate = useCallback(() => {
    if (onCreate) onCreate();
    else navigate('/departments/create');
  }, [onCreate, navigate]);

  const handleView = useCallback((dept: TransformedDepartment) => {
    console.log('View department:', dept);
  }, []);

  const columns = useMemo(() => [
    { header: 'Department Name', accessor: 'departmentName' as keyof TransformedDepartment, sortable: true, width: '20%' },
    { header: 'Department Code', accessor: 'departmentCode' as keyof TransformedDepartment, width: '20%' },
    { header: 'Description', accessor: 'description' as keyof TransformedDepartment, width: '30%' },
    { header: 'Status', accessor: 'isActive' as keyof TransformedDepartment, width: '15%' },
    { header: 'Created Date', accessor: 'createdAt' as keyof TransformedDepartment, sortable: true, width: '15%' },
  ], []);

  const viewModalFields: ModalField<TransformedDepartment>[] = useMemo(() => [
    {
      label: 'Department Name',
      key: 'departmentName',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Department Code',
      key: 'departmentCode',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'textarea' as const,
      disabled: true,
    },
    {
      label: 'Status',
      key: 'isActive',
      type: 'custom' as const,
      disabled: true,
      render: (value: unknown) => {
        const val = Boolean(value);
        return (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          background: val 
            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
          color: val ? '#166534' : '#dc2626',
          border: `1px solid ${val ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {val ? 'Active' : 'Inactive'}
        </div>
      );
      },
    },
    {
      label: 'Created Date',
      key: 'createdAt',
      type: 'custom' as const,
      disabled: true,
      render: (value: unknown) => {
        const val = typeof value === 'string' ? value : '';
        return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          padding: '10px 16px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <FaCalendarAlt size={14} color="#64748b" />
          <span style={{ color: '#475569', fontSize: '14px' }}>
            {new Date(val).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      );
      },
    },
  ], []);


  return (
    <CommonDataList<TransformedDepartment>
      data={transformedDepartments}
      title="Department Management"
      subtitle="Manage organizational departments and their details"
      
      columns={columns}
      
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      
      // View modal
      viewModalFields={viewModalFields}
      
      // Customization
      icon={<FaBuilding />}
      createButtonText="Create Department"
      searchPlaceholder="Search departments, codes..."
      emptyMessage="No departments configured"
      emptyDescription="Start by creating your first department to organize your structure"
      enableSearch={true}
      enableStatusFilter={true}
      statusFilterKey="isActive"
      customFilters={{
        status: [
          { value: 'all', label: 'All Departments' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      }}
      
      // Status
      isLoading={isLoading}
    />
  );
};

export default DepartmentList;