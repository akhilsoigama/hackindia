import { useEffect } from "react";
import { LeaveCreateView } from "../../../section/Leave-management/Leave-master/view";

export default function LeaveCreatePage() {
  useEffect(() => {
    document.title = "RuralSpark: Create Leave Application | Institute Management System";
  }, []);

  return <LeaveCreateView />;
}
