import { useEffect, useMemo } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useTheme } from '@/theme/AppThemeProvider';
import { useRouter } from "../../../hooks/useRouter";
import { useUser } from "../../../atoms/userAtom";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import RHFDropDown from "../../../components/hook-form/RHFDropDown";
import RHFCheckbox from "../../../components/hook-form/RHFCheckbox";
import RHFDropzoneField from "../../../components/hook-form/RHFImageUpload";
import { ParticleButton } from "../../../components/ui/particle-button";
import { Button } from "../../../components/ui/button";
import { useDepartments } from "../../../action/department";
import QuestionCard from "./question-card";
import {
  type CreateQuizInput,
  createQuizSchema,
} from "./schemas/quiz.schema";
import {
  useCreateQuiz as createQuizMutation,
  useGetQuizById,
  useQuizMutation,
  useUpdateQuiz as updateQuizMutation,
} from "../../../action/quiz";
import type {
  CreateQuizFormDto,
  CreateQuizDto,
  QuizDetails,
  UpdateQuizDto,
} from "../../../types/quizApi";
import RHFContentFormField from "../../../components/hook-form/RHFContent";
import { Translated } from "../../../components/common/translator/translator";

type QuizFormData = CreateQuizInput;

type QuizNewEditFormProps = {
  currentData?: QuizDetails | null;
  onSuccess?: () => void;
  quizId?: number;
};

const initialQuestion: QuizFormData["questions"][number] = {
  questionText: "",
  questionType: "mcq",
  marks: 1,
  options: [
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ],
};

