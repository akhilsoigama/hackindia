import { useEffect } from "react";
import { useParams } from "../../../hooks/useParams";
import { useGetFacultyLeaves } from "../../../action/facultyLeave";
import { LeaveEditView } from "../../../section/Leave-management/Leave-master/view";
import { Translated } from "../../../components/common/translator/translator";

export default function LeaveEditPage() {
  const { id } = useParams();
  const leaveId = Number(id);

  const { leaves, leavesLoading, leavesError } = useGetFacultyLeaves();
  const leave = Number.isNaN(leaveId) ? null : leaves.find((item) => item.id === leaveId) || null;

  useEffect(() => {
    document.title = " RuralSpark : Edit Leave Application | Institute Management System";
  }, []);

  if (leavesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="ml-2"><Translated text="Loading leave data..." /></span>
      </div>
    );
  }

  if (leavesError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">
          <Translated text="Error loading leave data" />
        </div>
      </div>
    );
  }

  if (!leavesLoading && !leave) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">
          <Translated text="Leave request not found" />
        </div>
      </div>
    );
  }

  return <LeaveEditView currentData={leave} />;
}
