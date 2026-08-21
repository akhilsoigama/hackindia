import { useEffect } from "react";
import FaculttyCreateView from "../../../section/Institute-management/faculty/view/faculty-create-view";

export default function FacultyCreatePage() {
  useEffect(() => {
    document.title = "Dashboard: Create New Faculty | Institute Management System";
  }, []);

  return <FaculttyCreateView />;
}