import { useEffect, useState } from "react";
import { useParams } from "../../../hooks/useParams";
import { useGetQuizAttemptById } from "../../../action/quizAttempt";
import type { QuizAttemptDetails } from "../../../types/quizApi";
import { QuizAttemptEditView } from "../../../section/Student-management/Quiz-attempt-master/view";

export default function EditQuizAttemptPage() {
  const { id } = useParams();
  const attemptId = Number(id);

  const { quizAttempt, quizAttemptLoading, quizAttemptError } = useGetQuizAttemptById(
    Number.isNaN(attemptId) ? null : attemptId,
  );
  const [data, setData] = useState<QuizAttemptDetails | null>(null);

  useEffect(() => {
    document.title = "Dashboard: Edit Quiz Attempt | Institute Management System";
  }, []);

  useEffect(() => {
    setData(quizAttempt || null);
  }, [quizAttempt, quizAttemptError, quizAttemptLoading]);

  if (quizAttemptLoading) {
    return <div className="flex h-64 items-center justify-center">Loading quiz attempt data...</div>;
  }

  if (quizAttemptError) {
    return <div className="flex h-64 items-center justify-center text-red-500">Error loading quiz attempt</div>;
  }

  if (!quizAttempt) {
    return <div className="flex h-64 items-center justify-center">Quiz attempt not found</div>;
  }

  return <QuizAttemptEditView currentData={data} />;
}
