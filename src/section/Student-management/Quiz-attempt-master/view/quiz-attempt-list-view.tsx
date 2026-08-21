import { useCallback, useMemo, useState } from "react";
import { mutate } from "swr";
import { useRouter } from "../../../../hooks/useRouter";
import { useUser } from "../../../../atoms/userAtom";
import {
  deleteQuizAttempt,
  useGetQuizAttempts,
} from "../../../../action/quizAttempt";
import { endpoints } from "../../../../utils/axios";
import type { QuizAttemptDetails } from "../../../../types/quizApi";
import QuizAttemptList from "../quiz-attempt-list.tsx";

export default function QuizAttemptListView() {
  const router = useRouter();
  const { user, isStudent } = useUser();
  const currentStudentId = Number(
    (user?.data as { studentId?: number; id?: number } | undefined)?.studentId ??
      (user?.data as { studentId?: number; id?: number } | undefined)?.id ??
      user?.id ??
      0,
  );

  const listQuery = isStudent && currentStudentId > 0 ? { studentId: currentStudentId } : undefined;
  const { quizAttempts, quizAttemptsLoading, quizAttemptsError } = useGetQuizAttempts(listQuery);
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleAttempts = useMemo(() => {
    if (isStudent && currentStudentId <= 0) {
      return [];
    }

    return quizAttempts;
  }, [currentStudentId, isStudent, quizAttempts]);

  const isLoading = useMemo(
    () => quizAttemptsLoading || quizAttemptsError !== undefined,
    [quizAttemptsLoading, quizAttemptsError],
  );

  const handleCreate = useCallback(() => {
    router.push("/dashboard/student-upload/quiz-attempt/new");
  }, [router]);

  const handleEdit = useCallback(
    (attempt: QuizAttemptDetails) => {
      router.push(`/dashboard/student-upload/quiz-attempt/${attempt.id}/edit`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (isDeleting) {
        return;
      }

      setIsDeleting(true);

      try {
        const deleted = await deleteQuizAttempt(id);
        if (!deleted) {
          setIsDeleting(false);
          return;
        }

        mutate(
          endpoints.quizAttempt.getAll,
          (currentData: { data: QuizAttemptDetails[] } | undefined) => {
            if (!currentData?.data) {
              return { data: [] };
            }

            return {
              data: currentData.data.filter((attempt) => attempt.id !== id),
            };
          },
          false,
        );

        mutate(endpoints.quizAttempt.getAll);
      } catch (error) {
        console.error("Failed to delete quiz attempt", error);
        mutate(endpoints.quizAttempt.getAll);
      } finally {
        setIsDeleting(false);
      }
    },
    [isDeleting],
  );

  return (
    <QuizAttemptList
      attempts={visibleAttempts}
      isLoading={isLoading}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
