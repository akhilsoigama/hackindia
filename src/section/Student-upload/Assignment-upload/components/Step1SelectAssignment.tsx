import { motion } from 'framer-motion';
import { CheckCircle, CalendarToday, TaskAlt } from '@mui/icons-material';
import { useTheme } from '@/theme/AppThemeProvider';
import { IAssignment } from '../../../../types/assignmentUpload';
import { Translated } from '../../../../components/common/translator/translator';
import RHFDropDown from '../../../../components/hook-form/RHFDropDown';

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

interface Step1SelectAssignmentProps {
  assignments: IAssignment[];
  selectedAssignment: IAssignment | null;
  selectedSubject: string;
  subjects: string[];
  submittedAssignmentIds: Set<string>;
  currentEditAssignmentId?: string;
  onSubjectChange: (subject: string) => void;
  onSelectAssignment: (assignment: IAssignment) => void;
}

export default function Step1SelectAssignment({
  assignments,
  selectedAssignment,
  selectedSubject,
  subjects,
  submittedAssignmentIds,
  currentEditAssignmentId,
  onSubjectChange,
  onSelectAssignment,
}: Step1SelectAssignmentProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const subjectOptions = subjects.map((subject) => ({
    value: subject,
    label: subject === 'all' ? 'All Subjects' : subject,
  }));

  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(glassCard(isDark), 'mb-6 p-4 sm:p-6')}
    >
      <h2 className={`text-xl  font-bold ${isDark ? 'text-slate-100' : 'text-slate-950/70'} flex items-center gap-3`}>
        <Translated text="Select an Assignment" />
      </h2>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn('text-xs sm:text-sm', subText(isDark))}>
          <Translated text="Filter assignments by subject" />
        </p>
        <div className="w-full sm:w-64">
          <RHFDropDown
            name="subjectFilter"
            label="Subject"
            options={subjectOptions}
            placeholder="All Subjects"
            value={selectedSubject}
            onChange={(event) => onSubjectChange(String(event.target.value))}
          />
        </div>
      </div>

      {assignments.length === 0 ? (
        <p className={subText(isDark)}>
          <Translated text="No assignments available" />
        </p>
      ) : (
        <div className="grid gap-3">
          {assignments.map((assignment) => (
            (() => {
              const alreadySubmitted = submittedAssignmentIds.has(assignment.id);
              const isCurrentEdit = currentEditAssignmentId === assignment.id;
              const isLocked = alreadySubmitted && !isCurrentEdit;

              return (
            <motion.button
              key={assignment.id}
              type="button"
              onClick={() => onSelectAssignment(assignment)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLocked}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-3 text-left transition-colors sm:p-4',
                selectedAssignment?.id === assignment.id
                  ? isDark
                    ? 'border-slate-400/50 bg-slate-950/70'
                    : 'border-slate-400 bg-slate-50'
                  : isDark
                  ? 'border-white/10 bg-slate-950/70 hover:border-white/20'
                  : 'border-slate-200/80 bg-white/60 hover:border-slate-300',
                isLocked && (isDark ? 'cursor-not-allowed opacity-70' : 'cursor-not-allowed opacity-80')
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={cn('text-sm font-semibold sm:text-base', primaryText(isDark))}>
                    {assignment.title}
                  </h3>
                  <div
                    className={cn('mt-2 flex flex-wrap gap-3 text-xs', subText(isDark))}
                  >
                    <span className="flex items-center gap-1">
                      <CalendarToday fontSize="small" />
                      {assignment.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <TaskAlt fontSize="small" />
                      <Translated text="Max Points" />: {assignment.maxPoints}
                    </span>
                    {assignment.subject && (
                      <span className={cn('rounded-md px-2 py-1', isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700')}>
                        {assignment.subject}
                      </span>
                    )}
                    {alreadySubmitted && (
                      <span className={cn('rounded-md px-2 py-1 font-medium', isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700')}>
                        <Translated text="Already Submitted" />
                      </span>
                    )}
                  </div>
                </div>
                {selectedAssignment?.id === assignment.id && (
                  <CheckCircle className="text-slate-400" />
                )}
              </div>
            </motion.button>
              );
            })()
          ))}
        </div>
      )}
    </motion.div>
  );
}
