import { IfacultyItem } from "../../../../types/Faculty";
import FacultyNewCreateForm from "../faculty-new-edit-form";

type FacultyEditViewProps = {
  currentData?: IfacultyItem | null;
};

export default function FacultyEditView({ currentData }: FacultyEditViewProps) {
  return <FacultyNewCreateForm currentData={currentData} />;
}