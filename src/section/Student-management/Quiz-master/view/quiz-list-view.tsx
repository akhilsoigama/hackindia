import { useCallback, useMemo, useState } from "react";
import { mutate } from "swr";
import { useRouter } from "../../../../hooks/useRouter";
import { useDeleteQuiz as deleteQuizMutation, useGetQuizzes } from "../../../../action/quiz";
import { endpoints } from "../../../../utils/axios";
import type { QuizDetails } from "../../../../types/quizApi";
import QuizList from "../quiz-list.tsx";

export default function QuizListView() {
  const router = useRouter();
  const { quizzes, quizzesLoading, quizzesError } = useGetQuizzes();
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoading = useMemo(
    () => quizzesLoading || quizzesError !== undefined,
    [quizzesLoading, quizzesError],
  );

  const handleCreateQuiz = useCallback(() => {
    router.push("/dashboard/faculty-management/quiz/new");
  }, [router]);

  const handleViewQuiz = useCallback(
    (quiz: QuizDetails) => {
      router.push(`/dashboard/faculty-management/quiz/${quiz.id}/view`);
    },
    [router],
  );

  const handleEditQuiz = useCallback(
    (quiz: QuizDetails) => {
      router.push(`/dashboard/faculty-management/quiz/${quiz.id}/edit`);
    },
    [router],
  );

  const handleDeleteQuiz = useCallback(
    async (id: number) => {
      if (isDeleting) {
        return;
      }

      setIsDeleting(true);

    try {
      const deleted = await deleteQuizMutation(id);
      if (!deleted) {
        setIsDeleting(false);
        return;
      }

      mutate(
        endpoints.quiz.getAll,
        (currentData: { data: QuizDetails[] } | undefined) => {
          if (!currentData?.data) {
            return { data: [] };
          }

          return {
            data: currentData.data.filter((quiz) => quiz.id !== id),
          };
        },
        false,
      );

      mutate(endpoints.quiz.getAll);
      setIsDeleting(false);
    } catch (error) {
      console.error("Failed to delete quiz", error);
      mutate(endpoints.quiz.getAll);
      setIsDeleting(false);
    }
  }, [isDeleting]);

  return (
    <>
      <QuizList
        quizzes={quizzes}
        isLoading={isLoading}
        onCreate={handleCreateQuiz}
        onView={handleViewQuiz}
        onEdit={handleEditQuiz}
        onDelete={handleDeleteQuiz}
      />
    </>
  );
}
