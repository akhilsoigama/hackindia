import type { QuizDetails } from "../../../../types/quizApi";
import QuizNewEditForm from "../quiz-new-edit-form";

type QuizEditViewProps = {
  currentData?: QuizDetails | null;
};

export default function QuizEditView({ currentData }: QuizEditViewProps) {
  return <QuizNewEditForm currentData={currentData} />;
}
