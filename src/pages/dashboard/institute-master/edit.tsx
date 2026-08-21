import { useState ,useEffect } from "react";
import { useParams } from "../../../hooks/useParams";
import { IInstitute } from "../../../types/Institute";
import InstituteEditView from "../../../section/nabha-management/institute-management/view/institute-edit-view";
import { useInstitute } from "../../../action/institute";
import { Translated } from "../../../components/common/translator/translator";


export default function InstituteEditPage(){
    const { id } = useParams();
    const instituteid = Number(id);

    const {institute,instituteLoading , instituteError} = useInstitute(instituteid);
    const [data,setData] = useState<IInstitute | null>(null);

    useEffect(() => {
        
        setData(institute || null);
    },[institute, instituteLoading, instituteError]);

    if (instituteLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2"><Translated text="Loading institute data..."/></span>
      </div>
    );
  }

  if (instituteError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <Translated text={`Error loading Institute: ${instituteError.message}`}/>
        </div>
      </div>
    );
  }

  if(!instituteLoading && !institute){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="Institute not found"/>
        </div>
      </div>
    );
  }

  return <InstituteEditView currentData={data} />;

}