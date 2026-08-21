import { motion } from 'framer-motion';
import { CheckCircle, MenuBook, Verified } from '@mui/icons-material';
import { useTheme } from '@/theme/AppThemeProvider';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

interface Step {
  id: number;
  label: string;
  icon: typeof MenuBook | typeof Verified | null;
}

const STEPS: Step[] = [
  { id: 1, label: 'Select Assignment', icon: MenuBook },
  { id: 2, label: 'Upload Files', icon: null },
  { id: 3, label: 'Review & Submit', icon: Verified },
];

const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');

interface StepProgressBarProps {
  currentStep: number;
}

export default function StepProgressBar({ currentStep }: StepProgressBarProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:flex sm:justify-between sm:gap-0">
        {STEPS.map((step: Step, i: number) => (
          <motion.div
            key={step.id}
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all sm:h-10 sm:w-10 sm:text-base',
                currentStep >= step.id
                  ? isDark
                    ? 'border-teal-400 bg-teal-400/15 text-teal-300'
                    : 'border-teal-500 bg-teal-50 text-teal-700'
                  : isDark
                  ? 'border-white/10 bg-slate-900/50 text-slate-400'
                  : 'border-slate-300 bg-white/50 text-slate-500'
              )}
            >
              {currentStep > step.id ? <CheckCircle fontSize="small" /> : step.id}
            </div>
            <div className={cn('ml-3 text-xs font-medium sm:text-sm', primaryText(isDark))}>
              {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-4 hidden h-0.5 flex-1 transition-colors sm:block',
                  currentStep > step.id
                    ? isDark
                      ? 'bg-teal-400'
                      : 'bg-teal-500'
                    : isDark
                    ? 'bg-slate-700'
                    : 'bg-slate-300'
                )}
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
