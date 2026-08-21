import { useEffect } from "react";
import { QuizAttemptView } from "../../../section/Student-management/Quiz-attempt-master/view";

export default function ViewQuizAttemptPage() {
  useEffect(() => {
    document.title = "Dashboard: Quiz Attempt View | Institute Management System";
  }, []);

  return <QuizAttemptView />;
}
