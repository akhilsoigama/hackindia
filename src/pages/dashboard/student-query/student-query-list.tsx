import { useEffect } from 'react';
import { StudentQueryListView } from '../../../section/Student-upload/Queries/view';

export default function StudentQueryListPage() {
  useEffect(() => {
    document.title = 'RuralSpark: My Queries';
  }, []);

  return <StudentQueryListView />;
}
