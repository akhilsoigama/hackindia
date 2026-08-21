import { useEffect } from "react";
import { LeaveListView } from "../../../section/Leave-management/Leave-master/view";

export default function LeaveListPage() {
  useEffect(() => {
    document.title = "RuralSpark: Leave Applications List | Institute Management System";
  }, []);

  return <LeaveListView />;
}
