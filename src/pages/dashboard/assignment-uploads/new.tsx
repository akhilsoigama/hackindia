import { useEffect } from 'react';
import { AssignmentUploadCreateView } from '../../../section/Student-upload/Assignment-upload/view';

export default function AssignmentUploadNewPage() {
  useEffect(() => {
    document.title = 'RuralSpark: Submit Assignment';
  }, []);

  return <AssignmentUploadCreateView />;
}
