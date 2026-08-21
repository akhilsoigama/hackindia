import { useEffect } from "react";
import { QuizCreateView } from "../../../section/Student-management/Quiz-master/view";

export default function CreateQuizPage() {
  useEffect(() => {
    document.title = "RuralSpark: Create Quiz ";
  }, []);

  return <QuizCreateView />;
}
