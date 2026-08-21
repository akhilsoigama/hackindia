import { useEffect } from "react";
import { AssignmentListview } from "../../../section/Student-management/Assignment-master/view";

export default function AssignmentListPage() {
  useEffect(() => {
    document.title = `RuralSpark: All Assignment List"`;
  }, []);

  return <AssignmentListview />;
}