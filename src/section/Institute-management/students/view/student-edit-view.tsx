import { IStudent } from "../../../../types/student";
import StudentNewEditForm from "../student-new-edit-form";

type StudentEditViewProps = {
  currentData?: IStudent | null;
};

export default function StudentEditView({ currentData }: StudentEditViewProps) {
  return <StudentNewEditForm currentData={currentData} />;
}