export default function QuizNewEditForm({
  currentData,
  onSuccess,
  quizId,
}: QuizNewEditFormProps) {
  const isEdit = !!currentData;
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();
  const { user } = useUser();
  const { departments } = useDepartments();
  const { refreshQuizzes } = useQuizMutation();

  const shouldFetchId = currentData ? null : (quizId ?? null);
  const { quiz, quizMutate } = useGetQuizById(shouldFetchId);

  const sourceData = currentData ?? quiz ?? null;

  const instituteId = Number(
    user?.data?.instituteId ?? sourceData?.instituteId ?? 0,
  );
  const facultyId = Number(user?.data?.facultyId ?? sourceData?.facultyId ?? 0);

  const departmentOptions = useMemo(
    () =>
      (departments || []).map((department) => ({
        value: department.id,
        label: department.departmentName,
      })),
    [departments],
  );

  const defaultValues: QuizFormData = useMemo(
    () => ({
      quizTitle: sourceData?.quizTitle ?? "",
      quizDescription: sourceData?.quizDescription ?? "",
      quizBanner: sourceData?.quizBanner ?? "",
      subject: sourceData?.subject ?? "",
      std: sourceData?.std ?? "",
      departmentId: Number(
        sourceData?.departmentId ?? departmentOptions[0]?.value ?? 1,
      ),
      dueDate: sourceData?.dueDate
        ? String(sourceData.dueDate).split("T")[0]
        : "",
      marks: Number(sourceData?.marks ?? 1),
      attemptLimit: Number(sourceData?.attemptLimit ?? 1),
      isActive: sourceData?.isActive ?? true,
      questions: sourceData?.questions?.length
        ? sourceData.questions.map((question) => ({
          questionText: question.questionText,
          questionType: question.questionType,
          marks: Number(question.marks),
          options: question.options?.length
            ? question.options.map((option, optionIndex) => ({
              optionText: option.optionText,
              isCorrect:
                option.isCorrect === true ||
                (question.correctOptionId !== undefined &&
                  (option.id === question.correctOptionId ||
                    optionIndex + 1 === question.correctOptionId)),
            }))
            : initialQuestion.options,
        }))
        : [initialQuestion],
    }),
    [sourceData, instituteId, facultyId, departmentOptions],
  );

  const methods = useForm<QuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onAddQuestion = () => {
    append(initialQuestion);
  };

  const onRemoveQuestion = (index: number) => {
    if (fields.length <= 1) {
      toast.error("Quiz must have at least one question");
      return;
    }

    remove(index);
  };

  const onTypeChange = (
    questionIndex: number,
    questionType: "mcq" | "true/false",
  ) => {
    if (questionType === "true/false") {
      setValue(`questions.${questionIndex}.options`, [
        { optionText: "True", isCorrect: false },
        { optionText: "False", isCorrect: false },
      ]);
    }

    if (questionType === "mcq") {
      const currentOptions =
        getValues(`questions.${questionIndex}.options`) || [];
      if (currentOptions.length < 2) {
        setValue(`questions.${questionIndex}.options`, initialQuestion.options);
      }
    }

    setValue(`questions.${questionIndex}.questionType`, questionType);
  };

  const onAddOption = (questionIndex: number) => {
    const options = getValues(`questions.${questionIndex}.options`) || [];
    setValue(`questions.${questionIndex}.options`, [
      ...options,
      { optionText: "", isCorrect: false },
    ]);
  };

  const onRemoveOption = (questionIndex: number, optionIndex: number) => {
    const options = getValues(`questions.${questionIndex}.options`) || [];
    if (options.length <= 2) {
      toast.error("At least 2 options are required");
      return;
    }

    setValue(
      `questions.${questionIndex}.options`,
      options.filter((_, index) => index !== optionIndex),
    );
  };

  const onSetCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const options = getValues(`questions.${questionIndex}.options`) || [];
    setValue(
      `questions.${questionIndex}.options`,
      options.map((option, index) => ({
        ...option,
        isCorrect: index === optionIndex,
      })),
    );
  };

  const onSubmit: SubmitHandler<QuizFormData> = async (data) => {
    const payload: CreateQuizFormDto = {
      quizTitle: data.quizTitle,
      quizDescription: data.quizDescription || null,
      quizBanner: data.quizBanner || "",
      subject: data.subject || null,
      std: data.std || null,
      departmentId: Number(data.departmentId),
      dueDate: data.dueDate,
      marks: Number(data.marks),
      attemptLimit: Number(data.attemptLimit),
      isActive: data.isActive,
      questions: data.questions.map((question) => ({
        questionText: question.questionText,
        questionType: question.questionType,
        marks: Number(question.marks),
        options: question.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      })),
    };

    const apiPayload: CreateQuizDto = {
      ...payload,
      instituteId,
      facultyId,
    };

    try {
      if (sourceData?.id) {
        const updated = await updateQuizMutation(
          sourceData.id,
          apiPayload as UpdateQuizDto,
        );
        if (updated) {
          await refreshQuizzes();
          if (quizMutate) await quizMutate();
          if (onSuccess) onSuccess();
          router.push("/dashboard/faculty-management/quiz/list");
        }
        return;
      }

      const created = await createQuizMutation(apiPayload);
      if (created) {
        await refreshQuizzes();
        if (quizMutate) await quizMutate();
        if (onSuccess) onSuccess();
        reset(defaultValues);
        router.push("/dashboard/faculty-management/quiz/list");
      }
    } catch (error) {
      console.error("Failed to save quiz", error);
      toast.error("Failed to save quiz");
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className={`min-h-screen px-3 py-4 sm:px-4 sm:py-6 md:px-6`}
      >
        <div
          className={`mx-auto  max-w-full rounded-xl border p-4 sm:p-5 md:p-6 ${isDark ? "border-slate-700 " : "border-slate-200 bg-white"
            }`}
        >
          <h1
            className={`text-3xl sm:text-4xl  font-bold ${isDark ? 'text-gray-100' : 'text-slate-950/70'} flex items-center gap-3`}
          >
            {sourceData?.id ? <Translated text="Edit Quiz" /> : <Translated text="Create Quiz" />}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RHFFormField
                name="quizTitle"
                label="Quiz Title"
                placeholder="Enter quiz title"
                required
              />
              <RHFFormField
                name="subject"
                label="Subject"
                placeholder="Enter subject"
              />
              <RHFFormField
                name="std"
                label="Standard"
                placeholder="Enter class/standard"
              />
              <RHFDropDown
                name="departmentId"
                label="Department"
                placeholder="Select department"
                options={departmentOptions}
                required
              />
              <RHFFormField
                name="dueDate"
                type="date"
                label="Due Date"
                required placeholder={undefined} />
              <RHFFormField
                name="marks"
                type="number"
                label="Total Marks"
                required placeholder={undefined} />
              <RHFFormField
                name="attemptLimit"
                type="number"
                label="Attempt Limit"
                required placeholder={undefined} />
            </div>

            <RHFContentFormField
              name="quizDescription"
              label="Quiz Description"
              required
            />
            <RHFDropzoneField name="quizBanner" />
            <div className="mt-5">
              <RHFCheckbox name="isActive" label="Active" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2
                  className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  <Translated text="Questions" />
                </h2>

                <Button type="button" onClick={onAddQuestion} className="gap-2">
                  <Plus className="h-4 w-4" />
                  <Translated text="Add Question" />
                </Button>
              </div>

              {fields.map((field, questionIndex) => (
                <QuestionCard
                  key={field.id}
                  questionIndex={questionIndex}
                  methods={methods}
                  isDark={isDark}
                  onRemove={() => onRemoveQuestion(questionIndex)}
                  onTypeChange={(questionType) =>
                    onTypeChange(questionIndex, questionType)
                  }
                  onAddOption={() => onAddOption(questionIndex)}
                  onRemoveOption={(optionIndex) =>
                    onRemoveOption(questionIndex, optionIndex)
                  }
                  onSetCorrectAnswer={(optionIndex) =>
                    onSetCorrectAnswer(questionIndex, optionIndex)
                  }
                />
              ))}
            </div>

            <motion.div
              className="mt-8 flex justify-end space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ParticleButton
                type="button"
                onClick={() => reset(defaultValues)}
                className={`flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${isDark ? "text-slate-200 bg-slate-800 border-slate-700 hover:bg-slate-700 focus:ring-blue-400" : "text-slate-700 bg-white border-slate-300 hover:bg-slate-50 focus:ring-blue-500"}`}
                successDuration={600}
              >
                <FaTimes className="mr-2" />
                {isEdit ? <Translated text="Reset Changes" /> : <Translated text="Reset" />}
              </ParticleButton>

              <ParticleButton
                type="submit"
                className={`px-4 flex items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                successDuration={800}
                disabled={isSubmitting}
              >
                {isEdit ? (
                  <FaEdit className="mr-2" />
                ) : (
                  <FaSave className="mr-2" />
                )}
                {isSubmitting
                  ? isEdit
                    ? <Translated text="Updating..." />
                    : <Translated text="Creating..." />
                  : isEdit
                    ? "Update Quiz"
                    : "Create Quiz"}
              </ParticleButton>
            </motion.div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
