import { motion } from 'framer-motion';
import { useTheme } from '@/theme/AppThemeProvider';
import { useWatch } from 'react-hook-form';
import RHFFormField from '../../../../components/hook-form/RHFFormFiled';
import { IAssignment } from '../../../../types/assignmentUpload';
import { Translated } from '../../../../components/common/translator/translator';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

const glassCard = (isDark: boolean) =>
  cn(
    'rounded-2xl border backdrop-blur-sm shadow-sm',
    isDark
      ? 'border-white/10 bg-slate-900/80 shadow-black/30'
      : 'border-slate-200/80 bg-white/90 shadow-slate-200/70'
  );

const subText = (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-slate-500');
const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');

function ReviewRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2 rounded-xl border px-3 py-3 sm:flex-row sm:gap-3 sm:px-4',
        isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
      )}
    >
      <span
        className={cn(
          'w-auto shrink-0 text-[11px] font-semibold uppercase tracking-wide sm:w-40 sm:text-xs',
          subText(isDark)
        )}
      >
        {label}
      </span>
      <span className={cn('text-sm font-medium', primaryText(isDark))}>{value || '—'}</span>
    </div>
  );
}

interface Step3ReviewSubmitProps {
  selectedAssignment: IAssignment | null;
}

export default function Step3ReviewSubmit({ selectedAssignment }: Step3ReviewSubmitProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const commentsWatch = useWatch({ name: 'comments' });

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(glassCard(isDark), 'mb-6 space-y-4 p-4 sm:p-6')}
    >
      <h2 className={cn('mb-4 text-lg font-semibold sm:text-xl', primaryText(isDark))}>
        <Translated text="Review Your Submission" />
      </h2>

      {selectedAssignment && (
        <>
          <ReviewRow
            isDark={isDark}
            label="Assignment"
            value={selectedAssignment.title}
          />
          <ReviewRow
            isDark={isDark}
            label="Course"
            value={selectedAssignment.course}
          />
        </>
      )}

      <RHFFormField
        name="comments"
        label="Comments (Optional)"
        placeholder="Add any comments about your submission..."
        type="text"
      />
      <div className={cn('text-xs', subText(isDark))}>
        {commentsWatch?.length || 0}/500
      </div>
    </motion.div>
  );
}
