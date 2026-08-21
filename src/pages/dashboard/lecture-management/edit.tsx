import { useState ,useEffect } from "react";
import { useParams } from "../../../hooks/useParams";
import { useGetLecture } from "../../../action/material";
import { ILecture } from "../../../types/material";
import { MaterialEditView } from "../../../section/Student-management/Materials-management/view";
import { Translated } from "../../../components/common/translator/translator";


export default function MaterialsEditPage(){
    const { id } = useParams();
    const lectureId = Number(id);

    const {lecture, isLoading,lectureError } = useGetLecture(lectureId);
    const [data,setData] = useState<ILecture | undefined>();
    console.log(lecture)
    useEffect(() => {
        
      setData(lecture ?? undefined);
    },[lecture, isLoading, lectureError]);

    if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2"><Translated text="Loading lecture data..."/></span>
      </div>
    );
  }

  if (lectureError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <Translated text={`Error loading lecture: ${lectureError.message}`}/>
        </div>
      </div>
    );
  }

  if(!isLoading && !lecture){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="lecture not found"/>
        </div>
      </div>
    );
  }

  return <MaterialEditView currentData={data} />;

}