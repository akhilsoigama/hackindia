import { Translated } from '../../../../components/common/translator/translator';
import { LEAVE_TYPES } from './leaveCreateData';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');
const subText = (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-slate-500');

function ReviewRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border px-4 py-3', isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50')}>
      <span className={cn('w-36 shrink-0 text-xs font-semibold uppercase tracking-wide', subText(isDark))}>{label}</span>
      <span className={cn('text-sm font-medium', primaryText(isDark))}>{value || '-'}</span>
    </div>
  );
}

interface Step3ReviewProps {
  isDark: boolean;
  leaveType: string;
  leaveDays: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function Step3Review({
  isDark,
  leaveType,
  leaveDays,
  startDate,
  endDate,
  reason,
}: Step3ReviewProps) {
  return (
    <div className="relative space-y-6">
      <div className={cn('border-b pb-4', isDark ? 'border-white/10' : 'border-slate-200')}>
        <p className={cn('text-xs font-semibold uppercase tracking-widest', isDark ? 'text-slate-300' : 'text-slate-700')}>Step 2 of 2</p>
        <h2 className={`text-xl  font-bold ${isDark ? 'text-gray-100' : 'text-slate-950/70'} flex items-center gap-3`}><Translated text="Review Application" /></h2>
        <p className={cn('mt-1 text-sm', subText(isDark))}><Translated text="Please review all details before submitting." /></p>
      </div>

      <div>
        <p className={cn('mb-3 text-xs font-semibold uppercase tracking-widest', isDark ? 'text-slate-300' : 'text-slate-700')}><Translated text="Leave Details" /></p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ReviewRow label="Leave Type" value={LEAVE_TYPES.find((t) => t.value === leaveType)?.label ?? ''} isDark={isDark} />
          <ReviewRow label="Total Days" value={`${leaveDays} day(s)`} isDark={isDark} />
          <ReviewRow label="Start Date" value={startDate} isDark={isDark} />
          <ReviewRow label="End Date" value={endDate} isDark={isDark} />
          <ReviewRow label="Status" value="Pending (auto)" isDark={isDark} />
        </div>
      </div>

      <div>
        <p className={cn('mb-2 text-xs font-semibold uppercase tracking-widest', isDark ? 'text-slate-300' : 'text-slate-700')}><Translated text="Reason" /></p>
        <div className={cn('rounded-xl border px-4 py-3 text-sm', isDark ? 'border-white/10 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600')}>
          {reason || '-'}
        </div>
      </div>
    </div>
  );
}
