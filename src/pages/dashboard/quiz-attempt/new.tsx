import { useEffect } from "react";
import { QuizAttemptCreateView } from "../../../section/Student-management/Quiz-attempt-master/view";

export default function CreateQuizAttemptPage() {
  useEffect(() => {
    document.title = "RuralSpark: Create Quiz Attempt";
  }, []);

  return <QuizAttemptCreateView />;
}
