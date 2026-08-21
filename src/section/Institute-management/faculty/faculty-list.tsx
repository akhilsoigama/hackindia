import { useMemo, useCallback } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IfacultyItem } from "../../../types/Faculty";
import CommonDataList, {
  ModalField,
} from "../../../components/common/commanDataList";

interface TransformedFaculty {
  id: string;
  facultyName: string;
  facultyId: string;
  designation: string;
  departmentName: string;
  facultyEmail: string;
  facultyMobile: string;
  instituteId?: number | string;
  institute_id?: number | string;
  createdAt: string;
  createdBy?: number | string;
  created_by?: number | string;
  isActive: boolean;
}

interface FacultyListProps {
  faculties: IfacultyItem[];
  onEdit?: (faculty: IfacultyItem) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const transformApiDataToFaculties = (
  apiData: IfacultyItem[],
): TransformedFaculty[] => {
  return apiData.map((item) => ({
    id: item.id?.toString() ?? "",
    facultyName: item.facultyName ?? "",
    facultyId: item.facultyId ?? "",
    designation: item.designation ?? "",
    departmentName: item.department?.departmentName ?? "",
    facultyEmail: item.facultyEmail ?? "",
    facultyMobile: item.facultyMobile ?? "",
    instituteId: item.instituteId,
    institute_id: (item as unknown as Record<string, unknown>).institute_id as
      | number
      | string
      | undefined,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    createdBy: (item as unknown as Record<string, unknown>).createdBy as
      | number
      | string
      | undefined,
    created_by: (item as unknown as Record<string, unknown>).created_by as
      | number
      | string
      | undefined,
    isActive: item.isActive ?? false,
  }));
};

const FacultyList = ({
  faculties,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: FacultyListProps) => {
  const navigate = useNavigate();

  const transformedFaculties = useMemo(
    () => transformApiDataToFaculties(faculties ?? []),
    [faculties],
  );

  const handleEdit = useCallback(
    (faculty: TransformedFaculty) => {
      const originalFaculty = faculties.find(
        (f) => f.id.toString() === faculty.id,
      );
      if (originalFaculty) {
        onEdit?.(originalFaculty);
      }
    },
    [onEdit, faculties],
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete?.(parseInt(id));
    },
    [onDelete],
  );

  const handleCreate = useCallback(() => {
    if (onCreate) onCreate();
    else navigate("/dashboard/institute-management/faculty/new");
  }, [onCreate, navigate]);

  const columns = useMemo(
    () => [
      {
        header: "Faculty Name",
        accessor: "facultyName" as keyof TransformedFaculty,
        width: "18%",
        render: (item: TransformedFaculty) => (
          <span translate="yes" className="font-medium">
            {item.facultyName || "N/A"}
          </span>
        ),
      },
      {
        header: "Email Address",
        accessor: "facultyEmail" as keyof TransformedFaculty,
        width: "22%",
      },
      {
        header: "Faculty ID",
        accessor: "facultyId" as keyof TransformedFaculty,
        width: "10%",
      },
      {
        header: "Designation",
        accessor: "designation" as keyof TransformedFaculty,
        width: "15%",
      },
      {
        header: "Department",
        accessor: "departmentName" as keyof TransformedFaculty,
        width: "15%",
      },
      {
        header: "Mobile",
        accessor: "facultyMobile" as keyof TransformedFaculty,
        width: "10%",
      },
      {
        header: "Status",
        accessor: "isActive" as keyof TransformedFaculty,
        width: "10%",
      },
    ],
    [],
  );

  const viewModalFields: ModalField<TransformedFaculty>[] = useMemo(
    () => [
      {
        label: "Faculty Name",
        key: "facultyName",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Faculty ID",
        key: "facultyId",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Designation",
        key: "designation",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Department",
        key: "departmentName",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Email Address",
        key: "facultyEmail",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Mobile Number",
        key: "facultyMobile",
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Status",
        key: "isActive",
        type: "custom" as const,
        disabled: true,
        render: (value: unknown) => {
          const val = Boolean(value);
          return (
            <span
              className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold ${
                val
                  ? "border-green-200 bg-green-100 text-green-700"
                  : "border-red-200 bg-red-100 text-red-700"
              }`}
            >
              {val ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    // ✅ FIXED: overflow-x-hidden → overflow-x-auto, max-w-full hataya
    <div className="w-full" style={{ boxSizing: "border-box" }}>
      <CommonDataList<TransformedFaculty>
        data={transformedFaculties}
        title="Faculty Management"
        subtitle="Manage faculty members, their profiles, and departmental assignments"
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewModalFields={viewModalFields}
        icon={<FaChalkboardTeacher />}
        createButtonText="Add Faculty Member"
        searchPlaceholder="Search faculty by name, ID, designation, or department..."
        emptyMessage="No faculty members found"
        emptyDescription="Get started by adding your first faculty member to the system"
        enableSearch={true}
        enableStatusFilter={true}
        statusFilterKey="isActive"
        customFilters={{
          status: [
            { value: "all", label: "All Faculty" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FacultyList;
