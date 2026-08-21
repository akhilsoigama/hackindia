import { FacultyLeaveResponse } from "../../../../action/facultyLeave";
import LeaveCreate from "../leave-create";

type LeaveEditViewProps = {
  currentData?: FacultyLeaveResponse | null;
};

export default function LeaveEditView({ currentData }: LeaveEditViewProps) {
  return <LeaveCreate currentData={currentData} />;
}
