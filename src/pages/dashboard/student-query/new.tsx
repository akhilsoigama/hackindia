import { useEffect } from 'react';
import { StudentQueryAskView } from '../../../section/Student-upload/Queries/view';

export default function StudentQueryCreatePage() {
  useEffect(() => {
    document.title = 'RuralSpark: Ask Query';
  }, []);

  return <StudentQueryAskView />;
}
