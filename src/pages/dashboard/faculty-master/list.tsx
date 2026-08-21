import { useEffect } from "react";
import { FacultyListView } from "../../../section/Institute-management/faculty/view";

export default function FacultyListPage() {
  useEffect(() => {
    document.title = "RuralSpark: All Faculty List";
  }, []);

  return <FacultyListView />;
}