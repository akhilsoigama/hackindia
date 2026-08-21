import { useEffect, useState } from "react";
import { useAssignment } from "../../../action/assignment";
import { useParams } from "../../../hooks/useParams";
import { IAssignmentItem } from "../../../types/assignment";
import { AssignmentEditView } from "../../../section/Student-management/Assignment-master/view";
import { Translated } from "../../../components/common/translator/translator";

export default function AssignmentEditPage(){
    const { id } = useParams();
    const assignmentId = Number(id);

    const {assignment, isLoading, assignmentError} = useAssignment(assignmentId);
    const [data,setData] = useState<IAssignmentItem | null>(null);

    useEffect(() => {
        
        setData(assignment || null);
    },[assignment, isLoading, assignmentError]);

    if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2"><Translated text="Loading assignment data..."/></span>
      </div>
    );
  }

  if (assignmentError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <Translated text={`Error loading assignment: ${assignmentError.message}`}/>
        </div>
      </div>
    );
  }

  if(!isLoading && !assignment){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="Assignment not found"/>
        </div>
      </div>
    );
  }

  return <AssignmentEditView currentData={data} />;

}