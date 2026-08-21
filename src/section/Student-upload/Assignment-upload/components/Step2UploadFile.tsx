import { motion } from 'framer-motion';
import { useTheme } from '@/theme/AppThemeProvider';
import RHFPDFUpload from '../../../../components/hook-form/RHFPDFUpload';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

const glassCard = (isDark: boolean) =>
  cn(
    'rounded-2xl border backdrop-blur-sm shadow-sm',
    isDark
      ? 'border-white/10 bg-slate-900/80 shadow-black/30'
      : 'border-slate-200/80 bg-white/90 shadow-slate-200/70'
  );

const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');

interface Step2UploadFileProps {
  currentValue?: string;
}

export default function Step2UploadFile({ currentValue }: Step2UploadFileProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(glassCard(isDark), 'mb-6 p-4 sm:p-6')}
    >
      <h2 className={cn('mb-4 text-lg font-semibold sm:text-xl', primaryText(isDark))}>
        Upload Assignment File
      </h2>
      <RHFPDFUpload 
        name="assignmentFile" 
        label="Upload Assignment File" 
        required 
        currentValue={currentValue}
      />
    </motion.div>
  );
}
