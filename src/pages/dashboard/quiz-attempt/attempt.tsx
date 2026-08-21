import { useEffect } from "react";
import QuizAttemptNewEditForm from "../../../section/Student-management/Quiz-attempt-master/quiz-attempt-new-edit-form";
import { useParams } from "../../../hooks/useParams";

export default function AttemptQuizPage() {
  const { quizId } = useParams();
  const parsedQuizId = Number(quizId);

  useEffect(() => {
    document.title = "RuralSpark: Attempt Quiz";
  }, []);

  return <QuizAttemptNewEditForm preselectedQuizId={Number.isNaN(parsedQuizId) ? undefined : parsedQuizId} />;
}
