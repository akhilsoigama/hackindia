import { useEffect } from "react";
import { QuizView } from "../../../section/Student-management/Quiz-master/view";

export default function ViewQuizPage() {
  useEffect(() => {
    document.title = "RuralSpark: Quiz View ";
  }, []);

  return <QuizView />;
}
