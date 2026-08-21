import { useEffect, useState } from "react";
import { useParams } from "../../../hooks/useParams";
import { useDepartment } from "../../../action/department";
import { IDepartment } from "../../../types/department";
import { DepartmentEditView } from "../../../section/Institute-management/department-master/view";
import { Translated } from "../../../components/common/translator/translator";

export default function Page() {
  const { id } = useParams();
  const departmentId = Number(id);

  const { department, isLoading, departmentError } = useDepartment(departmentId);
  const [data, setData] = useState<IDepartment | null>(null); // Initialize as null

  useEffect(() => {
    document.title = "Dashboard: Edit Department | Institute Management System";
  }, []);

  useEffect(() => {
    setData(department || null);
  }, [department, isLoading, departmentError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2"><Translated text="Loading department data..."/></span>
      </div>
    );
  }

  if (departmentError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <Translated text={`Error loading department: ${departmentError.message}`}/>
        </div>
      </div>
    );
  }

  if (!department && !isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="Department not found"/>
        </div>
      </div>
    );
  }

  return <DepartmentEditView currentData={data} />;
}