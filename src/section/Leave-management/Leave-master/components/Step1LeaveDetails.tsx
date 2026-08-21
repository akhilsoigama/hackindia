import { motion } from 'framer-motion';
import { CalendarToday, Description, Info, School } from '@mui/icons-material';
import { Translated } from '../../../../components/common/translator/translator';
import RHFDropDown from '../../../../components/hook-form/RHFDropDown';
import RHFFormField from '../../../../components/hook-form/RHFFormFiled';
import { LEAVE_TYPES } from './leaveCreateData';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');

interface Step1LeaveDetailsProps {
  isDark: boolean;
  startDate: string;
  leaveDays: number;
  today: string;
}

export default function Step1LeaveDetails({
  isDark,
  startDate,
  leaveDays,
  today,
}: Step1LeaveDetailsProps) {
  return (
    <div className="relative space-y-6">
      <div className={cn('border-b pb-4', isDark ? 'border-white/10' : 'border-slate-200')}>
        <p className={cn('text-xs font-semibold uppercase tracking-widest', isDark ? 'text-slate-300' : 'text-slate-700')}>Step 1 of 2</p>
        <h2 className={cn('mt-1 text-xl font-semibold', primaryText(isDark))}><Translated text="Leave Details" /></h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
        <RHFDropDown
          name="leaveType"
          label="Leave Type"
          options={LEAVE_TYPES}
          required
          icon={<School />}
          placeholder="Select leave type"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RHFFormField
          name="startDate"
          label="Start Date"
          type="date"
          placeholder=""
          required
          min={today}
          icon={<CalendarToday />}
        />
        <RHFFormField
          name="endDate"
          label="End Date"
          type="date"
          placeholder=""
          required
          min={startDate || today}
          icon={<CalendarToday />}
        />
      </div>

      <RHFFormField
        name="reason"
        label="Reason for Leave"
        type="textarea"
        placeholder="Please provide a detailed reason for your leave"
        required
        icon={<Description />}
      />

      {leaveDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('flex items-start gap-3 rounded-xl border px-4 py-3', isDark ? 'border-slate-400/20 bg-slate-400/8' : 'border-slate-200 bg-slate-50')}
        >
          <Info className={isDark ? 'mt-0.5 text-slate-300' : 'mt-0.5 text-slate-600'} fontSize="small" />
          <div className="text-sm">
            <p className={cn('font-semibold', isDark ? 'text-slate-200' : 'text-slate-800')}>
              <Translated text="Leave summary" />
            </p>
            <p className={cn('mt-0.5', isDark ? 'text-slate-300/80' : 'text-slate-700')}>
              <Translated text="Total" />: <strong>{leaveDays}</strong> day{leaveDays !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
