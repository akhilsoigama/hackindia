import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import {
  LessonFormData,
  useLessonForm,
} from "../../../hooks/useLectureUploadForm";
import {
  ICreateLecture,
  ILecture,
  IUpdateLecture,
} from "../../../types/material";
import { BasicInfoStep } from "../../../components/lecture-upload-constant";
import { toast } from "sonner";
import { createLecture, updateLecture } from "../../../action/material";
import { useRouter } from "../../../hooks/useRouter";
import { Translated } from "../../../components/common/translator/translator";
import { motion } from "framer-motion";
import { useTheme } from "@/theme/AppThemeProvider";
import { ParticleButton } from "@/components/ui/particle-button";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

type Props = {
  currentData?: ILecture;
};

const MaterialNewEditForm: React.FC<Props> = ({ currentData }) => {
  const { methods, currentStep, reset } = useLessonForm(currentData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  
  // Add isEdit variable
  const isEdit = !!currentData?.id;

  const defaultValues = methods.getValues(); // Get default values for reset

  const onSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true);
    const normalizedPayload: ICreateLecture = {
      title: data.title,
      subject: data.subject,
      std: data.std,
      contentType: data.contentType,
      facultyId: data.facultyId,
      description: data.description ?? null,
      departmentId: data.departmentId ?? null,
      chapterTopic: data.chapterTopic ?? null,
      learningObjectives: data.learningObjectives ?? null,
      difficultyLevel: data.difficultyLevel ?? null,
      thumbnailUrl: data.thumbnailUrl ?? null,
      contentUrl: data.contentUrl ?? null,
      durationInSeconds: data.durationInSeconds ?? null,
      textContent: data.textContent ?? null,
    };

    try {
      if (currentData?.id) {
        console.log("Updating lecture...");
        const updatePayload: IUpdateLecture = {
          ...normalizedPayload,
        };
        await updateLecture(currentData.id, updatePayload);
        toast.success(<Translated text="Lecture updated successfully!" />);
        router.push("/dashboard/faculty-management/material/list");
      } else {
        console.log("Creating lecture...");
        await createLecture(normalizedPayload);
        toast.success(<Translated text="Lecture created successfully!" />);
      }
      reset();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(
        <Translated text="Something went wrong. Please try again." />,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className={`relative overflow-hidden rounded-3xl px-2 py-2 sm:px-6 sm:py-2 md:px-4  duration-300 `}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 `}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-full max-w-full"
        >
          <div
            className={`rounded-3xl space-y-6  p-6 shadow-xl  duration-300 `}
          >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {currentStep === 1 && (
                <BasicInfoStep
                  watch={methods.watch}
                  setValue={methods.setValue}
                  getValues={methods.getValues}
                  currentData={currentData}
                />
              )}

              <motion.div
                className="mt-8 flex justify-end space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ParticleButton
                  type="button"
                  onClick={() => reset(defaultValues)}
                  className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                  successDuration={600}
                >
                  <FaTimes className="mr-2" />
                  {isEdit ? (
                    <Translated text="Reset Changes" />
                  ) : (
                    <Translated text="Reset" />
                  )}
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
                  {isSubmitting ? (
                    isEdit ? (
                      <Translated text="Updating..." />
                    ) : (
                      <Translated text="Creating..." />
                    )
                  ) : isEdit ? (
                    <Translated text="Update material" />
                  ) : (
                    <Translated text="Create material" />
                  )}
                </ParticleButton>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </FormProvider>
  );
};

export default MaterialNewEditForm;