import { useParams } from "../../../hooks/useParams";
import { useGetStudent } from "../../../action/student";
import { StudentEditView } from "../../../section/Institute-management/students/view";
import { Translated } from "../../../components/common/translator/translator";
import { useUser } from "../../../atoms/userAtom";


export default function StudentEditPage(){
    const { id } = useParams();
    const studentId = Number(id);
  const { user } = useUser();
  const instituteId = user?.instituteId ?? user?.data?.instituteId ?? undefined;

  const {student, studentLoading, studentError} = useGetStudent(studentId, instituteId);

    if (!Number.isFinite(studentId) || studentId <= 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">
            <Translated text="Invalid student ID" />
          </div>
        </div>
      );
    }

    if (studentLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2"><Translated text="Loading Student data..."/></span>
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <Translated text={`Error loading Student: ${studentError.message}`}/>
        </div>
      </div>
    );
  }

  if(!studentLoading && !student){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="Student not found"/>
        </div>
      </div>
    );
  }

  return <StudentEditView currentData={student} />;

}