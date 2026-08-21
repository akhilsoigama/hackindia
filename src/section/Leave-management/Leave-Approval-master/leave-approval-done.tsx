import { useState } from 'react';
import { useTheme } from '@/theme/AppThemeProvider';import {
  approveFacultyLeave,
  rejectFacultyLeave,
  useFacultyLeaveMutation,
  useGetFacultyLeaves,
  type FacultyLeaveResponse,
} from '../../../action/facultyLeave';
import CommonDatalist from './CommonDatalist';

const LeaveApprovalDone = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const { leaves: apiLeaves, leavesLoading } = useGetFacultyLeaves();
  const { refreshLeaves } = useFacultyLeaveMutation();
  const [processingLeaveId, setProcessingLeaveId] = useState<number | null>(null);

  const handleApprove = async (leave: FacultyLeaveResponse) => {
    setProcessingLeaveId(leave.id);
    try {
      const result = await approveFacultyLeave(leave.id);
      if (result) {
        await refreshLeaves();
      }
    } finally {
      setProcessingLeaveId(null);
    }
  };

  const handleReject = async (leave: FacultyLeaveResponse) => {
    setProcessingLeaveId(leave.id);
    try {
      const result = await rejectFacultyLeave(leave.id);
      if (result) {
        await refreshLeaves();
      }
    } finally {
      setProcessingLeaveId(null);
    }
  };

  return (
    <CommonDatalist
      leaves={apiLeaves}
      isLoading={leavesLoading}
      isDark={isDark}
      processingId={processingLeaveId}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};

export default LeaveApprovalDone;