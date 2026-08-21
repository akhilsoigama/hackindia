import { useEffect, useState } from "react";
import { useParams } from "../../../hooks/useParams";
import { useGetQuizById } from "../../../action/quiz";
import type { QuizDetails } from "../../../types/quizApi";
import { QuizEditView } from "../../../section/Student-management/Quiz-master/view";
import { Translated } from "../../../components/common/translator/translator";

export default function EditQuizPage() {
  const { id } = useParams();
  const quizId = Number(id);

  const { quiz, quizLoading, quizError } = useGetQuizById(Number.isNaN(quizId) ? null : quizId);
  const [data, setData] = useState<QuizDetails | null>(null);

  useEffect(() => {
    document.title = "Dashboard: Edit Quiz | Institute Management System";
  }, []);

  useEffect(() => {
    setData(quiz || null);
  }, [quiz, quizError, quizLoading]);

  if (quizLoading) {
    return <div className="flex h-64 items-center justify-center"><Translated text="Loading quiz data..."/></div>;
  }

  if (quizError) {
    return <div className="flex h-64 items-center justify-center text-red-500"><Translated text="Error loading quiz"/></div>;
  }

  if (!quiz) {
    return <div className="flex h-64 items-center justify-center"><Translated text="Quiz not found"/></div>;
  }

  return <QuizEditView currentData={data} />;
}
