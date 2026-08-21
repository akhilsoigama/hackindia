import { useEffect } from 'react';
import { AllQueriesView } from '../../../section/Student-management/Query-management/view';

export default function TeacherAllQueriesPage() {
  useEffect(() => {
    document.title = 'RuralSpark: Student Queries';
  }, []);

  return <AllQueriesView />;
}
