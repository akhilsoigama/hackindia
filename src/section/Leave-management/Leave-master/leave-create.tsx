import React, { memo, useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { HourglassTop } from '@mui/icons-material';
import { Translated } from '../../../components/common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';import {
  createFacultyLeave,
  updateFacultyLeave,
  useFacultyLeaveMutation,
  type FacultyLeaveResponse,
} from '../../../action/facultyLeave';
import { leaveSchema, today, type LeaveFormValues } from './schemas/leave.schema';
import { STEPS } from './components/leaveCreateData';
import StepProgressBar from './components/StepProgressBar';
import Step1LeaveDetails from './components/Step1LeaveDetails';
import Step3Review from './components/Step3Review';
import FormNavigation from './components/FormNavigation';
import SuccessScreen from './components/SuccessScreen';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
const glassCard = (isDark: boolean) =>
  cn(
    'rounded-2xl border backdrop-blur-sm shadow-sm',
    isDark
      ? 'border-white/10 bg-slate-900/80 shadow-black/30'
      : 'border-slate-200/80 bg-white/90 shadow-slate-200/70'
  );
const subText = (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-slate-500');

const calcDays = (start: string, end: string, half: boolean) => {
  if (!start || !end) return 0;
  const diff = Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 86_400_000) + 1;
  return half ? diff * 0.5 : diff;
};

type LeaveCreateProps = {
  currentData?: FacultyLeaveResponse | null;
};

const LeaveCreate: React.FC<LeaveCreateProps> = ({ currentData }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshLeaves } = useFacultyLeaveMutation();

  const methods = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: 'sick',
      startDate: '',
      endDate: '',
      reason: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!currentData) return;

    methods.reset({
      leaveType: currentData.leaveType ?? 'sick',
      startDate: currentData.startDate ?? '',
      endDate: currentData.endDate ?? '',
      reason: currentData.reason ?? '',
    });
  }, [currentData, methods]);

  const { handleSubmit, trigger } = methods;

  const isHalfDay = false;
  const startDate = useWatch({ control: methods.control, name: 'startDate' });
  const endDate = useWatch({ control: methods.control, name: 'endDate' });
  const leaveType = useWatch({ control: methods.control, name: 'leaveType' });
  const reason = useWatch({ control: methods.control, name: 'reason' });

  const leaveDays = calcDays(startDate, endDate, isHalfDay);

  const goNext = async () => {
    const fields: Array<keyof LeaveFormValues> = ['leaveType', 'startDate', 'endDate', 'reason'];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: LeaveFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        leaveType: data.leaveType,
        reason: data.reason,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const result = currentData?.id
        ? await updateFacultyLeave(currentData.id, payload)
        : await createFacultyLeave(payload);

      if (result) {
        await refreshLeaves();
        setSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SuccessScreen
        isDark={isDark}
        glassCard={glassCard}
        onReset={() => {
          setSubmitted(false);
          setCurrentStep(1);
          methods.reset();
        }}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <div className={cn('relative border border-slate-500/20 min-h-screen overflow-hidden rounded-4xl px-4 py-8 sm:px-6 md:px-10', isDark ? '' : 'bg-slate-50')}>
        <div aria-hidden="true"  />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="relative mx-auto max-w-full space-y-6">
            <div className="space-y-3">
              <h2 className={`text-3xl mb-5 sm:text-4xl  font-bold ${isDark ? 'text-slate-100' : 'text-slate-950/70'} flex items-center gap-3`}>
                <Translated text="Leave management" />
              </h2>
              <div className="mt-1 flex items-center gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', isDark ? 'bg-slate-400/15' : 'bg-slate-100')}>
                  <HourglassTop className={isDark ? 'text-slate-300' : 'text-slate-700'} fontSize="small" />
                </div>
                <div>
                  <h1 className={`text-xl sm:text-xl  font-bold ${isDark ? 'text-slate-100' : 'text-slate-950/70'} flex items-center gap-3`}>
                    <Translated text="Apply for Leave" />
                  </h1>
                  <p className={cn('text-sm', subText(isDark))}>
                    <Translated text="Submit your leave application for approval" />
                  </p>
                </div>
              </div>
            </div>

            <StepProgressBar currentStep={currentStep} isDark={isDark} glassCard={glassCard} />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={cn(glassCard(isDark), 'relative overflow-hidden p-6 sm:p-7')}
              >
                <div aria-hidden="true" />

                {currentStep === 1 && (
                  <Step1LeaveDetails
                    isDark={isDark}
                    startDate={startDate}
                    leaveDays={leaveDays}
                    today={today}
                  />
                )}

                {currentStep === 2 && (
                  <Step3Review
                    isDark={isDark}
                    leaveType={leaveType}
                    leaveDays={leaveDays}
                    startDate={startDate}
                    endDate={endDate}
                    reason={reason}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <FormNavigation
              currentStep={currentStep}
              totalSteps={STEPS.length}
              isSubmitting={isSubmitting}
              isDark={isDark}
              glassCard={glassCard}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default memo(LeaveCreate);
