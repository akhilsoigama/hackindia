import type { QuizAttemptDetails } from "../../../../types/quizApi";
import QuizAttemptNewEditForm from "../quiz-attempt-new-edit-form";

type QuizAttemptEditViewProps = {
  currentData?: QuizAttemptDetails | null;
};

export default function QuizAttemptEditView({ currentData }: QuizAttemptEditViewProps) {
  return <QuizAttemptNewEditForm currentData={currentData} />;
}
