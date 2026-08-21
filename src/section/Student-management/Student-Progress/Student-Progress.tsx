import { useEffect, useMemo, useState } from 'react';
import { 
  FiActivity, 
  FiBookOpen, 
  FiCheckSquare, 
  FiAward, 
  FiCheck,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProgressReport } from '../../../action/progressReport';
import { useUser } from '../../../atoms/userAtom';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { Translated } from '../../../components/common/translator/translator';
import { GiProgression } from "react-icons/gi";

// Sub-component for individual student progress card
const StudentProgressCard = ({ report, isDark }: { report: any; isDark: boolean }) => {
  const studentName = report.student?.studentName || 'Student';
  const deptName = report.student?.departmentName || 'CSE';
  const std = report.student?.studentStd || 'Batch A';
  const overallScore = Math.round(report.totalOverAllScore || 0);

  // Risk calculation: < 60% high risk, < 80% medium risk, >= 80% low risk
  const riskLevel = overallScore < 60 ? 'high risk' : (overallScore < 80 ? 'medium risk' : 'low risk');
  
  const riskBadgeClass = overallScore < 60 
    ? 'border-rose-500/25 bg-rose-500/10 text-rose-400' 
    : (overallScore < 80 ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400');

  const progressColorClass = overallScore < 60
    ? 'from-rose-500 to-red-400'
    : (overallScore < 80 ? 'from-amber-500 to-orange-400' : 'from-cyan-500 to-emerald-400');

  // Get initials for Avatar
  const initials = studentName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  // Stats
  const completedModules = report.stats?.completedModules ?? 0;
  const totalModules = report.stats?.totalModules ?? 3;
  const completedTasks = report.stats?.completedTasks ?? 0;
  const totalTasks = report.stats?.totalTasks ?? 5;
  const attendance = report.stats?.attendance ?? 90;

  return (
    <div className={`rounded-3xl border p-6 backdrop-blur-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
      isDark 
        ? 'border-white/10 bg-slate-900/90 hover:bg-slate-900/95 hover:border-white/20 shadow-black/30' 
        : 'border-slate-200/80 bg-white hover:bg-white hover:border-slate-300 shadow-slate-200/50'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 font-bold text-sm">
            {initials}
          </div>
          <div>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{studentName}</h3>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{deptName} - {std}</p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Last active: 2 hours ago</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{overallScore}%</p>
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold mt-1 tracking-wide uppercase ${riskBadgeClass}`}>
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className={`mt-5 h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div 
          className={`h-full rounded-full bg-linear-to-r ${progressColorClass}`}
          style={{ width: `${overallScore}%` }}
        />
      </div>

      {/* Stats Row */}
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className={`rounded-2xl p-3 border ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <FiBookOpen className="mx-auto text-cyan-400 text-base mb-1.5" />
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedModules}/{totalModules}</p>
          <p className={`text-[10px] uppercase font-semibold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Modules</p>
        </div>
        <div className={`rounded-2xl p-3 border ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <FiCheckSquare className="mx-auto text-cyan-400 text-base mb-1.5" />
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedTasks}/{totalTasks}</p>
          <p className={`text-[10px] uppercase font-semibold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tasks</p>
        </div>
        <div className={`rounded-2xl p-3 border ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <FiActivity className="mx-auto text-cyan-400 text-base mb-1.5" />
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{attendance}%</p>
          <p className={`text-[10px] uppercase font-semibold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Attendance</p>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="mt-5">
        <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subject Performance</h4>
        <div className="mt-3 space-y-3">
          {report.subjectProgress?.slice(0, 3).map((sub: any) => (
            <div key={sub.subject} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{sub.subject}</span>
                <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{Math.round(sub.overallScore)}%</span>
              </div>
              <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div 
                  className="h-full rounded-full bg-cyan-500"
                  style={{ width: `${Math.round(sub.overallScore)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-5 border-t pt-4 border-slate-800/60">
        <div className="space-y-2.5">
          {report.activities && report.activities.length > 0 ? (
            report.activities.slice(0, 3).map((act: any, idx: number) => {
              const statusBadge = act.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : (act.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20');
              return (
                <div key={idx} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 min-w-0">
                    <FiCheck className={act.status === 'completed' ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} />
                    <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{act.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wide font-semibold ${statusBadge}`}>
                      {act.status}
                    </span>
                    <span className={`text-[9px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Today</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`text-center py-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No recent activity recorded
            </div>
          )}
        </div>
      </div>

      {/* Bottom streak badge */}
      <div className={`mt-5 rounded-2xl p-3.5 flex items-center gap-3 border ${isDark ? 'bg-slate-800/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
        <FiAward className="text-amber-400 text-xl shrink-0" />
        <div className="min-w-0 text-[10px]">
          <p className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Completed {report.subjectProgress?.[0]?.subject || 'Calculus'} Module
          </p>
          <div className={`flex gap-3 mt-0.5 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Current streak: 9 days</span>
            <span>Task completion trend: {overallScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentProgress = () => {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const reportFilters = useMemo(() => {
    const rawUser = user?.data as { studentId?: number; instituteId?: number; id?: number; student_id?: number; institute_id?: number; departmentId?: number; department_id?: number } | undefined;
    const instituteId = Number(rawUser?.instituteId ?? rawUser?.institute_id ?? user?.instituteId ?? 0);
    const departmentId = Number(rawUser?.departmentId ?? rawUser?.department_id ?? user?.departmentId ?? 0);

    if (!Number.isFinite(instituteId) || instituteId <= 0) {
      return null;
    }

    if (!Number.isFinite(departmentId) || departmentId <= 0) {
      return null;
    }

    return { instituteId, departmentId };
  }, [user]);

  const { report, reportLoading, reportError, reportMessage } = useProgressReport(reportFilters);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute overall reports and rankings
  const reportsList = useMemo(() => {
    const payload = report as any;
    if (payload && Array.isArray(payload.reports)) {
      return payload.reports;
    }
    if (Array.isArray(payload)) {
      return payload;
    }
    return [];
  }, [report]);

  const actionCenterList = useMemo(() => {
    const payload = report as any;
    if (payload && Array.isArray(payload.actionCenter)) {
      return payload.actionCenter;
    }
    return [];
  }, [report]);

  const stats = useMemo(() => {
    const totalSubjectsSet = new Set<string>();
    let overallScoreSum = 0;
    
    reportsList.forEach((rep: any) => {
      rep.subjectProgress?.forEach((sub: any) => {
        totalSubjectsSet.add(sub.subject);
      });
      overallScoreSum += rep.totalOverAllScore || 0;
    });

    const averageOverall = reportsList.length > 0 ? Math.round(overallScoreSum / reportsList.length) : 0;
    const strengthsCount = reportsList.reduce((sum: number, rep: any) => sum + (rep.strengths?.length || 0), 0);
    const weakSubjectsCount = reportsList.reduce((sum: number, rep: any) => sum + (rep.weakSubjects?.length || 0), 0);

    return {
      averageOverall,
      totalSubjects: totalSubjectsSet.size,
      totalStudents: reportsList.length,
      strengthsCount,
      weakSubjectsCount
    };
  }, [reportsList]);

  // Sorting top performers
  const topPerformers = useMemo(() => {
    return [...reportsList]
      .sort((a, b) => (b.totalOverAllScore || 0) - (a.totalOverAllScore || 0))
      .slice(0, 5);
  }, [reportsList]);

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`rounded-3xl relative min-h-screen overflow-hidden p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background gradients */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_10%_20%,rgba(34,197,94,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.08),transparent_35%)]'
            : 'bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.06),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.05),transparent_35%)]'
        }`}
      />

      <div className="relative z-10 mx-auto max-w-full">
        {/* Header */}
        <motion.header
          className={`mb-6 rounded-2xl p-5 sm:p-6 border ${
            isDark 
              ? 'bg-slate-900/90 border-white/5 text-slate-100 shadow-black/30' 
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/40'
          }`}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className={`mb-1.5 text-xs font-bold uppercase tracking-[0.22em] ${mutedText}`}>
                <Translated text="LMS Analytics Suite" />
              </p>
              <div className="flex items-center gap-3">
                <GiProgression className="text-cyan-500 text-3xl shrink-0" />
                <h1 className="text-2xl font-black sm:text-3xl tracking-tight">
                  <Translated text="Student Progress Overview" />
                </h1>
              </div>
              <p className={`mt-2 text-sm font-medium ${mutedText}`}>
                {currentTime.toLocaleDateString([], {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                ·{' '}
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <FiActivity />
                <Translated text="Real-time Tracking Enabled" />
              </span>
            </div>
          </div>
        </motion.header>

        {/* Stats Row */}
        <motion.section
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          {[
            {
              title: 'Average Overall Score',
              value: reportLoading ? 'Loading...' : `${stats.averageOverall}%`,
              hint: `Based on active student evaluations`,
            },
            {
              title: 'Students Managed',
              value: String(stats.totalStudents),
              hint: `Active student enrollment in department`,
            },
            {
              title: 'Common Strengths',
              value: String(stats.strengthsCount),
              hint: `Total topics marked as mastered`,
            },
            {
              title: 'Support Needed',
              value: String(stats.weakSubjectsCount),
              hint: `Topics marked for remedial session`,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className={`rounded-3xl p-6 shadow-sm border ${
                isDark 
                  ? 'bg-slate-900/90 border-white/5 text-slate-100' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 + index * 0.06 }}
            >
              <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mutedText}`}>
                <Translated text={item.title} />
              </p>
              <p className="mt-2 text-3xl font-black">{item.value}</p>
              <p className={`mt-1 text-xs font-medium ${mutedText}`}>
                <Translated text={item.hint} />
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* Loading and Error states */}
        {reportLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500" />
          </div>
        )}

        {reportError && (
          <div className={`p-6 text-center border border-dashed rounded-3xl ${isDark ? 'border-red-900 bg-red-950/20 text-red-400' : 'border-red-200 bg-red-50 text-red-700'}`}>
            <FiAlertCircle className="mx-auto text-3xl mb-2" />
            <p className="font-bold"><Translated text="Failed to fetch progress report" /></p>
            <p className="text-sm mt-1">{reportMessage || 'Please verify that department and institute are configured.'}</p>
          </div>
        )}

        {/* Dashboard Panels (Left student grid, Right Rankings & Actions) */}
        {!reportLoading && !reportError && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr] items-start">
            
            {/* Left Panel: Students Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight"><Translated text="Student Progress Cards" /></h2>
                <span className={`text-xs font-bold rounded-full px-3 py-1 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {reportsList.length} Students
                </span>
              </div>
              
              {reportsList.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {reportsList.map((rep: any) => (
                    <StudentProgressCard key={rep.studentId} report={rep} isDark={isDark} />
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center border border-dashed rounded-3xl ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <Translated text="No student records found in your department." />
                </div>
              )}
            </div>

            {/* Right Panel: Performance Rankings & Action Center */}
            <div className="space-y-6">
              {/* Leaderboard/Rankings */}
              <div className={`rounded-3xl p-6 border ${
                isDark 
                  ? 'bg-slate-900/90 border-white/5 text-slate-100 shadow-black/30' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}>
                <h3 className="text-lg font-black mb-4 tracking-tight flex items-center gap-2">
                  <FiAward className="text-amber-500" />
                  <Translated text="Top Performers" />
                </h3>
                <div className="space-y-3.5">
                  {topPerformers.map((rep: any, idx: number) => {
                    return (
                      <div key={rep.studentId} className={`flex items-center justify-between p-3 rounded-2xl border ${
                        isDark ? 'bg-slate-800/40 border-white/5' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs bg-amber-500/10 text-amber-500">
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{rep.student?.studentName}</p>
                            <p className={`text-[10px] font-medium ${mutedText}`}>{rep.student?.departmentName} - {rep.student?.studentStd}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-sm text-cyan-400">{Math.round(rep.totalOverAllScore)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Center */}
              <div className={`rounded-3xl p-6 border ${
                isDark 
                  ? 'bg-slate-900/90 border-white/5 text-slate-100 shadow-black/30' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}>
                <h3 className="text-lg font-black mb-4 tracking-tight flex items-center gap-2">
                  <FiClock className="text-cyan-500" />
                  <Translated text="ACTION CENTER" />
                </h3>
                <div className="space-y-4">
                  {actionCenterList.length > 0 ? (
                    actionCenterList.map((item: any, idx: number) => {
                      const statusBadge = item.status === 'in-progress'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                      
                      const dateStr = item.dueDate ? new Date(item.dueDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      }) : 'Tomorrow';

                      return (
                        <div key={idx} className={`flex items-center justify-between pb-3.5 border-b last:border-b-0 ${
                          isDark ? 'border-slate-800/60' : 'border-slate-100'
                        }`}>
                          <div className="min-w-0 pr-3">
                            <p className="font-bold text-sm truncate">{item.title}</p>
                            <p className={`text-[11px] font-medium mt-0.5 ${mutedText}`}>{item.studentName}</p>
                            <p className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Due: {dateStr}</p>
                          </div>
                          <div>
                            <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wide font-semibold ${statusBadge}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`text-center py-6 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Translated text="No active tasks in action center." />
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
