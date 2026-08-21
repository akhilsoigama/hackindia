import { useEffect } from 'react';
import { DepartmentListView } from "../../../section/Institute-management/department-master/view";

export default function ListDepartmentPage() {
  useEffect(() => {
    document.title = "RuralSpark: All Department List";
  }, []);

  return <DepartmentListView />;
}