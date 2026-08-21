import { useEffect } from 'react';
import { AnsweredQueriesView } from '../../../section/Student-management/Query-management/view';

export default function TeacherAnsweredQueriesPage() {
  useEffect(() => {
    document.title = 'RuralSpark: Answered Student Queries';
  }, []);

  return <AnsweredQueriesView />;
}
