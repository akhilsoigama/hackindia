import { useState, useEffect } from "react";
import { useFaculty } from "../../../action/faculty";
import { useParams } from "../../../hooks/useParams";
import { IfacultyItem } from "../../../types/Faculty";
import { FacultyEditView } from "../../../section/Institute-management/faculty/view";
import { Translated } from "../../../components/common/translator/translator";
import { useUser } from "../../../atoms/userAtom";


export default function FacultyEditPage(){
    const { id } = useParams();
    const facultyid = Number(id);
    const { user } = useUser();
    const instituteId = user?.instituteId ?? user?.data?.instituteId ?? undefined;

    const {faculty, isLoading, facultyError} = useFaculty(facultyid, instituteId);
    const [data,setData] = useState<IfacultyItem | null>(null);

    useEffect(() => {
        
        setData(faculty || null);
    },[faculty, isLoading, facultyError]);

    if (!Number.isFinite(facultyid) || facultyid <= 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">
            <Translated text="Invalid faculty ID" />
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <span className="ml-2"><Translated text="Loading faculty data..."/></span>
        </div>
      );
    }

  if (facultyError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <Translated text={`Error loading Faculty: ${facultyError.message}`}/>
        </div>
      </div>
    );
  }

  if(!isLoading && !faculty){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="Faculty not found"/>
        </div>
      </div>
    );
  }

  return <FacultyEditView currentData={data} />;

}