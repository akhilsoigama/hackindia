import { IDepartment } from "../../../../types/department";
import DepartmentNewEditForm from "../department-new-edit-form";

type DepartmentNewEditFormProps = {
  currentData?: IDepartment | null;
};

export default function DepartmentEditView({ currentData }: DepartmentNewEditFormProps) {
  return <DepartmentNewEditForm currentData={currentData} />;
}