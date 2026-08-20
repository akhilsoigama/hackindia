import { useEffect, useState } from "react";
import { ILecture } from "../../../types/material";
import { useGetLecture } from "../../../action/material";
import { useParams } from "../../../hooks/useParams";
import { MaterialEditView } from "../../../section/Student-management/Materials-management/view";

// Metadata
const metadata = { title: `Materials Edit | Dashboard - EduHub` };

export default function Page() {
  const { id } = useParams();
  const lectureId = Number(id);

  const { lecture} = useGetLecture(lectureId);

  const [data, setData] = useState<ILecture | undefined>(undefined);

  useEffect(() => {
    if (lecture) {
      setData(lecture);
    }
  }, [lecture]);


  return (
    <>
      <head>
        <title>{metadata.title}</title>
      </head>

      <MaterialEditView
        currentData={data}
      
      />
    </>
  );
}
