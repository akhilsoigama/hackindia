import React from 'react';
import { CheckCircle } from '@mui/icons-material';
import { Translated } from '../../../../components/common/translator/translator';
import { STEPS } from './leaveCreateData';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
const subText = (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-slate-500');

interface StepProgressBarProps {
  currentStep: number;
  isDark: boolean;
  glassCard: (isDark: boolean) => string;
}

export default function StepProgressBar({ currentStep, isDark, glassCard }: StepProgressBarProps) {
  return (
    <div className={cn(glassCard(isDark), 'px-6 py-5')}>
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                    done
                      ? isDark
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : active
                        ? isDark
                          ? 'border-slate-400 bg-slate-500/20 text-slate-200'
                          : 'border-slate-500 bg-slate-50 text-slate-700'
                        : isDark
                          ? 'border-white/15 bg-slate-900 text-slate-500'
                          : 'border-slate-300 bg-white text-slate-400'
                  )}
                >
                  {done ? <CheckCircle fontSize="small" /> : <Icon fontSize="small" />}
                </div>
                <span className={cn('mt-2 text-xs font-medium', active ? (isDark ? 'text-slate-200' : 'text-slate-700') : subText(isDark))}>
                  <Translated text={step.label} />
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 mb-5 h-0.5 flex-1 rounded-full transition-all duration-300',
                    done ? 'bg-emerald-500' : isDark ? 'bg-white/10' : 'bg-slate-200'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
