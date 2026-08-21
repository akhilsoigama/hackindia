  import { useMemo, useCallback } from 'react';
  import { FaUniversity, FaCalendarAlt } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import CommonDataList, { ModalField } from '../../../components/common/commanDataList';
  import { IInstitute } from '../../../types/Institute';

  interface TransformedInstitute {
    id: string;
    instituteName: string;
    instituteCode: string;
    instituteType: string;
    instituteAddress: string;
    instituteCity: string;
    instituteState: string;
    instituteCountry: string;
    institutePinCode: string;
    institutePhone: string;
    instituteEmail: string;
    instituteWebsite: string;
    principalName: string;
    principalEmail: string;
    principalPhone: string;
    principalQualification: string;
    principalExperience: string; 
    establishedYear: string;
    affiliation: string;
    campusArea: number; 
    roleId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface InstituteListProps {
    institutes: IInstitute[];
    onEdit?: (institute: IInstitute) => void;
    onDelete?: (id: number) => void;
    onCreate?: () => void;
    isLoading?: boolean;
  }

  const InstituteList = ({
    institutes,
    onEdit,
    onDelete,
    onCreate,
    isLoading = false,
  }: InstituteListProps) => {

    const navigate = useNavigate();

    const transformedInstitutes: TransformedInstitute[] = useMemo(() => {
      return institutes?.map((i) => ({
        id: i.id.toString(),
        instituteName: i.instituteName || "",
        instituteCode: i.instituteCode || "",
        instituteType: i.instituteType || "",
        instituteAddress: i.instituteAddress || "",
        instituteCity: i.instituteCity || "",
        instituteState: i.instituteState || "",
        instituteCountry: i.instituteCountry || "",
        institutePinCode: i.institutePinCode || "",
        institutePhone: i.institutePhone || "",
        instituteEmail: i.instituteEmail || "",
        instituteWebsite: i.instituteWebsite || "",
        principalName: i.principalName || "",
        principalEmail: i.principalEmail || "",
        principalPhone: i.principalPhone || "",
        principalQualification: i.principalQualification || "",
        principalExperience: i.principalExperience || "",
        establishedYear: String(i.establishedYear || ""),
        affiliation: i.affiliation || "",
        campusArea: Number(i.campusArea) || 0,
        roleId: i.roleId || 0,
        isActive: i.isActive !== undefined ? i.isActive : true,
        createdAt: i.createdAt || "",
        updatedAt: i.updatedAt || "",
      })) || [];
    }, [institutes]);

    const handleEdit = useCallback(
      (row: TransformedInstitute) => {
        const original = institutes.find((i) => i.id.toString() === row.id);
        if (original) onEdit?.(original);
      },
      [onEdit, institutes]
    );

    const handleDelete = useCallback(
      (id: string) => {
        onDelete?.(parseInt(id));
      },
      [onDelete]
    );

    const handleCreate = useCallback(() => {
      if (onCreate) onCreate();
      else navigate('/dashboard/institute-management/institute/create');
    }, [onCreate, navigate]);

    const columns = useMemo(
      () => [
        {
          header: "Institute Name",
          accessor: "instituteName" as keyof TransformedInstitute,
          sortable: true,
          render: (row: TransformedInstitute) => (
            <span className="font-medium truncate wrap-break-word">
              {row.instituteName || "N/A"}
            </span>
          ),
          width: "100px",
        },
        {
          header: "Principal",
          accessor: "principalName" as keyof TransformedInstitute,
          render: (row: TransformedInstitute) => (
            <span className="truncate">{row.principalName || "N/A"}</span>
          ),
          width: "200px",
        },
        {
          header: "Area",
          accessor: "campusArea" as keyof TransformedInstitute,
          render: (row: TransformedInstitute) => (
            <span className="truncate">{row.campusArea || "N/A"}</span>
          ),
          width: "150px",
        },
        {
          header: "Established",
          accessor: "establishedYear" as keyof TransformedInstitute,
          render: (row: TransformedInstitute) => (
            <span className="truncate">{row.establishedYear || "N/A"}</span>
          ),
          width: "150px",
        },
        {
          header: "Country",
          accessor: "instituteCountry" as keyof TransformedInstitute,
          render: (row: TransformedInstitute) => (
            <span className="truncate">{row.instituteCountry || "N/A"}</span>
          ),
          width: "15%",
        },
        {
          header: "State",
          accessor: "instituteState" as keyof TransformedInstitute,
          render: (row: TransformedInstitute) => (
            <span className="truncate">{row.instituteState || "N/A"}</span>
          ),
          width: "15%",
        },
        {
          header: "Status",
          accessor: "isActive" as keyof TransformedInstitute,
          width: "15%",
        },
       
      ],
      []
    );

    const viewModalFields: ModalField<TransformedInstitute>[] = useMemo(
      () => [
        { label: 'Institute Name', key: 'instituteName', type: 'text', disabled: true },
        { label: 'Institute Code', key: 'instituteCode', type: 'text', disabled: true },
        { label: 'Institute Type', key: 'instituteType', type: 'text', disabled: true },
        { label: 'Established Year', key: 'establishedYear', type: 'text', disabled: true },
        { label: 'Affiliation', key: 'affiliation', type: 'text', disabled: true },
        { label: 'Campus Area', key: 'campusArea', type: 'text', disabled: true },

        { label: 'Email', key: 'instituteEmail', type: 'text', disabled: true },
        { label: 'Phone', key: 'institutePhone', type: 'text', disabled: true },
        { label: 'Website', key: 'instituteWebsite', type: 'text', disabled: true },

        { label: 'Address', key: 'instituteAddress', type: 'text', disabled: true },
        { label: 'City', key: 'instituteCity', type: 'text', disabled: true },
        { label: 'State', key: 'instituteState', type: 'text', disabled: true },
        { label: 'Country', key: 'instituteCountry', type: 'text', disabled: true },
        { label: 'Pin Code', key: 'institutePinCode', type: 'text', disabled: true },

        { label: 'Principal Name', key: 'principalName', type: 'text', disabled: true },
        { label: 'Principal Email', key: 'principalEmail', type: 'text', disabled: true },
        { label: 'Principal Phone', key: 'principalPhone', type: 'text', disabled: true },
        { label: 'Principal Qualification', key: 'principalQualification', type: 'text', disabled: true },
        { label: 'Principal Experience', key: 'principalExperience', type: 'text', disabled: true },

        {
          label: 'Status',
          key: 'isActive',
          type: 'custom',
          disabled: true,
          render: (value: unknown) => {
            const val = Boolean(value);
            return (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: val ? '#dcfce7' : '#fee2e2',
                color: val ? '#166534' : '#b91c1c',
                display: 'inline-block',
              }}
            >
              {val ? 'Active' : 'Inactive'}
            </div>
          );
          },
        },

        {
          label: 'Created Date',
          key: 'createdAt',
          type: 'custom',
          disabled: true,
          render: (value: unknown) => {
            const val = typeof value === 'string' ? value : '';
            return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: 0 }}>
              <FaCalendarAlt size={14} />
              {val ? new Date(val).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              }) : 'N/A'}
            </div>
          );
          },
        },
        {
          label: 'Last Updated',
          key: 'updatedAt',
          type: 'custom',
          disabled: true,
          render: (value: unknown) => {
            const val = typeof value === 'string' ? value : '';
            return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: 0 }}>
              <FaCalendarAlt size={14} />
              {val ? new Date(val).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              }) : 'N/A'}
            </div>
          );
          },
        },
      ],
      []
    );
    return (
      <div className="w-full max-w-full overflow-x-hidden min-w-0" style={{ boxSizing: 'border-box' }}>
        <div className="w-full max-w-full" style={{ boxSizing: 'border-box' }}>
          <CommonDataList<TransformedInstitute>
            title="Institute Management"
            subtitle="Manage registered institutes and their primary information"
            data={transformedInstitutes}
            columns={columns}
            icon={<FaUniversity />}
            onCreate={handleCreate}     
            onEdit={handleEdit}
            onDelete={handleDelete}
            viewModalFields={viewModalFields}
            createButtonText="Add New Institute"
            searchPlaceholder="Search institutes by name, code, or principal..."
            emptyMessage="No institutes found"
            emptyDescription="Start by adding a new institute."
            enableSearch={true}
            enableStatusFilter={true}
            statusFilterKey="isActive"
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  };

  export default InstituteList;
