import { useEffect } from 'react';
import { UnansweredQueriesView } from '../../../section/Student-management/Query-management/view';

export default function TeacherUnansweredQueriesPage() {
  useEffect(() => {
    document.title = 'RuralSpark: Pending Student Queries';
  }, []);

  return <UnansweredQueriesView />;
}
