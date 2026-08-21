import { useEffect } from "react";
import { QuizListView } from "../../../section/Student-management/Quiz-master/view";

export default function QuizListPage() {
  useEffect(() => {
    document.title = "RuralSpark: Quiz List";
  }, []);

  return <QuizListView />;
}
