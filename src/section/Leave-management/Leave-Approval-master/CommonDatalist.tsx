import { memo, useMemo } from "react";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";
import CommonDataList from "../../../components/common/commanDataList";
import { type FacultyLeaveResponse } from "../../../action/facultyLeave";

type ApprovalRow = {
  id: number;
  teacherName: string;
  teacherId: string;
  departmentName: string;
  leaveType: string;
  period: string;
  status: string;
  statusKey: "pending" | "approved" | "rejected";
  monthLeaves: number;
  yearLeaves: number;
  leaveCountSummary: string;
  reason: string;
  submittedDate: string;
  source: FacultyLeaveResponse;
};

type CommonDatalistProps = {
  leaves: FacultyLeaveResponse[];
  isLoading?: boolean;
  isDark?: boolean;
  processingId?: number | null;
  onApprove: (leave: FacultyLeaveResponse) => void;
  onReject: (leave: FacultyLeaveResponse) => void;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const getTeacherKey = (leave: FacultyLeaveResponse) =>
  leave.teacherId || leave.faculty?.facultyId || `faculty_${leave.facultyId}`;

const getReferenceDate = (leave: FacultyLeaveResponse) =>
  leave.startDate || leave.createdAt || leave.submittedDate || "";

const CommonDatalist = ({
  leaves,
  isLoading = false,
  processingId = null,
  onApprove,
  onReject,
}: CommonDatalistProps) => {
  const rows = useMemo<ApprovalRow[]>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyCountByTeacher: Record<string, number> = {};
    const yearlyCountByTeacher: Record<string, number> = {};

    leaves.forEach((leave) => {
      const teacherKey = getTeacherKey(leave);
      const refDate = new Date(getReferenceDate(leave));

      if (Number.isNaN(refDate.getTime())) return;

      if (refDate.getFullYear() === currentYear) {
        yearlyCountByTeacher[teacherKey] =
          (yearlyCountByTeacher[teacherKey] || 0) + 1;

        if (refDate.getMonth() === currentMonth) {
          monthlyCountByTeacher[teacherKey] =
            (monthlyCountByTeacher[teacherKey] || 0) + 1;
        }
      }
    });

    return leaves.map((leave) => {
      const teacherName =
        leave.teacherName ||
        leave.faculty?.facultyName ||
        `Faculty #${leave.facultyId}`;
      const teacherId = leave.teacherId || leave.faculty?.facultyId || "-";
      const departmentName =
        leave.department?.departmentName ||
        leave.faculty?.department?.departmentName ||
        "-";
      const teacherKey = getTeacherKey(leave);

      return {
        id: leave.id,
        teacherName,
        teacherId,
        departmentName,
        leaveType: `${toLabel(leave.leaveType)} Leave`,
        period: `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
        status: toLabel(leave.status),
        statusKey: leave.status,
        monthLeaves: monthlyCountByTeacher[teacherKey] || 0,
        yearLeaves: yearlyCountByTeacher[teacherKey] || 0,
        leaveCountSummary: `${monthlyCountByTeacher[teacherKey] || 0}/${yearlyCountByTeacher[teacherKey] || 0}`,
        reason: leave.reason || "-",
        submittedDate: leave.submittedDate || leave.createdAt || "",
        source: leave,
      };
    });
  }, [leaves]);

  const columns = useMemo(() => {
    return [
      {
        header: "Teacher",
        accessor: "teacherName" as const,
        sortable: true,
        width: "20%",
      },
      {
        header: "Department",
        accessor: "departmentName" as const,
        sortable: true,
        width: "15%",
      },
      {
        header: "Leave Type",
        accessor: "leaveType" as const,
        sortable: true,
        width: "15%",
      },
      {
        header: "Period",
        accessor: "period" as const,
        width: "20%",
      },
      {
        header: "Status",
        accessor: "status" as const,
        sortable: true,
        width: "15%",
        render: (item: ApprovalRow) => {
          const statusStyles: Record<ApprovalRow["statusKey"], string> = {
            pending: "bg-amber-100 text-amber-700 border border-amber-200",
            approved: "bg-green-100 text-green-700 border border-green-200",
            rejected: "bg-red-100 text-red-700 border border-red-200",
          };

          return (
            <span
              className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[item.statusKey]}`}
            >
              {item.status}
            </span>
          );
        },
      },
      {
        header: "Leaves (M/Y)",
        accessor: "leaveCountSummary" as const,
        sortable: true,
        width: "15%",
      },
    ];
  }, []);

  const viewModalFields = useMemo(
    () => [
      {
        label: "Teacher",
        key: "teacherName" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Teacher ID",
        key: "teacherId" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Department",
        key: "departmentName" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Leave Type",
        key: "leaveType" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Period",
        key: "period" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Status",
        key: "status" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Leaves This Month",
        key: "monthLeaves" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Leaves This Year",
        key: "yearLeaves" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Submitted Date",
        key: "submittedDate" as const,
        type: "text" as const,
        disabled: true,
      },
      {
        label: "Reason",
        key: "reason" as const,
        type: "textarea" as const,
        disabled: true,
      },
    ],
    [],
  );

  return (
    <CommonDataList<ApprovalRow>
      data={rows}
      title="Leave Approval Management"
      subtitle="Track pending, approved, and rejected leave records with monthly/yearly teacher totals"
      columns={columns}
      createButtonText="Refresh"
      emptyMessage="No leave requests found"
      emptyDescription="No leave records are available right now"
      enableSearch={true}
      enableStatusFilter={false}
      isLoading={isLoading}
      viewModalFields={viewModalFields}
      getActionMenuItems={(item, handlers) => {
        const isPending = item.statusKey === "pending";

        return [
          {
            label: "Details",
            onClick: () => handlers.view(),
            icon: <Visibility fontSize="small" />,
            variant: "default",
          },
          {
            label: "Approve",
            onClick: () => onApprove(item.source),
            icon: <CheckCircle fontSize="small" />,
            variant: "success",
            disabled: !isPending || processingId === item.id,
          },
          {
            label: "Reject",
            onClick: () => onReject(item.source),
            icon: <Cancel fontSize="small" />,
            variant: "danger",
            disabled: !isPending || processingId === item.id,
          },
        ];
      }}
    />
  );
};

export default memo(CommonDatalist);
