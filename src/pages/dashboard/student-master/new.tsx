import { useEffect } from "react";
import StudentCreateView from "../../../section/Institute-management/students/view/student-create-view";

export default function StudentCreatePage() {
  useEffect(() => {
    document.title = "RuralSpark: Create New Student";
  }, []);

  return <StudentCreateView />;
}