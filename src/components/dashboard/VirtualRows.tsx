import type { ReactElement } from 'react';
import type { RowComponentProps } from 'react-window';
import type { DashboardActivity, DashboardDeadline } from '@/constants/dashboard.constants';
import { DashboardIcon } from './DashboardIcon';
import { Translated } from '@/components/common/translator/translator';

export const ACTIVITY_ROW_HEIGHT = 68;
export const DEADLINE_ROW_HEIGHT = 88;

type ActivityRowProps = RowComponentProps<{
  items: DashboardActivity[];
  isDark: boolean;
}>;

type DeadlineRowProps = RowComponentProps<{
  items: DashboardDeadline[];
  isDark: boolean;
}>;

export const ActivityRow = ({ style, index, items, isDark }: ActivityRowProps): ReactElement | null => {
  const activity = items[index];

  if (!activity) {
    return null;
  }

  return (
    <div style={style} role="listitem" className="relative px-4">
      <span
        className={`absolute left-6 top-1/2 -translate-y-1/2 rounded-full ${
          isDark ? 'bg-slate-300' : 'bg-slate-500'
        } h-2.5 w-2.5`}
      />
      <span
        className={`pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 rounded-full opacity-70 ${
          isDark ? 'bg-slate-400/20' : 'bg-slate-500/20'
        } h-4 w-4 animate-pulse`}
      />
      <div
        className={`group flex h-14 items-center gap-3 rounded-2xl border px-4 pl-8 transition-all duration-200 ${
          isDark
            ? 'border-white/10 bg-white/5 hover:border-slate-400/30 hover:bg-white/10'
            : 'border-slate-200/70 bg-white/70 hover:border-slate-200/80 hover:bg-white'
        }`}
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            isDark
              ? 'bg-white/10 text-slate-200 group-hover:bg-slate-500/20'
              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-100'
          }`}
        >
          <DashboardIcon name={activity.icon} className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 ">
          <p className={`truncate text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Translated text={activity.title} />
          </p>
          <time className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Translated text={activity.time} />
          </time>
        </div>
      </div>
    </div>
  );
};

export const DeadlineRow = ({ style, index, items, isDark }: DeadlineRowProps): ReactElement | null => {
  const deadline = items[index];

  if (!deadline) {
    return null;
  }

  const priorityColors = {
    high: isDark ? 'border-teal-500/30 bg-teal-500/10 text-teal-200' : 'border-teal-200/70 bg-teal-50 text-teal-700',
    medium: isDark ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200' : 'border-cyan-200/70 bg-cyan-50 text-cyan-700',
    low: isDark ? 'border-slate-400/30 bg-slate-500/10 text-slate-200' : 'border-slate-200/70 bg-slate-50 text-slate-700',
  };

  const priorityFill = {
    high: 'bg-linear-to-r from-teal-500 to-teal-400',
    medium: 'bg-linear-to-r from-cyan-400 to-rose-300',
    low: 'bg-linear-to-r from-slate-400 to-slate-500',
  };

  const priorityIcons = {
    high: 'zap',
    medium: 'activity',
    low: 'clock',
  } as const;

  const urgency = {
    high: 88,
    medium: 62,
    low: 38,
  }[deadline.priority];

  return (
    <div style={style} role="listitem" className="px-2">
      <article
        className={`group relative h-20 rounded-2xl border px-4 py-3 transition-all duration-200 ${
          isDark
            ? 'border-white/10 bg-white/5 hover:border-white/20'
            : 'border-slate-200/70 bg-white/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className={`truncate text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Translated text={deadline.title} />
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${
              priorityColors[deadline.priority]
            }`}
          >
            <DashboardIcon name={priorityIcons[deadline.priority]} className="h-3 w-3" />
            <Translated text={deadline.subject} />
          </span>
        </div>
        <div className={`mt-1 flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <span className="inline-flex items-center">
            <DashboardIcon name="clock" className="mr-1.5 h-3.5 w-3.5" />
            <Translated text={`Due: ${deadline.due}`} />
          </span>
          <span className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Translated text="Urgency" />
          </span>
        </div>
        <div className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${priorityFill[deadline.priority]}`}
            style={{ width: `${urgency}%` }}
          />
        </div>
      </article>
    </div>
  );
};
