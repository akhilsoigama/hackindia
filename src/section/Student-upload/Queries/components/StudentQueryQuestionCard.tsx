import { FiBook, FiCalendar, FiCheckCircle, FiClock, FiTag, FiChevronDown, FiMessageSquare, FiUser } from 'react-icons/fi';
import { Question } from '../../../../types/Student-Queries';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentQueryQuestionCardProps {
  question: Question;
  expanded: boolean;
  onToggle: () => void;
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
  actionDisabled?: boolean;
  showActions?: boolean;
}

const statusCopy: Record<Question['status'], string> = {
  open: 'Pending Review',
  in_progress: 'In Progress',
  resolved: 'Answered',
  closed: 'Closed',
};

const statusConfig = {
  open: {
    light: 'bg-amber-50 text-amber-700 border-amber-200',
    dark: 'bg-amber-950/30 text-amber-300 border-amber-800/50',
  },
  in_progress: {
    light: 'bg-blue-50 text-blue-700 border-blue-200',
    dark: 'bg-blue-950/30 text-blue-300 border-blue-800/50',
  },
  resolved: {
    light: 'bg-teal-50 text-teal-700 border-teal-200',
    dark: 'bg-teal-950/30 text-teal-300 border-teal-800/50',
  },
  closed: {
    light: 'bg-slate-100 text-slate-600 border-slate-200',
    dark: 'bg-slate-800/50 text-slate-300 border-slate-700',
  },
};

const priorityConfig = {
  high: {
    light: 'bg-red-50 text-red-700',
    dark: 'bg-red-950/30 text-red-300'
  },
  medium: {
    light: 'bg-amber-50 text-amber-700',
    dark: 'bg-amber-950/30 text-amber-300'
  },
  low: {
    light: 'bg-green-50 text-green-700',
    dark: 'bg-green-950/30 text-green-300'
  },
};

const statusIcon = (status: Question['status'], isDark: boolean) => {
  if (status === 'resolved') return <FiCheckCircle className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-teal-500'}`} />;
  if (status === 'closed') return <FiCheckCircle className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />;
  return <FiClock className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />;
};

export default function StudentQueryQuestionCard({
  question,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  actionDisabled = false,
  showActions = false,
}: StudentQueryQuestionCardProps) {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const isAnswered = question.status === 'resolved' || question.status === 'closed';
  const status = statusConfig[question.status];
  const priority = priorityConfig[question.priority as keyof typeof priorityConfig] || priorityConfig.medium;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group rounded-2xl border shadow-lg transition-all duration-300 ${
        isDark 
          ? 'border-slate-800  hover:shadow-2xl hover:shadow-teal-500/5' 
          : 'border-slate-200 bg-white hover:shadow-xl'
      }`}
    >
      <button 
        type="button" 
        className="w-full p-5 text-left lg:p-6" 
        onClick={onToggle}
      >
        {/* Header Section */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
              isDark ? status.dark : status.light
            }`}>
              {statusIcon(question.status, isDark)}
              {statusCopy[question.status]}
            </span>
            
            {/* Priority Badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isDark ? priority.dark : priority.light
            }`}>
              <FiTag className="w-3 h-3" />
              {question.priority}
            </span>
          </div>
          
          {/* Date */}
          <div className={`flex items-center gap-1.5 text-xs ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <FiCalendar className="w-3.5 h-3.5" />
            <span>{question.createdAt ? new Date(question.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            }) : 'N/A'}</span>
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-3">
          <h3 className={`text-base font-semibold lg:text-lg tracking-tight ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            {question.title}
          </h3>
          
          <p className={`line-clamp-2 text-sm leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {question.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className={`flex flex-wrap items-center gap-3 text-xs ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            <span className="flex items-center gap-1.5">
              <FiBook className="w-3.5 h-3.5" />
              {question.category || 'General'} • {question.subject || 'General'}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUser className="w-3.5 h-3.5" />
              {question.studentName}
            </span>
          </div>
          
          {/* Expand/Collapse Indicator */}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            expanded 
              ? isDark 
                ? 'bg-teal-500/20 text-teal-300' 
                : 'bg-teal-50 text-teal-700'
              : isDark 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>
            <span>{expanded ? 'Collapse' : 'View Details'}</span>
            <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Action Buttons */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center justify-end gap-2 border-t px-5 py-3 lg:px-6 ${
              isDark 
                ? 'border-slate-800 bg-slate-900/50' 
                : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isDark 
                  ? 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:border-slate-600' 
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              } disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={actionDisabled}
              onClick={() => onEdit?.(question)}
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isDark 
                  ? 'border border-rose-800/50 bg-rose-950/30 text-rose-300 hover:bg-rose-950/50' 
                  : 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
              } disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={actionDisabled}
              onClick={() => onDelete?.(question)}
            >
              Delete
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Section (Expanded) */}
      <AnimatePresence>
        {expanded && isAnswered && question.response && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-t overflow-hidden ${
              isDark 
                ? 'border-teal-800/30 bg-linear-to-br from-teal-950/20 to-slate-900' 
                : 'border-teal-100 bg-linear-to-br from-teal-50/50 to-white'
            }`}
          >
            <div className="p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className={`rounded-full p-1.5 ${
                  isDark ? 'bg-teal-500/20' : 'bg-teal-100'
                }`}>
                  <FiMessageSquare className={`w-4 h-4 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`} />
                </div>
                <h4 className={`text-sm font-semibold uppercase tracking-wide ${
                  isDark ? 'text-teal-300' : 'text-teal-700'
                }`}>
                  Official Response
                </h4>
              </div>
              
              <div className={`rounded-xl border p-4 shadow-sm ${
                isDark 
                  ? 'border-teal-800/30 bg-slate-900/50' 
                  : 'border-teal-100 bg-white'
              }`}>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {question.response}
                </p>
              </div>
              
              {question.resolvedAt && (
                <div className="mt-4 flex items-center gap-2">
                  <FiCheckCircle className={`w-3.5 h-3.5 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`} />
                  <p className={`text-xs font-medium ${
                    isDark ? 'text-teal-300' : 'text-teal-700'
                  }`}>
                    Resolved on {new Date(question.resolvedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}