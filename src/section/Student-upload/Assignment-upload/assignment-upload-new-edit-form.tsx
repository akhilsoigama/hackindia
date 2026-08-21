import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  useAssignments,
  useAssignmentUploads,
  createAssignmentUpload,
  updateAssignmentUpload,
} from '../../../action/assignmentUpload';
import {
  IAssignment,
  IAssignmentUploadListItem,
} from '../../../types/assignmentUpload';
import StepProgressBar from './components/StepProgressBar';
import Step1SelectAssignment from './components/Step1SelectAssignment';
import Step2UploadFile from './components/Step2UploadFile';
import Step3ReviewSubmit from './components/Step3ReviewSubmit';
import SuccessScreen from './components/SuccessScreen';
import FormNavigation from './components/FormNavigation';

// ─── Zod schema ───────────────────────────────────────────────────────────────

const assignmentUploadSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment is required'),
  assignmentFile: z.string().min(1, 'File is required'),
  isActive: z.boolean().optional(),
  comments: z.string().max(500, 'Comments must be 500 characters or less').optional(),
});

type AssignmentUploadFormValues = z.infer<typeof assignmentUploadSchema>;

// ─── Main component ───────────────────────────────────────────────────────────

interface AssignmentUploadNewEditFormProps {
  currentData?: IAssignmentUploadListItem | null;
}

const AssignmentUploadNewEditForm: React.FC<AssignmentUploadNewEditFormProps> = ({
  currentData,
}) => {
  const isEdit = Boolean(currentData);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<IAssignment | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Fetch assignments using the hook
  const { assignments } = useAssignments();
  const { submissions } = useAssignmentUploads();

  const availableSubjects = React.useMemo(() => {
    const subjects = Array.from(
      new Set(assignments.map((assignment) => assignment.subject || assignment.course).filter(Boolean))
    );
    return ['all', ...subjects];
  }, [assignments]);

  const submittedAssignmentIds = React.useMemo(() => {
    return new Set(
      submissions
        .filter((submission) => submission.status === 'submitted' || submission.status === 'graded')
        .map((submission) => submission.assignmentId)
        .filter((assignmentId): assignmentId is string => Boolean(assignmentId))
    );
  }, [submissions]);

  const filteredAssignments = React.useMemo(() => {
    if (selectedSubject === 'all') return assignments;
    return assignments.filter((assignment) => (assignment.subject || assignment.course) === selectedSubject);
  }, [assignments, selectedSubject]);

  const methods = useForm<AssignmentUploadFormValues>({
    resolver: zodResolver(assignmentUploadSchema),
    defaultValues: {
      assignmentId: currentData?.assignmentId || '',
      assignmentFile: currentData?.assignmentFile || '',
      isActive: currentData?.isActive ?? true,
      comments: currentData?.comments || '',
    },
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (!isEdit || !currentData || assignments.length === 0) return;

    const match = assignments.find((assignment) => {
      if (currentData.assignmentId && assignment.id === currentData.assignmentId) {
        return true;
      }
      return assignment.title.toLowerCase() === currentData.title.toLowerCase();
    });

    if (match) {
      setSelectedAssignment(match);
      methods.setValue('assignmentId', match.id, { shouldValidate: true });
    }

    methods.setValue('assignmentFile', currentData.assignmentFile || '', { shouldValidate: true });
    methods.setValue('isActive', currentData.isActive ?? true);
    methods.setValue('comments', currentData.comments || '');
  }, [assignments, currentData, isEdit, methods]);

  const goNext = async () => {
    if (currentStep === 1) {
      if (!selectedAssignment) {
        toast.error('Please select an assignment');
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: AssignmentUploadFormValues) => {
    if (!selectedAssignment) {
      toast.error('Please select an assignment');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('assignmentId', data.assignmentId || selectedAssignment.id);
      formData.append('assignmentFile', data.assignmentFile);
      formData.append('isSubmitted', 'true');
      formData.append('isActive', String(data.isActive ?? true));

      if (data.comments) {
        formData.append('comments', data.comments);
      }

      const result = isEdit && currentData?.id
        ? await updateAssignmentUpload(Number(currentData.id), formData)
        : await createAssignmentUpload(formData);

      if (result) {
        toast.success(isEdit ? 'Assignment submission updated successfully!' : 'Assignment submitted successfully!');
        setSubmitted(true);
      }
    } catch (error: unknown) {
      interface AxiosError {
        response?: { data?: { message?: string; messages?: string } };
      }
      
      const errorMsg =
        (error instanceof Error && 'response' in error 
          ? ((error as AxiosError).response?.data?.message || (error as AxiosError).response?.data?.messages) 
          : null) ||
        'Failed to submit assignment';
      toast.error(errorMsg);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSubmission = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setSelectedAssignment(null);
    setSelectedSubject('all');
    methods.reset();
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return <SuccessScreen isEdit={isEdit} onNewSubmission={handleNewSubmission} />;
  }

  // ── Main form ────────────────────────────────────────────────────────────────
  return (
    <FormProvider {...methods}>
      <div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-full max-w-full"
        >
          <div className={`rounded-3xl p-6 `}>
            <form noValidate>
              <StepProgressBar currentStep={currentStep} />

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <Step1SelectAssignment
                    assignments={filteredAssignments}
                    selectedAssignment={selectedAssignment}
                    selectedSubject={selectedSubject}
                    subjects={availableSubjects}
                    submittedAssignmentIds={submittedAssignmentIds}
                    currentEditAssignmentId={isEdit ? currentData?.assignmentId : undefined}
                    onSubjectChange={setSelectedSubject}
                    onSelectAssignment={(assignment) => {
                      const alreadySubmitted = submittedAssignmentIds.has(assignment.id);
                      const isCurrentEditAssignment = isEdit && currentData?.assignmentId === assignment.id;

                      if (alreadySubmitted && !isCurrentEditAssignment) {
                        toast.info('This assignment is already submitted');
                        return;
                      }

                      setSelectedAssignment(assignment);
                      methods.setValue('assignmentId', assignment.id);
                    }}
                  />
                )}

                {currentStep === 2 && <Step2UploadFile currentValue={currentData?.assignmentFile} />}

                {currentStep === 3 && <Step3ReviewSubmit selectedAssignment={selectedAssignment} />}
              </AnimatePresence>

              <FormNavigation
                currentStep={currentStep}
                isSubmitting={isSubmitting}
                isEdit={isEdit}
                onPrev={goPrev}
                onNext={goNext}
                onSubmit={handleSubmit(onSubmit)} 
              />
            </form>
          </div>
        </motion.div>
      </div>
    </FormProvider>
  );
};

export default AssignmentUploadNewEditForm;