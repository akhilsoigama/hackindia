import { useEffect, useState } from 'react';
import { useParams } from '../../../hooks/useParams';
import { useAssignmentUploads } from '../../../action/assignmentUpload';
import { IAssignmentUploadListItem } from '../../../types/assignmentUpload';
import { AssignmentUploadEditView } from '../../../section/Student-upload/Assignment-upload/view';
import { Translated } from '../../../components/common/translator/translator';

export default function AssignmentUploadEditPage() {
  const { id } = useParams();
  const { submissions, submissionsLoading } = useAssignmentUploads();
  const [data, setData] = useState<IAssignmentUploadListItem | null>(null);

  useEffect(() => {
    if (id && submissions.length > 0) {
      const submission = submissions.find((s) => s.id === id);
      setData(submission || null);
    }
  }, [id, submissions]);

  useEffect(() => {
    document.title = 'RuralSpark: Edit Assignment Submission';
  }, []);

  if (submissionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2">
          <Translated text="Loading submission data..." />
        </span>
      </div>
    );
  }

  if (!submissionsLoading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <Translated text="Submission not found" />
        </div>
      </div>
    );
  }

  return <AssignmentUploadEditView currentData={data} />;
}
