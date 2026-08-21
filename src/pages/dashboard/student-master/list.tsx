import { useEffect } from "react";
import { StudentListView } from "../../../section/Institute-management/students/view";

export default function StudentListPage() {
  useEffect(() => {
    document.title = `RuralSpark: All Student List`;
  }, []);

  return <StudentListView />;
}