import { useEffect } from 'react';
import { DepartmentCreateView } from "../../../section/Institute-management/department-master/view";

export default function CreateDepartmentPage() {
  useEffect(() => {
    document.title = "Dashboard: Create New Department | Institute Management System";
  }, []);

  return <DepartmentCreateView />;
}