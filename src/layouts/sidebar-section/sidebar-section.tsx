import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/theme/AppThemeProvider';

interface SidebarSectionProps {
  title: React.ReactNode;
  isSidebarExpanded: boolean;
  children: React.ReactNode;
  delay?: number;
}

const SidebarSection = ({ title, isSidebarExpanded, children, delay = 0 }: SidebarSectionProps) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: 0.15, ease: 'easeOut' as const };
  void delay;

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={transition}
      className="space-y-2"
    >
      <AnimatePresence>
        {isSidebarExpanded && (
          <motion.h3
            className={`flex items-center gap-2 px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
            transition={transition}
          >
            <span className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
            {title}
            <span className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          </motion.h3>
        )}
      </AnimatePresence>
      <div className="space-y-1">{children}</div>
    </motion.section>
  );
};

export default SidebarSection;
