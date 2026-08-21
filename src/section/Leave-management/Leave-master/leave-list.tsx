import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserClock,
} from "react-icons/fa";
import CommonDataList, {
  ModalField,
} from "../../../components/common/commanDataList";
import { type FacultyLeaveResponse } from "../../../action/facultyLeave";

interface TransformedLeave {
  id: string;
  teacherName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: string;
  submittedDate: string;
  reason: string;
  contactNumber: string;
  emergencyContact: string;
  substituteTeacher: string;
  isActive: boolean;
}

type LeaveListProps = {
  leaves: FacultyLeaveResponse[];
  onEdit?: (leave: FacultyLeaveResponse) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const calcDuration = (
  startDate: string,
  endDate: string,
  isHalfDay?: boolean,
) => {
  if (!startDate || !endDate) return 0;
  const diff =
    Math.ceil(
      Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) /
        86_400_000,
    ) + 1;
  return isHalfDay ? diff * 0.5 : diff;
};

const toLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const transformApiDataToLeaves = (
  apiData: FacultyLeaveResponse[],
): TransformedLeave[] =>
  apiData.map((item) => ({
    id: item.id?.toString() ?? "",
    teacherName:
      item.teacherName ||
      item.faculty?.facultyName ||
      item.teacherId ||
      item.faculty?.facultyId ||
      `Faculty #${item.facultyId || item.id}`,
    leaveType: `${toLabel(item.leaveType)} Leave`,
    startDate: item.startDate,
    endDate: item.endDate,
    durationDays: calcDuration(item.startDate, item.endDate, item.isHalfDay),
    status: toLabel(item.status),
    submittedDate: item.submittedDate || item.createdAt || "",
    reason: item.reason || "-",
    contactNumber: item.contactNumber || "-",
    emergencyContact: item.emergencyContact || "-",
    substituteTeacher: item.substituteTeacher || "-",
    isActive: item.status === "approved",
  }));

const LeaveList = ({
  leaves,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: LeaveListProps) => {
  const navigate = useNavigate();

  const transformedLeaves = useMemo(
    () => transformApiDataToLeaves(leaves ?? []),
    [leaves],
  );

  const handleEdit = useCallback(
    (leave: TransformedLeave) => {
      const originalLeave = leaves.find((l) => l.id.toString() === leave.id);
      if (originalLeave) {
        onEdit?.(originalLeave);
      }
    },
    [onEdit, leaves],
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete?.(parseInt(id, 10));
    },
    [onDelete],
  );

  const handleCreate = useCallback(() => {
    if (onCreate) onCreate();
    else navigate("/dashboard/leave-management/leave/new");
  }, [onCreate, navigate]);

  const columns = useMemo(
    () => [
      {
        header: "Teacher",
        accessor: "teacherName" as keyof TransformedLeave,
        sortable: true,
        width: "20%",
      },
      {
        header: "Leave Type",
        accessor: "leaveType" as keyof TransformedLeave,
        sortable: true,
        width: "15%",
      },
      {
        header: "Period",
        accessor: "startDate" as keyof TransformedLeave,
        width: "22%",
        render: (item: TransformedLeave) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            <FaCalendarAlt size={12} />
            {`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
          </div>
        ),
      },
      {
        header: "Duration",
        accessor: "durationDays" as keyof TransformedLeave,
        sortable: true,
        width: "13%",
        render: (item: TransformedLeave) =>
          `${Math.round(item.durationDays * 10) / 10} day(s)`,
      },
      {
        header: "Status",
        accessor: "status" as keyof TransformedLeave,
        sortable: true,
        width: "15%",
        render: (item: TransformedLeave) => {
          const isApproved = item.status === "Approved";
          const isPending = item.status === "Pending";
          const color = isApproved
            ? "#16a34a"
            : isPending
              ? "#d97706"
              : "#dc2626";

          const bg = isApproved ? "#dcfce7" : isPending ? "#fef3c7" : "#fee2e2";

          const Icon = isApproved
            ? FaCheckCircle
            : isPending
              ? FaClock
              : FaTimesCircle;

          return (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 10px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                color,
                background: bg,
              }}
            >
              <Icon size={11} />
              {item.status}
            </span>
          );
        },
      },
      {
        header: "Submitted",
        accessor: "submittedDate" as keyof TransformedLeave,
        sortable: true,
        width: "15%",
        render: (item: TransformedLeave) => formatDate(item.submittedDate),
      },
    ],
    [],
  );

  const viewModalFields: ModalField<TransformedLeave>[] = useMemo(
    () => [
      { label: "Teacher", key: "teacherName", type: "text", disabled: true },
      { label: "Leave Type", key: "leaveType", type: "text", disabled: true },
      {
        label: "Period",
        type: "custom",
        disabled: true,
        render: (_value: unknown, data: TransformedLeave) => (
          <span>{`${formatDate(data.startDate)} - ${formatDate(data.endDate)}`}</span>
        ),
      },
      {
        label: "Duration",
        type: "custom",
        disabled: true,
        render: (_value: unknown, data: TransformedLeave) => (
          <span>{`${Math.round(data.durationDays * 10) / 10} day(s)`}</span>
        ),
      },
      { label: "Status", key: "status", type: "text", disabled: true },
      { label: "Reason", key: "reason", type: "textarea", disabled: true },
      {
        label: "Submitted Date",
        key: "submittedDate",
        type: "custom",
        disabled: true,
        render: (value: unknown) => (
          <span>{formatDate(String(value || ""))}</span>
        ),
      },
    ],
    [],
  );


  return (
    <CommonDataList<TransformedLeave>
      data={transformedLeaves}
      title="Leave Management"
      subtitle="Manage leave applications and monitor approval status"
      columns={columns}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      viewModalFields={viewModalFields}
      icon={<FaUserClock />}
      createButtonText="New Application"
      searchPlaceholder="Search by teacher, leave type, status, or reason..."
      emptyMessage="No leave applications found"
      emptyDescription="Create a leave request to get started"
      enableSearch={true}
      enableStatusFilter={false}
      isLoading={isLoading}
    />
  );
};

export default LeaveList;
