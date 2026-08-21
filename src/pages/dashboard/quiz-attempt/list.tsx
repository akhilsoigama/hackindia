import { useEffect } from "react";
import { QuizAttemptListView } from "../../../section/Student-management/Quiz-attempt-master/view";

export default function QuizAttemptListPage() {
  useEffect(() => {
    document.title = "RuralSpark: Quiz Attempt List";
  }, []);

  return <QuizAttemptListView />;
}
