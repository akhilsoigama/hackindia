import { useEffect } from 'react';
import { AssignmentUploadListView } from '../../../section/Student-upload/Assignment-upload/view';

export default function AssignmentUploadListPage() {
  useEffect(() => {
    document.title = 'RuralSpark: Assignment Uploads';
  }, []);

  return <AssignmentUploadListView />;
}
