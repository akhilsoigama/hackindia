import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FiAlertCircle, FiSend } from 'react-icons/fi';
import { NewQuestion, AskQuestionProps } from '../../../types/Student-Queries';
import { createStudentQuery, updateStudentQuery } from '../../../action/studentQuery';
import StudentQueryFormFields from './components/StudentQueryFormFields';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { FaEdit,  FaTimes } from 'react-icons/fa';
import { Translated } from '@/components/common/translator/translator';
import { ParticleButton } from '@/components/ui/particle-button';

interface ExtendedAskQuestionProps extends AskQuestionProps {
  currentData?: NewQuestion & { id?: string | number };
  isEdit?: boolean;
}

const defaultValues: NewQuestion = {
  title: '',
  description: '',
  subject: '',
  category: '',
  priority: 'medium',
};

const AskQuestion: React.FC<ExtendedAskQuestionProps> = ({ 
  onSubmitQuestion, 
  currentData, 
  isEdit = false 
}) => {
  const reduceMotion = useReducedMotion();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  
  const methods = useForm<NewQuestion>({ 
    defaultValues: currentData || defaultValues, 
    mode: 'onChange' 
  });
  
  const { handleSubmit, reset, setValue } = methods;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const preview = methods.watch();

  // Populate form with currentData when in edit mode
  useEffect(() => {
    if (isEdit && currentData) {
      setValue('title', currentData.title);
      setValue('description', currentData.description);
      setValue('subject', currentData.subject);
      setValue('category', currentData.category);
      setValue('priority', currentData.priority);
    }
  }, [isEdit, currentData, setValue]);

  const handleReset = () => {
    reset(isEdit && currentData ? currentData : defaultValues);
  };

 const onSubmit = async (formData: NewQuestion) => {
  setIsSubmitting(true);
  try {
    if (isEdit && currentData?.id) {
      // Convert id to number
      const id = typeof currentData.id === 'string' ? parseInt(currentData.id, 10) : currentData.id;
      
      // Check if conversion is valid
      if (isNaN(id)) {
        throw new Error('Invalid ID format');
      }
      
      const updated = await updateStudentQuery(id, {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
      });

      if (!updated) {
        throw new Error('Failed to update question');
      }

      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } else {
      // Create new question
      const created = await createStudentQuery({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
      });

      if (!created) {
        throw new Error('Failed to create question');
      }

      onSubmitQuestion?.(formData);
      setSubmitStatus('success');
      reset(defaultValues);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  } catch (error) {
    console.error('Error submitting question:', error);
    setSubmitStatus('error');
    setTimeout(() => setSubmitStatus('idle'), 3000);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8`}>
      <FormProvider {...methods}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}>
                {isEdit ? 'Edit Question' : 'Ask a Question'}
              </h1>
              <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isEdit ? 'Update your question details.' : 'Fill the details and submit your query.'}
              </p>
            </div>
          </div>

          {submitStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm"
            >
              <div className="flex items-center gap-2 font-medium">
                <FiAlertCircle className="text-emerald-600" />
                {isEdit ? 'Question updated successfully.' : 'Question submitted successfully.'}
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm"
            >
              <div className="flex items-center gap-2 font-medium">
                <FiAlertCircle className="text-red-600" />
                {isEdit ? 'Failed to update question. Please try again.' : 'Failed to submit question. Please try again.'}
              </div>
            </motion.div>
          )}

          <div>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <StudentQueryFormFields />

              <div className={`flex flex-col gap-4 rounded-2xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Priority selected: <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{preview.priority || 'medium'}</span>
                </div>
                
                <motion.div
                  className="flex justify-end space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ParticleButton
                    type="button"
                    onClick={handleReset}
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
                      <FiSend className="mr-2" />
                    )}
                    {isSubmitting ? (
                      isEdit ? (
                        <Translated text="Updating..." />
                      ) : (
                        <Translated text="Submitting..." />
                      )
                    ) : isEdit ? (
                      <Translated text="Update Question" />
                    ) : (
                      <Translated text="Submit Question" />
                    )}
                  </ParticleButton>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>
      </FormProvider>
    </div>
  );
};

export default AskQuestion;